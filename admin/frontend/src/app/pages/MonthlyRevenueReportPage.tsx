import { Fragment, useState } from "react";
import { Download } from "lucide-react";
import { Footer } from "../components/Footer";
import { MONTHLY_REVENUE_2026 } from "../data/mockData";

const YEAR_OPTIONS = ["2026", "2025", "2024", "2023"];

function formatCurrency(value: number) {
  return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

interface MonthlyRevenueReportPageProps {
  isDarkMode?: boolean;
}

export function MonthlyRevenueReportPage({ isDarkMode = false }: MonthlyRevenueReportPageProps) {
  const [year, setYear] = useState("2026");
  const [generated, setGenerated] = useState(false);

  const primaryColor = isDarkMode ? "#DF2A57" : "#C70039";
  const cardBg = isDarkMode ? "#252830" : "#FFFFFF";
  const borderColor = isDarkMode ? "#333333" : "#E5E7EB";
  const textColor = isDarkMode ? "#E5E7EB" : "#555555";
  const labelColor = isDarkMode ? "#9CA3AF" : "#666666";
  const tableHeaderBg = isDarkMode ? "#2A2D34" : "#E8E8E8";
  const inputBg = isDarkMode ? "#1A1C21" : "#FFFFFF";

  const revenueData = year === "2026" ? MONTHLY_REVENUE_2026 : [];

  function handleDownloadCsv() {
    const lines = ["Month,Client Name,Revenue,Expenses,Profit"];
    revenueData.forEach((group) => {
      group.rows.forEach((row) => {
        lines.push(
          `"${group.month}","${row.clientName}",${row.revenue.toFixed(2)},${row.expenses.toFixed(2)},${row.profit.toFixed(2)}`
        );
      });
    });
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `monthly-revenue-${year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
          Monthly Revenue Report
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
          <div style={{ display: "flex", alignItems: "flex-end", gap: "20px", flexWrap: "wrap" }}>
            <div style={{ width: "160px" }}>
              <label style={{ display: "block", fontSize: "12px", color: labelColor, marginBottom: "6px" }}>
                Year
              </label>
              <select
                value={year}
                onChange={(e) => {
                  setYear(e.target.value);
                  setGenerated(false);
                }}
                style={{
                  width: "100%",
                  height: "36px",
                  padding: "0 10px",
                  fontSize: "13px",
                  border: `1px solid ${borderColor}`,
                  borderRadius: "4px",
                  background: inputBg,
                  color: textColor,
                }}
              >
                {YEAR_OPTIONS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setGenerated(true)}
              style={{
                padding: "8px 24px",
                background: primaryColor,
                color: "#FFFFFF",
                border: "none",
                borderRadius: "4px",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
                height: "36px",
              }}
            >
              Generate Report
            </button>
          </div>

          {generated && revenueData.length > 0 && (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <p style={{ margin: 0, fontSize: "14px", color: textColor }}>
                  Monthly Revenue Report for: <span style={{ color: primaryColor, fontWeight: 600 }}>EvalRight</span>{" "}
                  for the year <span style={{ color: primaryColor, fontWeight: 600 }}>{year}</span>
                </p>
                <button
                  onClick={handleDownloadCsv}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 14px",
                    background: cardBg,
                    color: primaryColor,
                    border: `1px solid ${primaryColor}`,
                    borderRadius: "4px",
                    fontSize: "13px",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  <Download size={14} />
                  Download CSV
                </button>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ background: tableHeaderBg }}>
                      {["Client Name", "Revenue", "Expenses", "Profit"].map((col) => (
                        <th
                          key={col}
                          style={{
                            padding: "10px 16px",
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
                    {revenueData.map((group) => (
                      <Fragment key={group.month}>
                        <tr style={{ background: isDarkMode ? "#2A2D34" : "#F9F9F9" }}>
                          <td
                            colSpan={4}
                            style={{
                              padding: "10px 16px",
                              fontWeight: 700,
                              color: textColor,
                              borderBottom: `1px solid ${borderColor}`,
                            }}
                          >
                            {group.month}
                          </td>
                        </tr>
                        {group.rows.map((row) => (
                          <tr key={`${group.month}-${row.clientName}`} style={{ borderBottom: `1px solid ${borderColor}` }}>
                            <td style={{ padding: "10px 16px", color: textColor }}>{row.clientName}</td>
                            <td style={{ padding: "10px 16px", textAlign: "right", color: textColor }}>
                              {formatCurrency(row.revenue)}
                            </td>
                            <td style={{ padding: "10px 16px", textAlign: "right", color: textColor }}>
                              {formatCurrency(row.expenses)}
                            </td>
                            <td style={{ padding: "10px 16px", textAlign: "right", color: textColor }}>
                              {formatCurrency(row.profit)}
                            </td>
                          </tr>
                        ))}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {generated && revenueData.length === 0 && (
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
              No revenue data found for {year}.
            </div>
          )}
        </div>
      </div>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
