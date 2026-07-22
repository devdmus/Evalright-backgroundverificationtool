import { useState } from "react";
import { FileText } from "lucide-react";
import { Footer } from "../components/Footer";
import { RESEARCHERS } from "../data/mockData";

interface ResearcherReportPageProps {
  isDarkMode?: boolean;
}

export function ResearcherReportPage({ isDarkMode = false }: ResearcherReportPageProps) {
  const [researcher, setResearcher] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [generated, setGenerated] = useState(false);

  const primaryColor = isDarkMode ? "#DF2A57" : "#C70039";
  const cardBg = isDarkMode ? "#252830" : "#FFFFFF";
  const borderColor = isDarkMode ? "#333333" : "#E5E7EB";
  const textColor = isDarkMode ? "#E5E7EB" : "#555555";
  const labelColor = isDarkMode ? "#9CA3AF" : "#666666";
  const inputBg = isDarkMode ? "#1A1C21" : "#FFFFFF";

  const hasNoResults =
    generated &&
    researcher &&
    (researcher === "Alameda Researchers" || researcher === "A & C Research" || researcher === "All Researchers");

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: "36px",
    padding: "0 10px",
    fontSize: "13px",
    border: `1px solid ${borderColor}`,
    borderRadius: "4px",
    background: inputBg,
    color: textColor,
    boxSizing: "border-box",
  };

  function handleGenerate() {
    if (!researcher) return;
    setGenerated(true);
    if (!dateRange && researcher === "Alameda Researchers") {
      setDateRange("2026-06-01 to 2026-06-23");
    }
  }

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        background: isDarkMode ? "#1A1C21" : "#F4F5F7",
      }}
    >
      <div style={{ flex: 1, padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 600, color: primaryColor, margin: 0 }}>
          Generate Researcher Report
        </h1>

        <div
          style={{
            background: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: "6px",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px", alignItems: "end" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", color: labelColor, marginBottom: "6px" }}>
                Researcher
              </label>
              <select
                value={researcher}
                onChange={(e) => {
                  setResearcher(e.target.value);
                  setGenerated(false);
                }}
                style={inputStyle}
              >
                <option value="">Select a Researcher</option>
                {RESEARCHERS.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", color: labelColor, marginBottom: "6px" }}>
                Date Range
              </label>
              <input
                type="text"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                placeholder="Date Range"
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={handleGenerate}
              disabled={!researcher}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 20px",
                background: researcher ? primaryColor : "#CCCCCC",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "4px",
                fontSize: "13px",
                fontWeight: 500,
                cursor: researcher ? "pointer" : "not-allowed",
              }}
            >
              <FileText size={16} />
              Generate Report
            </button>
          </div>

          {!generated ? (
            <div
              style={{
                background: isDarkMode ? "#3D3419" : "#FFF3CD",
                color: isDarkMode ? "#FCD34D" : "#856404",
                textAlign: "center",
                padding: "10px 16px",
                fontSize: "13px",
                borderRadius: "4px",
              }}
            >
              Please select your criteria and generate the report.
            </div>
          ) : hasNoResults ? (
            <div
              style={{
                background: isDarkMode ? "#1E3A5F" : "#D1ECF1",
                color: isDarkMode ? "#93C5FD" : "#0C5460",
                textAlign: "center",
                padding: "10px 16px",
                fontSize: "13px",
                borderRadius: "4px",
              }}
            >
              No results found for your selected criteria.
            </div>
          ) : null}
        </div>
      </div>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
