import { useState } from "react";
import { Bell, TrendingUp, Moon, Maximize2, Menu, Search, UserCircle2, UserCog, LogOut } from "lucide-react";
import darkLogo from "../../imports/logo_2_logo_evalright_small_final.png";

const LOGO_SRC = "/evalright-logo.jpg";

interface HeaderProps {
  userName: string;
  onMenuToggle?: () => void;
  sidebarOpen?: boolean;
  onBellClick?: () => void;
  isAnnouncementsActive?: boolean;
  onAnalyticsClick?: () => void;
  isActivityReportActive?: boolean;
  isDarkMode?: boolean;
  onThemeToggle?: () => void;
  onNavigate?: (page: string) => void;
}

export function Header({
  userName,
  onMenuToggle,
  onBellClick,
  isAnnouncementsActive,
  onAnalyticsClick,
  isActivityReportActive,
  isDarkMode,
  onThemeToggle,
  onNavigate,
}: HeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <header
      style={{
        height: "76px",
        minHeight: "76px",
        display: "flex",
        alignItems: "center",
        background: isDarkMode ? "#252830" : "#ffffff",
        borderBottom: isDarkMode ? "1px solid #1A1C21" : "1px solid #E5E7EB",
        position: "sticky",
        top: 0,
        zIndex: 20,
        flexShrink: 0,
        width: "100%",
      }}
    >
      {/* Logo area */}
      <div
        style={{
          width: "240px",
          minWidth: "240px",
          display: "flex",
          alignItems: "center",
          paddingLeft: "16px",
          height: "100%",
          flexShrink: 0,
          borderRight: isDarkMode ? "1px solid #1A1C21" : "1px solid #F0F0F0",
        }}
      >
        <img
          src={isDarkMode ? darkLogo : LOGO_SRC}
          alt="EvalRight — Screen before Hire"
          style={{
            height: "64px",
            width: "auto",
            objectFit: "contain",
            objectPosition: "left center",
            display: "block",
            maxWidth: "210px",
          }}
        />
      </div>

      {/* Hamburger */}
      <button
        onClick={onMenuToggle}
        style={{
          padding: "0 20px",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: isDarkMode ? "#8391a2" : "#555555",
          flexShrink: 0,
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.color = isDarkMode ? "#ffffff" : "#333")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.color = isDarkMode ? "#8391a2" : "#555555")
        }
      >
        <Menu size={24} />
      </button>

      {/* Search bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "0 14px",
          height: "42px",
          background: isDarkMode ? "#2A2D34" : "#F3F4F6",
          border: "none",
          borderRadius: "4px",
          width: "220px",
          flexShrink: 0,
        }}
      >
        <Search size={16} style={{ color: "#9CA3AF", flexShrink: 0 }} />
        <input
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: "14px",
            color: isDarkMode ? "#E5E7EB" : "#6B7280",
            width: "100%",
          }}
          placeholder="Search..."
        />
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Right-side icon group */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          paddingRight: "8px",
          color: "#666666",
        }}
      >
        <IconBtn title="Notifications" onClick={onBellClick} active={isAnnouncementsActive} isDarkMode={isDarkMode}>
          <Bell size={20} />
        </IconBtn>
        <IconBtn title="Analytics" onClick={onAnalyticsClick} active={isActivityReportActive} isDarkMode={isDarkMode}>
          <TrendingUp size={20} />
        </IconBtn>
        <IconBtn title="Dark mode" onClick={onThemeToggle} active={isDarkMode} isDarkMode={isDarkMode}>
          <Moon size={20} />
        </IconBtn>
        <IconBtn title="Fullscreen" onClick={toggleFullscreen} isDarkMode={isDarkMode}>
          <Maximize2 size={20} />
        </IconBtn>
      </div>

      {/* Divider */}
      <div style={{ width: "1px", height: "40px", background: isDarkMode ? "#1A1C21" : "#E5E7EB", flexShrink: 0 }} />

      {/* User info */}
      <div
        style={{ position: "relative", height: "100%", display: "flex", alignItems: "center" }}
      >
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => setShowDropdown((prev) => !prev)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
            paddingLeft: "20px",
            paddingRight: "20px",
            height: "100%",
            flexShrink: 0,
            background: showDropdown && isDarkMode ? "#313641" : (showDropdown ? "#F9FAFB" : "transparent"),
          }}
        >
          <span
            style={{
              fontSize: "14px",
              color: (showDropdown || isHovered) ? "#C70039" : (isDarkMode ? "#E5E7EB" : "#333333"),
              fontWeight: 500,
              whiteSpace: "nowrap",
              transition: "color 0.15s ease",
            }}
          >
            {userName}
          </span>
          <UserCircle2 
            size={26} 
            style={{ 
              color: (showDropdown || isHovered) ? "#C70039" : (isDarkMode ? "#9CA3AF" : "#666666"), 
              flexShrink: 0,
              transition: "color 0.15s ease",
            }} 
          />
        </div>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              right: "0",
              width: "200px",
              background: isDarkMode ? "#252830" : "#FFFFFF",
              border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              borderRadius: "0 0 4px 4px",
              padding: "8px 0",
              zIndex: 50,
            }}
          >
            <div style={{ padding: "8px 16px", color: "#6B7280", fontSize: "12px", marginBottom: "4px" }}>
              Welcome !
            </div>
            
            <div
              onClick={() => {
                setShowDropdown(false);
                if (onNavigate) onNavigate("account-settings");
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 16px",
                cursor: "pointer",
                fontSize: "14px",
                color: isDarkMode ? "#E5E7EB" : "#4B5563",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = isDarkMode ? "#313641" : "#F3F4F6")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <UserCog size={18} style={{ color: "#6B7280" }} />
              Account Settings
            </div>

            <div
              onClick={() => setShowDropdown(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 16px",
                cursor: "pointer",
                fontSize: "14px",
                color: isDarkMode ? "#E5E7EB" : "#4B5563",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = isDarkMode ? "#313641" : "#F3F4F6")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <LogOut size={18} style={{ color: "#6B7280" }} />
              Logout
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function IconBtn({
  children,
  title,
  onClick,
  active,
  isDarkMode,
}: {
  children: React.ReactNode;
  title?: string;
  onClick?: () => void;
  active?: boolean;
  isDarkMode?: boolean;
}) {
  const activeBg = isDarkMode ? "rgba(255,255,255,0.1)" : "#FEE2E2";
  const hoverBg = isDarkMode ? "rgba(255,255,255,0.05)" : "#F3F4F6";
  const activeColor = isDarkMode ? "#FFFFFF" : "#C70039";
  const defaultColor = isDarkMode ? "#8391a2" : "#666666";

  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        background: active ? activeBg : "none",
        border: "none",
        cursor: "pointer",
        color: active ? activeColor : defaultColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "40px",
        height: "40px",
        borderRadius: "6px",
        transition: "background 0.15s, color 0.15s",
      }}
      onMouseEnter={(e) => {
        if (!active)
          (e.currentTarget as HTMLButtonElement).style.background = hoverBg;
      }}
      onMouseLeave={(e) => {
        if (!active)
          (e.currentTarget as HTMLButtonElement).style.background = "none";
      }}
    >
      {children}
    </button>
  );
}
