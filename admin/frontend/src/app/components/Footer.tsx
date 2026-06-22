import { Phone, Mail } from "lucide-react";

export function Footer({ isDarkMode = false }: { isDarkMode?: boolean }) {
  return (
    <footer
      style={{
        borderTop: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
        padding: "0 24px",
        height: "44px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
        background: isDarkMode ? "#252830" : "#FFFFFF",
        fontSize: "14px",
        color: isDarkMode ? "#9CA3AF" : "#777777",
      }}
    >
      <span>© 2026 EvalRight</span>
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Phone size={13} style={{ color: "#777777" }} />
          1-800-935-9025
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Mail size={13} style={{ color: "#777777" }} />
          support@evalright.com
        </span>
      </div>
    </footer>
  );
}
