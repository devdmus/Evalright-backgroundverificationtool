import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Footer } from "../components/Footer";

export function ApplicantStatistics({ isDarkMode = false }: { isDarkMode?: boolean }) {
  const [branchOpen, setBranchOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [branch, setBranch] = useState("All Branches");
  const [branchSearch, setBranchSearch] = useState("");

  const branchRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (branchRef.current && !branchRef.current.contains(event.target as Node)) {
        setBranchOpen(false);
      }
      if (dateRef.current && !dateRef.current.contains(event.target as Node)) {
        setDateOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calendar mock data
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const calendarDays = [
    31, 1, 2, 3, 4, 5, 6,
    7, 8, 9, 10, 11, 12, 13,
    14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27,
    28, 29, 30, 1, 2, 3, 4
  ];

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: isDarkMode ? "#1A1C21" : "#F8F9FA",
        minHeight: 0,
      }}
    >
      <div style={{ flex: 1, padding: "24px", overflowY: "auto" }}>
        {/* Page Title */}
        <h1
          style={{
            fontSize: "20px",
            fontWeight: 500,
            color: isDarkMode ? "#DF2A57" : "#C70039",
            marginBottom: "24px",
            marginTop: 0,
          }}
        >
          Applicant Statistics
        </h1>

        {/* Main Card */}
        <div
          style={{
            background: isDarkMode ? "#252830" : "#FFFFFF",
            border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
            borderRadius: "4px",
            padding: "24px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
          }}
        >
          <div
            style={{
              fontSize: "15px",
              color: isDarkMode ? "#9CA3AF" : "#555555",
              marginBottom: "16px",
              fontWeight: 500,
            }}
          >
            Date Range
          </div>

          <div style={{ display: "flex", gap: "20px", marginBottom: "24px", position: "relative" }}>
            
            {/* Branch Dropdown */}
            <div ref={branchRef} style={{ flex: 1, position: "relative" }}>
              <div
                onClick={() => {
                  setBranchOpen(!branchOpen);
                  setDateOpen(false);
                }}
                style={{
                  border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
                  borderRadius: "3px",
                  padding: "8px 12px",
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  height: "56px",
                  justifyContent: "center",
                  boxSizing: "border-box",
                  background: isDarkMode ? "#2A2D34" : "#FFFFFF",
                  boxShadow: branchOpen ? "0 0 0 1px #E5E7EB" : "none",
                }}
              >
                <span style={{ fontSize: "12px", color: isDarkMode ? "#9CA3AF" : "#A0A0A0", marginBottom: "2px" }}>
                  Branch
                </span>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "15px", color: isDarkMode ? "#E5E7EB" : "#333333" }}>{branch}</span>
                  <ChevronDown size={16} color={isDarkMode ? "#9CA3AF" : "#D1D5DB"} />
                </div>
              </div>

              {/* Branch Dropdown Content */}
              {branchOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    background: isDarkMode ? "#2A2D34" : "#FFFFFF",
                    border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
                    borderTop: "none",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                    zIndex: 10,
                    paddingBottom: "8px",
                  }}
                >
                  <div style={{ padding: "8px 12px" }}>
                    <input
                      type="text"
                      value={branchSearch}
                      onChange={(e) => setBranchSearch(e.target.value)}
                      style={{
                        width: "100%",
                        border: isDarkMode ? "1px solid #444" : "1px solid #E5E7EB",
                        borderRadius: "3px",
                        padding: "8px",
                        fontSize: "14px",
                        background: isDarkMode ? "#1A1C21" : "#FFFFFF",
                        color: isDarkMode ? "#E5E7EB" : "#333333",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div style={{ borderBottom: isDarkMode ? "1px dashed #444" : "1px dashed #E5E7EB", margin: "4px 0 8px 0" }} />
                  <div
                    onClick={() => {
                      setBranch("All Branches");
                      setBranchOpen(false);
                    }}
                    style={{
                      padding: "8px 12px",
                      cursor: "pointer",
                      fontSize: "14px",
                      color: isDarkMode ? "#E5E7EB" : "#555555",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = isDarkMode ? "#333" : "#F3F4F6")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    All Branches
                  </div>
                </div>
              )}
            </div>

            {/* Date Range Dropdown */}
            <div ref={dateRef} style={{ flex: 1, position: "relative" }}>
              <div
                onClick={() => {
                  setDateOpen(!dateOpen);
                  setBranchOpen(false);
                }}
                style={{
                  border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
                  borderRadius: "3px",
                  padding: "0 12px",
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  height: "56px",
                  boxSizing: "border-box",
                  background: isDarkMode ? "#2A2D34" : "#FFFFFF",
                }}
              >
                <span style={{ fontSize: "14px", color: isDarkMode ? "#9CA3AF" : "#A0A0A0" }}>
                  Order Date Range
                </span>
              </div>

              {/* Calendar Dropdown Content */}
              {dateOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    width: "320px",
                    background: isDarkMode ? "#2A2D34" : "#FFFFFF",
                    border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    zIndex: 10,
                    borderRadius: "4px",
                    overflow: "hidden",
                    marginTop: "4px",
                  }}
                >
                  {/* Calendar Header */}
                  <div
                    style={{
                      background: "#C70039",
                      color: "#FFFFFF",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 16px",
                    }}
                  >
                    <ChevronLeft size={18} style={{ cursor: "pointer" }} />
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "15px", fontWeight: 500 }}>
                      <span>June</span>
                      <ChevronDown size={14} />
                      <span>2026</span>
                    </div>
                    <ChevronRight size={18} style={{ cursor: "pointer" }} />
                  </div>

                  {/* Calendar Body */}
                  <div style={{ padding: "16px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px", textAlign: "center", marginBottom: "12px" }}>
                      {daysOfWeek.map((day) => (
                        <div key={day} style={{ fontSize: "12px", color: isDarkMode ? "#9CA3AF" : "#6B7280", fontWeight: 500 }}>
                          {day}
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px", textAlign: "center" }}>
                      {calendarDays.map((day, index) => {
                        const isCurrentMonth = index >= 1 && index <= 30; // Rough logic for mockup
                        const isSelected = day === 12 && isCurrentMonth;
                        return (
                          <div
                            key={index}
                            style={{
                              fontSize: "14px",
                              color: isCurrentMonth ? (isDarkMode ? "#E5E7EB" : "#333333") : (isDarkMode ? "#6B7280" : "#D1D5DB"),
                              padding: "6px",
                              borderRadius: "50%",
                              border: isSelected ? "1px solid #9CA3AF" : "1px solid transparent",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "30px",
                              height: "30px",
                              margin: "0 auto",
                            }}
                          >
                            {day}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            style={{
              background: "#C70039",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "4px",
              padding: "10px 24px",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Generate Report
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
