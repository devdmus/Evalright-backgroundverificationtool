import { useState, useRef } from "react";
import {
  Home,
  Users,
  ShoppingCart,
  FileText,
  Receipt,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

export type PageKey =
  | "home"
  | "clients"
  | "client-management"
  | "add-client"
  | "client-invoices"
  | "mass-mail"
  | "client-orders"
  | "reports"
  | "invoices"
  | "account-settings"
  | "support-center"
  | "announcements"
  | "activity-report";

interface SidebarProps {
  currentPage: PageKey;
  onNavigate: (page: PageKey) => void;
  isOpen?: boolean;
  isDarkMode?: boolean;
}

interface NavGroup {
  label: string;
  icon: React.ReactNode;
  page?: PageKey;
  hasChevron?: boolean;
  subItems?: { label: string; page: PageKey }[];
}

const mainNavGroups: NavGroup[] = [
  { label: "Home", icon: <Home size={18} />, page: "home" },
  {
    label: "Clients",
    icon: <Users size={18} />,
    hasChevron: true,
    subItems: [
      { label: "Client Management", page: "client-management" },
      { label: "Add New Client", page: "add-client" },
      { label: "Client Invoices", page: "client-invoices" },
      { label: "Mass Mail", page: "mass-mail" },
    ],
  },
  { label: "Client Orders", icon: <ShoppingCart size={18} />, page: "client-orders" },
  { label: "Reports", icon: <FileText size={18} />, page: "reports", hasChevron: true },
];

const accountNavGroups: NavGroup[] = [
  { label: "Invoices", icon: <Receipt size={18} />, page: "invoices" },
  { label: "Account Settings", icon: <Settings size={18} />, page: "account-settings", hasChevron: true },
  { label: "Support Center", icon: <HelpCircle size={18} />, page: "support-center", hasChevron: true },
];

const COLLAPSED_WIDTH = 64;
const EXPANDED_WIDTH = 250;

export function Sidebar({ currentPage, onNavigate, isOpen = true, isDarkMode = false }: SidebarProps) {
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep Clients expanded by default
  const [openGroup, setOpenGroup] = useState<string | null>("Clients");

  function handleNavScroll() {
    setIsScrolling(true);
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 700);
  }

  const collapsed = !isOpen;

  const sidebarBg = isDarkMode ? "#252830" : "#F5F5F5";
  const textColor = isDarkMode ? "#8391a2" : "#555555";
  const activeTextColor = isDarkMode ? "#ffffff" : "#C70039";
  // The active background color in light mode matches the red accent with low opacity (a soft red gradient/solid overlay)
  const activeBg = isDarkMode ? "rgba(206, 212, 218, 0.15)" : "rgba(199, 0, 57, 0.08)";
  const hoverBg = isDarkMode ? "rgba(206, 212, 218, 0.1)" : "#EBEBEB";
  const primaryBrandColor = isDarkMode ? "#DF2A57" : "#C70039";

  const renderNavButton = (group: NavGroup) => {
    const isSubActive = group.subItems?.some((item) => item.page === currentPage);
    const active = currentPage === group.page || isSubActive;
    const isExpanded = openGroup === group.label;

    const buttonTextColor = active
      ? isDarkMode
        ? "#ffffff"
        : isSubActive
        ? "#ffffff"
        : "#C70039"
      : textColor;

    const buttonBg = active
      ? isSubActive
        ? "#C70039"
        : activeBg
      : "transparent";

    const buttonLeftBorder = active
      ? isSubActive
        ? `4px solid #C70039`
        : `4px solid ${activeTextColor}`
      : "4px solid transparent";

    const handleParentClick = () => {
      if (group.subItems) {
        setOpenGroup(isExpanded ? null : group.label);
      } else if (group.page) {
        onNavigate(group.page);
      }
    };

    if (collapsed) {
      return (
        <button
          key={group.label}
          title={group.label}
          onClick={handleParentClick}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "48px",
            background: buttonBg,
            color: buttonTextColor,
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

    return (
      <div key={group.label} style={{ display: "flex", flexDirection: "column" }}>
        <button
          onClick={handleParentClick}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0px 20px",
            height: "42px",
            background: buttonBg,
            color: buttonTextColor,
            fontSize: "13px",
            fontWeight: active ? 600 : 500,
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            whiteSpace: "nowrap",
            transition: "background 0.15s, color 0.15s",
            borderLeft: buttonLeftBorder,
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
            <span style={{ color: active ? buttonTextColor : "inherit", display: "flex" }}>{group.icon}</span>
            <span>{group.label}</span>
          </span>
          {group.hasChevron && (
            <span style={{ color: buttonTextColor, flexShrink: 0, opacity: 0.7, display: "flex" }}>
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </span>
          )}
        </button>

        {/* Submenu items */}
        {group.subItems && isExpanded && (
          <div style={{ display: "flex", flexDirection: "column", background: isDarkMode ? "rgba(0,0,0,0.05)" : "rgba(0,0,0,0.02)", padding: "2px 0" }}>
            {group.subItems.map((subItem) => {
              const isSubItemActive = currentPage === subItem.page;
              return (
                <button
                  key={subItem.label}
                  onClick={() => onNavigate(subItem.page)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    padding: "0px 20px 0px 44px",
                    height: "36px",
                    background: "transparent",
                    color: isSubItemActive ? primaryBrandColor : textColor,
                    fontSize: "12.5px",
                    fontWeight: isSubItemActive ? 600 : 500,
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    whiteSpace: "nowrap",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = primaryBrandColor;
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubItemActive) {
                      (e.currentTarget as HTMLButtonElement).style.color = textColor;
                    }
                  }}
                >
                  {subItem.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

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
        {/* MAIN SECTION */}
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
          {mainNavGroups.map(renderNavButton)}
        </div>

        {/* ACCOUNT SECTION */}
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
          {accountNavGroups.map(renderNavButton)}
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

