import { Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid #E5E7EB",
        padding: "0 24px",
        height: "44px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
        background: "#FFFFFF",
        fontSize: "14px",
        color: "#777777",
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
