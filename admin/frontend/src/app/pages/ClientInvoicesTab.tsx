import { useMemo, useState } from "react";
import { ArrowLeft, ChevronDown, Download, Pencil, Trash2 } from "lucide-react";
import { Pagination } from "../components/Pagination";
import { CLIENT_INVOICES, INVOICE_PAYMENTS, ClientInvoice } from "../data/mockData";

const INVOICE_DETAIL_TABS = ["Summary", "Adjust Invoice", "Add Payment", "Credit", "Refund", "Notes"];

interface ClientInvoicesTabProps {
  isDarkMode?: boolean;
}

export function ClientInvoicesTab({ isDarkMode = false }: ClientInvoicesTabProps) {
  const [view, setView] = useState<"list" | "detail">("list");
  const [selectedInvoice, setSelectedInvoice] = useState<ClientInvoice | null>(null);
  const [detailTab, setDetailTab] = useState("Summary");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sendConfirmation, setSendConfirmation] = useState(true);

  const cardBg = isDarkMode ? "#252830" : "#FFFFFF";
  const borderColor = isDarkMode ? "#333333" : "#E5E7EB";
  const textColor = isDarkMode ? "#E5E7EB" : "#333333";
  const mutedColor = isDarkMode ? "#9CA3AF" : "#6B7280";
  const headerBg = isDarkMode ? "#2A2D34" : "#F9FAFB";
  const inputBg = isDarkMode ? "#1A1C21" : "#FFFFFF";
  const accentColor = isDarkMode ? "#DF2A57" : "#C70039";

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return CLIENT_INVOICES;
    return CLIENT_INVOICES.filter(
      (inv) =>
        inv.id.toLowerCase().includes(q) ||
        inv.invoiceDate.includes(q) ||
        inv.status.toLowerCase().includes(q)
    );
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);
  const totalAmount = filtered.reduce((sum, inv) => sum + parseFloat(inv.total.replace(/[$,]/g, "") || "0"), 0);

  function openInvoice(invoice: ClientInvoice) {
    setSelectedInvoice(invoice);
    setDetailTab("Summary");
    setView("detail");
  }

  if (view === "detail" && selectedInvoice) {
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 600, color: accentColor, margin: "0 0 10px 0" }}>
              Invoice #{selectedInvoice.id}
            </h2>
            <button
              onClick={() => setView("list")}
              style={{
                background: "none",
                border: "none",
                color: textColor,
                fontSize: "13px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: 0,
              }}
            >
              <ArrowLeft size={14} /> Go Back
            </button>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              style={{
                height: "34px",
                padding: "0 14px",
                background: cardBg,
                color: textColor,
                border: `1px solid ${borderColor}`,
                borderRadius: "4px",
                fontSize: "12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              Quick Actions <ChevronDown size={14} />
            </button>
            <button
              style={{
                height: "34px",
                padding: "0 14px",
                background: "#2563EB",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "4px",
                fontSize: "12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Download size={14} /> Download <ChevronDown size={14} />
            </button>
          </div>
        </div>

        <div style={{ display: "flex", marginBottom: "20px", borderBottom: `1px solid ${borderColor}` }}>
          {INVOICE_DETAIL_TABS.map((tab) => {
            const active = detailTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setDetailTab(tab)}
                style={{
                  padding: "10px 18px",
                  fontSize: "13px",
                  fontWeight: active ? 600 : 500,
                  background: "transparent",
                  color: active ? accentColor : textColor,
                  border: "none",
                  borderBottom: active ? `2px solid ${accentColor}` : "2px solid transparent",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <div
          style={{
            background: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: "6px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            padding: "24px 20px",
          }}
        >
          {detailTab === "Summary" && (
            <div style={{ maxWidth: "600px" }}>
              {[
                { label: "Company Name", value: selectedInvoice.companyName, color: accentColor },
                { label: "Invoice Date", value: "06/01/2026" },
                { label: "Invoice Due Date", value: "06/01/2026" },
                { label: "Balance", value: "$0.00", color: "#9ACD32" },
                { label: "Approved By", value: selectedInvoice.approvedBy },
                { label: "Approved On", value: selectedInvoice.approvedOn },
                { label: "Credit Card on File", value: "No users found with valid credit card" },
              ].map((row) => (
                <div
                  key={row.label}
                  style={{
                    display: "flex",
                    gap: "12px",
                    padding: "10px 0",
                    borderBottom: `1px solid ${borderColor}`,
                    fontSize: "13px",
                  }}
                >
                  <span style={{ fontWeight: 600, color: textColor, minWidth: "180px" }}>{row.label}:</span>
                  <span style={{ color: row.color ?? textColor }}>{row.value}</span>
                </div>
              ))}
              <div style={{ display: "flex", gap: "12px", padding: "10px 0", fontSize: "13px" }}>
                <span style={{ fontWeight: 600, color: textColor, minWidth: "180px" }}>Invoice Status:</span>
                <span>
                  <span style={{ color: "#4CAF50", fontWeight: 600 }}>PAID</span>
                  <span style={{ color: textColor }}> on {selectedInvoice.paidOn} via...</span>
                </span>
              </div>
            </div>
          )}

          {detailTab === "Adjust Invoice" && (
            <>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "flex-end", marginBottom: "16px" }}>
                <div>
                  <label style={{ fontSize: "11px", color: mutedColor, display: "block", marginBottom: "4px" }}>Filter by reference</label>
                  <select
                    style={{
                      height: "34px",
                      padding: "0 10px",
                      fontSize: "12px",
                      border: `1px solid ${borderColor}`,
                      borderRadius: "4px",
                      background: inputBg,
                      color: textColor,
                      minWidth: "140px",
                    }}
                  >
                    <option>No filter</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "11px", color: mutedColor, display: "block", marginBottom: "4px" }}>Filter by Applicant</label>
                  <input style={{ height: "34px", padding: "0 10px", fontSize: "12px", border: `1px solid ${borderColor}`, borderRadius: "4px", background: inputBg, color: textColor, width: "160px" }} />
                </div>
                <div>
                  <label style={{ fontSize: "11px", color: mutedColor, display: "block", marginBottom: "4px" }}>Filter by Search ID</label>
                  <input style={{ height: "34px", padding: "0 10px", fontSize: "12px", border: `1px solid ${borderColor}`, borderRadius: "4px", background: inputBg, color: textColor, width: "140px" }} />
                </div>
                <button
                  style={{
                    height: "34px",
                    padding: "0 20px",
                    background: accentColor,
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Filter
                </button>
              </div>

              <p style={{ fontSize: "12px", color: mutedColor, margin: "0 0 12px 0" }}>Showing 0</p>

              <div style={{ overflowX: "auto", marginBottom: "20px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                  <thead>
                    <tr style={{ background: headerBg, borderBottom: `1px solid ${borderColor}` }}>
                      {["Description", "Applicant", "User", "Search ID", "Amount", "Taxed", "Delete"].map((col) => (
                        <th key={col} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: mutedColor }}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: "8px 12px" }}>
                        <textarea
                          rows={3}
                          style={{ width: "100%", minWidth: "200px", padding: "8px", fontSize: "12px", border: `1px solid ${borderColor}`, borderRadius: "4px", background: inputBg, color: textColor, resize: "vertical" }}
                        />
                      </td>
                      <td style={{ padding: "8px 12px" }} />
                      <td style={{ padding: "8px 12px" }}>
                        <select style={{ height: "32px", padding: "0 8px", fontSize: "12px", border: `1px solid ${borderColor}`, borderRadius: "4px", background: inputBg, color: textColor, minWidth: "100px" }}>
                          <option />
                        </select>
                      </td>
                      <td style={{ padding: "8px 12px" }}>
                        <input style={{ width: "80px", height: "32px", padding: "0 8px", fontSize: "12px", border: `1px solid ${borderColor}`, borderRadius: "4px", background: inputBg, color: textColor }} />
                      </td>
                      <td style={{ padding: "8px 12px" }}>
                        <input style={{ width: "80px", height: "32px", padding: "0 8px", fontSize: "12px", border: `1px solid ${borderColor}`, borderRadius: "4px", background: inputBg, color: textColor }} />
                      </td>
                      <td style={{ padding: "8px 12px" }}>
                        <input type="checkbox" style={{ accentColor: accentColor }} />
                      </td>
                      <td style={{ padding: "8px 12px" }} />
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "24px" }}>
                <div style={{ fontSize: "13px", color: textColor, textAlign: "right" }}>
                  <div style={{ marginBottom: "4px" }}>Sub Total: $0.00</div>
                  <div style={{ marginBottom: "4px" }}>Credit: $0.00</div>
                  <div style={{ fontWeight: 600 }}>Total: $0.00</div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
                <button style={{ height: "36px", padding: "0 24px", background: accentColor, color: "#FFF", border: "none", borderRadius: "4px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                  Save Changes
                </button>
                <button style={{ height: "36px", padding: "0 24px", background: "#2E1B85", color: "#FFF", border: "none", borderRadius: "4px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                  Cancel Changes
                </button>
              </div>
            </>
          )}

          {detailTab === "Add Payment" && (
            <>
              <div
                style={{
                  background: isDarkMode ? "rgba(199,0,57,0.15)" : "#FDE8EC",
                  border: `1px solid ${isDarkMode ? "#5C2030" : "#F5C6CB"}`,
                  borderRadius: "4px",
                  padding: "12px 16px",
                  marginBottom: "20px",
                  fontSize: "13px",
                  color: textColor,
                }}
              >
                Warning: Use this method only to record payments already made! It will not attempt payment.
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px", marginBottom: "16px" }}>
                <Field label="Date" mutedColor={mutedColor}>
                  <input defaultValue="06/17/2026" style={{ width: "100%", height: "36px", padding: "0 10px", fontSize: "13px", border: `1px solid ${borderColor}`, borderRadius: "4px", background: inputBg, color: textColor, boxSizing: "border-box" }} />
                </Field>
                <Field label="Amount" mutedColor={mutedColor}>
                  <input defaultValue="0.00" style={{ width: "100%", height: "36px", padding: "0 10px", fontSize: "13px", border: `1px solid ${borderColor}`, borderRadius: "4px", background: inputBg, color: textColor, boxSizing: "border-box" }} />
                </Field>
                <Field label="Payment method" mutedColor={mutedColor}>
                  <select defaultValue="Credit Card" style={{ width: "100%", height: "36px", padding: "0 10px", fontSize: "13px", border: `1px solid ${borderColor}`, borderRadius: "4px", background: inputBg, color: textColor, boxSizing: "border-box" }}>
                    <option>Credit Card</option>
                    <option>Check</option>
                    <option>ACH</option>
                  </select>
                </Field>
                <Field label="Transaction Fees" mutedColor={mutedColor}>
                  <input defaultValue="0.00" style={{ width: "100%", height: "36px", padding: "0 10px", fontSize: "13px", border: `1px solid ${borderColor}`, borderRadius: "4px", background: inputBg, color: textColor, boxSizing: "border-box" }} />
                </Field>
                <Field label="Transaction ID" mutedColor={mutedColor}>
                  <input style={{ width: "100%", height: "36px", padding: "0 10px", fontSize: "13px", border: `1px solid ${borderColor}`, borderRadius: "4px", background: inputBg, color: textColor, boxSizing: "border-box" }} />
                </Field>
              </div>

              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: textColor, marginBottom: "20px", cursor: "pointer" }}>
                <input type="checkbox" checked={sendConfirmation} onChange={(e) => setSendConfirmation(e.target.checked)} style={{ accentColor: accentColor }} />
                Tick to Send Confirmation Email
              </label>

              <div style={{ display: "flex", justifyContent: "center", marginBottom: "28px" }}>
                <button style={{ height: "36px", padding: "0 28px", background: accentColor, color: "#FFF", border: "none", borderRadius: "4px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                  Add Payment
                </button>
              </div>

              <h4 style={{ fontSize: "14px", fontWeight: 600, color: accentColor, margin: "0 0 12px 0" }}>Previous Payments/Transactions</h4>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                  <thead>
                    <tr style={{ background: headerBg, borderBottom: `1px solid ${borderColor}` }}>
                      {["Payment Date", "Description", "Payment", "Entered by", "Delete"].map((col) => (
                        <th key={col} style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: mutedColor }}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {INVOICE_PAYMENTS.map((p, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${borderColor}` }}>
                        <td style={{ padding: "12px 16px", color: textColor }}>{p.paymentDate}</td>
                        <td style={{ padding: "12px 16px", color: textColor }}>{p.description}</td>
                        <td style={{ padding: "12px 16px", color: textColor }}>{p.payment}</td>
                        <td style={{ padding: "12px 16px", color: textColor }}>{p.enteredBy}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <button style={{ background: "none", border: "none", cursor: "pointer", color: accentColor, padding: "2px", display: "flex" }}>
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {detailTab === "Credit" && (
            <>
              <CreditSection
                title="Add Credit to Invoice"
                available="$0.00 Available"
                buttonLabel="Add"
                accentColor={accentColor}
                borderColor={borderColor}
                inputBg={inputBg}
                textColor={textColor}
              />
              <div style={{ borderTop: `1px solid ${borderColor}`, margin: "24px 0" }} />
              <CreditSection
                title="Remove Credit from Invoice"
                available="$0.00 Available"
                buttonLabel="Remove"
                accentColor={accentColor}
                borderColor={borderColor}
                inputBg={inputBg}
                textColor={textColor}
              />
            </>
          )}

          {detailTab === "Refund" && (
            <div style={{ maxWidth: "700px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "16px" }}>
                <div>
                  <label style={{ fontSize: "11px", color: mutedColor, display: "block", marginBottom: "4px" }}>Transaction</label>
                  <select
                    style={{
                      width: "100%",
                      height: "40px",
                      padding: "0 12px",
                      fontSize: "13px",
                      border: `1px solid ${borderColor}`,
                      borderRadius: "4px",
                      background: inputBg,
                      color: textColor,
                      boxSizing: "border-box",
                    }}
                  >
                    <option value="" />
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "11px", color: mutedColor, display: "block", marginBottom: "4px" }}>Amount</label>
                  <input
                    style={{
                      width: "100%",
                      height: "40px",
                      padding: "0 12px",
                      fontSize: "13px",
                      border: `1px solid ${borderColor}`,
                      borderRadius: "4px",
                      background: inputBg,
                      color: textColor,
                      boxSizing: "border-box",
                    }}
                  />
                  <span style={{ fontSize: "11px", color: accentColor, display: "block", marginTop: "4px" }}>
                    *Leave blank for full refund
                  </span>
                </div>
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: textColor, marginBottom: "24px", cursor: "pointer" }}>
                <input type="checkbox" defaultChecked style={{ accentColor: accentColor, width: "14px", height: "14px" }} />
                Automatically refund via payment gateway (if supported)
              </label>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  style={{
                    height: "36px",
                    padding: "0 28px",
                    background: accentColor,
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Refund
                </button>
              </div>
            </div>
          )}

          {detailTab === "Notes" && (
            <div style={{ maxWidth: "600px" }}>
              <p style={{ fontSize: "13px", color: accentColor, margin: "0 0 12px 0" }}>
                Leave any invoice related comments here
              </p>
              <textarea
                placeholder="Note"
                rows={5}
                style={{
                  width: "100%",
                  padding: "12px",
                  fontSize: "13px",
                  border: `1px solid ${borderColor}`,
                  borderRadius: "4px",
                  background: inputBg,
                  color: textColor,
                  boxSizing: "border-box",
                  resize: "vertical",
                  fontFamily: "inherit",
                  marginBottom: "20px",
                }}
              />
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                  style={{
                    height: "36px",
                    padding: "0 28px",
                    background: accentColor,
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Save Note
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: cardBg,
        border: `1px solid ${borderColor}`,
        borderRadius: "6px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "12px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: mutedColor }}>
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
            style={{
              height: "30px",
              padding: "0 8px",
              fontSize: "12px",
              border: `1px solid ${borderColor}`,
              borderRadius: "4px",
              background: cardBg,
              color: textColor,
            }}
          >
            {[10, 25, 50].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <span>entries per page</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "12px", color: mutedColor }}>Search:</span>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search..."
            style={{
              height: "30px",
              width: "180px",
              padding: "0 10px",
              fontSize: "12px",
              border: `1px solid ${borderColor}`,
              borderRadius: "4px",
              background: cardBg,
              color: textColor,
            }}
          />
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
          <thead>
            <tr style={{ background: headerBg, borderBottom: `1px solid ${borderColor}` }}>
              {["Invoice #", "Branch", "Invoice Date", "Due Date", "Total", "Status", "Actions"].map((col) => (
                <th key={col} style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: mutedColor, whiteSpace: "nowrap" }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((inv, i) => (
              <tr
                key={inv.id}
                style={{
                  borderBottom: i < paged.length - 1 ? `1px solid ${borderColor}` : "none",
                  background: i % 2 === 0 ? "transparent" : isDarkMode ? "rgba(255,255,255,0.02)" : "#FAFAFA",
                }}
              >
                <td style={{ padding: "12px 16px" }}>
                  <button
                    onClick={() => openInvoice(inv)}
                    style={{
                      background: "none",
                      border: "none",
                      color: accentColor,
                      fontSize: "12px",
                      fontWeight: 500,
                      cursor: "pointer",
                      padding: 0,
                      textDecoration: "underline",
                    }}
                  >
                    {inv.id}
                  </button>
                </td>
                <td style={{ padding: "12px 16px", color: textColor }}>{inv.branch}</td>
                <td style={{ padding: "12px 16px", color: textColor }}>{inv.invoiceDate}</td>
                <td style={{ padding: "12px 16px", color: textColor }}>{inv.dueDate}</td>
                <td style={{ padding: "12px 16px", color: textColor }}>{inv.total}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "3px 10px",
                      borderRadius: "12px",
                      fontSize: "11px",
                      fontWeight: 600,
                      background: "#D1FAE5",
                      color: "#065F46",
                    }}
                  >
                    {inv.status}
                  </span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <button
                    onClick={() => openInvoice(inv)}
                    title="Edit Invoice"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: accentColor,
                      padding: "2px",
                      display: "inline-flex",
                    }}
                  >
                    <Pencil size={14} />
                  </button>
                </td>
              </tr>
            ))}
            <tr style={{ background: headerBg, fontWeight: 600 }}>
              <td colSpan={4} style={{ padding: "12px 16px" }} />
              <td style={{ padding: "12px 16px", color: textColor }}>Total: ${totalAmount.toFixed(2)}</td>
              <td colSpan={2} />
            </tr>
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        totalEntries={filtered.length}
        perPage={perPage}
        onPageChange={setPage}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}

function Field({ label, children, mutedColor }: { label: string; children: React.ReactNode; mutedColor: string }) {
  return (
    <div>
      <label style={{ fontSize: "11px", color: mutedColor, display: "block", marginBottom: "4px" }}>{label}</label>
      {children}
    </div>
  );
}

function CreditSection({
  title,
  available,
  buttonLabel,
  accentColor,
  borderColor,
  inputBg,
  textColor,
}: {
  title: string;
  available: string;
  buttonLabel: string;
  accentColor: string;
  borderColor: string;
  inputBg: string;
  textColor: string;
}) {
  return (
    <div>
      <h4 style={{ fontSize: "14px", fontWeight: 600, color: accentColor, margin: "0 0 6px 0" }}>{title}</h4>
      <p style={{ fontSize: "13px", color: accentColor, margin: "0 0 12px 0", opacity: 0.85 }}>{available}</p>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <input
          defaultValue="0.00"
          style={{
            width: "100px",
            height: "36px",
            padding: "0 10px",
            fontSize: "13px",
            border: `1px solid ${borderColor}`,
            borderRadius: "4px",
            background: inputBg,
            color: textColor,
          }}
        />
        <button
          style={{
            height: "36px",
            padding: "0 24px",
            background: accentColor,
            color: "#FFFFFF",
            border: "none",
            borderRadius: "4px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
