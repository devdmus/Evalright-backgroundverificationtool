import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, ArrowUpDown } from "lucide-react";
import { Footer } from "../components/Footer";

interface DrugScreen {
  orderId: string;
  applicant: string;
  search: string;
  orderDate: string;
  regId: string;
  status: string;
  findLabs: string;
}

export function DrugScreening() {
  const [activeTab, setActiveTab] = useState<"Pending Drug Screens" | "Completed Drug Screens">("Pending Drug Screens");
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [drugScreens] = useState<DrugScreen[]>([]); // Initially empty to match screenshot

  // Sorting state
  const [sortField, setSortField] = useState<keyof DrugScreen | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (field: keyof DrugScreen) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Filter and sort logic
  const processedScreens = useMemo(() => {
    let result = [...drugScreens];

    // Filter by Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.orderId.toLowerCase().includes(query) ||
          a.applicant.toLowerCase().includes(query) ||
          a.search.toLowerCase().includes(query) ||
          a.orderDate.toLowerCase().includes(query) ||
          a.status.toLowerCase().includes(query)
      );
    }

    // Sort
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
  }, [drugScreens, searchQuery, sortField, sortAsc]);

  // Pagination calculations
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
      style={{
        background: "#F6F6F6",
      }}
    >
      <div
        className="flex-1 p-6"
        style={{
          overflowY: "auto",
        }}
      >
        {/* Page Title */}
        <h1
          style={{
            fontSize: "20px",
            fontWeight: 500,
            color: "rgb(199, 0, 57)",
            marginBottom: "20px",
          }}
        >
          Drug Screen Dashboard
        </h1>

        {/* Tab Navigation */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #E0E0E0",
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
                }}
                style={{
                  background: "none",
                  border: "none",
                  borderBottom: isActive ? "2px solid rgb(199, 0, 57)" : "2px solid transparent",
                  padding: "8px 16px",
                  fontSize: "13px",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#333333" : "#777777",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  marginBottom: "-1px",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = "rgb(199, 0, 57)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = "#777777";
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Tab Content Title */}
        <p
          style={{
            fontSize: "14px",
            fontWeight: 500,
            color: "#555555",
            marginBottom: "16px",
            marginTop: "0",
          }}
        >
          {activeTab}
        </p>

        {/* Table Container Card */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: "4px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
            overflow: "hidden",
            marginBottom: "20px",
          }}
        >
          {/* Toolbar */}
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
            {/* Page Size Selector */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#555555" }}>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                style={{
                  border: "1px solid #D1D5DB",
                  borderRadius: "3px",
                  padding: "3px 6px",
                  fontSize: "12px",
                  outline: "none",
                  background: "#FFFFFF",
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

            {/* Search Input */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "#F9FAFB",
                border: "1px solid #D1D5DB",
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
                  color: "#333333",
                  width: "100%",
                }}
              />
            </div>
          </div>

          {/* Table */}
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
                    background: "#F9FAFB",
                    borderTop: "1px solid #E5E7EB",
                    borderBottom: "1px solid #E5E7EB",
                  }}
                >
                  {[
                    { label: "Order ID", field: "orderId" as keyof DrugScreen, sortable: true },
                    { label: "Applicant", field: "applicant" as keyof DrugScreen, sortable: true },
                    { label: "Search", field: "search" as keyof DrugScreen, sortable: true },
                    { label: "Order Date", field: "orderDate" as keyof DrugScreen, sortable: true },
                    { label: "Reg. ID", field: "regId" as keyof DrugScreen, sortable: true },
                    { label: "Status", field: "status" as keyof DrugScreen, sortable: true },
                    { label: "Find Labs", field: "findLabs" as keyof DrugScreen, sortable: true },
                  ].map((col, idx) => (
                    <th
                      key={idx}
                      onClick={() => col.sortable && col.field && handleSort(col.field)}
                      style={{
                        padding: "10px 14px",
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#555555",
                        cursor: col.sortable ? "pointer" : "default",
                        borderRight: idx < 6 ? "1px solid #E5E7EB" : "none",
                        userSelect: "none",
                      }}
                      onMouseEnter={(e) => {
                         if (col.sortable) e.currentTarget.style.background = "#F3F4F6";
                      }}
                      onMouseLeave={(e) => {
                         if (col.sortable) e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px" }}>
                        <span>{col.label}</span>
                        {col.sortable && (
                          <ArrowUpDown
                            size={11}
                            style={{
                              color: sortField === col.field ? "rgb(199, 0, 57)" : "#A0A0A0",
                            }}
                          />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedScreens.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      style={{
                        padding: "24px 16px",
                        textAlign: "center",
                        fontSize: "12px",
                        color: "#8A8A8A",
                        background: "#FFFFFF",
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
                        background: idx % 2 === 0 ? "#FFFFFF" : "#FAFAFA",
                        borderBottom: "1px solid #F3F4F6",
                        transition: "background 0.15s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F8FC")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = idx % 2 === 0 ? "#FFFFFF" : "#FAFAFA")}
                    >
                      <td style={{ padding: "10px 14px", fontSize: "12px", color: "rgb(199, 0, 57)", fontWeight: 500 }}>
                        {screen.orderId}
                      </td>
                      <td style={{ padding: "10px 14px", fontSize: "12px", color: "#333333", fontWeight: 500 }}>
                        {screen.applicant}
                      </td>
                      <td style={{ padding: "10px 14px", fontSize: "12px", color: "#555555" }}>
                        {screen.search}
                      </td>
                      <td style={{ padding: "10px 14px", fontSize: "12px", color: "#555555" }}>
                        {screen.orderDate}
                      </td>
                      <td style={{ padding: "10px 14px", fontSize: "12px", color: "#555555" }}>
                        {screen.regId}
                      </td>
                      <td style={{ padding: "10px 14px", fontSize: "12px", color: "#555555" }}>
                        {screen.status}
                      </td>
                      <td style={{ padding: "10px 14px", fontSize: "12px", color: "#666666" }}>
                        {screen.findLabs}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer / Pagination Controls */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 16px",
              borderTop: "1px solid #E5E7EB",
              background: "#FFFFFF",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            {/* Showing entries status */}
            <span style={{ fontSize: "12px", color: "#777777" }}>
              Showing {startIndex} to {endIndex} of {totalEntries} entries
            </span>

            {/* Pagination buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
              {/* First Page button */}
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                style={{
                  background: "none",
                  border: "1px solid #E5E7EB",
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

              {/* Prev Page button */}
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  background: "none",
                  border: "1px solid #E5E7EB",
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

              {/* Page Number Button */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                if (totalPages > 5 && Math.abs(p - page) > 1 && p !== 1 && p !== totalPages) {
                  if (p === 2 || p === totalPages - 1) {
                    return <span key={p} style={{ padding: "2px 6px", fontSize: "11px", color: "#9CA3AF" }}>...</span>;
                  }
                  return null;
                }
                const isCurrent = page === p;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    style={{
                      background: isCurrent ? "rgb(199, 0, 57)" : "none",
                      border: "1px solid #E5E7EB",
                      borderLeft: "none",
                      color: isCurrent ? "#FFFFFF" : "#777777",
                      padding: "4px 8px",
                      fontSize: "12px",
                      fontWeight: isCurrent ? "600" : "400",
                      cursor: "pointer",
                      minWidth: "26px",
                      boxSizing: "border-box",
                    }}
                  >
                    {p}
                  </button>
                );
              })}

              {/* Next Page button */}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{
                  background: "none",
                  border: "1px solid #E5E7EB",
                  borderLeft: "none",
                  padding: "4px 6px",
                  cursor: page === totalPages ? "not-allowed" : "pointer",
                  opacity: page === totalPages ? 0.35 : 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ChevronRight size={12} style={{ color: "#777777" }} />
              </button>

              {/* Last Page button */}
              <button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                style={{
                  background: "none",
                  border: "1px solid #E5E7EB",
                  borderLeft: "none",
                  padding: "4px 6px",
                  cursor: page === totalPages ? "not-allowed" : "pointer",
                  opacity: page === totalPages ? 0.35 : 1,
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
      <Footer />
    </div>
  );
}
