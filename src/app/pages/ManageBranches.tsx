import React, { useState, useRef, useEffect } from "react";
import { ChevronRight, ChevronDown, MoreHorizontal, X, Edit2, Trash2, Eye } from "lucide-react";
import { Footer } from "../components/Footer";

// Mock Data
const MOCK_BRANCHES = [
  {
    id: 1,
    name: "Addanki",
    address1: "31547A B LEF nagar addanki",
    address2: "",
    city: "Bapatla",
    state: "Andhra Pradesh",
    postcode: "523201",
    country: "India",
    phone: "07075809540",
    emailDist: "",
    invoiceEmail: "",
    showClientPkg: false,
    showConfigPkg: false,
  },
  {
    id: 2,
    name: "Headquarters/All",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postcode: "",
    country: "",
    phone: "",
    emailDist: "",
    invoiceEmail: "",
    showClientPkg: false,
    showConfigPkg: false,
  },
  {
    id: 3,
    name: "Hyderabad",
    address1: "31547A B LEF nagar addanki",
    address2: "kedar nilayam 523201",
    city: "Bapatla",
    state: "Andhra Pradesh",
    postcode: "523201",
    country: "India",
    phone: "07075809540",
    emailDist: "sandeepjavvaji9848@gmail.com",
    invoiceEmail: "sandeepjavvaji9848@gmail.com",
    showClientPkg: true,
    showConfigPkg: true,
  },
];

const MOCK_USERS = [
  { id: 1, firstName: "Farooq", lastName: "Shaik" },
];

export function ManageBranches({ isDarkMode = false }: { isDarkMode?: boolean }) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [actionMenuOpen, setActionMenuOpen] = useState<number | null>(null);

  // Modals state
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<any>(null); // null means adding new

  const actionMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setActionMenuOpen(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleRow = (id: number) => {
    const next = new Set(expandedRows);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedRows(next);
  };

  const handleEdit = (branch: any) => {
    setEditingBranch(branch);
    setIsBranchModalOpen(true);
    setActionMenuOpen(null);
  };

  const handleAddNew = () => {
    setEditingBranch(null);
    setIsBranchModalOpen(true);
  };

  const handleShowUsers = () => {
    setIsAssignModalOpen(true);
    setActionMenuOpen(null);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
    setActionMenuOpen(null);
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: isDarkMode ? "#1A1C21" : "#F8F9FA",
        minHeight: 0,
      }}
    >
      <div style={{ flex: 1, padding: "24px", overflowY: "auto" }}>
        {/* Page Title */}
        <h1
          style={{
            fontSize: "20px",
            fontWeight: 500,
            color: isDarkMode ? "#DF2A57" : "#C70039",
            marginBottom: "24px",
            marginTop: 0,
          }}
        >
          Manage Branches
        </h1>

        {/* Main Card */}
        <div
          style={{
            background: isDarkMode ? "#252830" : "#FFFFFF",
            border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
            borderRadius: "4px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 24px",
              borderBottom: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
            }}
          >
            <h2 style={{ fontSize: "15px", fontWeight: 500, color: isDarkMode ? "#E5E7EB" : "#555555", margin: 0 }}>
              Branch List
            </h2>
            <button
              onClick={handleAddNew}
              style={{
                background: "#C70039",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "3px",
                padding: "8px 16px",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              + Add New Branch
            </button>
          </div>

          {/* Controls */}
          <div style={{ padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: isDarkMode ? "#9CA3AF" : "#777777" }}>
              <select
                style={{
                  border: isDarkMode ? "1px solid #444" : "1px solid #E5E7EB",
                  background: isDarkMode ? "#1A1C21" : "#FFFFFF",
                  color: isDarkMode ? "#E5E7EB" : "#333333",
                  padding: "6px",
                  borderRadius: "3px",
                  outline: "none",
                }}
              >
                <option>10</option>
              </select>
              <span>entries per page</span>
            </div>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Search..."
                style={{
                  border: isDarkMode ? "1px solid #444" : "1px solid #E5E7EB",
                  background: isDarkMode ? "#1A1C21" : "#F9FAFB",
                  color: isDarkMode ? "#E5E7EB" : "#333333",
                  padding: "8px 12px 8px 32px",
                  borderRadius: "4px",
                  fontSize: "13px",
                  width: "200px",
                  outline: "none",
                }}
              />
              <svg
                style={{ position: "absolute", left: "10px", top: "9px", color: "#9CA3AF" }}
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: isDarkMode ? "#2A2D34" : "#F3F4F6", color: isDarkMode ? "#E5E7EB" : "#555555", textAlign: "left" }}>
                  <th style={{ padding: "12px 24px", fontWeight: 600 }}>Branch Name</th>
                  <th style={{ padding: "12px 24px", fontWeight: 600 }}>Address1</th>
                  <th style={{ padding: "12px 24px", fontWeight: 600 }}>City</th>
                  <th style={{ padding: "12px 24px", fontWeight: 600 }}>State</th>
                  <th style={{ padding: "12px 24px", fontWeight: 600 }}>Postcode</th>
                  <th style={{ padding: "12px 24px", fontWeight: 600 }}>Country</th>
                  <th style={{ padding: "12px 24px", fontWeight: 600 }}>Phone Number</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_BRANCHES.map((branch) => {
                  const isExpanded = expandedRows.has(branch.id);
                  return (
                    <React.Fragment key={branch.id}>
                      <tr
                        style={{
                          borderBottom: isDarkMode ? "1px solid #333333" : "1px solid #F3F4F6",
                          color: isDarkMode ? "#9CA3AF" : "#777777",
                        }}
                      >
                        <td style={{ padding: "12px 24px", display: "flex", alignItems: "center", gap: "8px" }}>
                          <button
                            onClick={() => toggleRow(branch.id)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#C70039",
                            }}
                          >
                            <div style={{ border: "1px solid #C70039", borderRadius: "50%", display: "flex", padding: "2px" }}>
                              {isExpanded ? <ChevronDown size={12} strokeWidth={3} /> : <ChevronRight size={12} strokeWidth={3} />}
                            </div>
                          </button>
                          <span style={{ color: isDarkMode ? "#E5E7EB" : "#555555" }}>{branch.name}</span>
                        </td>
                        <td style={{ padding: "12px 24px" }}>{branch.address1}</td>
                        <td style={{ padding: "12px 24px" }}>{branch.city}</td>
                        <td style={{ padding: "12px 24px" }}>{branch.state}</td>
                        <td style={{ padding: "12px 24px" }}>{branch.postcode}</td>
                        <td style={{ padding: "12px 24px" }}>{branch.country}</td>
                        <td style={{ padding: "12px 24px" }}>{branch.phone}</td>
                      </tr>
                      {/* Expanded Row Content */}
                      {isExpanded && (
                        <tr style={{ background: isDarkMode ? "#1F2128" : "#FAFAFA", borderBottom: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB" }}>
                          <td colSpan={7} style={{ padding: "16px 24px" }}>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                              <span style={{ fontSize: "13px", fontWeight: 600, color: isDarkMode ? "#E5E7EB" : "#333333", marginBottom: "8px" }}>Actions</span>
                              <div style={{ position: "relative" }} ref={actionMenuOpen === branch.id ? actionMenuRef : null}>
                                <button
                                  onClick={() => setActionMenuOpen(actionMenuOpen === branch.id ? null : branch.id)}
                                  style={{
                                    background: isDarkMode ? "#333333" : "#E5E7EB",
                                    border: "none",
                                    borderRadius: "3px",
                                    padding: "4px 12px",
                                    cursor: "pointer",
                                    color: isDarkMode ? "#E5E7EB" : "#555555",
                                  }}
                                >
                                  <MoreHorizontal size={16} />
                                </button>
                                
                                {/* Action Menu Dropdown */}
                                {actionMenuOpen === branch.id && (
                                  <div
                                    style={{
                                      position: "absolute",
                                      top: "100%",
                                      left: 0,
                                      background: isDarkMode ? "#252830" : "#FFFFFF",
                                      border: isDarkMode ? "1px solid #444" : "1px solid #E5E7EB",
                                      borderRadius: "4px",
                                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                      zIndex: 10,
                                      minWidth: "160px",
                                      marginTop: "4px",
                                      padding: "4px 0",
                                    }}
                                  >
                                    <button
                                      onClick={handleShowUsers}
                                      style={getDropdownItemStyle(isDarkMode)}
                                      onMouseEnter={(e) => e.currentTarget.style.background = isDarkMode ? "#333" : "#F3F4F6"}
                                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                                    >
                                      <Eye size={14} /> Show Assigned Users
                                    </button>
                                    <button
                                      onClick={() => handleEdit(branch)}
                                      style={getDropdownItemStyle(isDarkMode)}
                                      onMouseEnter={(e) => e.currentTarget.style.background = isDarkMode ? "#333" : "#F3F4F6"}
                                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                                    >
                                      <Edit2 size={14} /> Edit
                                    </button>
                                    <button
                                      onClick={handleDeleteClick}
                                      style={getDropdownItemStyle(isDarkMode)}
                                      onMouseEnter={(e) => e.currentTarget.style.background = isDarkMode ? "#333" : "#F3F4F6"}
                                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                                    >
                                      <Trash2 size={14} /> Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer / Pagination */}
          <div style={{ padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", color: isDarkMode ? "#9CA3AF" : "#777777", fontSize: "13px" }}>
            <span>Showing 1 to 3 of 3 entries</span>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "not-allowed" }}>«</button>
              <button style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "not-allowed" }}>‹</button>
              <button style={{ background: "#C70039", color: "#FFF", border: "none", borderRadius: "3px", width: "24px", height: "24px", cursor: "pointer" }}>1</button>
              <button style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "not-allowed" }}>›</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* --- MODALS --- */}
      
      {/* Branch Modal (Add / Edit) */}
      {isBranchModalOpen && (
        <div style={getModalOverlayStyle()}>
          <div style={getModalStyle(isDarkMode)}>
            <div style={getModalHeaderStyle()}>
              <span style={{ fontSize: "16px", fontWeight: 500 }}>{editingBranch ? "Editing Branch" : "Add New Branch"}</span>
              <button onClick={() => setIsBranchModalOpen(false)} style={{ background: "none", border: "none", color: "#FFF", cursor: "pointer", display: "flex" }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ maxWidth: "400px" }}>
                <InputField label="Branch Name" value={editingBranch?.name || ""} isDarkMode={isDarkMode} />
              </div>
              
              <div style={{ display: "flex", gap: "16px" }}>
                <InputField label="Address 1" value={editingBranch?.address1 || ""} isDarkMode={isDarkMode} />
                <InputField label="Address 2" value={editingBranch?.address2 || ""} isDarkMode={isDarkMode} />
                <InputField label="City" value={editingBranch?.city || ""} isDarkMode={isDarkMode} />
              </div>

              <div style={{ display: "flex", gap: "16px" }}>
                <InputField label="State" value={editingBranch?.state || ""} isDarkMode={isDarkMode} />
                <InputField label="Postcode" value={editingBranch?.postcode || ""} isDarkMode={isDarkMode} />
                <InputField label="Country" value={editingBranch?.country || ""} isDarkMode={isDarkMode} />
              </div>

              <div style={{ maxWidth: "400px" }}>
                <InputField label="Phone Number" value={editingBranch?.phone || ""} isDarkMode={isDarkMode} />
              </div>

              <div style={{ display: "flex", gap: "16px" }}>
                <InputField label="Email Distribution" value={editingBranch?.emailDist || ""} isDarkMode={isDarkMode} />
                <InputField label="Branch Invoice Email" value={editingBranch?.invoiceEmail || ""} isDarkMode={isDarkMode} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "8px" }}>
                <CheckboxField label="Show Client Packages" checked={editingBranch?.showClientPkg || false} isDarkMode={isDarkMode} />
                <CheckboxField label="Show Config Group Packages" checked={editingBranch?.showConfigPkg || false} isDarkMode={isDarkMode} />
              </div>
            </div>

            <div style={{ padding: "16px 24px", display: "flex", justifyContent: "center", gap: "12px" }}>
              <button style={{ background: "#C70039", color: "#FFF", border: "none", borderRadius: "3px", padding: "8px 24px", fontSize: "14px", cursor: "pointer" }}>Save</button>
              <button onClick={() => setIsBranchModalOpen(false)} style={{ background: "#4A148C", color: "#FFF", border: "none", borderRadius: "3px", padding: "8px 24px", fontSize: "14px", cursor: "pointer" }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Assigned Users Modal */}
      {isAssignModalOpen && (
        <div style={getModalOverlayStyle()}>
          <div style={{ ...getModalStyle(isDarkMode), maxWidth: "600px" }}>
            <div style={getModalHeaderStyle()}>
              <span style={{ fontSize: "16px", fontWeight: 500 }}>Assigned Users</span>
              <button onClick={() => setIsAssignModalOpen(false)} style={{ background: "none", border: "none", color: "#FFF", cursor: "pointer", display: "flex" }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", fontSize: "13px", color: isDarkMode ? "#9CA3AF" : "#777" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <select style={{ border: "1px solid #E5E7EB", padding: "4px 8px", borderRadius: "3px", outline: "none", background: isDarkMode ? "#252830" : "#FFF", color: isDarkMode ? "#E5E7EB" : "#333" }}>
                    <option>10</option>
                  </select>
                  <span>entries per page</span>
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    placeholder="Search..."
                    style={{
                      border: "1px solid #E5E7EB",
                      padding: "6px 12px 6px 30px",
                      borderRadius: "3px",
                      outline: "none",
                      background: isDarkMode ? "#252830" : "#F9FAFB",
                      color: isDarkMode ? "#E5E7EB" : "#333",
                      fontSize: "13px"
                    }}
                  />
                  <svg style={{ position: "absolute", left: "8px", top: "7px", color: "#9CA3AF" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: isDarkMode ? "#2A2D34" : "#F8F9FA", color: isDarkMode ? "#E5E7EB" : "#555" }}>
                    <th style={{ padding: "12px", width: "40px" }}><input type="checkbox" /></th>
                    <th style={{ padding: "12px", textAlign: "left", fontWeight: 600 }}>First Name</th>
                    <th style={{ padding: "12px", textAlign: "left", fontWeight: 600 }}>Last Name</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_USERS.map((user) => (
                    <tr key={user.id} style={{ borderBottom: "1px solid #E5E7EB", color: isDarkMode ? "#9CA3AF" : "#777" }}>
                      <td style={{ padding: "12px" }}><input type="checkbox" /></td>
                      <td style={{ padding: "12px" }}>{user.firstName}</td>
                      <td style={{ padding: "12px" }}>{user.lastName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px", fontSize: "13px", color: isDarkMode ? "#9CA3AF" : "#777" }}>
                <span>Showing 1 to 1 of 1 entry</span>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <button style={{ background: "none", border: "none", color: "#9CA3AF" }}>‹</button>
                  <button style={{ background: "#C70039", color: "#FFF", border: "none", borderRadius: "50%", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}>1</button>
                  <button style={{ background: "none", border: "none", color: "#9CA3AF" }}>›</button>
                </div>
              </div>
            </div>

            <div style={{ padding: "16px 24px", display: "flex", justifyContent: "center", gap: "12px", borderTop: isDarkMode ? "1px solid #333" : "none" }}>
              <button onClick={() => setIsAssignModalOpen(false)} style={{ background: "#4A148C", color: "#FFF", border: "none", borderRadius: "3px", padding: "8px 24px", fontSize: "14px", cursor: "pointer" }}>Close</button>
              <button style={{ background: "#C70039", color: "#FFF", border: "none", borderRadius: "3px", padding: "8px 24px", fontSize: "14px", cursor: "pointer" }}>Save changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div style={getModalOverlayStyle()}>
          <div
            style={{
              background: isDarkMode ? "#252830" : "#FFFFFF",
              borderRadius: "4px",
              width: "100%",
              maxWidth: "480px",
              padding: "40px 24px 24px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              textAlign: "center",
              animation: "fadeIn 0.2s ease-out",
            }}
          >
            {/* Yellow Warning Icon */}
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                border: "4px solid #F8BB86",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                  color: "#F8BB86",
                }}
              >
                <div style={{ width: "6px", height: "24px", background: "#F8BB86", borderRadius: "3px" }} />
                <div style={{ width: "6px", height: "6px", background: "#F8BB86", borderRadius: "50%" }} />
              </div>
            </div>

            <h2
              style={{
                fontSize: "28px",
                fontWeight: 500,
                color: isDarkMode ? "#E5E7EB" : "#545454",
                margin: "0 0 16px 0",
              }}
            >
              Are you sure?
            </h2>

            <p
              style={{
                fontSize: "16px",
                color: isDarkMode ? "#9CA3AF" : "#545454",
                margin: "0 0 32px 0",
              }}
            >
              You won't be able to revert this!
            </p>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                style={{
                  background: "#C70039",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "4px",
                  padding: "10px 24px",
                  fontSize: "15px",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Yes, delete it!
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                style={{
                  background: "#4A148C",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "4px",
                  padding: "10px 24px",
                  fontSize: "15px",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Subcomponents & Styles

function InputField({ label, value, isDarkMode }: { label: string, value: string, isDarkMode: boolean }) {
  return (
    <div style={{ flex: 1, position: "relative", border: isDarkMode ? "1px solid #444" : "1px solid #E5E7EB", borderRadius: "3px", padding: "8px 12px", minHeight: "56px", display: "flex", flexDirection: "column", justifyContent: "center", boxSizing: "border-box" }}>
      <label style={{ fontSize: "12px", color: isDarkMode ? "#9CA3AF" : "#9CA3AF", marginBottom: "2px", display: value ? "block" : "none" }}>{label}</label>
      <input type="text" readOnly value={value} placeholder={value ? "" : label} style={{ background: "transparent", border: "none", outline: "none", fontSize: "14px", color: isDarkMode ? "#E5E7EB" : "#333", width: "100%", padding: 0 }} />
    </div>
  );
}

function CheckboxField({ label, checked, isDarkMode }: { label: string, checked: boolean, isDarkMode: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
      <div style={{ width: "18px", height: "18px", borderRadius: "3px", border: checked ? "none" : "1px solid #D1D5DB", background: checked ? "#C70039" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {checked && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
      </div>
      <span style={{ fontSize: "14px", color: isDarkMode ? "#9CA3AF" : "#555" }}>{label}</span>
    </div>
  );
}

const getDropdownItemStyle = (isDarkMode: boolean): React.CSSProperties => ({
  background: "none",
  border: "none",
  width: "100%",
  textAlign: "left",
  padding: "8px 16px",
  fontSize: "13px",
  color: isDarkMode ? "#E5E7EB" : "#555555",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

const getModalOverlayStyle = (): React.CSSProperties => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.5)",
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const getModalStyle = (isDarkMode: boolean): React.CSSProperties => ({
  background: isDarkMode ? "#252830" : "#FFFFFF",
  borderRadius: "4px",
  width: "100%",
  maxWidth: "900px",
  overflow: "hidden",
  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
});

const getModalHeaderStyle = (): React.CSSProperties => ({
  background: "#C70039",
  color: "#FFFFFF",
  padding: "16px 24px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});
