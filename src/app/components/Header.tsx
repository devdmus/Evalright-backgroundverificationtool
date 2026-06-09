import { Bell, RefreshCw, Moon, Maximize2, Menu, Search, UserCircle2 } from "lucide-react";

const LOGO_SRC = "/evalright-logo.jpg";

interface HeaderProps {
  userName: string;
  onMenuToggle?: () => void;
}

export function Header({ userName, onMenuToggle }: HeaderProps) {
  return (
    <header
      style={{
        height: "66px",
        minHeight: "40px",
        display: "flex",
        alignItems: "center",
        background: "rgb(255, 255, 255)",
        borderBottom: "1px solid rgb(229, 231, 235)",
        fontFamily: "\"Segoe UI\", Arial, sans-serif",
        position: "sticky",
        top: "0px",
        zIndex: 20,
        flexShrink: 50,
      }}
    >
      {/* Logo area – matches sidebar width */}
      <div
        style={{
          width: "180px",
          minWidth: "180px",
          display: "flex",
          alignItems: "center",
          paddingLeft: "14px",
          height: "100%",
          borderRight: "1px solid #E5E7EB",
        }}
      >
        <img
          src={LOGO_SRC}
          alt="EvalRight — Screen before Hire"
          style={{
            height: "66px",
            width: "auto",
            objectFit: "contain",
            objectPosition: "left center",
            display: "block",
            maxWidth: "300px",
          }}
        />
      </div>

      {/* Hamburger */}
      <button
        onClick={onMenuToggle}
        style={{
          padding: "0 16px",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#666666",
          flexShrink: 0,
        }}
      >
        <Menu size={22} />
      </button>

      {/* Search bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "0 12px",
          height: "36px",
          background: "#F3F4F6",
          border: "none",
          borderRadius: "2px",
          width: "200px",
          flexShrink: 0,
        }}
      >
        <Search size={14} style={{ color: "#9CA3AF", flexShrink: 0 }} />
        <input
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: "13px",
            color: "#9CA3AF",
            width: "100%",
            fontFamily: "Segoe UI, Arial, sans-serif",
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
          gap: "8px",
          paddingRight: "8px",
          color: "#666666",
        }}
      >
        <IconBtn title="Notifications"><Bell size={18} /></IconBtn>
        <IconBtn title="Analytics"><RefreshCw size={18} /></IconBtn>
        <IconBtn title="Dark mode"><Moon size={18} /></IconBtn>
        <IconBtn title="Fullscreen"><Maximize2 size={18} /></IconBtn>
      </div>

      {/* User info */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
          paddingLeft: "16px",
          paddingRight: "16px",
          height: "100%",
          borderLeft: "1px solid #E5E7EB",
          width: "170px",
          minWidth: "170px",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: "13px",
            color: "#333333",
            fontWeight: 500,
            whiteSpace: "nowrap",
            fontFamily: "Segoe UI, Arial, sans-serif",
            flex: 1,
          }}
        >
          {userName}
        </span>
        <UserCircle2 size={22} style={{ color: "#666666", flexShrink: 0 }} />
      </div>
    </header>
  );
}

function IconBtn({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <button
      title={title}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "#666666",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "34px",
        height: "34px",
        borderRadius: "4px",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "#F3F4F6";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "none";
      }}
    >
      {children}
    </button>
  );
}
