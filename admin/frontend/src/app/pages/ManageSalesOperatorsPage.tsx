import { useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Footer } from "../components/Footer";
import { SALES_OPERATORS } from "../data/mockData";
import { AddSalesOperatorPage } from "./AddSalesOperatorPage";

interface ManageSalesOperatorsPageProps {
  isDarkMode?: boolean;
}

type ViewMode = "list" | "add";

export function ManageSalesOperatorsPage({ isDarkMode = false }: ManageSalesOperatorsPageProps) {
  const [operators] = useState(SALES_OPERATORS);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const primaryColor = isDarkMode ? "#DF2A57" : "#C70039";
  const cardBg = isDarkMode ? "#252830" : "#FFFFFF";
  const borderColor = isDarkMode ? "#333333" : "#E5E7EB";
  const textColor = isDarkMode ? "#E5E7EB" : "#555555";
  const mutedColor = isDarkMode ? "#9CA3AF" : "#666666";
  const tableHeaderBg = isDarkMode ? "#2A2D34" : "#F9FAFB";
  const inputBg = isDarkMode ? "#1A1C21" : "#FFFFFF";

  if (viewMode === "add") {
    return <AddSalesOperatorPage isDarkMode={isDarkMode} onBack={() => setViewMode("list")} />;
  }

  const filtered = operators.filter((op) => {
    if (!searchText.trim()) return true;
    const q = searchText.toLowerCase();
    return (
      op.id.includes(q) ||
      op.username.toLowerCase().includes(q) ||
      op.name.toLowerCase().includes(q) ||
      op.email.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / entriesPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * entriesPerPage;
  const pageRows = filtered.slice(startIdx, startIdx + entriesPerPage);
  const showingFrom = filtered.length === 0 ? 0 : startIdx + 1;
  const showingTo = Math.min(startIdx + entriesPerPage, filtered.length);

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
        <h1 style={{ fontSize: "20px", fontWeight: 600, color: primaryColor, margin: 0 }}>Manage Sales Operators</h1>

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
            <h2 style={{ margin: 0, fontSize: "14px", fontWeight: 500, color: mutedColor }}>Sales Operators List</h2>
            <button
              type="button"
              onClick={() => setViewMode("add")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                background: primaryColor,
                color: "#FFFFFF",
                border: "none",
                borderRadius: "4px",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              <Plus size={16} />
              Add New Sales Operator
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: textColor }}>
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
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
                {[10, 25, 50].map((n) => (
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
                onChange={(e) => {
                  setSearchText(e.target.value);
                  setCurrentPage(1);
                }}
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
                  {["ID", "Username", "Name", "Email", "Sales %", "Manager %", ""].map((col, i) => (
                    <th
                      key={col || "actions"}
                      style={{
                        padding: "12px 16px",
                        textAlign: i === 6 ? "right" : "left",
                        fontWeight: 600,
                        color: mutedColor,
                        width: i === 6 ? "80px" : undefined,
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageRows.map((op) => (
                  <tr key={op.id} style={{ borderBottom: `1px solid ${borderColor}` }}>
                    <td style={{ padding: "12px 16px", color: textColor }}>{op.id}</td>
                    <td style={{ padding: "12px 16px", color: textColor }}>{op.username}</td>
                    <td style={{ padding: "12px 16px", color: textColor }}>{op.name}</td>
                    <td style={{ padding: "12px 16px", color: textColor }}>{op.email}</td>
                    <td style={{ padding: "12px 16px", color: textColor }}>{op.salesPct}</td>
                    <td style={{ padding: "12px 16px", color: textColor }}>{op.managerPct}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                        <button type="button" style={{ background: "none", border: "none", padding: 0, color: primaryColor, cursor: "pointer" }}>
                          <Pencil size={16} />
                        </button>
                        <button type="button" style={{ background: "none", border: "none", padding: 0, color: primaryColor, cursor: "pointer" }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "13px", color: mutedColor }}>
            <span>
              Showing {showingFrom} to {showingTo} of {filtered.length} entries
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                style={{
                  padding: "4px 10px",
                  border: `1px solid ${borderColor}`,
                  borderRadius: "4px",
                  background: cardBg,
                  color: safePage <= 1 ? mutedColor : textColor,
                  fontSize: "13px",
                  cursor: safePage <= 1 ? "not-allowed" : "pointer",
                }}
              >
                Previous
              </button>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: primaryColor,
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                {safePage}
              </div>
              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                style={{
                  padding: "4px 10px",
                  border: `1px solid ${borderColor}`,
                  borderRadius: "4px",
                  background: cardBg,
                  color: safePage >= totalPages ? mutedColor : textColor,
                  fontSize: "13px",
                  cursor: safePage >= totalPages ? "not-allowed" : "pointer",
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
