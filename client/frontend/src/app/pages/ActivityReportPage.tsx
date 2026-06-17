import { useState } from "react";
import { Download } from "lucide-react";
import { Footer } from "../components/Footer";
import { getPageTheme } from "../theme/pageTheme";

const TABS = [
  {
    key: "ytd",
    label: "YTD Activity",
    pageTitle: "YTD Activity Report",
    barTitle: "YTD Activity Report",
    empty: "No activity this month.",
  },
  {
    key: "yesterday",
    label: "Yesterday's Activity",
    pageTitle: "Yesterday's Activity Report",
    barTitle: "Yesterday's Activity Report",
    empty: "No activity yesterday.",
  },
  {
    key: "today",
    label: "Today's Activity",
    pageTitle: "Today's Activity Report",
    barTitle: "Today's Activity Report",
    empty: "No activity today.",
  },
  {
    key: "avg-search",
    label: "Average Search Time",
    pageTitle: "Search Turnaround Time",
    barTitle: "Average Search Time",
    empty: "",
  },
  {
    key: "all-time",
    label: "All Time Activity",
    pageTitle: "All Time Activity Report",
    barTitle: "All Time Activity Report",
    empty: "No activity found.",
  },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function ActivityReportPage({ isDarkMode = false }: { isDarkMode?: boolean }) {
  const [activeTab, setActiveTab] = useState<TabKey>("ytd");
  const t = getPageTheme(isDarkMode);
  const current = TABS.find((tab) => tab.key === activeTab)!;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
      <div style={{ flex: 1, padding: "20px 24px", background: t.contentBg, overflowY: "auto" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 500, color: t.titleAlt, marginBottom: "16px" }}>
          {current.pageTitle}
        </h1>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", marginBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "stretch", background: t.tabInactiveBg, padding: 0 }}>
            {TABS.map((tab) => {
              const isActive = tab.key === activeTab;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding: "10px 20px",
                    fontSize: "14px",
                    fontWeight: 400,
                    color: t.text,
                    background: isActive ? t.tabActiveBg : "transparent",
                    border: "none",
                    borderRadius: 0,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    letterSpacing: "0.01em",
                    transition: "background 0.15s, color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = isDarkMode ? "#333333" : "#ebebeb";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = "transparent";
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "9px 20px",
              fontSize: "13px",
              fontWeight: 500,
              color: "#FFFFFF",
              background: "#3D2B7A",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            <Download size={15} strokeWidth={2.2} />
            Download CSV Report
          </button>
        </div>

        {activeTab === "avg-search" && (
          <div
            style={{
              background: t.cardBg,
              border: t.cardBorder,
              borderRadius: "4px",
              padding: "20px",
              display: "flex",
              alignItems: "flex-end",
              gap: "24px",
              marginBottom: "16px",
              boxShadow: t.cardShadow,
            }}
          >
            {["Start Date", "End Date"].map((label) => (
              <div key={label} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "14px", color: t.textMuted }}>{label}</label>
                <input
                  type="date"
                  style={{
                    width: "180px",
                    padding: "9px 12px",
                    border: t.inputBorder,
                    borderRadius: "4px",
                    fontSize: "14px",
                    color: t.text,
                    background: t.inputBg,
                    outline: "none",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                    cursor: "pointer",
                  }}
                />
              </div>
            ))}

            <button
              style={{
                padding: "10px 24px",
                background: "#B7042C",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "4px",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
                height: "40px",
              }}
            >
              Apply Filter
            </button>

            <button
              style={{
                padding: "10px 24px",
                background: t.inputBg,
                color: "#4A3CA0",
                border: "1px solid #4A3CA0",
                borderRadius: "4px",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
                height: "40px",
              }}
            >
              Clear Filters
            </button>
          </div>
        )}

        <div
          style={{
            background: "#B7042C",
            color: "#FFFFFF",
            padding: "12px 18px",
            fontSize: "14px",
            fontWeight: 600,
            letterSpacing: "0.01em",
          }}
        >
          {current.barTitle}
        </div>

        <div
          style={{
            background: t.cardBg,
            border: t.cardBorder,
            borderTop: "none",
            minHeight: "220px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {activeTab === "avg-search" ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: isDarkMode ? "#2A2D34" : "#F4F4F4",
                padding: "12px 18px",
                fontSize: "14px",
                fontWeight: 600,
                color: t.textMuted,
                borderBottom: t.tableRowBorder,
              }}
            >
              <div style={{ flex: 1 }}>Search Type</div>
              <div style={{ flex: 1 }}>Average Turnaround Time</div>
            </div>
          ) : (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
              <span style={{ fontSize: "14px", color: t.textMuted }}>{current.empty}</span>
            </div>
          )}
        </div>
      </div>

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
