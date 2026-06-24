import { useState, useRef, useEffect } from "react";
import {
  Home,
  Users,
  ClipboardList,
  FileText,
  Receipt,
  UserCog,
  HelpCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

export type PageKey =
  | "home"
  | "client-management"
  | "add-new-client"
  | "client-invoices"
  | "mass-mail"
  | "client-summary"
  | "set-pricing"
  | "client-orders"
  | "accounts-receivable"
  | "reports-activity"
  | "reports-client-group-activity"
  | "reports-client-payments"
  | "reports-commission-manager"
  | "reports-daily-usage"
  | "reports-inactive-client"
  | "reports-jurisdiction"
  | "reports-order-loss"
  | "reports-sales-by-salesperson"
  | "reports-researchers"
  | "reports-sales"
  | "reports-geographic-criminal"
  | "reports-income-history"
  | "reports-package-order-trend"
  | "reports-a-la-carte-frequency"
  | "reports-monthly-revenue"
  | "invoices"
  | "account-settings"
  | "client-groups"
  | "signup-pages"
  | "billing-setup"
  | "manage-sales-operators"
  | "manage-email-templates"
  | "setup-welcome-email"
  | "support-bulk-orders"
  | "support-documents"
  | "announcements"
  | "activity-report";

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

const mainNavGroups: NavGroup[] = [
  { label: "Home", icon: <Home size={18} />, page: "home" },
  {
    label: "Clients",
    icon: <Users size={18} />,
    children: [
      { label: "Client Management", page: "client-management" },
      { label: "Add New Client", page: "add-new-client" },
      { label: "Client Invoices", page: "client-invoices" },
      { label: "Mass Mail", page: "mass-mail" },
    ],
  },
  { label: "Client Orders", icon: <ClipboardList size={18} />, page: "client-orders" },
  {
    label: "Reports",
    icon: <FileText size={18} />,
    children: [
      { label: "Accounts Receivable", page: "accounts-receivable" },
      { label: "Activity", page: "reports-activity" },
      { label: "Client Group Activity", page: "reports-client-group-activity" },
      { label: "Client Payments", page: "reports-client-payments" },
      { label: "Commission Manager", page: "reports-commission-manager" },
      { label: "Daily Usage", page: "reports-daily-usage" },
      { label: "Inactive Client", page: "reports-inactive-client" },
      { label: "Jurisdiction", page: "reports-jurisdiction" },
      { label: "Order Loss", page: "reports-order-loss" },
      { label: "Sales Report by Salesperson", page: "reports-sales-by-salesperson" },
      { label: "Researchers", page: "reports-researchers" },
      { label: "Sales", page: "reports-sales" },
      { label: "Geographic Criminal Report", page: "reports-geographic-criminal" },
      { label: "Income History", page: "reports-income-history" },
      { label: "Package Order Trend", page: "reports-package-order-trend" },
      { label: "A La Carte Order Frequency", page: "reports-a-la-carte-frequency" },
      { label: "Monthly Revenue Report", page: "reports-monthly-revenue" },
    ],
  },
];

const accountNavGroups: NavGroup[] = [
  { label: "Invoices", icon: <Receipt size={18} />, page: "invoices" },
  {
    label: "Account Settings",
    icon: <UserCog size={18} />,
    children: [
      { label: "Account Settings", page: "account-settings" },
      { label: "Client Groups", page: "client-groups" },
      { label: "Signup Pages", page: "signup-pages" },
      { label: "Billing Setup", page: "billing-setup" },
      { label: "Manage Sales Operators", page: "manage-sales-operators" },
      { label: "Set Prices", page: "set-pricing" },
      { label: "Manage E-mail Templates", page: "manage-email-templates" },
      { label: "Setup Welcome Email", page: "setup-welcome-email" },
    ],
  },
  {
    label: "Support Center",
    icon: <HelpCircle size={18} />,
    children: [
      { label: "Bulk Order Requests", page: "support-bulk-orders" },
      { label: "Forms & Documents", page: "support-documents" },
    ],
  },
];

const clientsPages = new Set<PageKey>([
  "client-management", "add-new-client", "client-invoices", "mass-mail", "client-summary",
]);
const reportsPages = new Set<PageKey>([
  "accounts-receivable",
  "reports-activity",
  "reports-client-group-activity",
  "reports-client-payments",
  "reports-commission-manager",
  "reports-daily-usage",
  "reports-inactive-client",
  "reports-jurisdiction",
  "reports-order-loss",
  "reports-sales-by-salesperson",
  "reports-researchers",
  "reports-sales",
  "reports-geographic-criminal",
  "reports-income-history",
  "reports-package-order-trend",
  "reports-a-la-carte-frequency",
  "reports-monthly-revenue",
]);
const accountSettingsPages = new Set<PageKey>([
  "account-settings",
  "client-groups",
  "signup-pages",
  "billing-setup",
  "manage-sales-operators",
  "set-pricing",
  "manage-email-templates",
  "setup-welcome-email",
]);
const supportPages = new Set<PageKey>(["support-bulk-orders", "support-documents"]);

const COLLAPSED_WIDTH = 64;
const EXPANDED_WIDTH = 250;

export function Sidebar({ currentPage, onNavigate, isOpen = true, isDarkMode = false }: SidebarProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    Clients: clientsPages.has(currentPage),
    Reports: reportsPages.has(currentPage),
    "Account Settings": accountSettingsPages.has(currentPage),
    "Support Center": supportPages.has(currentPage),
  });
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setExpanded((prev) => ({
      ...prev,
      Clients: clientsPages.has(currentPage),
      Reports: reportsPages.has(currentPage),
      "Account Settings": accountSettingsPages.has(currentPage),
      "Support Center": supportPages.has(currentPage),
    }));
  }, [currentPage]);

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
    if (!group.children) return false;
    if (group.label === "Clients") {
      return group.children.some((c) => c.page === currentPage) || currentPage === "client-summary";
    }
    return group.children.some((c) => c.page === currentPage);
  }

  const collapsed = !isOpen;
  const sidebarBg = isDarkMode ? "#252830" : "#F5F5F5";
  const textColor = isDarkMode ? "#8391a2" : "#555555";
  const activeTextColor = isDarkMode ? "#ffffff" : "#C70039";
  const activeBg = isDarkMode ? "rgba(206, 212, 218, 0.15)" : "rgba(199, 0, 57, 0.08)";
  const hoverBg = isDarkMode ? "rgba(206, 212, 218, 0.1)" : "#EBEBEB";
  const primaryBrandColor = isDarkMode ? "#DF2A57" : "#C70039";

  function renderNavGroup(group: NavGroup) {
    const active = isGroupActive(group);
    const isExpanded = expanded[group.label];

    if (collapsed) {
      return (
        <button
          key={group.label}
          title={group.label}
          onClick={() => {
            if (group.page) onNavigate(group.page);
            else if (group.children?.length) onNavigate(group.children[0].page);
          }}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "48px",
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
          {group.icon}
        </button>
      );
    }

    if (group.children) {
      return (
        <div key={group.label}>
          <button
            onClick={() => toggleGroup(group.label)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0px 20px",
              height: "42px",
              textAlign: "left",
              background: active ? activeBg : "transparent",
              color: active ? activeTextColor : textColor,
              fontSize: "13px",
              fontWeight: active ? 600 : 500,
              border: "none",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "background 0.15s, color 0.15s",
              borderLeft: active ? `4px solid ${activeTextColor}` : "4px solid transparent",
              boxSizing: "border-box",
            }}
            onMouseEnter={(e) => {
              if (!active) {
                (e.currentTarget as HTMLButtonElement).style.background = hoverBg;
                (e.currentTarget as HTMLButtonElement).style.color = activeTextColor;
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = textColor;
              }
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ color: active ? activeTextColor : "inherit", display: "flex" }}>{group.icon}</span>
              <span>{group.label}</span>
            </span>
            {isExpanded ? (
              <ChevronDown size={14} style={{ color: active ? activeTextColor : textColor, flexShrink: 0, opacity: 0.7 }} />
            ) : (
              <ChevronRight size={14} style={{ color: active ? activeTextColor : textColor, flexShrink: 0, opacity: 0.7 }} />
            )}
          </button>

          {isExpanded && (
            <div style={{ paddingTop: "2px", paddingBottom: "6px" }}>
              {group.children.map((child) => {
                const childActive =
                  currentPage === child.page ||
                  (child.page === "client-management" && currentPage === "client-summary");
                return (
                  <button
                    key={child.page}
                    onClick={() => onNavigate(child.page)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "0px 20px 0px 50px",
                      height: "36px",
                      fontSize: "12px",
                      color: childActive ? activeTextColor : textColor,
                      fontWeight: childActive ? 600 : 400,
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
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
          padding: "0px 20px",
          height: "42px",
          background: active ? activeBg : "transparent",
          color: active ? activeTextColor : textColor,
          fontSize: "13px",
          fontWeight: active ? 600 : 500,
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          whiteSpace: "nowrap",
          transition: "background 0.15s, color 0.15s",
          borderLeft: active ? `4px solid ${activeTextColor}` : "4px solid transparent",
          boxSizing: "border-box",
        }}
        onMouseEnter={(e) => {
          if (!active) {
            (e.currentTarget as HTMLButtonElement).style.background = hoverBg;
            (e.currentTarget as HTMLButtonElement).style.color = activeTextColor;
          }
        }}
        onMouseLeave={(e) => {
          if (!active) {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            (e.currentTarget as HTMLButtonElement).style.color = textColor;
          }
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ color: active ? activeTextColor : "inherit", display: "flex" }}>{group.icon}</span>
          <span>{group.label}</span>
        </span>
      </button>
    );
  }

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
      <nav
        className={`sidebar-nav${isScrolling ? " sidebar-nav--scrolling" : ""}${isDarkMode ? " sidebar-nav--dark" : ""}`}
        onScroll={handleNavScroll}
        style={{ flex: 1, overflowY: "auto", overflowX: "hidden", paddingTop: "12px" }}
      >
        {!collapsed && (
          <div
            style={{
              padding: "12px 20px 6px 20px",
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
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {mainNavGroups.map(renderNavGroup)}
        </div>

        <div style={{ marginTop: "16px" }} />
        {!collapsed && (
          <div
            style={{
              padding: "12px 20px 6px 20px",
              fontSize: "11px",
              fontWeight: 600,
              color: isDarkMode ? "#8391a2" : "#8A8A8A",
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            ACCOUNT
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {accountNavGroups.map(renderNavGroup)}
        </div>
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
