import { useState } from "react";
import { Download } from "lucide-react";
import { Footer } from "../components/Footer";
import { PACKAGE_ORDER_TREND_CLIENTS, PACKAGE_ORDER_TREND_DATA } from "../data/mockData";

interface PackageOrderTrendPageProps {
  isDarkMode?: boolean;
}

export function PackageOrderTrendPage({ isDarkMode = false }: PackageOrderTrendPageProps) {
  const [clientId, setClientId] = useState("");
  const [dateFrom, setDateFrom] = useState("2026-05-24");
  const [dateTo, setDateTo] = useState("2026-06-23");
  const [generated, setGenerated] = useState(false);

  const primaryColor = isDarkMode ? "#DF2A57" : "#C70039";
  const cardBg = isDarkMode ? "#252830" : "#FFFFFF";
  const borderColor = isDarkMode ? "#333333" : "#E5E7EB";
  const textColor = isDarkMode ? "#E5E7EB" : "#555555";
  const labelColor = isDarkMode ? "#9CA3AF" : "#666666";
  const tableHeaderBg = isDarkMode ? "#2A2D34" : "#F0F0F0";
  const inputBg = isDarkMode ? "#1A1C21" : "#FFFFFF";

  const selectedClient = PACKAGE_ORDER_TREND_CLIENTS.find((c) => c.id === clientId);
  const clientLabel = selectedClient?.name ?? "Client";
  const trendData = clientId ? PACKAGE_ORDER_TREND_DATA[clientId] : undefined;
  const hasResults = generated && clientId && trendData && trendData.length > 0;

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
    setGenerated(true);
  }

  function handleDownloadCsv() {
    if (!trendData) return;
    const lines = ["Package Name,Order Count", ...trendData.map((r) => `"${r.packageName}",${r.orderCount}`)];
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "package-order-trend.csv";
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
          Generate Order Trend Report
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
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "20px", alignItems: "end" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", color: labelColor, marginBottom: "6px" }}>
                Client
              </label>
              <select
                value={clientId}
                onChange={(e) => {
                  setClientId(e.target.value);
                  setGenerated(false);
                }}
                style={inputStyle}
              >
                {PACKAGE_ORDER_TREND_CLIENTS.map((client) => (
                  <option key={client.id || "none"} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", color: labelColor, marginBottom: "6px" }}>
                Date From
              </label>
              <input
                type="text"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setGenerated(false);
                }}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", color: labelColor, marginBottom: "6px" }}>
                Date To
              </label>
              <input
                type="text"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setGenerated(false);
                }}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              onClick={handleGenerate}
              disabled={!clientId}
              style={{
                padding: "8px 24px",
                background: clientId ? primaryColor : "#CCCCCC",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "4px",
                fontSize: "13px",
                fontWeight: 500,
                cursor: clientId ? "pointer" : "not-allowed",
              }}
            >
              Generate Report
            </button>
          </div>

          {generated && clientId && !hasResults && (
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
              No orders found for {clientLabel} from {dateFrom} to {dateTo}
            </div>
          )}

          {hasResults && (
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
                <p style={{ margin: 0, fontSize: "14px", color: textColor }}>
                  Package Order Trend Report for:{" "}
                  <span style={{ color: primaryColor, fontWeight: 600 }}>{clientLabel}</span> from{" "}
                  <span style={{ color: primaryColor, fontWeight: 600 }}>{dateFrom}</span> →{" "}
                  <span style={{ color: primaryColor, fontWeight: 600 }}>{dateTo}</span>
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
                      <th
                        style={{
                          padding: "10px 12px",
                          textAlign: "left",
                          fontWeight: 600,
                          color: labelColor,
                          borderBottom: `1px solid ${borderColor}`,
                        }}
                      >
                        Package Name
                      </th>
                      <th
                        style={{
                          padding: "10px 12px",
                          textAlign: "right",
                          fontWeight: 600,
                          color: labelColor,
                          borderBottom: `1px solid ${borderColor}`,
                        }}
                      >
                        Order Count
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {trendData!.map((row) => (
                      <tr key={row.packageName} style={{ borderBottom: `1px solid ${borderColor}` }}>
                        <td style={{ padding: "10px 12px", color: textColor }}>{row.packageName}</td>
                        <td style={{ padding: "10px 12px", textAlign: "right", color: textColor }}>
                          {row.orderCount}
                        </td>
                      </tr>
                    ))}
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
