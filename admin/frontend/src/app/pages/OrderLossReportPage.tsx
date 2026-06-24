import { useState } from "react";
import { FileText } from "lucide-react";
import { Footer } from "../components/Footer";
import { ORDER_LOSS_REPORT_DATA } from "../data/mockData";

const DATE_RANGE_OPTIONS = [
  "Today",
  "This Week",
  "Last Week",
  "This Month",
  "Last Month",
  "1 Month",
  "6 Months",
  "1 Year",
] as const;

const CLIENT_FILTER_OPTIONS = ["All Clients", "New Clients Only"] as const;

type DateRangeOption = (typeof DATE_RANGE_OPTIONS)[number];
type ClientFilterOption = (typeof CLIENT_FILTER_OPTIONS)[number];

function getDateRangeLabel(range: DateRangeOption): { from: string; to: string } {
  const to = new Date(2026, 5, 23);
  const from = new Date(to);

  switch (range) {
    case "Today":
      break;
    case "This Week":
      from.setDate(to.getDate() - to.getDay());
      break;
    case "Last Week":
      from.setDate(to.getDate() - to.getDay() - 7);
      to.setDate(from.getDate() + 6);
      break;
    case "This Month":
      from.setDate(1);
      break;
    case "Last Month":
      from.setMonth(to.getMonth() - 1, 1);
      to.setDate(0);
      break;
    case "1 Month":
      from.setMonth(to.getMonth() - 1);
      break;
    case "6 Months":
      from.setMonth(to.getMonth() - 6);
      break;
    case "1 Year":
      from.setFullYear(to.getFullYear() - 1);
      break;
  }

  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  return { from: fmt(from), to: fmt(to) };
}

interface OrderLossReportPageProps {
  isDarkMode?: boolean;
  onViewClient?: (clientId: string) => void;
}

export function OrderLossReportPage({ isDarkMode = false, onViewClient }: OrderLossReportPageProps) {
  const [dateRange, setDateRange] = useState<DateRangeOption>("Today");
  const [customDateRange, setCustomDateRange] = useState("");
  const [clientFilter, setClientFilter] = useState<ClientFilterOption>("All Clients");
  const [generated, setGenerated] = useState(false);
  const [reportRange, setReportRange] = useState({ from: "", to: "" });

  const primaryColor = isDarkMode ? "#DF2A57" : "#C70039";
  const cardBg = isDarkMode ? "#252830" : "#FFFFFF";
  const borderColor = isDarkMode ? "#333333" : "#E5E7EB";
  const textColor = isDarkMode ? "#E5E7EB" : "#555555";
  const labelColor = isDarkMode ? "#9CA3AF" : "#666666";
  const tableHeaderBg = isDarkMode ? "#2A2D34" : "#F0F0F0";
  const inputBg = isDarkMode ? "#1A1C21" : "#FFFFFF";

  const rows =
    clientFilter === "New Clients Only" ? ORDER_LOSS_REPORT_DATA : ORDER_LOSS_REPORT_DATA;

  const totals = rows.reduce(
    (acc, row) => ({
      charged: acc.charged + row.totalCharged,
      expenses: acc.expenses + row.totalExpenses,
      loss: acc.loss + row.loss,
    }),
    { charged: 0, expenses: 0, loss: 0 }
  );

  function handleGenerate() {
    const range = customDateRange.trim()
      ? { from: customDateRange, to: customDateRange }
      : getDateRangeLabel(dateRange);
    setReportRange(range);
    setGenerated(true);
  }

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
        <h1 style={{ fontSize: "20px", fontWeight: 600, color: primaryColor, margin: 0 }}>Order Loss Report</h1>

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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
            }}
          >
            <div>
              <label style={{ display: "block", fontSize: "12px", color: labelColor, marginBottom: "6px" }}>
                Pre-Defined Date Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as DateRangeOption)}
                style={selectStyle}
              >
                {DATE_RANGE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", color: labelColor, marginBottom: "6px" }}>
                Custom Date Range
              </label>
              <input
                type="text"
                value={customDateRange}
                onChange={(e) => setCustomDateRange(e.target.value)}
                style={selectStyle}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", color: labelColor, marginBottom: "6px" }}>
                Client Filter
              </label>
              <select
                value={clientFilter}
                onChange={(e) => setClientFilter(e.target.value as ClientFilterOption)}
                style={selectStyle}
              >
                {CLIENT_FILTER_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
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
              Please select criteria and generate the report.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <p style={{ margin: 0, fontSize: "13px", color: textColor }}>
                Loss Orders from {reportRange.from} to {reportRange.to}
              </p>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ background: tableHeaderBg }}>
                      {[
                        "Client / Company Name",
                        "Order ID",
                        "Order Date",
                        "Total Charged ($)",
                        "Total Expenses ($)",
                        "Loss ($)",
                      ].map((col) => (
                        <th
                          key={col}
                          style={{
                            padding: "10px 12px",
                            textAlign: col.includes("$") ? "right" : "left",
                            fontWeight: 600,
                            color: labelColor,
                            borderBottom: `1px solid ${borderColor}`,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.orderId} style={{ borderBottom: `1px solid ${borderColor}` }}>
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
                            {row.companyName}
                          </button>
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          <span style={{ color: primaryColor }}>{row.orderId}</span>
                        </td>
                        <td style={{ padding: "10px 12px", color: textColor }}>{row.orderDate}</td>
                        <td style={{ padding: "10px 12px", textAlign: "right", color: textColor }}>
                          {row.totalCharged.toFixed(2)}
                        </td>
                        <td style={{ padding: "10px 12px", textAlign: "right", color: textColor }}>
                          {row.totalExpenses.toFixed(2)}
                        </td>
                        <td style={{ padding: "10px 12px", textAlign: "right", color: primaryColor, fontWeight: 500 }}>
                          {row.loss.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                    <tr style={{ background: tableHeaderBg, fontWeight: 600 }}>
                      <td colSpan={3} style={{ padding: "10px 12px", color: textColor }}>
                        Totals:
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "right", color: textColor }}>
                        {totals.charged.toFixed(2)}
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "right", color: textColor }}>
                        {totals.expenses.toFixed(2)}
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "right", color: primaryColor }}>
                        {totals.loss.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
