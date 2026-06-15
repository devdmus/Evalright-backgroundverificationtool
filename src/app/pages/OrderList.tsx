import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ORDERS, STATUS_STYLES, type SearchStatus } from "../data/mockData";
import { Footer } from "../components/Footer";

const ITEMS_PER_PAGE = 10;

export function OrderList({ isDarkMode = false }: { isDarkMode?: boolean }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(ORDERS.length / ITEMS_PER_PAGE);
  const paginated = ORDERS.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="flex-1 flex flex-col min-h-0" style={{ fontFamily: "'Wix Madefor Display', sans-serif" }}>
      <div className="flex-1 p-6" style={{ background: isDarkMode ? "#252830" : "#F6F6F6" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 500, color: isDarkMode ? "#DF2A57" : "rgb(199, 0, 57)", marginBottom: "0px", }}>
          Order List
        </h1>
        <div className="rounded overflow-hidden" style={{ background: isDarkMode ? "#1A1C21" : "#FFFFFF", border: isDarkMode ? "1px solid #333333" : "1px solid #E0E0E0", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <div className="px-4 py-2 border-b uppercase tracking-widest" style={{ background: isDarkMode ? "#2A2D34" : "#F2F2F2", borderColor: isDarkMode ? "#333333" : "#E0E0E0", fontSize: "10px", color: isDarkMode ? "#9CA3AF" : "#6C7589", fontWeight: 600 }}>
            Orders
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ background: isDarkMode ? "#2A2D34" : "#F2F2F2", borderBottom: isDarkMode ? "1px solid #333333" : "1px solid #E0E0E0" }}>
                {["Search ID", "Applicant Name", "Verification Type", "Status", "Order Date"].map((col) => (
                  <th key={col} className="text-left px-4 py-2" style={{ fontSize: "11px", color: "#6C7589", fontWeight: 600 }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((o, idx) => (
                <tr key={o.searchId} style={{ borderBottom: isDarkMode ? "1px solid #333333" : "1px solid #F2F2F2", background: idx % 2 === 0 ? (isDarkMode ? "#1A1C21" : "#FFFFFF") : (isDarkMode ? "#252830" : "#FAFAFA") }}>
                  <td className="px-4 py-2.5" style={{ fontSize: "12px", color: isDarkMode ? "#93C5FD" : "#3B1D7D", fontWeight: 600 }}>{o.searchId}</td>
                  <td className="px-4 py-2.5" style={{ fontSize: "12px", color: isDarkMode ? "#E5E7EB" : "#333333" }}>{o.applicantName}</td>
                  <td className="px-4 py-2.5" style={{ fontSize: "12px", color: isDarkMode ? "#E5E7EB" : "#333333" }}>{o.verificationType}</td>
                  <td className="px-4 py-2.5">
                    <span style={{
                      display: "inline-block", padding: "2px 10px", borderRadius: "999px",
                      fontSize: "10px", fontWeight: 600,
                      background: STATUS_STYLES[o.status].bg,
                      color: STATUS_STYLES[o.status].color,
                      border: `1px solid ${STATUS_STYLES[o.status].border}`,
                    }}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5" style={{ fontSize: "12px", color: isDarkMode ? "#9CA3AF" : "#6C7589" }}>{o.orderDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-2 border-t" style={{ borderColor: isDarkMode ? "#333333" : "#E0E0E0", background: isDarkMode ? "#2A2D34" : "#FAFAFA" }}>
              <span style={{ fontSize: "11px", color: isDarkMode ? "#9CA3AF" : "#6C7589" }}>
                Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, ORDERS.length)} of {ORDERS.length}
              </span>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                  style={{ padding: "4px 8px", border: isDarkMode ? "1px solid #333333" : "1px solid #E0E0E0", borderRadius: "4px", background: isDarkMode ? "#1A1C21" : "#FFFFFF", cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.4 : 1 }}>
                  <ChevronLeft size={13} style={{ color: isDarkMode ? "#9CA3AF" : "#6C7589" }} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setPage(p)}
                    style={{ width: "28px", height: "28px", borderRadius: "4px", border: p === page ? "1px solid #B7042C" : (isDarkMode ? "1px solid #333333" : "1px solid #E0E0E0"), background: p === page ? "#B7042C" : (isDarkMode ? "#1A1C21" : "#FFFFFF"), color: p === page ? "#FFFFFF" : (isDarkMode ? "#9CA3AF" : "#6C7589"), fontSize: "11px", fontWeight: 600, cursor: "pointer" }}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  style={{ padding: "4px 8px", border: isDarkMode ? "1px solid #333333" : "1px solid #E0E0E0", borderRadius: "4px", background: isDarkMode ? "#1A1C21" : "#FFFFFF", cursor: page === totalPages ? "not-allowed" : "pointer", opacity: page === totalPages ? 0.4 : 1 }}>
                  <ChevronRight size={13} style={{ color: isDarkMode ? "#9CA3AF" : "#6C7589" }} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
