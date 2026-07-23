import { Request, Response, NextFunction } from 'express';
import { pool } from './config/db';

const DEACTIVATED_STATUSES = new Set(['inactive', 'suspended', 'rejected', 'closed', 'disabled']);

const PUBLIC_API_PREFIXES = [
  '/api/health',
  '/api/auth/',
  '/api/services/prices',
];

/** Invitation token routes are public (applicant-facing). */
function isPublicInvitationRoute(method: string, path: string): boolean {
  const m = method.toUpperCase();
  if (m === 'GET' && /^\/api\/invitations\/[^/]+\/?$/.test(path)) return true;
  if (m === 'POST' && /^\/api\/invitations\/[^/]+\/submit\/?$/.test(path)) return true;
  return false;
}

function isPublicRoute(method: string, path: string): boolean {
  if (PUBLIC_API_PREFIXES.some((prefix) => path === prefix || path.startsWith(prefix))) {
    return true;
  }
  return isPublicInvitationRoute(method, path);
}

function extractUserId(req: Request): string | null {
  const headerId = req.headers['x-user-id'];
  if (typeof headerId === 'string' && headerId.trim()) return headerId.trim();

  const body = req.body || {};
  const fromBody = body.orderedBy || body.createdBy || body.userId;
  if (typeof fromBody === 'string' && fromBody.trim()) return fromBody.trim();

  return null;
}

export interface AuthUser {
  id: string;
  company_id: string;
  branch_id: string | null;
  is_active: boolean;
  company_status: string;
}

declare global {
  namespace Express {
    interface Request {
      authUser?: AuthUser;
    }
  }
}

/**
 * Enforces that the calling client's user + company are ACTIVE
 * before any protected API handler runs.
 */
export async function requireActiveAccount(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (isPublicRoute(req.method, req.path)) {
      next();
      return;
    }

    // Non-API traffic (shouldn't happen) — pass through
    if (!req.path.startsWith('/api/')) {
      next();
      return;
    }

    const userId = extractUserId(req);
    if (!userId) {
      res.status(401).json({
        message: 'Unauthorized: user must be authenticated.',
        error: 'Unauthorized: user must be authenticated.',
      });
      return;
    }

    const result = await pool.query(
      `
      SELECT
        u.id,
        u.company_id,
        u.branch_id,
        u.is_active,
        LOWER(COALESCE(c.status, 'active')) AS company_status
      FROM users u
      LEFT JOIN companies c ON c.id = u.company_id
      WHERE u.id = $1
      LIMIT 1
      `,
      [userId]
    );

    if (result.rows.length === 0) {
      res.status(401).json({
        message: 'Unauthorized: user not found.',
        error: 'Unauthorized: user not found.',
      });
      return;
    }

    const user = result.rows[0] as AuthUser;
    const companyStatus = String(user.company_status || 'active').toLowerCase();
    const accountBlocked =
      !user.is_active || DEACTIVATED_STATUSES.has(companyStatus) || companyStatus !== 'active';

    if (accountBlocked) {
      res.status(403).json({
        message: 'Your account has been deactivated. Please contact the administrator.',
        error: 'Your account has been deactivated. Please contact the administrator.',
      });
      return;
    }

    req.authUser = user;
    next();
  } catch (error: any) {
    console.error('❌ Error enforcing account activation status:', error);
    res.status(500).json({
      message: 'Failed to verify account status.',
      error: error.message,
    });
  }
}
