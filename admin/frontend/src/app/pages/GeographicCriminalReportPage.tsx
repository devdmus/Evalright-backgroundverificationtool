import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Footer } from "../components/Footer";
import {
  GEOGRAPHIC_STATES,
  COUNTIES_BY_STATE,
  GEOGRAPHIC_CRIMINAL_STATS,
  STATE_ABBREVIATIONS,
} from "../data/mockData";

interface GeographicCriminalReportPageProps {
  isDarkMode?: boolean;
}

export function GeographicCriminalReportPage({ isDarkMode = false }: GeographicCriminalReportPageProps) {
  const [state, setState] = useState("");
  const [county, setCounty] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const primaryColor = isDarkMode ? "#DF2A57" : "#C70039";
  const cardBg = isDarkMode ? "#252830" : "#FFFFFF";
  const borderColor = isDarkMode ? "#333333" : "#E5E7EB";
  const textColor = isDarkMode ? "#E5E7EB" : "#555555";
  const labelColor = isDarkMode ? "#9CA3AF" : "#666666";
  const inputBg = isDarkMode ? "#1A1C21" : "#FFFFFF";

  const counties = state ? COUNTIES_BY_STATE[state] ?? [] : [];
  const stateAbbr = STATE_ABBREVIATIONS[state] ?? state.slice(0, 2).toUpperCase();
  const statsKey = `${state}|${county}`;
  const stats = GEOGRAPHIC_CRIMINAL_STATS[statsKey];

  useEffect(() => {
    if (!state || !county) {
      setLoading(false);
      setShowResults(false);
      return;
    }

    setLoading(true);
    setShowResults(false);
    const timer = setTimeout(() => {
      setLoading(false);
      setShowResults(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, [state, county]);

  const selectStyle: React.CSSProperties = {
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
          Geographic Criminal Report
        </h1>

        <div
          style={{
            background: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: "6px",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", maxWidth: "820px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", color: labelColor, marginBottom: "6px" }}>
                State
              </label>
              <select
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                  setCounty("");
                }}
                style={selectStyle}
              >
                <option value="">Select a State</option>
                {GEOGRAPHIC_STATES.filter((s) => s !== "Select a State").map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", color: labelColor, marginBottom: "6px" }}>
                County
              </label>
              <select
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                disabled={!state}
                style={{
                  ...selectStyle,
                  color: !state ? labelColor : textColor,
                }}
              >
                <option value="">{!state ? "Select a State first" : "Select a County"}</option>
                {counties.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading && county && (
            <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px 0" }}>
              <Loader2 size={22} color={primaryColor} style={{ animation: "spin 1s linear infinite" }} />
              <span style={{ fontSize: "13px", color: textColor }}>
                Calculating stats for {county}/{stateAbbr} for the last 365 days...
              </span>
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {showResults && county && stats && (
            <div
              style={{
                border: `1px solid ${borderColor}`,
                borderRadius: "6px",
                padding: "20px 24px",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: textColor }}>
                {county}/ {stateAbbr}
              </h2>

              {stats.sections.map((section) => (
                <div key={section.title} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: primaryColor }}>{section.title}</h3>
                  <p style={{ margin: 0, fontSize: "13px", color: textColor }}>
                    {section.avgTurnaround} Average Turnaround/Response Time
                  </p>
                  <p style={{ margin: 0, fontSize: "13px", color: textColor }}>
                    {section.recordsFoundPct} of Applicants Found with Records
                  </p>
                  <p style={{ margin: 0, fontSize: "13px", color: textColor }}>{section.totalSearches} Total Searches</p>
                </div>
              ))}
            </div>
          )}

          {showResults && county && !stats && (
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
              No stats available for {county}, {state}.
            </div>
          )}
        </div>
      </div>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
