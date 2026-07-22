import { useState } from "react";
import { FileText } from "lucide-react";
import { Footer } from "../components/Footer";
import {
  CONFIGURATION_GROUPS,
  SALES_REPORT_CLIENTS,
  SALES_BY_SEARCH_TYPE_DATA,
  SALES_COUNT_ALL_DATA,
} from "../data/mockData";

type SalesReportType = "by-search-type" | "count-all";

interface SalesReportPageProps {
  isDarkMode?: boolean;
  onViewClient?: (clientId: string) => void;
}

export function SalesReportPage({ isDarkMode = false, onViewClient }: SalesReportPageProps) {
  const [clientId, setClientId] = useState("all");
  const [configGroup, setConfigGroup] = useState("All Groups");
  const [dateRange, setDateRange] = useState("");
  const [reportType, setReportType] = useState<SalesReportType>("by-search-type");
  const [generated, setGenerated] = useState(false);

  const primaryColor = isDarkMode ? "#DF2A57" : "#C70039";
  const cardBg = isDarkMode ? "#252830" : "#FFFFFF";
  const borderColor = isDarkMode ? "#333333" : "#E5E7EB";
  const textColor = isDarkMode ? "#E5E7EB" : "#555555";
  const labelColor = isDarkMode ? "#9CA3AF" : "#666666";
  const tableHeaderBg = isDarkMode ? "#2A2D34" : "#F0F0F0";
  const inputBg = isDarkMode ? "#1A1C21" : "#FFFFFF";

  const selectedClient = SALES_REPORT_CLIENTS.find((c) => c.id === clientId);
  const showResults = generated && clientId === "16420";

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
    if (!dateRange && clientId === "16420") {
      setDateRange("2026-06-01 to 2026-06-23");
    }
    setGenerated(true);
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
        <h1 style={{ fontSize: "20px", fontWeight: 600, color: primaryColor, margin: 0 }}>Sales Report</h1>

        <div
          style={{
            background: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: "6px",
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", color: labelColor, marginBottom: "6px" }}>
                Client
              </label>
              <select
                value={clientId}
                onChange={(e) => {
                  setClientId(e.target.value);
                  setGenerated(false);
                  if (e.target.value === "16420") setDateRange("2026-06-01 to 2026-06-23");
                }}
                style={inputStyle}
              >
                {SALES_REPORT_CLIENTS.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", color: labelColor, marginBottom: "6px" }}>
                Configuration Group
              </label>
              <select value={configGroup} onChange={(e) => setConfigGroup(e.target.value)} style={inputStyle}>
                {CONFIGURATION_GROUPS.map((group) => (
                  <option key={group} value={group}>
                    {group}
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
                placeholder=""
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", color: labelColor, marginBottom: "6px" }}>
                Report Type
              </label>
              <select
                value={reportType}
                onChange={(e) => {
                  setReportType(e.target.value as SalesReportType);
                  setGenerated(false);
                }}
                style={inputStyle}
              >
                <option value="by-search-type">Break down by search type</option>
                <option value="count-all">Count of all searches ordered</option>
              </select>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              onClick={handleGenerate}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 20px",
                background: primaryColor,
                color: "#FFFFFF",
                border: "none",
                borderRadius: "4px",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              <FileText size={16} />
              Generate Report
            </button>
          </div>

          {!generated || !showResults ? (
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
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {reportType === "by-search-type" && (
                <>
                  <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: primaryColor }}>
                    {selectedClient?.name}
                  </h2>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                      <thead>
                        <tr style={{ background: tableHeaderBg }}>
                          {[
                            "Search Type",
                            "Total Searches",
                            "Total Expenses ($)",
                            "Total Sale Price ($)",
                            "Profit/Loss ($)",
                          ].map((col) => (
                            <th
                              key={col}
                              style={{
                                padding: "10px 12px",
                                textAlign: col === "Search Type" ? "left" : "right",
                                fontWeight: 600,
                                color: labelColor,
                                borderBottom: `1px solid ${borderColor}`,
                              }}
                            >
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {SALES_BY_SEARCH_TYPE_DATA.map((row) => (
                          <tr key={row.searchType} style={{ borderBottom: `1px solid ${borderColor}` }}>
                            <td style={{ padding: "10px 12px", color: textColor }}>{row.searchType}</td>
                            <td style={{ padding: "10px 12px", textAlign: "right", color: textColor }}>
                              {row.totalSearches}
                            </td>
                            <td style={{ padding: "10px 12px", textAlign: "right", color: textColor }}>
                              {row.totalExpenses.toFixed(2)}
                            </td>
                            <td style={{ padding: "10px 12px", textAlign: "right", color: textColor }}>
                              {row.totalSalePrice.toFixed(2)}
                            </td>
                            <td style={{ padding: "10px 12px", textAlign: "right", color: textColor }}>
                              {row.profitLoss.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div style={{ fontSize: "13px", color: textColor, display: "flex", flexDirection: "column", gap: "4px" }}>
                    <div>
                      <strong>Total Sales:</strong> $91.00
                    </div>
                    <div>
                      <strong>Total Profits:</strong> $61.60
                    </div>
                  </div>
                </>
              )}

              {reportType === "count-all" && (
                <>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                      <thead>
                        <tr style={{ background: tableHeaderBg }}>
                          {[
                            "Client Name",
                            "Total Searches",
                            "Total Expenses ($)",
                            "Total Sale Price ($)",
                            "Profit/Loss ($)",
                          ].map((col) => (
                            <th
                              key={col}
                              style={{
                                padding: "10px 12px",
                                textAlign: col === "Client Name" ? "left" : "right",
                                fontWeight: 600,
                                color: labelColor,
                                borderBottom: `1px solid ${borderColor}`,
                              }}
                            >
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {SALES_COUNT_ALL_DATA.map((row) => (
                          <tr key={row.clientId} style={{ borderBottom: `1px solid ${borderColor}` }}>
                            <td style={{ padding: "10px 12px" }}>
                              <button
                                type="button"
                                onClick={() => onViewClient?.(row.clientId)}
                                style={{
                                  background: "none",
                                  border: "none",
                                  padding: 0,
                                  color: primaryColor,
                                  cursor: onViewClient ? "pointer" : "default",
                                  fontSize: "13px",
                                  textDecoration: onViewClient ? "underline" : "none",
                                }}
                              >
                                {row.clientName}
                              </button>
                            </td>
                            <td style={{ padding: "10px 12px", textAlign: "right", color: textColor }}>
                              {row.totalSearches}
                            </td>
                            <td style={{ padding: "10px 12px", textAlign: "right", color: textColor }}>
                              {row.totalExpenses.toFixed(2)}
                            </td>
                            <td style={{ padding: "10px 12px", textAlign: "right", color: textColor }}>
                              {row.totalSalePrice.toFixed(2)}
                            </td>
                            <td style={{ padding: "10px 12px", textAlign: "right", color: textColor }}>
                              {row.profitLoss.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div style={{ fontSize: "13px", color: textColor, display: "flex", flexDirection: "column", gap: "4px" }}>
                    <div>
                      <strong>Total Sales:</strong> $91.00
                    </div>
                    <div>
                      <strong>Total Profits:</strong> $61.60
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
