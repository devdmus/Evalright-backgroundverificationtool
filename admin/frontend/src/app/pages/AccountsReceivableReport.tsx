import { useState } from "react";
import { Download, FileText } from "lucide-react";
import { Footer } from "../components/Footer";
import { CLIENT_LIST, DEMO_CLIENT } from "../data/mockData";

interface ReportRow {
  account: string;
  customer: string;
  lastPayment: string;
  amount: number;
  aging0_30: number;
  aging31_60: number;
  aging61_90: number;
  agingOver90: number;
  totalDue: number;
}

const REPORT_DATA: ReportRow[] = [
  {
    account: "14843",
    customer: "ACS Consultancy Services, Inc",
    lastPayment: "2026-06-18",
    amount: 0.00,
    aging0_30: 0,
    aging31_60: 0,
    aging61_90: 0,
    agingOver90: 41.97,
    totalDue: 41.97,
  },
  {
    account: "9464",
    customer: "Amity Tech Corporation",
    lastPayment: "2026-03-02",
    amount: 0.00,
    aging0_30: 0,
    aging31_60: 0,
    aging61_90: 0,
    agingOver90: 30,
    totalDue: 30,
  },
  {
    account: "12743",
    customer: "Arveta, Inc",
    lastPayment: "-",
    amount: 0.00,
    aging0_30: 0,
    aging31_60: 0,
    aging61_90: 0,
    agingOver90: 118.47,
    totalDue: 118.47,
  },
  {
    account: "10676",
    customer: "BALDOR TECHNOLOGIES PRIVATE LIMITED",
    lastPayment: "2025-10-13",
    amount: 0.00,
    aging0_30: 0,
    aging31_60: 0,
    aging61_90: 0,
    agingOver90: 8,
    totalDue: 8,
  },
  {
    account: "8418",
    customer: "BSoft1",
    lastPayment: "-",
    amount: 0.00,
    aging0_30: 0,
    aging31_60: 0,
    aging61_90: 0,
    agingOver90: 0,
    totalDue: 0,
  },
  {
    account: "11369",
    customer: "Crystal Data LLC",
    lastPayment: "2026-03-11",
    amount: 0.00,
    aging0_30: 0,
    aging31_60: 0,
    aging61_90: 0,
    agingOver90: 36,
    totalDue: 36,
  },
  {
    account: "14565",
    customer: "Dataflow Group",
    lastPayment: "-",
    amount: 0.00,
    aging0_30: 0,
    aging31_60: 0,
    aging61_90: 0,
    agingOver90: 1176.4,
    totalDue: 1176.4,
  },
  {
    account: "13444",
    customer: "Destin IT Solutions INC",
    lastPayment: "2025-06-18",
    amount: 0.00,
    aging0_30: 0,
    aging31_60: 99.5,
    aging61_90: 0,
    agingOver90: 0,
    totalDue: 99.5,
  },
  {
    account: "8406",
    customer: "Evalright Demo Account",
    lastPayment: "2026-06-03",
    amount: 0.00,
    aging0_30: 0,
    aging31_60: 0,
    aging61_90: 0,
    agingOver90: 0,
    totalDue: 0,
  },
  {
    account: "13151",
    customer: "Global Business Consulting Services, Inc.",
    lastPayment: "2025-10-10",
    amount: 0.00,
    aging0_30: 0,
    aging31_60: 0,
    aging61_90: 0,
    agingOver90: 143.21,
    totalDue: 143.21,
  },
  {
    account: "12034",
    customer: "Greycell Labs Inc",
    lastPayment: "2026-06-10",
    amount: 0.00,
    aging0_30: 0,
    aging31_60: 0,
    aging61_90: 0,
    agingOver90: 15,
    totalDue: 15,
  },
  {
    account: "11096",
    customer: "IDA Automation Inc",
    lastPayment: "2026-06-19",
    amount: 0.00,
    aging0_30: 0,
    aging31_60: 169.89,
    aging61_90: 15,
    agingOver90: 134.9,
    totalDue: 319.79,
  },
];

interface AccountsReceivableReportProps {
  isDarkMode?: boolean;
  onViewClient?: (clientId: string) => void;
}

function getClientIdByName(name: string): string {
  const match = CLIENT_LIST.find((c) => c.companyName.toLowerCase() === name.toLowerCase());
  return match?.id ?? DEMO_CLIENT.id;
}

export function AccountsReceivableReport({ isDarkMode = false, onViewClient }: AccountsReceivableReportProps) {
  const [data] = useState<ReportRow[]>(REPORT_DATA);
  const [downloadHover, setDownloadHover] = useState(false);

  // Helper to format currency values exactly as they are represented in the screenshot
  const formatCurrency = (val: number) => {
    if (val === 0) return "₹0";
    if (val % 1 === 0) return `₹${val}`;
    
    // Check if it has one decimal place (like 99.5 or 1176.4) or two
    const str = val.toString();
    const parts = str.split(".");
    if (parts.length === 2 && parts[1].length === 1) {
      return `₹${val}`;
    }
    return `₹${val.toFixed(2)}`;
  };

  const handleDownload = () => {
    // Generate CSV Content
    const headers = ["Account", "Customer", "Last Payment", "Amount", "0-30", "31-60", "61-90", "Over 90", "Total Due"];
    const rows = data.map(row => [
      row.account,
      `"${row.customer.replace(/"/g, '""')}"`,
      row.lastPayment,
      row.amount.toFixed(2),
      row.aging0_30,
      row.aging31_60,
      row.aging61_90,
      row.agingOver90,
      row.totalDue
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "accounts_receivable_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Color variables matching the design system
  const primaryBrandColor = isDarkMode ? "#DF2A57" : "#C70039";
  const primaryBrandHover = isDarkMode ? "#F23F6C" : "#A60030";
  const bodyBg = isDarkMode ? "#1A1C21" : "#F4F5F7";
  const cardBg = isDarkMode ? "#252830" : "#FFFFFF";
  const cardBorder = isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB";
  const textPrimary = isDarkMode ? "#E5E7EB" : "#374151";
  const textMuted = isDarkMode ? "#8391a2" : "#777777";
  const textTitle = isDarkMode ? "#FFFFFF" : "#1F2937";
  const tableHeaderBg = isDarkMode ? "#2D3039" : "#F3F4F6";
  const tableHeaderBorder = isDarkMode ? "1px solid #3A3E4A" : "1px solid #E5E7EB";
  const tableRowBorder = isDarkMode ? "1px solid #333333" : "1px solid #F3F4F6";
  const tableRowHoverBg = isDarkMode ? "rgba(255, 255, 255, 0.02)" : "#FBFBFB";

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        background: bodyBg,
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <div style={{ flex: "20 1 0%", padding: "10px", display: "flex", flexDirection: "column", gap: "5px" }}>
        
        {/* Breadcrumb / Top Page Title */}
        <h1 style={{ fontSize: "20px", fontWeight: 600, color: primaryBrandColor, margin: 0, fontFamily: "'Wix Madefor Display', sans-serif" }}>
          Accounts Receivable Report
        </h1>

        {/* Main Card */}
        <div
          style={{
            background: cardBg,
            border: cardBorder,
            borderRadius: "6px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Card Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px 24px",
              borderBottom: cardBorder,
            }}
          >
            <h2 style={{ fontSize: "16px", fontWeight: 500, color: textTitle, margin: 0, fontFamily: "'Wix Madefor Display', sans-serif" }}>
              Accounts Receivable Report
            </h2>
            <button
              type="button"
              onClick={handleDownload}
              onMouseEnter={() => setDownloadHover(true)}
              onMouseLeave={() => setDownloadHover(false)}
              style={{
                background: downloadHover ? primaryBrandHover : primaryBrandColor,
                color: "#FFFFFF",
                border: "none",
                borderRadius: "4px",
                padding: "8px 16px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "background 0.15s ease",
                fontFamily: "'Wix Madefor Display', sans-serif",
              }}
            >
              <Download size={15} />
              Download This Report
            </button>
          </div>

          {/* Table Container */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13.5px" }}>
              <thead>
                <tr style={{ background: tableHeaderBg, borderBottom: tableHeaderBorder }}>
                  <th style={{ padding: "14px 20px", fontWeight: 600, color: textMuted, width: "100px" }}>Account</th>
                  <th style={{ padding: "14px 20px", fontWeight: 600, color: textMuted }}>Customer</th>
                  <th style={{ padding: "14px 20px", fontWeight: 600, color: textMuted, width: "150px" }}>Last Payment</th>
                  <th style={{ padding: "14px 20px", fontWeight: 600, color: textMuted, textAlign: "right", width: "110px" }}>Amount</th>
                  <th style={{ padding: "14px 20px", fontWeight: 600, color: textMuted, textAlign: "right", width: "90px" }}>0-30</th>
                  <th style={{ padding: "14px 20px", fontWeight: 600, color: textMuted, textAlign: "right", width: "90px" }}>31-60</th>
                  <th style={{ padding: "14px 20px", fontWeight: 600, color: textMuted, textAlign: "right", width: "90px" }}>61-90</th>
                  <th style={{ padding: "14px 20px", fontWeight: 600, color: textMuted, textAlign: "right", width: "110px" }}>Over 90</th>
                  <th style={{ padding: "14px 20px", fontWeight: 600, color: textMuted, textAlign: "right", width: "120px" }}>Total Due</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr
                    key={row.account}
                    style={{
                      borderBottom: tableRowBorder,
                      transition: "background 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = tableRowHoverBg;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <td style={{ padding: "14px 20px", color: textPrimary }}>{row.account}</td>
                    <td style={{ padding: "14px 20px" }}>
                      <button
                        type="button"
                        style={{
                          background: "transparent",
                          border: "none",
                          padding: 0,
                          color: primaryBrandColor,
                          fontWeight: 500,
                          cursor: "pointer",
                          textAlign: "left",
                          textDecoration: "none",
                          fontFamily: "inherit",
                          fontSize: "inherit",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.textDecoration = "underline";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.textDecoration = "none";
                        }}
                        onClick={() => onViewClient?.(getClientIdByName(row.customer))}
                      >
                        {row.customer}
                      </button>
                    </td>
                    <td style={{ padding: "14px 20px", color: textPrimary }}>{row.lastPayment}</td>
                    <td style={{ padding: "14px 20px", color: textPrimary, textAlign: "right" }}>
                      ₹{row.amount.toFixed(2)}
                    </td>
                    <td style={{ padding: "14px 20px", color: textPrimary, textAlign: "right" }}>
                      {formatCurrency(row.aging0_30)}
                    </td>
                    <td style={{ padding: "14px 20px", color: textPrimary, textAlign: "right" }}>
                      {formatCurrency(row.aging31_60)}
                    </td>
                    <td style={{ padding: "14px 20px", color: textPrimary, textAlign: "right" }}>
                      {formatCurrency(row.aging61_90)}
                    </td>
                    <td style={{ padding: "14px 20px", color: textPrimary, textAlign: "right" }}>
                      {formatCurrency(row.agingOver90)}
                    </td>
                    <td style={{ padding: "14px 20px", color: textPrimary, textAlign: "right", fontWeight: 600 }}>
                      {formatCurrency(row.totalDue)}
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
