import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, RotateCcw, Trash2 } from "lucide-react";
import { Pagination } from "../components/Pagination";
import { CLIENT_EMAILS } from "../data/mockData";

interface ClientEmailsTabProps {
  isDarkMode?: boolean;
}

export function ClientEmailsTab({ isDarkMode = false }: ClientEmailsTabProps) {
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(false);

  const cardBg = isDarkMode ? "#252830" : "#FFFFFF";
  const borderColor = isDarkMode ? "#333333" : "#E5E7EB";
  const textColor = isDarkMode ? "#E5E7EB" : "#333333";
  const mutedColor = isDarkMode ? "#9CA3AF" : "#6B7280";
  const headerBg = isDarkMode ? "#2A2D34" : "#F9FAFB";
  const accentColor = isDarkMode ? "#DF2A57" : "#C70039";

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = CLIENT_EMAILS;
    if (q) {
      rows = rows.filter(
        (e) =>
          e.date.toLowerCase().includes(q) ||
          e.userEmail.toLowerCase().includes(q) ||
          e.subject.toLowerCase().includes(q)
      );
    }
    return [...rows].sort((a, b) => {
      const cmp = a.date.localeCompare(b.date);
      return sortAsc ? cmp : -cmp;
    });
  }, [search, sortAsc]);

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
              <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: mutedColor }}>
                <button
                  onClick={() => setSortAsc((v) => !v)}
                  style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", color: mutedColor, fontSize: "12px", fontWeight: 600, padding: 0 }}
                >
                  Date
                  <span style={{ display: "flex", flexDirection: "column", lineHeight: 0.6 }}>
                    <ChevronUp size={10} />
                    <ChevronDown size={10} />
                  </span>
                </button>
              </th>
              <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: mutedColor }}>User Email</th>
              <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: mutedColor }}>Subject</th>
              <th style={{ padding: "10px 16px", textAlign: "center", fontWeight: 600, color: mutedColor }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((email, i) => (
              <tr
                key={`${email.date}-${email.subject}-${i}`}
                style={{
                  borderBottom: i < paged.length - 1 ? `1px solid ${borderColor}` : "none",
                  background: i % 2 === 0 ? "transparent" : isDarkMode ? "rgba(255,255,255,0.02)" : "#FAFAFA",
                }}
              >
                <td style={{ padding: "12px 16px", color: textColor }}>{email.date}</td>
                <td style={{ padding: "12px 16px", color: textColor }}>{email.userEmail}</td>
                <td style={{ padding: "12px 16px" }}>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      color: accentColor,
                      fontSize: "12px",
                      fontWeight: 500,
                      cursor: "pointer",
                      padding: 0,
                      textAlign: "left",
                    }}
                  >
                    {email.subject}
                  </button>
                </td>
                <td style={{ padding: "12px 16px", textAlign: "center" }}>
                  <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                    <button
                      title="Resend"
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#4CAF50",
                        padding: "2px",
                        display: "flex",
                      }}
                    >
                      <RotateCcw size={15} />
                    </button>
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: accentColor,
                        padding: "2px",
                        display: "flex",
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} totalEntries={filtered.length} perPage={perPage} onPageChange={setPage} isDarkMode={isDarkMode} />
    </div>
  );
}
