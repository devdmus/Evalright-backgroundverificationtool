import { useState, useMemo } from "react";
import { Search, Eye, ArrowLeft, Download } from "lucide-react";
import { Footer } from "../components/Footer";
import { MY_INVOICES_LIST, INVOICE_DETAILS } from "../data/mockData";

interface MyInvoicesPageProps {
  isDarkMode?: boolean;
}

function SortIcon() {
  return (
    <span
      style={{
        marginLeft: "6px",
        display: "inline-flex",
        flexDirection: "column",
        verticalAlign: "middle",
        opacity: 0.35,
      }}
    >
      <span style={{ fontSize: "8px", height: "5px", lineHeight: "1" }}>▲</span>
      <span style={{ fontSize: "8px", height: "5px", lineHeight: "1", marginTop: "2px" }}>▼</span>
    </span>
  );
}

function PaidBadge() {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 12px",
        borderRadius: "4px",
        fontSize: "11px",
        fontWeight: 700,
        background: "#28A745",
        color: "#FFFFFF",
        letterSpacing: "0.04em",
      }}
    >
      PAID
    </span>
  );
}

export function MyInvoicesPage({ isDarkMode = false }: MyInvoicesPageProps) {
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [viewingInvoiceId, setViewingInvoiceId] = useState<string | null>(null);

  const primaryColor = isDarkMode ? "#DF2A57" : "#C70039";
  const purpleColor = "#2E1B85";
  const cardBg = isDarkMode ? "#252830" : "#FFFFFF";
  const borderColor = isDarkMode ? "#333333" : "#E5E7EB";
  const textColor = isDarkMode ? "#E5E7EB" : "#555555";
  const mutedColor = isDarkMode ? "#9CA3AF" : "#666666";
  const tableHeaderBg = isDarkMode ? "#2A2D34" : "#F9FAFB";
  const inputBg = isDarkMode ? "#1A1C21" : "#FFFFFF";

  const filtered = useMemo(() => {
    if (!searchText.trim()) return MY_INVOICES_LIST;
    const q = searchText.toLowerCase();
    return MY_INVOICES_LIST.filter((inv) => inv.id.includes(q) || inv.status.toLowerCase().includes(q));
  }, [searchText]);

  const displayed = filtered.slice(0, entriesPerPage);
  const detail = viewingInvoiceId ? INVOICE_DETAILS[viewingInvoiceId] : null;

  if (viewingInvoiceId && detail) {
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
          <h1 style={{ fontSize: "20px", fontWeight: 600, color: primaryColor, margin: 0 }}>Invoice Details</h1>

          <div
            style={{
              background: cardBg,
              border: `1px solid ${borderColor}`,
              borderRadius: "6px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
              <button
                onClick={() => setViewingInvoiceId(null)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 14px",
                  background: cardBg,
                  color: textColor,
                  border: `1px solid ${borderColor}`,
                  borderRadius: "4px",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                <ArrowLeft size={14} />
                Go Back
              </button>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {["Download PDF", "Download CSV", "Download Detail"].map((label) => (
                  <button
                    key={label}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 16px",
                      background: purpleColor,
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "13px",
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    <Download size={14} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
              <div>
                <div style={{ fontSize: "28px", fontWeight: 700, color: primaryColor, marginBottom: "8px" }}>
                  ER EvalRight
                </div>
                <div style={{ fontSize: "16px", fontWeight: 600, color: textColor, marginBottom: "12px" }}>
                  Invoice #{detail.id}
                </div>
                <PaidBadge />
                <div style={{ marginTop: "20px", fontSize: "13px", color: textColor, display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div>Invoice Date: {detail.invoiceDate}</div>
                  <div>Due Date: {detail.dueDate}</div>
                  <div>Date Paid: {detail.datePaid}</div>
                </div>
              </div>

              <div style={{ fontSize: "13px", color: textColor, lineHeight: 1.6 }}>
                <div style={{ fontWeight: 600, marginBottom: "8px" }}>Brango LLC</div>
                <div>4261 E. University Dr. Suite 30-352</div>
                <div>Prosper, TX 75078</div>
                <div style={{ marginTop: "8px" }}>Toll Free: 800-935-9218</div>
                <div>Website: www.backgroundchecksinabox.com</div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", borderTop: `1px solid ${borderColor}`, paddingTop: "20px" }}>
              <div style={{ fontSize: "13px", color: textColor }}>
                <div>Date Paid: {detail.datePaid}</div>
              </div>
              <div style={{ fontSize: "13px", color: textColor, textAlign: "right" }}>
                <div>Phone: 1-800-935-9025</div>
                <div>Email: support@evalright.com</div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "32px",
                borderTop: `1px solid ${borderColor}`,
                paddingTop: "20px",
              }}
            >
              <div style={{ fontSize: "13px", color: textColor, lineHeight: 1.7 }}>
                <div style={{ fontWeight: 600, marginBottom: "8px" }}>Notes:</div>
                <p style={{ margin: "0 0 8px 0" }}>
                  All accounts are to be paid within 15 days from receipt of invoice. A 10% late fee will be charged to
                  all invoices where a payment is not received within 30 days.
                </p>
                <p style={{ margin: 0, color: primaryColor }}>
                  If payment is made by credit card, an additional 3% will be added to the total amount.
                </p>
              </div>
              <div style={{ fontSize: "13px", color: textColor, textAlign: "right" }}>
                <div>Sub Total: ${detail.subTotal.toFixed(2)}</div>
                <div>Credit: ${detail.credit.toFixed(2)}</div>
                <div style={{ fontSize: "16px", fontWeight: 700, color: primaryColor, marginTop: "8px" }}>
                  Total: ${detail.total.toFixed(2)}
                </div>
              </div>
            </div>

            <div style={{ overflowX: "auto", borderTop: `1px solid ${borderColor}`, paddingTop: "16px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: tableHeaderBg }}>
                    {["Transaction Date", "Gateway", "Transaction ID", "Amount"].map((col) => (
                      <th
                        key={col}
                        style={{
                          padding: "10px 12px",
                          textAlign: col === "Amount" ? "right" : "left",
                          fontWeight: 600,
                          color: mutedColor,
                          borderBottom: `1px solid ${borderColor}`,
                        }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {detail.transactions.map((txn, idx) => (
                    <tr key={txn.transactionId || `txn-${idx}`} style={{ borderBottom: `1px solid ${borderColor}` }}>
                      <td style={{ padding: "10px 12px", color: textColor }}>{txn.transactionDate}</td>
                      <td style={{ padding: "10px 12px", color: textColor }}>{txn.gateway || "-"}</td>
                      <td style={{ padding: "10px 12px", color: textColor }}>{txn.transactionId}</td>
                      <td style={{ padding: "10px 12px", textAlign: "right", color: textColor }}>
                        ${txn.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ textAlign: "right", padding: "12px 12px 0", fontSize: "13px", fontWeight: 600, color: textColor }}>
                Balance: ${(detail.balance ?? 0).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
        <Footer isDarkMode={isDarkMode} />
      </div>
    );
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
      <div style={{ flex: 1, padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: 600, color: primaryColor, margin: "0 0 4px 0" }}>My Invoices</h1>
          <p style={{ margin: 0, fontSize: "14px", color: mutedColor }}>Invoice List</p>
        </div>

        <div
          style={{
            background: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: "6px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: textColor }}>
              <select
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                style={{
                  height: "32px",
                  padding: "0 8px",
                  border: `1px solid ${borderColor}`,
                  borderRadius: "4px",
                  background: inputBg,
                  color: textColor,
                  fontSize: "13px",
                }}
              >
                {[10, 25, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span>entries per page</span>
            </div>
            <div style={{ position: "relative" }}>
              <Search
                size={14}
                style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: mutedColor }}
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{
                  height: "32px",
                  paddingLeft: "32px",
                  paddingRight: "12px",
                  border: `1px solid ${borderColor}`,
                  borderRadius: "4px",
                  background: inputBg,
                  color: textColor,
                  fontSize: "13px",
                  width: "200px",
                }}
              />
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: tableHeaderBg, borderBottom: `1px solid ${borderColor}` }}>
                  {["#", "Branch", "Invoice Date", "Due Date", "Total", "Status", "Actions"].map((col) => (
                    <th
                      key={col}
                      style={{
                        padding: "12px 16px",
                        textAlign: col === "Total" ? "right" : "left",
                        fontWeight: 600,
                        color: mutedColor,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {col}
                      {col !== "Actions" && <SortIcon />}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayed.map((invoice) => (
                  <tr key={invoice.id} style={{ borderBottom: `1px solid ${borderColor}` }}>
                    <td style={{ padding: "12px 16px" }}>
                      <button
                        type="button"
                        onClick={() => INVOICE_DETAILS[invoice.id] && setViewingInvoiceId(invoice.id)}
                        style={{
                          background: "none",
                          border: "none",
                          padding: 0,
                          color: primaryColor,
                          fontWeight: 600,
                          cursor: INVOICE_DETAILS[invoice.id] ? "pointer" : "default",
                          fontSize: "13px",
                          textDecoration: INVOICE_DETAILS[invoice.id] ? "underline" : "none",
                        }}
                      >
                        {invoice.id}
                      </button>
                    </td>
                    <td style={{ padding: "12px 16px", color: textColor }}>{invoice.branch || ""}</td>
                    <td style={{ padding: "12px 16px", color: textColor }}>{invoice.invoiceDate}</td>
                    <td style={{ padding: "12px 16px", color: textColor }}>{invoice.dueDate}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right", color: textColor }}>
                      ${invoice.total.toFixed(2)}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <PaidBadge />
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <button
                        type="button"
                        title="View Invoice"
                        onClick={() => INVOICE_DETAILS[invoice.id] && setViewingInvoiceId(invoice.id)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          border: `1px solid ${primaryColor}`,
                          background: "transparent",
                          color: primaryColor,
                          cursor: INVOICE_DETAILS[invoice.id] ? "pointer" : "default",
                        }}
                      >
                        <Eye size={14} />
                      </button>
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
