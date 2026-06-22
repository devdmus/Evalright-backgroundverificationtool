import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, ArrowUpDown } from "lucide-react";
import { Footer } from "../components/Footer";

type TabKey = "Pending Drug Screens" | "Completed Drug Screens";

interface PendingDrugScreen {
  orderId: string;
  applicant: string;
  search: string;
  orderDate: string;
  regId: string;
  status: string;
  findLabs: string;
}

interface CompletedDrugScreen {
  orderId: string;
  applicant: string;
  search: string;
  orderDate: string;
  closeDate: string;
}

const PENDING_COLUMNS: { label: string; field: keyof PendingDrugScreen }[] = [
  { label: "Order ID", field: "orderId" },
  { label: "Applicant", field: "applicant" },
  { label: "Search", field: "search" },
  { label: "Order Date", field: "orderDate" },
  { label: "Reg. ID", field: "regId" },
  { label: "Status", field: "status" },
  { label: "Find Labs", field: "findLabs" },
];

const COMPLETED_COLUMNS: { label: string; field: keyof CompletedDrugScreen }[] = [
  { label: "Order ID", field: "orderId" },
  { label: "Applicant", field: "applicant" },
  { label: "Search", field: "search" },
  { label: "Order Date", field: "orderDate" },
  { label: "Close Date", field: "closeDate" },
];

export function DrugScreening({ isDarkMode = false }: { isDarkMode?: boolean }) {
  const [activeTab, setActiveTab] = useState<TabKey>("Pending Drug Screens");
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pendingScreens] = useState<PendingDrugScreen[]>([]);
  const [completedScreens] = useState<CompletedDrugScreen[]>([]);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const columns = activeTab === "Pending Drug Screens" ? PENDING_COLUMNS : COMPLETED_COLUMNS;
  const rawData = activeTab === "Pending Drug Screens" ? pendingScreens : completedScreens;

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const processedScreens = useMemo(() => {
    let result = [...rawData] as Record<string, string>[];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some((val) => val.toLowerCase().includes(query))
      );
    }

    if (sortField) {
      result = [...result].sort((a, b) => {
        const valA = a[sortField] ?? "";
        const valB = b[sortField] ?? "";
        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [rawData, searchQuery, sortField, sortAsc]);

  const totalEntries = processedScreens.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / pageSize));
  const startIndex = totalEntries === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, totalEntries);

  const paginatedScreens = useMemo(() => {
    return processedScreens.slice((page - 1) * pageSize, page * pageSize);
  }, [processedScreens, page, pageSize]);

  return (
    <div
      className="flex-1 flex flex-col min-h-0"
      style={{ background: isDarkMode ? "#252830" : "#F6F6F6" }}
    >
      <div className="flex-1 p-6" style={{ overflowY: "auto" }}>
        <h1
          style={{
            fontSize: "20px",
            fontWeight: 500,
            color: isDarkMode ? "#DF2A57" : "rgb(199, 0, 57)",
            marginBottom: "20px",
          }}
        >
          Drug Screen Dashboard
        </h1>

        <div
          style={{
            display: "flex",
            borderBottom: isDarkMode ? "1px solid #333333" : "1px solid #E0E0E0",
            marginBottom: "20px",
          }}
        >
          {(["Pending Drug Screens", "Completed Drug Screens"] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setPage(1);
                  setSortField(null);
                  setSearchQuery("");
                }}
                style={{
                  background: "none",
                  border: "none",
                  borderBottom: isActive ? "2px solid rgb(199, 0, 57)" : "2px solid transparent",
                  padding: "8px 16px",
                  fontSize: "13px",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? (isDarkMode ? "#E5E7EB" : "#333333") : (isDarkMode ? "#9CA3AF" : "#777777"),
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  marginBottom: "-1px",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = "rgb(199, 0, 57)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = isDarkMode ? "#9CA3AF" : "#777777";
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <p
          style={{
            fontSize: "14px",
            fontWeight: 500,
            color: isDarkMode ? "#E5E7EB" : "#555555",
            marginBottom: "16px",
            marginTop: "0",
          }}
        >
          {activeTab}
        </p>

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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 16px",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: isDarkMode ? "#9CA3AF" : "#555555" }}>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                style={{
                  border: isDarkMode ? "1px solid #333333" : "1px solid #D1D5DB",
                  borderRadius: "3px",
                  padding: "3px 6px",
                  fontSize: "12px",
                  outline: "none",
                  background: isDarkMode ? "#252830" : "#FFFFFF",
                  color: isDarkMode ? "#E5E7EB" : "#333333",
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

            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: isDarkMode ? "#252830" : "#F9FAFB",
                border: isDarkMode ? "1px solid #333333" : "1px solid #D1D5DB",
                borderRadius: "3px",
                padding: "0 8px",
                height: "28px",
                width: "180px",
              }}
            >
              <Search size={13} style={{ color: "#9CA3AF", marginRight: "6px" }} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                style={{
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  fontSize: "12px",
                  color: isDarkMode ? "#E5E7EB" : "#333333",
                  width: "100%",
                }}
              />
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: isDarkMode ? "#2A2D34" : "#F9FAFB",
                    borderTop: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
                    borderBottom: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
                  }}
                >
                  {columns.map((col, idx) => (
                    <th
                      key={col.field}
                      onClick={() => handleSort(col.field)}
                      style={{
                        padding: "10px 14px",
                        fontSize: "11px",
                        fontWeight: 600,
                        color: isDarkMode ? "#9CA3AF" : "#555555",
                        cursor: "pointer",
                        borderRight: idx < columns.length - 1 ? (isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB") : "none",
                        userSelect: "none",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = isDarkMode ? "#333333" : "#F3F4F6";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px" }}>
                        <span>{col.label}</span>
                        <ArrowUpDown
                          size={11}
                          style={{
                            color: sortField === col.field ? "rgb(199, 0, 57)" : "#A0A0A0",
                          }}
                        />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedScreens.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      style={{
                        padding: "24px 16px",
                        textAlign: "center",
                        fontSize: "12px",
                        color: "#8A8A8A",
                        background: isDarkMode ? "#1A1C21" : "#FFFFFF",
                      }}
                    >
                      No records found
                    </td>
                  </tr>
                ) : (
                  paginatedScreens.map((screen, idx) => (
                    <tr
                      key={idx}
                      style={{
                        background: idx % 2 === 0 ? (isDarkMode ? "#1A1C21" : "#FFFFFF") : (isDarkMode ? "#252830" : "#FAFAFA"),
                        borderBottom: isDarkMode ? "1px solid #333333" : "1px solid #F3F4F6",
                        transition: "background 0.15s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = isDarkMode ? "#2A2D34" : "#F5F8FC")}
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = idx % 2 === 0 ? (isDarkMode ? "#1A1C21" : "#FFFFFF") : (isDarkMode ? "#252830" : "#FAFAFA"))
                      }
                    >
                      {columns.map((col) => (
                        <td
                          key={col.field}
                          style={{
                            padding: "10px 14px",
                            fontSize: "12px",
                            color: col.field === "orderId" ? "rgb(199, 0, 57)" : isDarkMode ? "#D1D5DB" : "#555555",
                            fontWeight: col.field === "orderId" || col.field === "applicant" ? 500 : 400,
                          }}
                        >
                          {screen[col.field]}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 16px",
              borderTop: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
              background: isDarkMode ? "#1A1C21" : "#FFFFFF",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <span style={{ fontSize: "12px", color: isDarkMode ? "#9CA3AF" : "#777777" }}>
              Showing {startIndex} to {endIndex} of {totalEntries} entries
            </span>

            <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                style={{
                  background: "none",
                  border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
                  padding: "4px 6px",
                  cursor: page === 1 ? "not-allowed" : "pointer",
                  opacity: page === 1 ? 0.35 : 1,
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "3px 0 0 3px",
                }}
              >
                <ChevronsLeft size={12} style={{ color: "#777777" }} />
              </button>

              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  background: "none",
                  border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
                  borderLeft: "none",
                  padding: "4px 6px",
                  cursor: page === 1 ? "not-allowed" : "pointer",
                  opacity: page === 1 ? 0.35 : 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ChevronLeft size={12} style={{ color: "#777777" }} />
              </button>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || totalEntries === 0}
                style={{
                  background: "none",
                  border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
                  borderLeft: "none",
                  padding: "4px 6px",
                  cursor: page === totalPages || totalEntries === 0 ? "not-allowed" : "pointer",
                  opacity: page === totalPages || totalEntries === 0 ? 0.35 : 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ChevronRight size={12} style={{ color: "#777777" }} />
              </button>

              <button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages || totalEntries === 0}
                style={{
                  background: "none",
                  border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
                  borderLeft: "none",
                  padding: "4px 6px",
                  cursor: page === totalPages || totalEntries === 0 ? "not-allowed" : "pointer",
                  opacity: page === totalPages || totalEntries === 0 ? 0.35 : 1,
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "0 3px 3px 0",
                }}
              >
                <ChevronsRight size={12} style={{ color: "#777777" }} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
