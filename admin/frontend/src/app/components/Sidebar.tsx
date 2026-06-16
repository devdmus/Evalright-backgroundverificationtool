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
}

const mainNavGroups: NavGroup[] = [
  { label: "Home", icon: <Home size={18} />, page: "home" },
  { label: "Clients", icon: <Users size={18} />, page: "clients", hasChevron: true },
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

  const renderNavButton = (group: NavGroup) => {
    const active = currentPage === group.page;

    if (collapsed) {
      return (
        <button
          key={group.label}
          title={group.label}
          onClick={() => group.page && onNavigate(group.page)}
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
        {group.hasChevron && (
          <ChevronRight size={14} style={{ color: active ? activeTextColor : textColor, flexShrink: 0, opacity: 0.7 }} />
        )}
      </button>
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
