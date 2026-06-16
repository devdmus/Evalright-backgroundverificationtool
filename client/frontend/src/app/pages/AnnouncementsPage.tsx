import { useState } from "react";
import { Info, X } from "lucide-react";
import { Footer } from "../components/Footer";

export function AnnouncementsPage() {
  const [bannerVisible, setBannerVisible] = useState(true);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <div
        style={{
          flex: 1,
          padding: "20px 24px",
          background: "#F5F5F5",
          overflowY: "auto",
        }}
      >
        {/* Page title */}
        <h1
          style={{
            fontSize: "20px",
            fontWeight: 500,
            color: "#C70039",
            marginBottom: "20px",
          }}
        >
          Announcements
        </h1>

        {/* Info banner */}
        {bannerVisible && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#EBF4FB",
              border: "1px solid #BEE3F8",
              borderRadius: "6px",
              padding: "12px 16px",
              gap: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: "#4A90B8",
                fontSize: "14px",
              }}
            >
              <Info size={17} style={{ flexShrink: 0, color: "#5DA8D0" }} />
              <span style={{ color: "#4A7C94" }}>
                There are no announcements at this moment.
              </span>
            </div>

            <button
              onClick={() => setBannerVisible(false)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#7BABB8",
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

      <Footer />
    </div>
  );
}
