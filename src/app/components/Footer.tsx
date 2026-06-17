import { Phone, Mail } from "lucide-react";
import { getPageTheme } from "../theme/pageTheme";

export function Footer({ isDarkMode = false }: { isDarkMode?: boolean }) {
  const t = getPageTheme(isDarkMode);

  return (
    <footer
      style={{
        borderTop: t.footerBorder,
        padding: "0 24px",
        height: "44px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
        background: t.footerBg,
        fontSize: "14px",
        color: t.footerText,
      }}
    >
      <span>© 2026 EvalRight</span>
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Phone size={13} style={{ color: t.footerText }} />
          1-800-935-9025
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Mail size={13} style={{ color: t.footerText }} />
          support@evalright.com
        </span>
      </div>
    </footer>
  );
}
