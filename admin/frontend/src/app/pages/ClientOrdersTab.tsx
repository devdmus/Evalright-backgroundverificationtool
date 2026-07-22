import { useMemo, useState } from "react";
import { Eye } from "lucide-react";
import { Pagination } from "../components/Pagination";
import { CLIENT_ORDERS } from "../data/mockData";

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  CANCELLED: { bg: "#FEE2E2", color: "#991B1B" },
  CLOSED: { bg: "#D1FAE5", color: "#065F46" },
  PENDING: { bg: "#FEF3C7", color: "#92400E" },
};

interface ClientOrdersTabProps {
  isDarkMode?: boolean;
}

export function ClientOrdersTab({ isDarkMode = false }: ClientOrdersTabProps) {
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const cardBg = isDarkMode ? "#252830" : "#FFFFFF";
  const borderColor = isDarkMode ? "#333333" : "#E5E7EB";
  const textColor = isDarkMode ? "#E5E7EB" : "#333333";
  const mutedColor = isDarkMode ? "#9CA3AF" : "#6B7280";
  const headerBg = isDarkMode ? "#2A2D34" : "#F9FAFB";
  const accentColor = isDarkMode ? "#DF2A57" : "#C70039";

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return CLIENT_ORDERS;
    return CLIENT_ORDERS.filter(
      (o) =>
        o.orderId.toLowerCase().includes(q) ||
        o.applicantName.toLowerCase().includes(q) ||
        o.status.toLowerCase().includes(q)
    );
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

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
              {["Order ID", "Applicant Name", "Order Date", "Amount", "Order Status", "Actions"].map((col) => (
                <th key={col} style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: mutedColor, whiteSpace: "nowrap" }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((order, i) => {
              const statusStyle = STATUS_STYLES[order.status];
              return (
                <tr
                  key={order.orderId}
                  style={{
                    borderBottom: i < paged.length - 1 ? `1px solid ${borderColor}` : "none",
                    background: i % 2 === 0 ? "transparent" : isDarkMode ? "rgba(255,255,255,0.02)" : "#FAFAFA",
                  }}
                >
                  <td style={{ padding: "12px 16px", color: accentColor, fontWeight: 500 }}>{order.orderId}</td>
                  <td style={{ padding: "12px 16px", color: textColor }}>{order.applicantName}</td>
                  <td style={{ padding: "12px 16px", color: textColor }}>{order.orderDate}</td>
                  <td style={{ padding: "12px 16px", color: textColor }}>{order.amount}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "3px 10px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: 600,
                        background: statusStyle.bg,
                        color: statusStyle.color,
                      }}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {order.hasInvoice && (
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          color: accentColor,
                          fontSize: "12px",
                          fontWeight: 500,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: 0,
                        }}
                      >
                        <Eye size={14} /> View Invoice
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} totalEntries={filtered.length} perPage={perPage} onPageChange={setPage} isDarkMode={isDarkMode} />
    </div>
  );
}
