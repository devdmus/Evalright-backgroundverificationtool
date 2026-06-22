import { useMemo, useState } from "react";
import { Pencil, Trash2, ChevronUp, ChevronDown, X } from "lucide-react";
import { Pagination } from "../components/Pagination";
import { CLIENT_TRANSACTIONS, ClientTransaction } from "../data/mockData";

interface ClientTransactionsTabProps {
  isDarkMode?: boolean;
}

export function ClientTransactionsTab({ isDarkMode = false }: ClientTransactionsTabProps) {
  const [transactions, setTransactions] = useState(CLIENT_TRANSACTIONS);
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [editTx, setEditTx] = useState<ClientTransaction | null>(null);
  const [editForm, setEditForm] = useState({
    invoiceId: "254772",
    date: "06/03/2026",
    transactionId: "",
    paymentMethod: "",
    amountIn: "0.00",
    amountOut: "0.00",
    fees: "0.00",
    description: "Invoice Payment",
  });

  const cardBg = isDarkMode ? "#252830" : "#FFFFFF";
  const borderColor = isDarkMode ? "#333333" : "#E5E7EB";
  const textColor = isDarkMode ? "#E5E7EB" : "#333333";
  const mutedColor = isDarkMode ? "#9CA3AF" : "#6B7280";
  const headerBg = isDarkMode ? "#2A2D34" : "#F9FAFB";
  const inputBg = isDarkMode ? "#1A1C21" : "#FFFFFF";
  const accentColor = isDarkMode ? "#DF2A57" : "#C70039";

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = transactions;
    if (q) {
      rows = rows.filter(
        (t) =>
          t.date.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.paymentMethod.toLowerCase().includes(q)
      );
    }
    return [...rows].sort((a, b) => {
      const cmp = a.date.localeCompare(b.date);
      return sortAsc ? cmp : -cmp;
    });
  }, [transactions, search, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  function openEdit(tx: ClientTransaction) {
    setEditTx(tx);
    setEditForm({
      invoiceId: "254772",
      date: "06/03/2026",
      transactionId: "",
      paymentMethod: tx.paymentMethod === "-" ? "" : tx.paymentMethod,
      amountIn: tx.amountIn,
      amountOut: tx.amountOut,
      fees: tx.fees,
      description: tx.description.replace(/ \(.*\)/, "").trim() || "Invoice Payment",
    });
  }

  function saveEdit() {
    if (!editTx) return;
    setTransactions((prev) =>
      prev.map((t) =>
        t === editTx
          ? {
              ...t,
              paymentMethod: editForm.paymentMethod || "-",
              amountIn: editForm.amountIn,
              amountOut: editForm.amountOut,
              fees: editForm.fees,
              description: editForm.description,
            }
          : t
      )
    );
    setEditTx(null);
  }

  return (
    <>
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
            padding: "14px 20px",
            borderBottom: `1px solid ${borderColor}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ fontSize: "14px", fontWeight: 600, color: textColor, margin: 0 }}>Transaction List</h3>
          <button
            style={{
              height: "32px",
              padding: "0 14px",
              background: accentColor,
              color: "#FFFFFF",
              border: "none",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            + Add Transaction
          </button>
        </div>

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
              {[10, 25, 50, 100].map((n) => (
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
                <Th borderColor={borderColor} mutedColor={mutedColor}>
                  <button
                    onClick={() => setSortAsc((v) => !v)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      color: mutedColor,
                      fontSize: "12px",
                      fontWeight: 600,
                      padding: 0,
                    }}
                  >
                    Date
                    <span style={{ display: "flex", flexDirection: "column", lineHeight: 0.6 }}>
                      <ChevronUp size={10} />
                      <ChevronDown size={10} />
                    </span>
                  </button>
                </Th>
                <Th borderColor={borderColor} mutedColor={mutedColor}>Payment Method</Th>
                <Th borderColor={borderColor} mutedColor={mutedColor}>Description</Th>
                <Th borderColor={borderColor} mutedColor={mutedColor} align="right">Amount In</Th>
                <Th borderColor={borderColor} mutedColor={mutedColor} align="right">Amount Out</Th>
                <Th borderColor={borderColor} mutedColor={mutedColor} align="right">Fees</Th>
                <Th borderColor={borderColor} mutedColor={mutedColor} align="center">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {paged.map((tx, i) => (
                <tr
                  key={`${tx.description}-${i}`}
                  style={{
                    borderBottom: i < paged.length - 1 ? `1px solid ${borderColor}` : "none",
                    background: i % 2 === 0 ? "transparent" : isDarkMode ? "rgba(255,255,255,0.02)" : "#FAFAFA",
                  }}
                >
                  <Td textColor={textColor}>{tx.date}</Td>
                  <Td textColor={textColor}>{tx.paymentMethod}</Td>
                  <Td textColor={textColor}>{tx.description}</Td>
                  <Td textColor={textColor} align="right">{tx.amountIn}</Td>
                  <Td textColor={textColor} align="right">{tx.amountOut}</Td>
                  <Td textColor={textColor} align="right">{tx.fees}</Td>
                  <Td textColor={textColor} align="center">
                    <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                      <button
                        onClick={() => openEdit(tx)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: accentColor, padding: "2px", display: "flex" }}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        style={{ background: "none", border: "none", cursor: "pointer", color: accentColor, padding: "2px", display: "flex" }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination page={page} totalPages={totalPages} totalEntries={filtered.length} perPage={perPage} onPageChange={setPage} isDarkMode={isDarkMode} />
      </div>

      {editTx && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={() => setEditTx(null)}
        >
          <div
            style={{
              background: cardBg,
              borderRadius: "6px",
              width: "100%",
              maxWidth: "720px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                background: accentColor,
                color: "#FFFFFF",
                padding: "14px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>Edit Transaction</h3>
              <button onClick={() => setEditTx(null)} style={{ background: "none", border: "none", color: "#FFF", cursor: "pointer", padding: "4px", display: "flex" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: "24px 20px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "16px" }}>
                <ModalField label="Invoice ID" value={editForm.invoiceId} onChange={(v) => setEditForm((f) => ({ ...f, invoiceId: v }))} borderColor={borderColor} inputBg={inputBg} textColor={textColor} />
                <ModalField label="Date" value={editForm.date} onChange={(v) => setEditForm((f) => ({ ...f, date: v }))} borderColor={borderColor} inputBg={inputBg} textColor={textColor} />
                <ModalField label="Transaction ID" value={editForm.transactionId} onChange={(v) => setEditForm((f) => ({ ...f, transactionId: v }))} borderColor={borderColor} inputBg={inputBg} textColor={textColor} />
                <div>
                  <label style={{ fontSize: "11px", color: mutedColor, display: "block", marginBottom: "4px" }}>Payment Method</label>
                  <select
                    value={editForm.paymentMethod}
                    onChange={(e) => setEditForm((f) => ({ ...f, paymentMethod: e.target.value }))}
                    style={{ width: "100%", height: "36px", padding: "0 10px", fontSize: "13px", border: `1px solid ${borderColor}`, borderRadius: "4px", background: inputBg, color: textColor, boxSizing: "border-box" }}
                  >
                    <option value="" />
                    <option>Credit Card</option>
                    <option>Check</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "16px" }}>
                <ModalField label="Amount In" value={editForm.amountIn} onChange={(v) => setEditForm((f) => ({ ...f, amountIn: v }))} borderColor={borderColor} inputBg={inputBg} textColor={textColor} />
                <ModalField label="Amount Out" value={editForm.amountOut} onChange={(v) => setEditForm((f) => ({ ...f, amountOut: v }))} borderColor={borderColor} inputBg={inputBg} textColor={textColor} />
                <ModalField label="Fees" value={editForm.fees} onChange={(v) => setEditForm((f) => ({ ...f, fees: v }))} borderColor={borderColor} inputBg={inputBg} textColor={textColor} />
              </div>
              <div>
                <label style={{ fontSize: "11px", color: mutedColor, display: "block", marginBottom: "4px" }}>Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  style={{ width: "100%", padding: "10px", fontSize: "13px", border: `1px solid ${borderColor}`, borderRadius: "4px", background: inputBg, color: textColor, boxSizing: "border-box", resize: "vertical", fontFamily: "inherit" }}
                />
              </div>
            </div>

            <div style={{ padding: "0 20px 24px", display: "flex", justifyContent: "center", gap: "12px" }}>
              <button onClick={() => setEditTx(null)} style={{ height: "36px", padding: "0 28px", background: "#2E1B85", color: "#FFF", border: "none", borderRadius: "4px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={saveEdit} style={{ height: "36px", padding: "0 28px", background: accentColor, color: "#FFF", border: "none", borderRadius: "4px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ModalField({
  label,
  value,
  onChange,
  borderColor,
  inputBg,
  textColor,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  borderColor: string;
  inputBg: string;
  textColor: string;
}) {
  return (
    <div>
      <label style={{ fontSize: "11px", color: "#888", display: "block", marginBottom: "4px" }}>{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", height: "36px", padding: "0 10px", fontSize: "13px", border: `1px solid ${borderColor}`, borderRadius: "4px", background: inputBg, color: textColor, boxSizing: "border-box" }}
      />
    </div>
  );
}

function Th({ children, borderColor, mutedColor, align = "left" }: { children: React.ReactNode; borderColor: string; mutedColor: string; align?: "left" | "right" | "center" }) {
  return (
    <th style={{ padding: "10px 16px", textAlign: align, fontWeight: 600, color: mutedColor, borderBottom: `1px solid ${borderColor}`, whiteSpace: "nowrap" }}>
      {children}
    </th>
  );
}

function Td({ children, textColor, align = "left" }: { children: React.ReactNode; textColor: string; align?: "left" | "right" | "center" }) {
  return (
    <td style={{ padding: "12px 16px", color: textColor, textAlign: align, whiteSpace: "nowrap" }}>{children}</td>
  );
}
