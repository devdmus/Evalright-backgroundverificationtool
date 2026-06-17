import { useState } from "react";
import { Info, X } from "lucide-react";
import { Footer } from "../components/Footer";
import { getPageTheme } from "../theme/pageTheme";

export function AnnouncementsPage({ isDarkMode = false }: { isDarkMode?: boolean }) {
  const [bannerVisible, setBannerVisible] = useState(true);
  const t = getPageTheme(isDarkMode);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
      <div style={{ flex: 1, padding: "20px 24px", background: t.contentBg, overflowY: "auto" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 500, color: t.titleAlt, marginBottom: "20px" }}>
          Announcements
        </h1>

        {bannerVisible && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: t.infoBannerBg,
              border: t.infoBannerBorder,
              borderRadius: "6px",
              padding: "12px 16px",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px" }}>
              <Info size={17} style={{ flexShrink: 0, color: t.infoBannerText }} />
              <span style={{ color: t.infoBannerText }}>There are no announcements at this moment.</span>
            </div>

            <button
              onClick={() => setBannerVisible(false)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: t.infoBannerText,
                display: "flex",
                alignItems: "center",
                padding: "2px",
                flexShrink: 0,
              }}
              title="Dismiss"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
