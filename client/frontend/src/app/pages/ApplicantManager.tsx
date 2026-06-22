import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, ArrowUpDown, Eye, UserPlus, MoreVertical } from "lucide-react";
import { Footer } from "../components/Footer";

interface Applicant {
  inviteId: string;
  name: string;
  email: string;
  dateCreated: string;
  status: "Active" | "Complete" | "Expired/Other";
  emailActivity: string;
}

export function ApplicantManager({ isDarkMode = false }: { isDarkMode?: boolean }) {
  const [activeTab, setActiveTab] = useState<"Active" | "Complete" | "Expired/Other">("Active");
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [applicants] = useState<Applicant[]>([]); // Initially empty to match screenshot

  // Sorting state
  const [sortField, setSortField] = useState<keyof Applicant | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (field: keyof Applicant) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Filter and sort logic
  const processedApplicants = useMemo(() => {
    // 1. Filter by Tab
    let result = applicants.filter((a) => a.status === activeTab);

    // 2. Filter by Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.inviteId.toLowerCase().includes(query) ||
          a.name.toLowerCase().includes(query) ||
          a.email.toLowerCase().includes(query) ||
          a.dateCreated.toLowerCase().includes(query) ||
          a.status.toLowerCase().includes(query)
      );
    }

    // 3. Sort
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
  }, [applicants, activeTab, searchQuery, sortField, sortAsc]);

  // Pagination calculations
  const totalEntries = processedApplicants.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / pageSize));
  const startIndex = totalEntries === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, totalEntries);

  const paginatedApplicants = useMemo(() => {
    return processedApplicants.slice((page - 1) * pageSize, page * pageSize);
  }, [processedApplicants, page, pageSize]);

  return (
    <div
      className="flex-1 flex flex-col min-h-0"
      style={{

        background: isDarkMode ? "#252830" : "#F6F6F6",
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
            color: isDarkMode ? "#DF2A57" : "rgb(199, 0, 57)",
            marginBottom: "20px",
          }}
        >
          Applicant Manager
        </h1>

        {/* Table Container Card */}
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
          {/* Tab Navigation */}
          <div
            style={{
              display: "flex",
              borderBottom: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
              padding: "0 20px",
            }}
          >
            {(["Active", "Complete", "Expired/Other"] as const).map((tab) => {
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
                    padding: "16px 20px",
                    fontSize: "14px",
                    fontWeight: isActive ? 500 : 400,
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

          {/* Subtitle Description */}
          <div style={{ padding: "20px 20px 0 20px" }}>
            <p
              style={{
                fontSize: "13px",
                color: isDarkMode ? "#9CA3AF" : "#8A8A8A",
                margin: 0,
              }}
            >
              Manage your applicants efficiently with status-based tabs.
            </p>
          </div>

          {/* Toolbar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            {/* Page Size Selector */}
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
                  background: isDarkMode ? "#1A1C21" : "#FFFFFF",
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

            {/* Search Input */}
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
                    background: isDarkMode ? "#2A2D34" : "#F3F4F6",
                    borderTop: isDarkMode ? "1px solid #333333" : "none",
                    borderBottom: isDarkMode ? "1px solid #333333" : "none",
                  }}
                >
                  {[
                    { label: "Invite ID", field: "inviteId" as keyof Applicant, sortable: true },
                    { label: "Applicant Name", field: "name" as keyof Applicant, sortable: true },
                    { label: "Email", field: "email" as keyof Applicant, sortable: true },
                    { label: "Date Created", field: "dateCreated" as keyof Applicant, sortable: true },
                    { label: "Status", field: "status" as keyof Applicant, sortable: true, hideOnComplete: true },
                    { label: "Email Activity", field: null, sortable: false, hideOnComplete: true },
                    { label: "Actions", field: null, sortable: false },
                  ].filter(col => !(activeTab === "Complete" && col.hideOnComplete)).map((col, idx) => (
                    <th
                      key={idx}
                      onClick={() => col.sortable && col.field && handleSort(col.field)}
                      style={{
                        padding: "14px 20px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: isDarkMode ? "#9CA3AF" : "#555555",
                        cursor: col.sortable ? "pointer" : "default",
                        borderRight: "none",
                        userSelect: "none",
                      }}
                      onMouseEnter={(e) => {
                        if (col.sortable) e.currentTarget.style.background = isDarkMode ? "#313641" : "#E5E7EB";
                      }}
                      onMouseLeave={(e) => {
                        if (col.sortable) e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: "8px" }}>
                        <span>{col.label}</span>
                        {col.sortable && (
                          <ArrowUpDown
                            size={12}
                            style={{
                              color: sortField === col.field ? "rgb(199, 0, 57)" : "#D1D5DB",
                            }}
                          />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedApplicants.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      style={{
                        padding: "16px",
                        textAlign: "center",
                        fontSize: "12px",
                        color: isDarkMode ? "#9CA3AF" : "#8A8A8A",
                        background: "transparent",
                      }}
                    >
                      No records found
                    </td>
                  </tr>
                ) : (
                  paginatedApplicants.map((applicant, idx) => (
                    <tr
                      key={applicant.inviteId}
                      style={{
                        background: idx % 2 === 0 ? (isDarkMode ? "#1A1C21" : "#FFFFFF") : (isDarkMode ? "#252830" : "#FAFAFA"),
                        borderBottom: isDarkMode ? "1px solid #333333" : "1px solid #F3F4F6",
                        transition: "background 0.15s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = isDarkMode ? "#313641" : "#F5F8FC")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = idx % 2 === 0 ? (isDarkMode ? "#1A1C21" : "#FFFFFF") : (isDarkMode ? "#252830" : "#FAFAFA"))}
                    >
                      <td style={{ padding: "10px 14px", fontSize: "12px", color: isDarkMode ? "#93C5FD" : "rgb(199, 0, 57)", fontWeight: 500 }}>
                        {applicant.inviteId}
                      </td>
                      <td style={{ padding: "10px 14px", fontSize: "12px", color: isDarkMode ? "#E5E7EB" : "#333333", fontWeight: 500 }}>
                        {applicant.name}
                      </td>
                      <td style={{ padding: "10px 14px", fontSize: "12px", color: isDarkMode ? "#9CA3AF" : "#555555" }}>
                        {applicant.email}
                      </td>
                      <td style={{ padding: "10px 14px", fontSize: "12px", color: isDarkMode ? "#9CA3AF" : "#555555" }}>
                        {applicant.dateCreated}
                      </td>
                      {activeTab !== "Complete" && (
                        <td style={{ padding: "10px 14px" }}>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "2px 8px",
                              borderRadius: "12px",
                              fontSize: "10px",
                              fontWeight: 600,
                              background:
                                applicant.status === "Complete"
                                  ? "#E6F4EA"
                                  : applicant.status === "Active"
                                    ? "#E8F0FE"
                                    : "#FCE8E6",
                              color:
                                applicant.status === "Complete"
                                  ? "#137333"
                                  : applicant.status === "Active"
                                    ? "#1A73E8"
                                    : "#C5221F",
                              border: `1px solid ${applicant.status === "Complete"
                                ? "#CEEAD6"
                                : applicant.status === "Active"
                                  ? "#D2E3FC"
                                  : "#FAD2CF"
                                }`,
                            }}
                          >
                            {applicant.status}
                          </span>
                        </td>
                      )}
                      {activeTab !== "Complete" && (
                        <td style={{ padding: "10px 14px", fontSize: "12px", color: isDarkMode ? "#9CA3AF" : "#666666" }}>
                          {applicant.emailActivity}
                        </td>
                      )}
                      <td style={{ padding: "10px 14px" }}>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            title="View Applicant"
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "#666666",
                              padding: "2px",
                              display: "flex",
                              alignItems: "center",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "rgb(199, 0, 57)")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "#666666")}
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            title="Resend Invite"
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "#666666",
                              padding: "2px",
                              display: "flex",
                              alignItems: "center",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "rgb(199, 0, 57)")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "#666666")}
                          >
                            <UserPlus size={14} />
                          </button>
                          <button
                            title="More Actions"
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "#666666",
                              padding: "2px",
                              display: "flex",
                              alignItems: "center",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "rgb(199, 0, 57)")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "#666666")}
                          >
                            <MoreVertical size={14} />
                          </button>
                        </div>
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
              padding: "16px 20px",
              borderTop: isDarkMode ? "1px solid #333333" : "1px solid #F3F4F6",
              background: isDarkMode ? "#1A1C21" : "#FFFFFF",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            {/* Showing entries status */}
            <span style={{ fontSize: "13px", color: isDarkMode ? "#9CA3AF" : "#8A8A8A" }}>
              Showing {startIndex} to {endIndex} of {totalEntries} entries
            </span>

            {/* Pagination buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
              {/* First Page button */}
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                style={{
                  background: isDarkMode ? "#252830" : "#FFFFFF",
                  border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
                  padding: "6px 10px",
                  cursor: page === 1 ? "not-allowed" : "pointer",
                  opacity: page === 1 ? 0.35 : 1,
                  display: "flex",
                  alignItems: "center",
                  color: isDarkMode ? "#9CA3AF" : "#8A8A8A",
                  borderRadius: "3px 0 0 3px",
                }}
              >
                <ChevronsLeft size={16} />
              </button>

              {/* Prev Page button */}
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  background: isDarkMode ? "#252830" : "#FFFFFF",
                  border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
                  borderLeft: "none",
                  padding: "6px 10px",
                  cursor: page === 1 ? "not-allowed" : "pointer",
                  opacity: page === 1 ? 0.35 : 1,
                  display: "flex",
                  alignItems: "center",
                  color: isDarkMode ? "#9CA3AF" : "#8A8A8A",
                }}
              >
                <ChevronLeft size={16} />
              </button>

              {/* Next Page button */}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{
                  background: isDarkMode ? "#252830" : "#FFFFFF",
                  border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
                  borderLeft: "none",
                  padding: "6px 10px",
                  cursor: page === totalPages ? "not-allowed" : "pointer",
                  opacity: page === totalPages ? 0.35 : 1,
                  display: "flex",
                  alignItems: "center",
                  color: isDarkMode ? "#9CA3AF" : "#8A8A8A",
                }}
              >
                <ChevronRight size={16} />
              </button>

              {/* Last Page button */}
              <button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                style={{
                  background: isDarkMode ? "#252830" : "#FFFFFF",
                  border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
                  borderLeft: "none",
                  padding: "6px 10px",
                  cursor: page === totalPages ? "not-allowed" : "pointer",
                  opacity: page === totalPages ? 0.35 : 1,
                  display: "flex",
                  alignItems: "center",
                  color: isDarkMode ? "#9CA3AF" : "#8A8A8A",
                  borderRadius: "0 3px 3px 0",
                }}
              >
                <ChevronsRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
