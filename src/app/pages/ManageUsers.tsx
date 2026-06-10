import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, ArrowUpDown, Pencil, Plus, X } from "lucide-react";
import { Footer } from "../components/Footer";

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  status: boolean; // true = Enabled, false = Disabled
}

const INITIAL_USERS: User[] = [
  { id: 25014, username: "rameshs", name: "ramesh K", email: "sales@evalright.us", status: false },
  { id: 13670, username: "Evalrightdemo", name: "Suresh Ramakoti", email: "sales@evalright.us", status: true }
];

export function ManageUsers() {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  // Sorting state
  const [sortField, setSortField] = useState<keyof User | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  // Add User Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newStatus, setNewStatus] = useState("Enabled");

  // Toggle user status
  const handleToggleStatus = (id: number) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, status: !user.status } : user
      )
    );
  };

  // Sort handler
  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Add user handler
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newName || !newEmail) return;

    const newUser: User = {
      id: Math.floor(10000 + Math.random() * 90000), // Random 5-digit ID
      username: newUsername,
      name: newName,
      email: newEmail,
      status: newStatus === "Enabled"
    };

    setUsers((prev) => [...prev, newUser]);
    
    // Reset form & close modal
    setNewUsername("");
    setNewName("");
    setNewEmail("");
    setNewStatus("Enabled");
    setIsModalOpen(false);
  };

  // Filter and sort logic
  const processedUsers = useMemo(() => {
    let result = users;

    // Filter by Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          u.id.toString().includes(query) ||
          u.username.toLowerCase().includes(query) ||
          u.name.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query)
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
  }, [users, searchQuery, sortField, sortAsc]);

  // Pagination calculations
  const totalEntries = processedUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / pageSize));
  const startIndex = totalEntries === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, totalEntries);

  const paginatedUsers = useMemo(() => {
    return processedUsers.slice((page - 1) * pageSize, page * pageSize);
  }, [processedUsers, page, pageSize]);

  return (
    <div
      className="flex-1 flex flex-col min-h-0"
      style={{
        fontFamily: "'Segoe UI', Arial, sans-serif",
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
          Manage Users
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
          {/* Card Header Toolbar with Add User Button */}
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
              Users List
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
              <Plus size={14} /> Add New User
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
                  fontFamily: "'Segoe UI', Arial, sans-serif",
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
                    { label: "ID", field: "id" as keyof User, sortable: true },
                    { label: "Username", field: "username" as keyof User, sortable: true },
                    { label: "Name", field: "name" as keyof User, sortable: true },
                    { label: "Email", field: "email" as keyof User, sortable: true },
                    { label: "Status", field: null, sortable: false },
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
                        borderRight: idx < 5 ? "1px solid #E5E7EB" : "none",
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
                {paginatedUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
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
                  paginatedUsers.map((user, idx) => (
                    <tr
                      key={user.id}
                      style={{
                        background: idx % 2 === 0 ? "#FFFFFF" : "#FAFAFA",
                        borderBottom: "1px solid #F3F4F6",
                        transition: "background 0.15s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F8FC")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = idx % 2 === 0 ? "#FFFFFF" : "#FAFAFA")}
                    >
                      {/* ID */}
                      <td style={{ padding: "12px 14px", fontSize: "12px", color: "#555555" }}>
                        {user.id}
                      </td>
                      {/* Username */}
                      <td style={{ padding: "12px 14px", fontSize: "12px", color: "#333333", fontWeight: 500 }}>
                        {user.username}
                      </td>
                      {/* Name */}
                      <td style={{ padding: "12px 14px", fontSize: "12px", color: "#555555", fontWeight: 500 }}>
                        {user.name}
                      </td>
                      {/* Email */}
                      <td style={{ padding: "12px 14px", fontSize: "12px", color: "#555555" }}>
                        {user.email}
                      </td>
                      {/* Status (Interactive Toggle Switch) */}
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                          {/* Outer Track */}
                          <div
                            onClick={() => handleToggleStatus(user.id)}
                            style={{
                              width: "32px",
                              height: "16px",
                              borderRadius: "8px",
                              background: user.status ? "#86EFAC" : "#E5E7EB",
                              position: "relative",
                              cursor: "pointer",
                              transition: "background 0.2s ease",
                            }}
                          >
                            {/* Inner Knob */}
                            <div
                              style={{
                                width: "12px",
                                height: "12px",
                                borderRadius: "50%",
                                background: "#FFFFFF",
                                position: "absolute",
                                top: "2px",
                                left: user.status ? "18px" : "2px",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                                transition: "left 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                              }}
                            />
                          </div>
                          {/* Label Text below */}
                          <span
                            style={{
                              fontSize: "9px",
                              fontWeight: 600,
                              marginTop: "3px",
                              color: user.status ? "#137333" : "#C70039",
                              userSelect: "none",
                            }}
                          >
                            {user.status ? "Enabled" : "Disabled"}
                          </span>
                        </div>
                      </td>
                      {/* Actions */}
                      <td style={{ padding: "12px 14px" }}>
                        <button
                          title="Edit User"
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
                          <Pencil size={14} />
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

      {/* Add New User Modal Dialog */}
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
              fontFamily: "'Segoe UI', Arial, sans-serif",
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
                Add New User
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
            <form onSubmit={handleAddUser} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Username Input */}
              <div style={formFieldStyle}>
                <label style={formLabelStyle}>Username *</label>
                <input
                  type="text"
                  required
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  style={formInputStyle}
                  placeholder="e.g. johndoe"
                />
              </div>

              {/* Full Name Input */}
              <div style={formFieldStyle}>
                <label style={formLabelStyle}>Full Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  style={formInputStyle}
                  placeholder="e.g. John Doe"
                />
              </div>

              {/* Email Input */}
              <div style={formFieldStyle}>
                <label style={formLabelStyle}>Email Address *</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  style={formInputStyle}
                  placeholder="e.g. john@example.com"
                />
              </div>

              {/* Status Selector */}
              <div style={formFieldStyle}>
                <label style={formLabelStyle}>Initial Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  style={formSelectStyle}
                >
                  <option value="Enabled">Enabled</option>
                  <option value="Disabled">Disabled</option>
                </select>
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
                  Save User
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
  fontFamily: "'Segoe UI', Arial, sans-serif",
};

const formSelectStyle: React.CSSProperties = {
  ...formInputStyle,
  cursor: "pointer",
  background: "#FFFFFF",
};
