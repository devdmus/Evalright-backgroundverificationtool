import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, ArrowUpDown, Eye, Plus, X } from "lucide-react";
import { Footer } from "../components/Footer";

interface BulkRequest {
  requestNo: number;
  name: string;
  status: "PENDING" | "IN PROGRESS" | "RESOLVED" | "CANCELLED";
  date: string;
}

const INITIAL_REQUESTS: BulkRequest[] = [
  { requestNo: 7852, name: "test", status: "RESOLVED", date: "2023-06-16 15:19:23" }
];

export function BulkOrderRequests() {
  const [requests, setRequests] = useState<BulkRequest[]>(INITIAL_REQUESTS);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  // Sorting state
  const [sortField, setSortField] = useState<keyof BulkRequest | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestName, setRequestName] = useState("");
  const [pkg, setPkg] = useState("Basic Screening");
  const [notes, setNotes] = useState("");

  const handleSort = (field: keyof BulkRequest) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleAddRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestName.trim()) return;

    const newRequest: BulkRequest = {
      requestNo: Math.floor(7000 + Math.random() * 2000), // Random 4-digit number
      name: requestName,
      status: "PENDING",
      date: new Date().toISOString().replace("T", " ").substring(0, 19)
    };

    setRequests((prev) => [newRequest, ...prev]);
    setRequestName("");
    setNotes("");
    setIsModalOpen(false);
  };

  // Filter and sort logic
  const processedRequests = useMemo(() => {
    let result = requests;

    // Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.requestNo.toString().includes(query) ||
          r.name.toLowerCase().includes(query) ||
          r.status.toLowerCase().includes(query) ||
          r.date.toLowerCase().includes(query)
      );
    }

    // Sort
    if (sortField) {
      result = [...result].sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (typeof valA === "string" && typeof valB === "string") {
          return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        if (typeof valA === "number" && typeof valB === "number") {
          return sortAsc ? valA - valB : valB - valA;
        }
        return 0;
      });
    }

    return result;
  }, [requests, searchQuery, sortField, sortAsc]);

  // Pagination calculations
  const totalEntries = processedRequests.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / pageSize));
  const startIndex = totalEntries === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, totalEntries);

  const paginatedRequests = useMemo(() => {
    return processedRequests.slice((page - 1) * pageSize, page * pageSize);
  }, [processedRequests, page, pageSize]);

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
          Bulk Order Requests
        </h1>

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
          {/* Card Header Toolbar with Add Request Button */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px",
              borderBottom: "1px solid #E5E7EB",
            }}
          >
            <h2
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#555555",
                margin: 0,
              }}
            >
              Bulk Order Requests
            </h2>
            <button
              onClick={() => setIsModalOpen(true)}
              style={{
                background: "rgb(199, 0, 57)",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "3px",
                padding: "6px 14px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#A0002C")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgb(199, 0, 57)")}
            >
              <Plus size={14} /> Request Bulk Order
            </button>
          </div>

          {/* Secondary Toolbar */}
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
                    { label: "Request #", field: "requestNo" as keyof BulkRequest, sortable: true },
                    { label: "Request Name", field: "name" as keyof BulkRequest, sortable: true },
                    { label: "Status", field: null, sortable: false },
                    { label: "Date", field: null, sortable: false },
                    { label: "Actions", field: null, sortable: false },
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
                        borderRight: idx < 4 ? "1px solid #E5E7EB" : "none",
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
                {paginatedRequests.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        padding: "16px",
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
                  paginatedRequests.map((request, idx) => (
                    <tr
                      key={request.requestNo}
                      style={{
                        background: idx % 2 === 0 ? "#FFFFFF" : "#FAFAFA",
                        borderBottom: "1px solid #F3F4F6",
                        transition: "background 0.15s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F8FC")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = idx % 2 === 0 ? "#FFFFFF" : "#FAFAFA")}
                    >
                      {/* Request # */}
                      <td style={{ padding: "12px 14px", fontSize: "12px", color: "#555555" }}>
                        {request.requestNo}
                      </td>
                      {/* Request Name */}
                      <td style={{ padding: "12px 14px", fontSize: "12px", color: "rgb(199, 0, 57)", fontWeight: 500 }}>
                        {request.name}
                      </td>
                      {/* Status */}
                      <td style={{ padding: "12px 14px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "2px 8px",
                            borderRadius: "12px",
                            fontSize: "10px",
                            fontWeight: 600,
                            background:
                              request.status === "RESOLVED"
                                ? "#F3E8FF"
                                : request.status === "PENDING"
                                  ? "#EFF6FF"
                                  : request.status === "IN PROGRESS"
                                    ? "#FFFBEB"
                                    : "#FCE8E6",
                            color:
                              request.status === "RESOLVED"
                                ? "#6B21A8"
                                : request.status === "PENDING"
                                  ? "#1D4ED8"
                                  : request.status === "IN PROGRESS"
                                    ? "#92400E"
                                    : "#C5221F",
                            border: `1px solid ${request.status === "RESOLVED"
                                ? "#E9D5FF"
                                : request.status === "PENDING"
                                  ? "#BFDBFE"
                                  : request.status === "IN PROGRESS"
                                    ? "#FDE68A"
                                    : "#FAD2CF"
                              }`,
                          }}
                        >
                          {request.status}
                        </span>
                      </td>
                      {/* Date */}
                      <td style={{ padding: "12px 14px", fontSize: "12px", color: "#555555" }}>
                        {request.date}
                      </td>
                      {/* Actions */}
                      <td style={{ padding: "12px 14px" }}>
                        <button
                          title="View Request"
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "rgb(199, 0, 57)",
                            padding: "2px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Eye size={14} />
                        </button>
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

              {/* Page Number Buttons */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
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
                      borderRadius: isCurrent ? "50%" : "0", // Circle paginator highlight
                      boxSizing: "border-box",
                      height: "26px",
                      width: "26px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
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

      {/* Add New Request Modal Dialog */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            animation: "fadeIn 0.15s ease-out",
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "4px",
              boxShadow: "0 4px 24px rgba(0, 0, 0, 0.15)",
              width: "420px",
              maxWidth: "90%",
              overflow: "hidden",

            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px",
                borderBottom: "1px solid #E5E7EB",
                background: "#F9FAFB",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#333" }}>
                Request Bulk Order
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#6B7280",
                  padding: "2px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleAddRequest} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Request Name Input */}
              <div style={formFieldStyle}>
                <label style={formLabelStyle}>Request Name *</label>
                <input
                  type="text"
                  required
                  value={requestName}
                  onChange={(e) => setRequestName(e.target.value)}
                  style={formInputStyle}
                  placeholder="e.g. June Bulk Recruitment"
                />
              </div>

              {/* Package Selector */}
              <div style={formFieldStyle}>
                <label style={formLabelStyle}>Select Package *</label>
                <select
                  value={pkg}
                  onChange={(e) => setPkg(e.target.value)}
                  style={formSelectStyle}
                >
                  <option value="Basic Screening">Basic Screening</option>
                  <option value="Standard">Standard</option>
                  <option value="DEMO-2">DEMO-2</option>
                  <option value="nationwide + federal">nationwide + federal</option>
                </select>
              </div>

              {/* Details/Notes */}
              <div style={formFieldStyle}>
                <label style={formLabelStyle}>Details / Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{
                    ...formInputStyle,
                    height: "70px",
                    resize: "none",
                  }}
                  placeholder="Provide any additional notes or details..."
                />
              </div>

              {/* Modal Actions */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  marginTop: "8px",
                  borderTop: "1px solid #E5E7EB",
                  paddingTop: "16px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #D1D5DB",
                    borderRadius: "3px",
                    padding: "6px 14px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#374151",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: "rgb(199, 0, 57)",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "3px",
                    padding: "6px 16px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSS Animation Keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// Modal Form Styling Definitions
const formFieldStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
};

const formLabelStyle: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 600,
  color: "#4B5563",
};

const formInputStyle: React.CSSProperties = {
  border: "1px solid #D1D5DB",
  borderRadius: "3px",
  padding: "8px 12px",
  fontSize: "12px",
  outline: "none",
  color: "#374151",

};

const formSelectStyle: React.CSSProperties = {
  ...formInputStyle,
  cursor: "pointer",
  background: "#FFFFFF",
};
