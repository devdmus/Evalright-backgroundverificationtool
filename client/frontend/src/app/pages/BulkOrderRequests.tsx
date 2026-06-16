import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  ArrowUpDown,
  Eye,
  Plus,
  X,
  ArrowLeft,
  Trash2,
  Paperclip,
  Send,
} from "lucide-react";
import { Footer } from "../components/Footer";

interface BulkRequest {
  requestNo: number;
  name: string;
  details: string;
  status: "NEW" | "CLOSED";
  date: string;
  displayDate: string;
  attachment?: string;
}

const USER_NAME = "Farooq Shaik";

const formatDate = (d: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

const formatDisplayDate = (d: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export function BulkOrderRequests({ isDarkMode = false }: { isDarkMode?: boolean }) {
  const [requests, setRequests] = useState<BulkRequest[]>([]);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<"requestNo" | "name" | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingRequest, setViewingRequest] = useState<BulkRequest | null>(null);
  const [replyText, setReplyText] = useState("");
  const [requestName, setRequestName] = useState("");
  const [requestDetails, setRequestDetails] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSort = (field: "requestNo" | "name") => {
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

    const now = new Date();
    const newRequest: BulkRequest = {
      requestNo: 11939,
      name: requestName.trim(),
      details: requestDetails.trim() || "demo purpose",
      status: "NEW",
      date: formatDate(now),
      displayDate: formatDisplayDate(now),
      attachment: selectedFile?.name ?? "logo_2_logo_evalright_small_final.png",
    };

    setRequests([newRequest]);
    setRequestName("");
    setRequestDetails("");
    setSelectedFile(null);
    setIsModalOpen(false);
    setPage(1);
  };

  const handleCloseTicket = () => {
    if (!viewingRequest) return;
    setRequests((prev) =>
      prev.map((r) => (r.requestNo === viewingRequest.requestNo ? { ...r, status: "CLOSED" } : r))
    );
    setViewingRequest(null);
    setReplyText("");
  };

  const processedRequests = useMemo(() => {
    let result = [...requests];
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

  const totalEntries = processedRequests.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / pageSize));
  const startIndex = totalEntries === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, totalEntries);
  const entryLabel = totalEntries === 1 ? "entry" : "entries";

  const paginatedRequests = useMemo(() => {
    return processedRequests.slice((page - 1) * pageSize, page * pageSize);
  }, [processedRequests, page, pageSize]);

  if (viewingRequest) {
    return (
      <div className="flex-1 flex flex-col min-h-0" style={{ background: isDarkMode ? "#252830" : "#F6F6F6" }}>
        <div className="flex-1 p-6" style={{ overflowY: "auto" }}>
          <h1 style={{ fontSize: "20px", fontWeight: 500, color: isDarkMode ? "#DF2A57" : "rgb(199, 0, 57)", marginBottom: "20px" }}>
            View Request
          </h1>

          <div
            style={{
              background: isDarkMode ? "#1A1C21" : "#FFFFFF",
              border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
              borderRadius: "4px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
              padding: "16px 20px",
              marginBottom: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <span style={{ fontSize: "14px", fontWeight: 500, color: isDarkMode ? "#E5E7EB" : "#555555" }}>
              Request #{viewingRequest.requestNo}
            </span>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => { setViewingRequest(null); setReplyText(""); }}
                style={actionButtonStyle}
              >
                <ArrowLeft size={16} /> Go Back
              </button>
              <button type="button" onClick={handleCloseTicket} style={actionButtonStyle}>
                Close Bulk Order Request Ticket <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div style={{ background: isDarkMode ? "#2A2D34" : "#F3F4F6", borderRadius: "4px", padding: "24px", marginBottom: "20px" }}>
            <div
              style={{
                background: isDarkMode ? "#1A1C21" : "#FFFFFF",
                borderRadius: "4px",
                padding: "20px 24px",
                maxWidth: "720px",
                position: "relative",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  left: "-8px",
                  width: 0,
                  height: 0,
                  borderTop: "8px solid transparent",
                  borderBottom: "8px solid transparent",
                  borderRight: `8px solid ${isDarkMode ? "#1A1C21" : "#FFFFFF"}`,
                }}
              />
              <p style={{ fontSize: "13px", color: "#6B8CAE", margin: "0 0 12px 0", paddingBottom: "12px", borderBottom: "1px solid #E5E7EB" }}>
                {USER_NAME} - Client on {viewingRequest.displayDate}
              </p>
              <p style={{ fontSize: "14px", color: isDarkMode ? "#D1D5DB" : "#555555", margin: "0 0 16px 0", lineHeight: 1.5 }}>
                {viewingRequest.details}
              </p>
              {viewingRequest.attachment && (
                <div>
                  <span style={{ fontSize: "13px", color: isDarkMode ? "#9CA3AF" : "#777777" }}>Attachments: </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "rgb(199, 0, 57)" }}>
                    <Paperclip size={14} />
                    {viewingRequest.attachment}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div style={{ background: isDarkMode ? "#2A2D34" : "#F3F4F6", borderRadius: "4px", padding: "20px" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Enter your text"
                style={{
                  flex: 1,
                  minHeight: "80px",
                  padding: "12px 14px",
                  fontSize: "13px",
                  border: isDarkMode ? "1px solid #333333" : "1px solid #D1D5DB",
                  borderRadius: "3px",
                  outline: "none",
                  resize: "vertical",
                  background: isDarkMode ? "#1A1C21" : "#FFFFFF",
                  color: isDarkMode ? "#E5E7EB" : "#333333",
                  fontFamily: "inherit",
                }}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingTop: "4px" }}>
                <button
                  type="button"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#9CA3AF",
                    padding: "4px",
                    display: "flex",
                  }}
                >
                  <Paperclip size={20} />
                </button>
                <button
                  type="button"
                  style={{
                    background: "#79B249",
                    border: "none",
                    borderRadius: "3px",
                    padding: "8px 10px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Send size={16} color="#FFFFFF" />
                </button>
              </div>
            </div>
            <p style={{ fontSize: "11px", color: isDarkMode ? "#9CA3AF" : "#9CA3AF", margin: "10px 0 0 0" }}>
              (Allowed File Extensions: .jpg, .gif, .jpeg, .png, .pdf, .zip, .csv, .xls)
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0" style={{ background: isDarkMode ? "#252830" : "#F6F6F6" }}>
      <div className="flex-1 p-6" style={{ overflowY: "auto" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 500, color: isDarkMode ? "#DF2A57" : "rgb(199, 0, 57)", marginBottom: "20px" }}>
          Bulk Order Requests
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", borderBottom: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB" }}>
            <h2 style={{ fontSize: "13px", fontWeight: 600, color: isDarkMode ? "#E5E7EB" : "#555555", margin: 0 }}>
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
              }}
            >
              <Plus size={14} /> Request Bulk Order
            </button>
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
                  {[
                    { label: "Request #", field: "requestNo" as const, sortable: true },
                    { label: "Request Name", field: "name" as const, sortable: true },
                    { label: "Status", sortable: false },
                    { label: "Date", sortable: false },
                    { label: "Actions", sortable: false },
                  ].map((col, idx) => (
                    <th
                      key={col.label}
                      onClick={() => col.sortable && col.field && handleSort(col.field)}
                      style={{
                        padding: "10px 14px", fontSize: "11px", fontWeight: 600, color: isDarkMode ? "#9CA3AF" : "#555555",
                        cursor: col.sortable ? "pointer" : "default",
                        borderRight: idx < 4 ? (isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB") : "none",
                        userSelect: "none",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px" }}>
                        <span>{col.label}</span>
                        {col.sortable && col.field && (
                          <ArrowUpDown size={11} style={{ color: sortField === col.field ? "rgb(199, 0, 57)" : "#A0A0A0" }} />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedRequests.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: "24px 16px", textAlign: "center", fontSize: "12px", color: "#8A8A8A", background: isDarkMode ? "#1A1C21" : "#FFFFFF" }}>
                      No active tickets found
                    </td>
                  </tr>
                ) : (
                  paginatedRequests.map((request, idx) => (
                    <tr
                      key={request.requestNo}
                      style={{
                        background: idx % 2 === 0 ? (isDarkMode ? "#1A1C21" : "#FFFFFF") : (isDarkMode ? "#252830" : "#FAFAFA"),
                        borderBottom: isDarkMode ? "1px solid #333333" : "1px solid #F3F4F6",
                      }}
                    >
                      <td style={{ padding: "12px 14px", fontSize: "12px", color: isDarkMode ? "#9CA3AF" : "#555555" }}>{request.requestNo}</td>
                      <td style={{ padding: "12px 14px", fontSize: "12px", color: "rgb(199, 0, 57)", fontWeight: 500 }}>{request.name}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "2px 10px",
                            borderRadius: "12px",
                            fontSize: "10px",
                            fontWeight: 700,
                            background: "#E6F4EA",
                            color: "#137333",
                            letterSpacing: "0.3px",
                          }}
                        >
                          {request.status}
                        </span>
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: "12px", color: isDarkMode ? "#9CA3AF" : "#555555" }}>{request.date}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <button
                          type="button"
                          title="View Request"
                          onClick={() => setViewingRequest(request)}
                          style={{
                            background: "rgb(199, 0, 57)",
                            border: "none",
                            borderRadius: "50%",
                            width: "28px",
                            height: "28px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Eye size={14} color="#FFFFFF" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderTop: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB", background: isDarkMode ? "#1A1C21" : "#FFFFFF", flexWrap: "wrap", gap: "12px" }}>
            <span style={{ fontSize: "12px", color: isDarkMode ? "#9CA3AF" : "#777777" }}>
              Showing {startIndex} to {endIndex} of {totalEntries} {entryLabel}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
              <button onClick={() => setPage(1)} disabled={page === 1} style={paginationBtnStyle(isDarkMode, true, page === 1)}>
                <ChevronsLeft size={12} style={{ color: "#777777" }} />
              </button>
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} style={paginationBtnStyle(isDarkMode, false, page === 1)}>
                <ChevronLeft size={12} style={{ color: "#777777" }} />
              </button>
              {totalEntries > 0 &&
                Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                  const isCurrent = page === p;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      style={{
                        background: isCurrent ? "rgb(199, 0, 57)" : "none",
                        border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
                        borderLeft: "none",
                        color: isCurrent ? "#FFFFFF" : "#777777",
                        padding: "4px 8px",
                        fontSize: "12px",
                        fontWeight: isCurrent ? 600 : 400,
                        cursor: "pointer",
                        minWidth: "26px",
                        borderRadius: isCurrent ? "50%" : "0",
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
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalEntries === 0} style={paginationBtnStyle(isDarkMode, false, page === totalPages || totalEntries === 0)}>
                <ChevronRight size={12} style={{ color: "#777777" }} />
              </button>
              <button onClick={() => setPage(totalPages)} disabled={page === totalPages || totalEntries === 0} style={paginationBtnStyle(isDarkMode, false, page === totalPages || totalEntries === 0, true)}>
                <ChevronsRight size={12} style={{ color: "#777777" }} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />

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
          }}
        >
          <div style={{ background: "#FFFFFF", borderRadius: "4px", boxShadow: "0 4px 24px rgba(0, 0, 0, 0.15)", width: "480px", maxWidth: "90%", overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: "rgb(199, 0, 57)" }}>
              <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#FFFFFF" }}>
                New Bulk Order Request
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#FFFFFF", padding: "2px", display: "flex" }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddRequest} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <input
                type="text"
                required
                value={requestName}
                onChange={(e) => setRequestName(e.target.value)}
                placeholder="Request Name"
                style={modalInputStyle}
              />
              <textarea
                value={requestDetails}
                onChange={(e) => setRequestDetails(e.target.value)}
                placeholder="Request Details"
                style={{ ...modalInputStyle, minHeight: "100px", resize: "vertical" }}
              />
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#777777", marginBottom: "8px" }}>Attachments</label>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <label
                    style={{
                      display: "inline-block",
                      padding: "6px 14px",
                      fontSize: "12px",
                      color: "#333333",
                      background: "#F3F4F6",
                      border: "1px solid #D1D5DB",
                      borderRadius: "3px",
                      cursor: "pointer",
                    }}
                  >
                    Choose File
                    <input type="file" style={{ display: "none" }} onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)} />
                  </label>
                  <span style={{ fontSize: "12px", color: "#777777" }}>{selectedFile ? selectedFile.name : "No file chosen"}</span>
                </div>
                <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "8px 0 0 0" }}>
                  Supported file types: jpg, jpeg, png, gif, pdf, zip, csv
                </p>
              </div>

              <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "8px", paddingTop: "8px" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    background: "#4A4E69",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "3px",
                    padding: "8px 24px",
                    fontSize: "13px",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
                <button
                  type="submit"
                  style={{
                    background: "rgb(199, 0, 57)",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "3px",
                    padding: "8px 24px",
                    fontSize: "13px",
                    fontWeight: 500,
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
    </div>
  );
}

const actionButtonStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  background: "rgb(199, 0, 57)",
  color: "#FFFFFF",
  border: "none",
  borderRadius: "3px",
  padding: "8px 16px",
  fontSize: "13px",
  fontWeight: 500,
  cursor: "pointer",
};

const modalInputStyle: React.CSSProperties = {
  border: "1px solid #D1D5DB",
  borderRadius: "3px",
  padding: "12px 14px",
  fontSize: "13px",
  outline: "none",
  color: "#374151",
  width: "100%",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

const paginationBtnStyle = (isDarkMode: boolean, isFirst: boolean, disabled: boolean, isLast = false): React.CSSProperties => ({
  background: "none",
  border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
  borderLeft: isFirst ? undefined : "none",
  padding: "4px 6px",
  cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.35 : 1,
  display: "flex",
  alignItems: "center",
  borderRadius: isFirst ? "3px 0 0 3px" : isLast ? "0 3px 3px 0" : "0",
});
