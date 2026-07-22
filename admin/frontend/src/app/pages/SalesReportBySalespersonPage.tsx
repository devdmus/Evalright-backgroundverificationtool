import { useState } from "react";
import { Download } from "lucide-react";
import { Footer } from "../components/Footer";
import { SALES_PERSONS, SALES_REPORT_BY_PERSON_DATA } from "../data/mockData";

type DatePreset = "this-month" | "last-month" | "this-year" | "last-year";
type ReportType = "sales-person" | "manager";

function formatCurrency(value: number) {
  return `$${value.toFixed(2)}`;
}

function formatProfit(value: number, pct: number) {
  return `${formatCurrency(value)} (${pct.toFixed(2)}%)`;
}

function getPresetDates(preset: DatePreset): { from: string; to: string } {
  switch (preset) {
    case "this-month":
      return { from: "06/01/2026", to: "06/23/2026" };
    case "last-month":
      return { from: "05/01/2026", to: "05/31/2026" };
    case "this-year":
      return { from: "01/01/2026", to: "06/23/2026" };
    case "last-year":
      return { from: "01/01/2025", to: "12/31/2025" };
  }
}

interface SalesReportBySalespersonPageProps {
  isDarkMode?: boolean;
}

export function SalesReportBySalespersonPage({ isDarkMode = false }: SalesReportBySalespersonPageProps) {
  const [salesPersonId, setSalesPersonId] = useState("");
  const [datePreset, setDatePreset] = useState<DatePreset>("this-month");
  const [dateFrom, setDateFrom] = useState("06/01/2026");
  const [dateTo, setDateTo] = useState("06/23/2026");
  const [reportType, setReportType] = useState<ReportType>("sales-person");
  const [generated, setGenerated] = useState(false);

  const primaryColor = isDarkMode ? "#DF2A57" : "#C70039";
  const cardBg = isDarkMode ? "#252830" : "#FFFFFF";
  const borderColor = isDarkMode ? "#333333" : "#E5E7EB";
  const textColor = isDarkMode ? "#E5E7EB" : "#555555";
  const labelColor = isDarkMode ? "#9CA3AF" : "#666666";
  const tableHeaderBg = isDarkMode ? "#2A2D34" : "#F0F0F0";
  const inputBg = isDarkMode ? "#1A1C21" : "#FFFFFF";

  const selectedPerson = SALES_PERSONS.find((p) => p.id === salesPersonId);

  const summary = SALES_REPORT_BY_PERSON_DATA.reduce(
    (acc, row) => ({
      totalSales: acc.totalSales + row.totalSales,
      totalGrossProfit: acc.totalGrossProfit + row.grossProfit,
      totalNetProfit: acc.totalNetProfit + row.netProfit,
      totalSalesCommission: acc.totalSalesCommission + row.salesCommission,
      totalManagerCommission: acc.totalManagerCommission + row.managerCommission,
    }),
    { totalSales: 0, totalGrossProfit: 0, totalNetProfit: 0, totalSalesCommission: 0, totalManagerCommission: 0 }
  );
  const grossProfitPct = summary.totalSales > 0 ? (summary.totalGrossProfit / summary.totalSales) * 100 : 0;
  const netProfitPct = summary.totalSales > 0 ? (summary.totalNetProfit / summary.totalSales) * 100 : 0;
  const summaryWithPct = { ...summary, grossProfitPct, netProfitPct };

  function handlePresetChange(preset: DatePreset) {
    setDatePreset(preset);
    const dates = getPresetDates(preset);
    setDateFrom(dates.from);
    setDateTo(dates.to);
  }

  function handleGenerate() {
    if (!salesPersonId) return;
    setGenerated(true);
  }

  function handleDownloadCsv() {
    const headers = [
      "Client",
      "Order Count",
      "Total Sales",
      "Fees",
      "Gross Profit",
      "Gross Profit %",
      "Net Profit",
      "Net Profit %",
      "Sales Commission",
      "Manager Commission",
    ];
    const lines = [
      headers.join(","),
      ...SALES_REPORT_BY_PERSON_DATA.map((row) =>
        [
          `"${row.client}"`,
          row.orderCount,
          row.totalSales.toFixed(2),
          row.fees.toFixed(2),
          row.grossProfit.toFixed(2),
          row.grossProfitPct.toFixed(2),
          row.netProfit.toFixed(2),
          row.netProfitPct.toFixed(2),
          row.salesCommission.toFixed(2),
          row.managerCommission.toFixed(2),
        ].join(",")
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sales-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

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

  const radioOptions: { value: DatePreset; label: string }[] = [
    { value: "this-month", label: "This month" },
    { value: "last-month", label: "Last month" },
    { value: "this-year", label: "This year" },
    { value: "last-year", label: "Last year" },
  ];

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
          Generate Sales Report by Sales Person
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
          <div style={{ maxWidth: "400px" }}>
            <label style={{ display: "block", fontSize: "12px", color: labelColor, marginBottom: "6px" }}>
              Sales Person
            </label>
            <select
              value={salesPersonId}
              onChange={(e) => {
                setSalesPersonId(e.target.value);
                setGenerated(false);
              }}
              style={inputStyle}
            >
              <option value="">Select a Sales Person</option>
              {SALES_PERSONS.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", color: labelColor, marginBottom: "10px" }}>
              Report Date Range
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginBottom: "14px" }}>
              {radioOptions.map((opt) => (
                <label
                  key={opt.value}
                  style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: textColor, cursor: "pointer" }}
                >
                  <input
                    type="radio"
                    name="datePreset"
                    checked={datePreset === opt.value}
                    onChange={() => handlePresetChange(opt.value)}
                    style={{ accentColor: primaryColor }}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", maxWidth: "500px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: labelColor, marginBottom: "6px" }}>
                  Date From
                </label>
                <input
                  type="text"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: labelColor, marginBottom: "6px" }}>
                  Date To
                </label>
                <input type="text" value={dateTo} onChange={(e) => setDateTo(e.target.value)} style={inputStyle} />
              </div>
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", color: labelColor, marginBottom: "10px" }}>
              Report Type
            </label>
            <div style={{ display: "flex", gap: "20px" }}>
              {(
                [
                  { value: "sales-person" as ReportType, label: "Sales Person" },
                  { value: "manager" as ReportType, label: "Manager" },
                ] as const
              ).map((opt) => (
                <label
                  key={opt.value}
                  style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: textColor, cursor: "pointer" }}
                >
                  <input
                    type="radio"
                    name="reportType"
                    checked={reportType === opt.value}
                    onChange={() => setReportType(opt.value)}
                    style={{ accentColor: primaryColor }}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={handleGenerate}
              disabled={!salesPersonId}
              style={{
                padding: "8px 24px",
                background: salesPersonId ? primaryColor : "#CCCCCC",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "4px",
                fontSize: "13px",
                fontWeight: 500,
                cursor: salesPersonId ? "pointer" : "not-allowed",
              }}
            >
              Generate Report
            </button>
          </div>

          {generated && selectedPerson && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "8px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <p style={{ margin: 0, fontSize: "14px", color: primaryColor, fontWeight: 500 }}>
                  Sales Report for: {selectedPerson.displayName} from {dateFrom} → {dateTo}
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
                      {[
                        "Client",
                        "Order Count",
                        "Total Sales",
                        "Fees",
                        "Gross Profit (%)",
                        "Net Profit (%)",
                        "Sales Commission",
                        "Manager Commission",
                      ].map((col) => (
                        <th
                          key={col}
                          style={{
                            padding: "10px 12px",
                            textAlign: col === "Client" ? "left" : "right",
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
                    {SALES_REPORT_BY_PERSON_DATA.map((row) => (
                      <tr key={row.client} style={{ borderBottom: `1px solid ${borderColor}` }}>
                        <td style={{ padding: "10px 12px", color: textColor }}>{row.client}</td>
                        <td style={{ padding: "10px 12px", textAlign: "right", color: textColor }}>{row.orderCount}</td>
                        <td style={{ padding: "10px 12px", textAlign: "right", color: textColor }}>
                          {formatCurrency(row.totalSales)}
                        </td>
                        <td style={{ padding: "10px 12px", textAlign: "right", color: textColor }}>
                          {formatCurrency(row.fees)}
                        </td>
                        <td style={{ padding: "10px 12px", textAlign: "right", color: textColor }}>
                          {formatProfit(row.grossProfit, row.grossProfitPct)}
                        </td>
                        <td style={{ padding: "10px 12px", textAlign: "right", color: textColor }}>
                          {formatProfit(row.netProfit, row.netProfitPct)}
                        </td>
                        <td style={{ padding: "10px 12px", textAlign: "right", color: textColor }}>
                          {formatCurrency(row.salesCommission)}
                        </td>
                        <td style={{ padding: "10px 12px", textAlign: "right", color: textColor }}>
                          {formatCurrency(row.managerCommission)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ overflowX: "auto", marginTop: "4px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ background: primaryColor, color: "#FFFFFF" }}>
                      {[
                        "Total Sales",
                        "Total Gross Profit",
                        "Total Net Profit",
                        "Total Sales Person Commission",
                        "Total Manager Commission",
                      ].map((col) => (
                        <th
                          key={col}
                          style={{
                            padding: "10px 12px",
                            textAlign: "right",
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ background: tableHeaderBg }}>
                      <td style={{ padding: "10px 12px", textAlign: "right", color: textColor, fontWeight: 600 }}>
                        {formatCurrency(summaryWithPct.totalSales)}
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "right", color: textColor, fontWeight: 600 }}>
                        {formatCurrency(summaryWithPct.totalGrossProfit)} / {summaryWithPct.grossProfitPct.toFixed(2)}%
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "right", color: textColor, fontWeight: 600 }}>
                        {formatCurrency(summaryWithPct.totalNetProfit)} / {summaryWithPct.netProfitPct.toFixed(2)}%
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "right", color: textColor, fontWeight: 600 }}>
                        {formatCurrency(summaryWithPct.totalSalesCommission)}
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "right", color: textColor, fontWeight: 600 }}>
                        {formatCurrency(summaryWithPct.totalManagerCommission)}
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
