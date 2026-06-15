import { useState } from "react";
import { Download, Calendar } from "lucide-react";
import { Footer } from "../components/Footer";

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

// ── Component ─────────────────────────────────────────────────────────────────
export function ActivityReportPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("ytd");

  const current = TABS.find((t) => t.key === activeTab)!;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
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
            color: "#B7042C",
            marginBottom: "16px",
          }}
        >
          {current.pageTitle}
        </h1>

        {/* ── Tab bar + Download button ──────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            marginBottom: "12px", // Added gap between tabs and red header bar
          }}
        >
          {/* Tabs strip */}
          <div
            style={{
              display: "flex",
              alignItems: "stretch",
              background: "#f4f4f4",
              padding: "0",
            }}
          >
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
                    color: "#333333",
                    background: isActive ? "#d4d4d4" : "transparent",
                    border: "none",
                    borderRadius: "0", // No border radius
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    letterSpacing: "0.01em",
                    transition: "background 0.15s, color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "#ebebeb";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    }
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Download CSV Report button */}
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
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background = "#2E2060")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background = "#3D2B7A")
            }
          >
            <Download size={15} strokeWidth={2.2} />
            Download CSV Report
          </button>
        </div>

        {/* ── Optional Filter Box (Average Search Time) ──────────────── */}
        {activeTab === "avg-search" && (
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "4px",
              padding: "20px",
              display: "flex",
              alignItems: "flex-end",
              gap: "24px",
              marginBottom: "16px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "14px", color: "#6B7280" }}>Start Date</label>
              <div style={{ width: "180px" }}>
                <input
                  type="date"
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    border: "1px solid #E5E7EB",
                    borderRadius: "4px",
                    fontSize: "14px",
                    color: "#333333",
                    outline: "none",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                    cursor: "pointer",
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "14px", color: "#6B7280" }}>End Date</label>
              <div style={{ width: "180px" }}>
                <input
                  type="date"
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    border: "1px solid #E5E7EB",
                    borderRadius: "4px",
                    fontSize: "14px",
                    color: "#333333",
                    outline: "none",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                    cursor: "pointer",
                  }}
                />
              </div>
            </div>

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
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#900322")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#B7042C")}
            >
              Apply Filter
            </button>

            <button
              style={{
                padding: "10px 24px",
                background: "#FFFFFF",
                color: "#4A3CA0",
                border: "1px solid #4A3CA0",
                borderRadius: "4px",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
                height: "40px",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#F4F2FF")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#FFFFFF")}
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* ── Dark red section header ────────────────────────────────── */}
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

        {/* ── Content / empty state ─────────────────────────────────── */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E5E7EB",
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
                background: "#F4F4F4",
                padding: "12px 18px",
                fontSize: "14px",
                fontWeight: 600,
                color: "#6B7280",
                borderBottom: "1px solid #E5E7EB",
              }}
            >
              <div style={{ flex: 1 }}>Search Type</div>
              <div style={{ flex: 1 }}>Average Turnaround Time</div>
            </div>
          ) : (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
              <span style={{ fontSize: "14px", color: "#6B7280" }}>{current.empty}</span>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
