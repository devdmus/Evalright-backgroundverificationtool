import { useState, useRef } from "react";
import {
  Home,
  ShoppingCart,
  FileText,
  Users,
  Settings,
  FlaskConical,
  Receipt,
  HelpCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

export type PageKey =
  | "home"
  | "order"
  | "order-invitation"
  | "order-list"
  | "reports-all-order-details"
  | "reports-orders-list"
  | "reports-draft-orders"
  | "reports-summary"
  | "reports-consents"
  | "reports-adverse-worksheets"
  | "reports-adverse-log"
  | "reports-analytics"
  | "reports-hr"
  | "reports-disputes"
  | "applicants"
  | "applicant-invite-templates"
  | "applicant-statistics"
  | "account-settings"
  | "manage-users"
  | "manage-branches"
  | "drug-screening"
  | "setup-random-drug-checks"
  | "invoices"
  | "support-center"
  | "activity-report"
  | "invite-form"
  | "forms-documents"
  | "email-activity"
  | "announcements";

interface SidebarProps {
  currentPage: PageKey;
  onNavigate: (page: PageKey) => void;
  isOpen?: boolean;
  isDarkMode?: boolean;
}

interface SubItem {
  label: string;
  page: PageKey;
}

interface NavGroup {
  label: string;
  icon: React.ReactNode;
  page?: PageKey;
  children?: SubItem[];
}

const navGroups: NavGroup[] = [
  { label: "Home", icon: <Home size={20} />, page: "home" },
  {
    label: "Order",
    icon: <ShoppingCart size={20} />,
    children: [
      { label: "Order", page: "order" },
      { label: "Order w / invitation", page: "order-invitation" },
    ],
  },
  {
    label: "Reports & Orders",
    icon: <FileText size={20} />,
    children: [
      { label: "All Order Details", page: "reports-all-order-details" },
      { label: "Orders List", page: "reports-orders-list" },
      { label: "Draft Order List", page: "reports-draft-orders" },
      { label: "Order Summary Report", page: "reports-summary" },
      { label: "Electronic Consents", page: "reports-consents" },
      { label: "Adverse Worksheets", page: "reports-adverse-worksheets" },
      { label: "Adverse Actions Log", page: "reports-adverse-log" },
      { label: "Analytics", page: "reports-analytics" },
      { label: "HR Software Integrations", page: "reports-hr" },
      { label: "Disputes List", page: "reports-disputes" },
    ],
  },
  {
    label: "Applicants",
    icon: <Users size={20} />,
    children: [
      { label: "Applicant Manager", page: "applicants" },
      { label: "Applicant Invite Templates", page: "applicant-invite-templates" },
      { label: "Applicant Statistics", page: "applicant-statistics" },
    ],
  },
  {
    label: "Account Settings",
    icon: <Settings size={20} />,
    children: [
      { label: "Manage Account", page: "account-settings" },
      { label: "Manage Users", page: "manage-users" },
      { label: "Manage Branches", page: "manage-branches" },
    ],
  },
  {
    label: "Drug Screening",
    icon: <FlaskConical size={20} />,
    children: [
      { label: "Drug Screening Dashboard", page: "drug-screening" },
      { label: "Setup Random Drug Checks", page: "setup-random-drug-checks" },
    ],
  },
  { label: "Invoices", icon: <Receipt size={20} />, page: "invoices" },
  {
    label: "Support Center",
    icon: <HelpCircle size={20} />,
    children: [
      { label: "Bulk Order Requests", page: "support-center" },
      { label: "Forms & Documents", page: "forms-documents" },
      { label: "Email Activity Log", page: "email-activity" },
    ],
  },
];

const orderPages = new Set<PageKey>(["order", "order-invitation", "order-list"]);
const reportsPages = new Set<PageKey>([
  "reports-all-order-details", "reports-orders-list", "reports-draft-orders",
  "reports-summary", "reports-consents", "reports-adverse-worksheets",
  "reports-adverse-log", "reports-analytics", "reports-hr", "reports-disputes",
]);
const applicantsPages = new Set<PageKey>([
  "applicants", "applicant-invite-templates", "applicant-statistics",
]);
const accountSettingsPages = new Set<PageKey>([
  "account-settings", "manage-users", "manage-branches",
]);
const drugScreeningPages = new Set<PageKey>([
  "drug-screening", "setup-random-drug-checks",
]);
const supportPages = new Set<PageKey>([
  "support-center", "forms-documents", "email-activity",
]);

// Icon-only sidebar width when collapsed
const COLLAPSED_WIDTH = 64;
const EXPANDED_WIDTH = 280;

export function Sidebar({ currentPage, onNavigate, isOpen = true, isDarkMode = false }: SidebarProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    Order: orderPages.has(currentPage),
    "Reports & Orders": reportsPages.has(currentPage),
    Applicants: applicantsPages.has(currentPage),
    "Account Settings": accountSettingsPages.has(currentPage),
    "Drug Screening": drugScreeningPages.has(currentPage),
    "Support Center": supportPages.has(currentPage),
  });
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleNavScroll() {
    setIsScrolling(true);
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 700);
  }

  function toggleGroup(label: string) {
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }));
  }

  function isGroupActive(group: NavGroup) {
    if (group.page) return currentPage === group.page;
    if (group.children) return group.children.some((c) => c.page === currentPage);
    return false;
  }

  const collapsed = !isOpen;

  const sidebarBg = isDarkMode ? "#252830" : "#F5F5F5";
  const textColor = isDarkMode ? "#8391a2" : "#555555";
  const activeTextColor = isDarkMode ? "#ffffff" : "#C70039";
  const activeBg = isDarkMode ? "rgba(206, 212, 218, 0.15)" : "#B7042C40"; // Using #ced4da with opacity for the active background
  const hoverBg = isDarkMode ? "rgba(206, 212, 218, 0.1)" : "#EBEBEB"; // Using #ced4da with opacity for hover

  return (
    <aside
      style={{
        width: collapsed ? `${COLLAPSED_WIDTH}px` : `${EXPANDED_WIDTH}px`,
        minWidth: collapsed ? `${COLLAPSED_WIDTH}px` : `${EXPANDED_WIDTH}px`,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: sidebarBg,
        borderRight: isDarkMode ? "none" : "1px solid #E5E7EB",
        flexShrink: 0,
        overflow: "hidden",
        transition: "width 0.25s ease, min-width 0.25s ease, background 0.15s",
      }}
    >
      {/* MAIN label — only show when expanded */}
      {!collapsed && (
        <div
          style={{
            padding: "20px 20px 8px 20px",
            fontSize: "11px",
            fontWeight: 600,
            color: isDarkMode ? "#8391a2" : "#8A8A8A",
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          MAIN
        </div>
      )}

      {/* Nav */}
      <nav
        className={`sidebar-nav${isScrolling ? " sidebar-nav--scrolling" : ""}${isDarkMode ? " sidebar-nav--dark" : ""}`}
        onScroll={handleNavScroll}
        style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}
      >
        {navGroups.map((group) => {
          const active = isGroupActive(group);
          const isExpanded = expanded[group.label];

          if (collapsed) {
            // Icon-only mode: render a single icon button for every group
            return (
              <button
                key={group.label}
                title={group.label}
                onClick={() => {
                  if (group.page) {
                    onNavigate(group.page);
                  } else if (group.children && group.children.length > 0) {
                    onNavigate(group.children[0].page);
                  }
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "52px",
                  background: active ? activeBg : "transparent",
                  color: active ? activeTextColor : textColor,
                  border: "none",
                  cursor: "pointer",
                  transition: "background 0.15s, color 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (!active) (e.currentTarget as HTMLButtonElement).style.background = hoverBg;
                }}
                onMouseLeave={(e) => {
                  if (!active) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                }}
              >
                <span style={{ color: active ? activeTextColor : textColor, display: "flex" }}>
                  {group.icon}
                </span>
              </button>
            );
          }

          // ── Expanded mode ──
          if (group.children) {
            return (
              <div key={group.label}>
                <button
                  onClick={() => {
                    toggleGroup(group.label);
                    if (group.children && group.children.length > 0) {
                      onNavigate(group.children[0].page);
                    }
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0px 16px",
                    height: "44px",
                    textAlign: "left",
                    background: active ? activeBg : "transparent",
                    color: active ? activeTextColor : textColor,
                    fontSize: "13px",
                    fontWeight: 500,
                    border: "none",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) (e.currentTarget as HTMLButtonElement).style.background = hoverBg;
                  }}
                  onMouseLeave={(e) => {
                    if (!active) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ color: active ? activeTextColor : textColor, display: "flex" }}>{group.icon}</span>
                    <span>{group.label}</span>
                  </span>
                  {isExpanded ? (
                    <ChevronDown size={14} style={{ color: active ? activeTextColor : textColor, flexShrink: 0 }} />
                  ) : (
                    <ChevronRight size={14} style={{ color: active ? activeTextColor : textColor, flexShrink: 0 }} />
                  )}
                </button>

                {isExpanded && (
                  <div style={{ paddingTop: "4px", paddingBottom: "8px" }}>
                    {group.children.map((child) => {
                      const childActive = currentPage === child.page;
                      return (
                        <button
                          key={child.page}
                          onClick={() => onNavigate(child.page)}
                          style={{
                            width: "100%",
                            textAlign: "left",
                            padding: "0px 16px 0px 46px",
                            height: "36px",
                            fontSize: "12px",
                            color: childActive ? activeTextColor : textColor,
                            fontWeight: childActive ? 600 : 400,
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "2px",
                            whiteSpace: "nowrap",
                            transition: "color 0.15s",
                          }}
                          onMouseEnter={(e) => {
                            if (!childActive) (e.currentTarget as HTMLButtonElement).style.color = activeTextColor;
                          }}
                          onMouseLeave={(e) => {
                            if (!childActive) (e.currentTarget as HTMLButtonElement).style.color = textColor;
                          }}
                        >
                          {child.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <button
              key={group.label}
              onClick={() => group.page && onNavigate(group.page)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0px 16px",
                height: "44px",
                background: active ? activeBg : "transparent",
                color: active ? activeTextColor : textColor,
                fontSize: "13px",
                fontWeight: 500,
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                whiteSpace: "nowrap",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!active) (e.currentTarget as HTMLButtonElement).style.background = hoverBg;
              }}
              onMouseLeave={(e) => {
                if (!active) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ color: active ? activeTextColor : textColor, display: "flex" }}>{group.icon}</span>
                <span>{group.label}</span>
              </span>
              {group.label !== "Home" && group.label !== "Invoices" && (
                <ChevronRight size={14} style={{ color: active ? activeTextColor : textColor, flexShrink: 0 }} />
              )}
            </button>
          );
        })}
      </nav>

      <style>{`
        .sidebar-nav {
          scrollbar-width: thin;
          scrollbar-color: transparent transparent;
        }
        .sidebar-nav--scrolling {
          scrollbar-color: rgba(0, 0, 0, 0.22) transparent;
        }
        .sidebar-nav--dark.sidebar-nav--scrolling {
          scrollbar-color: rgba(255, 255, 255, 0.28) transparent;
        }
        .sidebar-nav::-webkit-scrollbar {
          width: 6px;
        }
        .sidebar-nav::-webkit-scrollbar-track {
          background: transparent;
        }
        .sidebar-nav::-webkit-scrollbar-thumb {
          background: transparent;
          border-radius: 3px;
        }
        .sidebar-nav.sidebar-nav--scrolling::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.22);
        }
        .sidebar-nav.sidebar-nav--dark.sidebar-nav--scrolling::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.28);
        }
      `}</style>
    </aside>
  );
}
