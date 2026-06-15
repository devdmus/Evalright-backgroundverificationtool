import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, ArrowUpDown } from "lucide-react";
import { Footer } from "../components/Footer";

interface Invoice {
  id: number;
  branch: string;
  invoiceDate: string;
  dueDate: string;
  total: string;
  status: string;
}

const COLUMNS: { label: string; field: keyof Invoice | null; sortable: boolean }[] = [
  { label: "#", field: "id", sortable: true },
  { label: "Branch", field: "branch", sortable: true },
  { label: "Invoice Date", field: "invoiceDate", sortable: true },
  { label: "Due Date", field: "dueDate", sortable: true },
  { label: "Total", field: "total", sortable: true },
  { label: "Status", field: "status", sortable: true },
  { label: "Actions", field: null, sortable: false },
];

export function Invoices({ isDarkMode = false }: { isDarkMode?: boolean }) {
  const [invoices] = useState<Invoice[]>([]);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Invoice | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (field: keyof Invoice) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const processedInvoices = useMemo(() => {
    let result = [...invoices];
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((inv) =>
        Object.values(inv).some((val) => String(val).toLowerCase().includes(query))
      );
    }
    if (sortField) {
      result = [...result].sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [invoices, searchQuery, sortField, sortAsc]);

  const totalEntries = processedInvoices.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / pageSize));
  const startIndex = totalEntries === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, totalEntries);

  const paginatedInvoices = useMemo(() => {
    return processedInvoices.slice((page - 1) * pageSize, page * pageSize);
  }, [processedInvoices, page, pageSize]);

  return (
    <div className="flex-1 flex flex-col min-h-0" style={{ background: isDarkMode ? "#252830" : "#F6F6F6" }}>
      <div className="flex-1 p-6" style={{ overflowY: "auto" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 500, color: isDarkMode ? "#DF2A57" : "rgb(199, 0, 57)", marginBottom: "20px" }}>
          My Invoices
        </h1>

        <div
          style={{
            background: isDarkMode ? "#1A1C21" : "#FFFFFF",
            border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
            borderRadius: "4px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
            overflow: "hidden",
            marginBottom: "20px",
          }}
        >
          <div style={{ padding: "16px", borderBottom: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB" }}>
            <h2 style={{ fontSize: "13px", fontWeight: 600, color: isDarkMode ? "#E5E7EB" : "#555555", margin: 0 }}>
              Invoice List
            </h2>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: isDarkMode ? "#9CA3AF" : "#555555" }}>
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                style={{
                  border: isDarkMode ? "1px solid #333333" : "1px solid #D1D5DB",
                  borderRadius: "3px", padding: "3px 6px", fontSize: "12px", outline: "none",
                  background: isDarkMode ? "#252830" : "#FFFFFF", color: isDarkMode ? "#E5E7EB" : "#333333", cursor: "pointer",
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>entries per page</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", background: isDarkMode ? "#252830" : "#F9FAFB", border: isDarkMode ? "1px solid #333333" : "1px solid #D1D5DB", borderRadius: "3px", padding: "0 8px", height: "28px", width: "180px" }}>
              <Search size={13} style={{ color: "#9CA3AF", marginRight: "6px" }} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                style={{ border: "none", background: "transparent", outline: "none", fontSize: "12px", color: isDarkMode ? "#E5E7EB" : "#333333", width: "100%" }}
              />
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ background: isDarkMode ? "#2A2D34" : "#F9FAFB", borderTop: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB", borderBottom: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB" }}>
                  {COLUMNS.map((col, idx) => (
                    <th
                      key={col.label}
                      onClick={() => col.sortable && col.field && handleSort(col.field)}
                      style={{
                        padding: "10px 14px", fontSize: "11px", fontWeight: 600, color: isDarkMode ? "#9CA3AF" : "#555555",
                        cursor: col.sortable ? "pointer" : "default",
                        borderRight: idx < COLUMNS.length - 1 ? (isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB") : "none",
                        userSelect: "none",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px" }}>
                        <span>{col.label}</span>
                        {col.sortable && <ArrowUpDown size={11} style={{ color: sortField === col.field ? "rgb(199, 0, 57)" : "#A0A0A0" }} />}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: "24px 16px", textAlign: "center", fontSize: "12px", color: "#8A8A8A", background: isDarkMode ? "#1A1C21" : "#FFFFFF" }}>
                      No invoices found
                    </td>
                  </tr>
                ) : (
                  paginatedInvoices.map((inv, idx) => (
                    <tr key={inv.id} style={{ background: idx % 2 === 0 ? (isDarkMode ? "#1A1C21" : "#FFFFFF") : (isDarkMode ? "#252830" : "#FAFAFA"), borderBottom: isDarkMode ? "1px solid #333333" : "1px solid #F3F4F6" }}>
                      {COLUMNS.filter((c) => c.field).map((col) => (
                        <td key={col.field!} style={{ padding: "12px 14px", fontSize: "12px", color: isDarkMode ? "#D1D5DB" : "#555555" }}>
                          {inv[col.field!]}
                        </td>
                      ))}
                      <td style={{ padding: "12px 14px" }} />
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderTop: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB", background: isDarkMode ? "#1A1C21" : "#FFFFFF", flexWrap: "wrap", gap: "12px" }}>
            <span style={{ fontSize: "12px", color: isDarkMode ? "#9CA3AF" : "#777777" }}>
              Showing {startIndex} to {endIndex} of {totalEntries} entries
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
              {[
                { icon: ChevronsLeft, action: () => setPage(1), disabled: page === 1, radius: "3px 0 0 3px" },
                { icon: ChevronLeft, action: () => setPage((p) => Math.max(1, p - 1)), disabled: page === 1 },
                { icon: ChevronRight, action: () => setPage((p) => Math.min(totalPages, p + 1)), disabled: page === totalPages || totalEntries === 0 },
                { icon: ChevronsRight, action: () => setPage(totalPages), disabled: page === totalPages || totalEntries === 0, radius: "0 3px 3px 0" },
              ].map(({ icon: Icon, action, disabled, radius }, i) => (
                <button
                  key={i}
                  onClick={action}
                  disabled={disabled}
                  style={{
                    background: "none", border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
                    borderLeft: i > 0 ? "none" : undefined, padding: "4px 6px",
                    cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.35 : 1,
                    display: "flex", alignItems: "center", borderRadius: radius,
                  }}
                >
                  <Icon size={12} style={{ color: "#777777" }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
