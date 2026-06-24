import { Download } from "lucide-react";
import { Footer } from "../components/Footer";
import { A_LA_CARTE_FREQUENCY_DATA } from "../data/mockData";

interface ALaCarteOrderFrequencyPageProps {
  isDarkMode?: boolean;
}

export function ALaCarteOrderFrequencyPage({ isDarkMode = false }: ALaCarteOrderFrequencyPageProps) {
  const primaryColor = isDarkMode ? "#DF2A57" : "#C70039";
  const cardBg = isDarkMode ? "#252830" : "#FFFFFF";
  const borderColor = isDarkMode ? "#333333" : "#E5E7EB";
  const textColor = isDarkMode ? "#E5E7EB" : "#555555";
  const labelColor = isDarkMode ? "#9CA3AF" : "#666666";
  const tableHeaderBg = isDarkMode ? "#2A2D34" : "#F0F0F0";

  function handleDownloadCsv() {
    const headers = ["Client Name", "Total Orders", "Package Orders", "Percentage of A La Carte Orders"];
    const lines = [
      headers.join(","),
      ...A_LA_CARTE_FREQUENCY_DATA.map((row) =>
        [`"${row.clientName}"`, row.totalOrders, row.packageOrders, `"${row.percentage}"`].join(",")
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "a-la-carte-order-frequency.csv";
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <h1 style={{ fontSize: "20px", fontWeight: 600, color: primaryColor, margin: 0 }}>
            A La Carte Order Frequency Report
          </h1>
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

        <div
          style={{
            background: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: "6px",
            padding: "0",
            overflow: "hidden",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: tableHeaderBg }}>
                  {["Client Name", "Total Orders", "Package Orders", "Percentage of A La Carte Orders"].map((col) => (
                    <th
                      key={col}
                      style={{
                        padding: "12px 16px",
                        textAlign: col === "Client Name" ? "left" : "right",
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
                {A_LA_CARTE_FREQUENCY_DATA.map((row) => (
                  <tr key={row.clientName} style={{ borderBottom: `1px solid ${borderColor}` }}>
                    <td style={{ padding: "10px 16px", color: textColor }}>{row.clientName}</td>
                    <td style={{ padding: "10px 16px", textAlign: "right", color: textColor }}>{row.totalOrders}</td>
                    <td style={{ padding: "10px 16px", textAlign: "right", color: textColor }}>{row.packageOrders}</td>
                    <td style={{ padding: "10px 16px", textAlign: "right", color: primaryColor, fontWeight: 500 }}>
                      {row.percentage}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
