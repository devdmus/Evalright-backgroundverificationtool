import { useState } from "react";
import { Search } from "lucide-react";
import { Footer } from "../components/Footer";

interface InvoiceRecord {
  id: string;
  branch: string;
  invoiceDate: string;
  dueDate: string;
  total: string;
  status: string;
}

const MOCK_INVOICES: InvoiceRecord[] = [];

function SortIcon({ active, direction }: { active: boolean; direction: "asc" | "desc" }) {
  return (
    <span style={{ marginLeft: "6px", display: "inline-flex", flexDirection: "column", verticalAlign: "middle", opacity: active ? 1 : 0.35 }}>
      <span style={{ fontSize: "8px", height: "5px", lineHeight: "1", color: active && direction === "asc" ? "#111827" : "#A0AEC0" }}>▲</span>
      <span style={{ fontSize: "8px", height: "5px", lineHeight: "1", color: active && direction === "desc" ? "#111827" : "#A0AEC0", marginTop: "2px" }}>▼</span>
    </span>
  );
}

export function Invoices() {
  const [invoices, setInvoices] = useState<InvoiceRecord[]>(MOCK_INVOICES);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("invoiceDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  function handleSort(field: string) {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setPage(1);
  }

  const filtered = invoices.filter((inv) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        inv.id.toLowerCase().includes(q) ||
        inv.branch.toLowerCase().includes(q) ||
        inv.total.toLowerCase().includes(q) ||
        inv.status.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    let valA = a[sortField as keyof InvoiceRecord] ?? "";
    let valB = b[sortField as keyof InvoiceRecord] ?? "";

    return sortDirection === "asc"
      ? valA.toString().localeCompare(valB.toString())
      : valB.toString().localeCompare(valA.toString());
  });

  const totalEntries = sorted.length;
  const totalPages = Math.ceil(totalEntries / perPage);
  const startIndex = totalEntries === 0 ? 0 : (page - 1) * perPage + 1;
  const endIndex = Math.min(page * perPage, totalEntries);
  const paginated = sorted.slice((page - 1) * perPage, page * perPage);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, fontFamily: "'Wix Madefor Display', sans-serif" }}>
      <div style={{ flex: 1, padding: "16px 20px", background: "#F5F5F5", overflowY: "auto" }}>
        
        {/* Page Title */}
        <h1 style={{ fontSize: "20px", fontWeight: 500, color: "rgb(199, 0, 57)", marginBottom: "14px" }}>
          My Invoices
        </h1>

        {/* Card Container */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "4px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          
          {/* Card Header Title with divider */}
          <div style={{ borderBottom: "1px solid #E5E7EB", paddingBottom: "12px", marginBottom: "16px", fontSize: "15px", color: "#4B5563", fontWeight: 500 }}>
            Invoice List
          </div>

          {/* Table Controls Row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            
            {/* Entries Selection */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#4B5563" }}>
              <select
                value={perPage}
                onChange={(e) => { setPerPage(parseInt(e.target.value)); setPage(1); }}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #cbd5e1",
                  borderRadius: "4px",
                  padding: "4px 8px",
                  fontSize: "14px",
                  color: "#333",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>entries per page</span>
            </div>

            {/* Live Search Input */}
            <div style={{ position: "relative", width: "240px" }}>
              <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", display: "flex", alignItems: "center" }}>
                <Search size={15} />
              </span>
              <input
                placeholder="Search..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                style={{
                  width: "100%",
                  padding: "8px 12px 8px 32px",
                  fontSize: "14px",
                  background: "#F2F4F6",
                  border: "1px solid #cbd5e1",
                  borderRadius: "4px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* Main Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "#F3F4F6", borderBottom: "2px solid #E5E7EB" }}>
                  <th onClick={() => handleSort("id")} style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 600, color: "#4B5563", cursor: "pointer", userSelect: "none" }}>
                    # <SortIcon active={sortField === "id"} direction={sortDirection} />
                  </th>
                  <th onClick={() => handleSort("branch")} style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 600, color: "#4B5563", cursor: "pointer", userSelect: "none" }}>
                    Branch <SortIcon active={sortField === "branch"} direction={sortDirection} />
                  </th>
                  <th onClick={() => handleSort("invoiceDate")} style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 600, color: "#4B5563", cursor: "pointer", userSelect: "none" }}>
                    Invoice Date <SortIcon active={sortField === "invoiceDate"} direction={sortDirection} />
                  </th>
                  <th onClick={() => handleSort("dueDate")} style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 600, color: "#4B5563", cursor: "pointer", userSelect: "none" }}>
                    Due Date <SortIcon active={sortField === "dueDate"} direction={sortDirection} />
                  </th>
                  <th onClick={() => handleSort("total")} style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 600, color: "#4B5563", cursor: "pointer", userSelect: "none" }}>
                    Total <SortIcon active={sortField === "total"} direction={sortDirection} />
                  </th>
                  <th onClick={() => handleSort("status")} style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 600, color: "#4B5563", cursor: "pointer", userSelect: "none" }}>
                    Status <SortIcon active={sortField === "status"} direction={sortDirection} />
                  </th>
                  <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 600, color: "#4B5563" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "32px", fontSize: "14px", color: "#6B7280" }}>
                      No invoices found
                    </td>
                  </tr>
                ) : (
                  paginated.map((inv, idx) => (
                    <tr key={inv.id} style={{ borderBottom: "1px solid #F3F4F6", background: idx % 2 === 0 ? "#FFFFFF" : "#F9FAFB" }}>
                      <td style={{ padding: "12px 16px", fontSize: "13px", color: "#3B1D7D", fontWeight: 600 }}>{inv.id}</td>
                      <td style={{ padding: "12px 16px", fontSize: "13px", color: "#111827" }}>{inv.branch}</td>
                      <td style={{ padding: "12px 16px", fontSize: "13px", color: "#4B5563" }}>{inv.invoiceDate}</td>
                      <td style={{ padding: "12px 16px", fontSize: "13px", color: "#4B5563" }}>{inv.dueDate}</td>
                      <td style={{ padding: "12px 16px", fontSize: "13px", color: "#4B5563" }}>{inv.total}</td>
                      <td style={{ padding: "12px 16px", fontSize: "13px", color: "#4B5563" }}>{inv.status}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <button style={{ background: "none", border: "none", color: "#C70039", fontSize: "13px", fontWeight: 500, cursor: "pointer", padding: 0 }}>
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px", fontSize: "14px", color: "#4B5563" }}>
            <div>
              Showing {startIndex} to {endIndex} of {totalEntries} entries
            </div>
            
            <div style={{ display: "flex", gap: "4px" }}>
              <button
                disabled={page === 1}
                onClick={() => setPage(1)}
                style={{
                  padding: "6px 8px",
                  border: "none",
                  background: "transparent",
                  color: page === 1 ? "#D1D5DB" : "#4B5563",
                  cursor: page === 1 ? "not-allowed" : "pointer",
                  fontSize: "16px",
                }}
              >
                «
              </button>
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                style={{
                  padding: "6px 8px",
                  border: "none",
                  background: "transparent",
                  color: page === 1 ? "#D1D5DB" : "#4B5563",
                  cursor: page === 1 ? "not-allowed" : "pointer",
                  fontSize: "16px",
                }}
              >
                &lt;
              </button>

              {totalPages > 0 && Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  style={{
                    padding: "6px 12px",
                    border: p === page ? "1px solid #C70039" : "1px solid #E5E7EB",
                    background: p === page ? "#C70039" : "#FFFFFF",
                    color: p === page ? "#FFFFFF" : "#4B5563",
                    borderRadius: "4px",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  {p}
                </button>
              ))}

              <button
                disabled={page === totalPages || totalPages === 0}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                style={{
                  padding: "6px 8px",
                  border: "none",
                  background: "transparent",
                  color: (page === totalPages || totalPages === 0) ? "#D1D5DB" : "#4B5563",
                  cursor: (page === totalPages || totalPages === 0) ? "not-allowed" : "pointer",
                  fontSize: "16px",
                }}
              >
                &gt;
              </button>
              <button
                disabled={page === totalPages || totalPages === 0}
                onClick={() => setPage(totalPages)}
                style={{
                  padding: "6px 8px",
                  border: "none",
                  background: "transparent",
                  color: (page === totalPages || totalPages === 0) ? "#D1D5DB" : "#4B5563",
                  cursor: (page === totalPages || totalPages === 0) ? "not-allowed" : "pointer",
                  fontSize: "16px",
                }}
              >
                »
              </button>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}
