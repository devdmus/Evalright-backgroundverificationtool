import { useState } from "react";
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
  | "invoices"
  | "support-center"
  | "forms-documents"
  | "email-activity";

interface SidebarProps {
  currentPage: PageKey;
  onNavigate: (page: PageKey) => void;
  isOpen?: boolean;
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
  { label: "Home", icon: <Home size={18} />, page: "home" },
  {
    label: "Order",
    icon: <ShoppingCart size={18} />,
    children: [
      { label: "Order", page: "order" },
      { label: "Order w / invitation", page: "order-invitation" },
    ],
  },
  {
    label: "Reports & Orders",
    icon: <FileText size={18} />,
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
    icon: <Users size={18} />,
    children: [
      { label: "Applicant Manager", page: "applicants" },
      { label: "Applicant Invite Templates", page: "applicant-invite-templates" },
      { label: "Applicant Statistics", page: "applicant-statistics" },
    ],
  },
  {
    label: "Account Settings",
    icon: <Settings size={18} />,
    children: [
      { label: "Manage Account", page: "account-settings" },
      { label: "Manage Users", page: "manage-users" },
      { label: "Manage Branches", page: "manage-branches" },
    ],
  },
  { label: "Drug Screening", icon: <FlaskConical size={18} />, page: "drug-screening" },
  { label: "Invoices", icon: <Receipt size={18} />, page: "invoices" },
  {
    label: "Support Center",
    icon: <HelpCircle size={18} />,
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
const supportPages = new Set<PageKey>([
  "support-center", "forms-documents", "email-activity",
]);

export function Sidebar({ currentPage, onNavigate, isOpen = true }: SidebarProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    Order: orderPages.has(currentPage),
    "Reports & Orders": reportsPages.has(currentPage),
    Applicants: applicantsPages.has(currentPage),
    "Account Settings": accountSettingsPages.has(currentPage),
    "Support Center": supportPages.has(currentPage),
  });

  function toggleGroup(label: string) {
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }));
  }

  function isGroupActive(group: NavGroup) {
    if (group.page) return currentPage === group.page;
    if (group.children) return group.children.some((c) => c.page === currentPage);
    return false;
  }

  return (
    <aside
      style={{
        width: isOpen ? "220px" : "0px",
        minWidth: isOpen ? "220px" : "0px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#F5F5F5",
        borderRight: isOpen ? "1px solid #E5E7EB" : "none",

        flexShrink: 0,
        overflow: "hidden",
        transition: "width 0.25s ease, min-width 0.25s ease",
      }}
    >
      {/* MAIN label */}
      <div
        style={{
          padding: "20px 20px 8px 20px",
          fontSize: "12px",
          fontWeight: 600,
          color: "#8A8A8A",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        MAIN
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto" }}>
        {navGroups.map((group) => {
          const active = isGroupActive(group);
          const isExpanded = expanded[group.label];

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
                    background: active ? "#F7D7DD" : "transparent",
                    color: active ? "#C70039" : "rgb(85, 85, 85)",
                    fontSize: "13px",
                    fontWeight: 500,
                    borderWidth: "medium",
                    borderStyle: "none",
                    borderColor: "currentcolor",
                    borderImage: "initial",
                    cursor: "pointer",

                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ color: active ? "#C70039" : "#555555", display: "flex" }}>{group.icon}</span>
                    <span>{group.label}</span>
                  </span>
                  {isExpanded ? (
                    <ChevronDown size={14} style={{ color: active ? "#C70039" : "#888" }} />
                  ) : (
                    <ChevronRight size={14} style={{ color: active ? "#C70039" : "#888" }} />
                  )}
                </button>

                {isExpanded && (
                  <div style={{ paddingLeft: "46px", borderLeft: "none", paddingTop: "4px", paddingBottom: "8px" }}>
                    {group.children.map((child) => {
                      const childActive = currentPage === child.page;
                      return (
                        <button
                          key={child.page}
                          onClick={() => onNavigate(child.page)}
                          style={{
                            width: "100%",
                            textAlign: "left",
                            padding: "0px",
                            height: "25px",
                            fontSize: "12px",
                            color: childActive ? "rgb(199, 0, 57)" : "#555555",
                            fontWeight: childActive ? 600 : 400,
                            background: childActive ? "rgb(247, 215, 221)" : "transparent",
                            borderWidth: "medium",
                            borderStyle: "none",
                            borderColor: "currentcolor",
                            borderImage: "initial",
                            cursor: "pointer",

                            display: "flex",
                            alignItems: "center",
                            marginBottom: "2px",
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
                background: active ? "#F7D7DD" : "transparent",
                color: active ? "#C70039" : "rgb(85, 85, 85)",
                fontSize: "13px",
                fontWeight: 500,
                borderWidth: "medium",
                borderStyle: "none",
                borderColor: "currentcolor",
                borderImage: "initial",
                cursor: "pointer",

                textAlign: "left",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ color: active ? "#C70039" : "#555555", display: "flex" }}>{group.icon}</span>
                <span>{group.label}</span>
              </span>
              {group.label !== "Home" && group.label !== "Invoices" && (
                <ChevronRight size={14} style={{ color: active ? "#C70039" : "#888" }} />
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
