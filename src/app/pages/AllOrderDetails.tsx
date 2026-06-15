import { useState } from "react";
import { Eye, Upload } from "lucide-react";
import { ORDERS, type SearchStatus, type OrderRecord, VERIFICATION_TYPES } from "../data/mockData";
import { Footer } from "../components/Footer";

interface Filters {
  searchId: string;
  reportId: string;
  status: string;
  searchType: string;
  firstName: string;
  lastName: string;
  ssn: string;
  dob: string;
  county: string;
  state: string;
  orderReference: string;
  orderDateFrom: string;
  orderDateTo: string;
  sortOrder: string;
  perPage: string;
  age: string;
  applicantEmail: string;
  criminalRecordsFound: string;
  orderedBy: string;
}

const EMPTY_FILTERS: Filters = {
  searchId: "", reportId: "", status: "", searchType: "",
  firstName: "", lastName: "", ssn: "", dob: "",
  county: "", state: "", orderReference: "",
  orderDateFrom: "", orderDateTo: "",
  sortOrder: "Status", perPage: "20",
  age: "", applicantEmail: "", criminalRecordsFound: "", orderedBy: "",
};

const FIELD_CONTAINER_STYLE: React.CSSProperties = {
  background: "#FFFFFF",
  border: "1px solid #F3F4F6", // very faint border matching screenshot
  borderRadius: "2px",
  padding: "6px 12px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  height: "56px",
  boxSizing: "border-box",
  boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
};

const FIELD_LABEL_STYLE: React.CSSProperties = {
  fontSize: "12px",
  color: "#9CA3AF",
  fontWeight: 400,
  lineHeight: "1.2",
  textTransform: "none",
  marginBottom: "2px",
};

const getInputStyle = (isDarkMode: boolean): React.CSSProperties => ({
  width: "100%",
  border: "none",
  outline: "none",
  background: "transparent",
  fontSize: "14px",
  color: isDarkMode ? "#E5E7EB" : "#4B5563",
  padding: "0",
  height: "22px",
});

const getSelectStyle = (isDarkMode: boolean): React.CSSProperties => ({
  width: "100%",
  border: "none",
  outline: "none",
  background: "transparent",
  fontSize: "14px",
  color: isDarkMode ? "#E5E7EB" : "#4B5563",
  padding: "0",
  height: "22px",
  appearance: "none",
  backgroundImage: isDarkMode 
    ? `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 24 24' fill='none' stroke='%23E5E7EB' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`
    : `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 24 24' fill='none' stroke='%23888888' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 0px center",
  paddingRight: "15px",
  cursor: "pointer",
});

function Field({ label, children, isDarkMode }: { label: string; children: React.ReactNode; isDarkMode?: boolean }) {
  return (
    <div style={{
      ...FIELD_CONTAINER_STYLE,
      background: isDarkMode ? "#1A1C21" : "#FFFFFF",
      border: isDarkMode ? "1px solid #333333" : "1px solid #F3F4F6",
    }}>
      <label style={{ ...FIELD_LABEL_STYLE, color: isDarkMode ? "#9CA3AF" : "#9CA3AF" }}>{label}</label>
      <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
        {children}
      </div>
    </div>
  );
}

const BADGE_STYLES: Record<SearchStatus, { bg: string; color: string; border: string }> = {
  CANCELLED: { bg: "#EBF5FF", color: "#0066CC", border: "#C4E1FF" },
  CLOSED: { bg: "#FDE8E8", color: "#C81E1E", border: "#F8B4B4" },
  PENDING: { bg: "#FEF08A", color: "#854D0E", border: "#FDE047" },
  "IN PROGRESS": { bg: "#F3F4F6", color: "#374151", border: "#E5E7EB" },
};

export function AllOrderDetails({ isDarkMode = false }: { isDarkMode?: boolean }) {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [applied, setApplied] = useState<Filters>(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [searched, setSearched] = useState(true);
  const [showAlert, setShowAlert] = useState(true);
  const [expandedSearchId, setExpandedSearchId] = useState<string | null>(null);

  function set(key: keyof Filters, val: string) {
    setFilters((prev) => ({ ...prev, [key]: val }));
  }

  function handleSearch() {
    setApplied(filters);
    setPage(1);
    setSearched(true);
    setShowAlert(true);
  }

  function handleReset() {
    setFilters(EMPTY_FILTERS);
    setApplied(EMPTY_FILTERS);
    setPage(1);
    setSearched(true);
    setShowAlert(true);
  }

  const perPage = parseInt(applied.perPage || "20");

  const filtered = ORDERS.filter((o) => {
    if (applied.searchId && !o.searchId.toLowerCase().includes(applied.searchId.toLowerCase())) return false;
    if (applied.reportId && !o.reportId.toLowerCase().includes(applied.reportId.toLowerCase())) return false;
    if (applied.status && o.status !== applied.status) return false;
    if (applied.searchType && o.verificationType !== applied.searchType) return false;
    if (applied.firstName && !o.applicantName.split(" ")[0].toLowerCase().includes(applied.firstName.toLowerCase())) return false;
    if (applied.lastName && !o.applicantName.split(" ").slice(-1)[0].toLowerCase().includes(applied.lastName.toLowerCase())) return false;
    if (applied.state && o.state && !o.state.toLowerCase().includes(applied.state.toLowerCase())) return false;
    if (applied.county && o.county && !o.county.toLowerCase().includes(applied.county.toLowerCase())) return false;
    if (applied.orderedBy && !o.orderedBy.toLowerCase().includes(applied.orderedBy.toLowerCase())) return false;
    if (applied.orderDateFrom && o.orderDate < applied.orderDateFrom) return false;
    if (applied.orderDateTo && o.orderDate > applied.orderDateTo) return false;

    // New fields filtering:
    if (applied.applicantEmail && o.applicantEmail && !o.applicantEmail.toLowerCase().includes(applied.applicantEmail.toLowerCase())) return false;
    if (applied.criminalRecordsFound) {
      const hasRecords = o.criminalRecordsFound && o.criminalRecordsFound !== "None";
      if (applied.criminalRecordsFound === "yes" && !hasRecords) return false;
      if (applied.criminalRecordsFound === "no" && hasRecords) return false;
    }
    if (applied.age) {
      if (!o.dob) return false;
      const birthYear = new Date(o.dob).getFullYear();
      const age = new Date().getFullYear() - birthYear;
      if (applied.age === "Under 25" && age >= 25) return false;
      if (applied.age === "25 - 40" && (age < 25 || age > 40)) return false;
      if (applied.age === "Over 40" && age <= 40) return false;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (applied.sortOrder === "Status") {
      return a.status.localeCompare(b.status);
    } else if (applied.sortOrder === "Search ID") {
      return b.searchId.localeCompare(a.searchId);
    } else if (applied.sortOrder === "Order Date") {
      return b.orderDate.localeCompare(a.orderDate);
    }
    return b.searchId.localeCompare(a.searchId);
  });

  const totalPages = Math.ceil(sorted.length / perPage);
  const paginated = sorted.slice((page - 1) * perPage, page * perPage);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,

      }}
    >
      <div
        style={{
          flex: 1,
          padding: "16px 20px",
          background: isDarkMode ? "#252830" : "#F5F5F5",
          overflowY: "auto",
        }}
      >
        {/* Page Title */}
        <h1
          style={{
            fontSize: "20px",
            fontWeight: 500,
            color: isDarkMode ? "#DF2A57" : "rgb(199, 0, 57)",
            marginBottom: "14px",

          }}
        >
          All Order Details
        </h1>

        {/* ── Filters Grid ───────────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: "10px",
            marginBottom: "16px",
          }}
        >
          {/* Row 1 */}
          <Field label="Search ID" isDarkMode={isDarkMode}>
            <input
              style={getInputStyle(isDarkMode)}
              value={filters.searchId}
              onChange={(e) => set("searchId", e.target.value)}
            />
          </Field>
          <Field label="Report ID" isDarkMode={isDarkMode}>
            <input
              style={getInputStyle(isDarkMode)}
              value={filters.reportId}
              onChange={(e) => set("reportId", e.target.value)}
            />
          </Field>
          <Field label="Status" isDarkMode={isDarkMode}>
            <select
              style={getSelectStyle(isDarkMode)}
              value={filters.status}
              onChange={(e) => set("status", e.target.value)}
            >
              <option value="">Any Status</option>
              <option value="CLOSED">CLOSED</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="PENDING">PENDING</option>
              <option value="IN PROGRESS">IN PROGRESS</option>
            </select>
          </Field>
          <Field label="Search Type / Name" isDarkMode={isDarkMode}>
            <select
              style={getSelectStyle(isDarkMode)}
              value={filters.searchType}
              onChange={(e) => set("searchType", e.target.value)}
            >
              <option value="">All Searches</option>
              {VERIFICATION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
          <Field label="First Name" isDarkMode={isDarkMode}>
            <input
              style={getInputStyle(isDarkMode)}
              value={filters.firstName}
              onChange={(e) => set("firstName", e.target.value)}
            />
          </Field>
          <Field label="Last Name" isDarkMode={isDarkMode}>
            <input
              style={getInputStyle(isDarkMode)}
              value={filters.lastName}
              onChange={(e) => set("lastName", e.target.value)}
            />
          </Field>

          {/* Row 2 */}
          <Field label="SSN" isDarkMode={isDarkMode}>
            <input
              style={getInputStyle(isDarkMode)}
              value={filters.ssn}
              onChange={(e) => set("ssn", e.target.value)}
            />
          </Field>
          <Field label="DOB" isDarkMode={isDarkMode}>
            <input
              style={getInputStyle(isDarkMode)}
              value={filters.dob}
              onChange={(e) => set("dob", e.target.value)}
            />
          </Field>
          <Field label="County" isDarkMode={isDarkMode}>
            <input
              style={getInputStyle(isDarkMode)}
              value={filters.county}
              onChange={(e) => set("county", e.target.value)}
            />
          </Field>
          <Field label="State" isDarkMode={isDarkMode}>
            <input
              style={getInputStyle(isDarkMode)}
              value={filters.state}
              onChange={(e) => set("state", e.target.value)}
            />
          </Field>
          <Field label="Order Reference" isDarkMode={isDarkMode}>
            <input
              style={getInputStyle(isDarkMode)}
              value={filters.orderReference}
              onChange={(e) => set("orderReference", e.target.value)}
            />
          </Field>
          <Field label="Order Date From" isDarkMode={isDarkMode}>
            <input
              style={getInputStyle(isDarkMode)}
              value={filters.orderDateFrom}
              onChange={(e) => set("orderDateFrom", e.target.value)}
            />
          </Field>

          {/* Row 3 */}
          <Field label="Order Date To" isDarkMode={isDarkMode}>
            <input
              style={getInputStyle(isDarkMode)}
              value={filters.orderDateTo}
              onChange={(e) => set("orderDateTo", e.target.value)}
            />
          </Field>
          <Field label="Sort Order" isDarkMode={isDarkMode}>
            <select
              style={getSelectStyle(isDarkMode)}
              value={filters.sortOrder}
              onChange={(e) => set("sortOrder", e.target.value)}
            >
              <option value="Status">Status</option>
              <option value="Search ID">Search ID</option>
              <option value="Order Date">Order Date</option>
            </select>
          </Field>
          <Field label="Searches per page" isDarkMode={isDarkMode}>
            <select
              style={getSelectStyle(isDarkMode)}
              value={filters.perPage}
              onChange={(e) => set("perPage", e.target.value)}
            >
              <option value="20">20 Searches</option>
              <option value="10">10 Searches</option>
              <option value="50">50 Searches</option>
              <option value="100">100 Searches</option>
            </select>
          </Field>
          <Field label="Age" isDarkMode={isDarkMode}>
            <select
              style={getSelectStyle(isDarkMode)}
              value={filters.age}
              onChange={(e) => set("age", e.target.value)}
            >
              <option value="">All</option>
              <option value="Under 25">Under 25</option>
              <option value="25 - 40">25 - 40</option>
              <option value="Over 40">Over 40</option>
            </select>
          </Field>
          <Field label="Applicant Email" isDarkMode={isDarkMode}>
            <input
              style={getInputStyle(isDarkMode)}
              value={filters.applicantEmail}
              onChange={(e) => set("applicantEmail", e.target.value)}
            />
          </Field>
          <Field label="Criminal Records Found" isDarkMode={isDarkMode}>
            <select
              style={getSelectStyle(isDarkMode)}
              value={filters.criminalRecordsFound}
              onChange={(e) => set("criminalRecordsFound", e.target.value)}
            >
              <option value="">All</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </Field>

          {/* Row 4 */}
          <Field label="Ordered By" isDarkMode={isDarkMode}>
            <select
              style={getSelectStyle(isDarkMode)}
              value={filters.orderedBy}
              onChange={(e) => set("orderedBy", e.target.value)}
            >
              <option value="">All Users</option>
              <option value="Suresh Ramakoti">Suresh Ramakoti</option>
              <option value="Admin User">Admin User</option>
            </select>
          </Field>
        </div>

        {/* ── Buttons ────────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <button
            onClick={handleSearch}
            style={{
              background: "#C70039",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "4px",
              padding: "10px 24px",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",

            }}
          >
            Search
          </button>
          <button
            onClick={handleReset}
            style={{
              background: "#312E81",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "4px",
              padding: "10px 24px",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",

            }}
          >
            Reset
          </button>
        </div>

        {/* ── Green success alert banner ─────────────────────────────── */}
        {searched && showAlert && (
          <div
            style={{
              background: "#E6F0CD", // Olive-ish light green from screenshot
              border: "1px solid #D4E0B6",
              borderRadius: "4px",
              padding: "10px 16px",
              color: "#5B7A38",
              fontSize: "13px",
              fontWeight: 500,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",

            }}
          >
            <div style={{ flex: 1, textAlign: "center" }}>
              {sorted.length} Records Found. Page {page} of {Math.max(1, totalPages)}
            </div>
            <button
              onClick={() => setShowAlert(false)}
              style={{
                background: "none",
                border: "none",
                color: "#2E7D32",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "bold",
                padding: "0",
                display: "flex",
                alignItems: "center",
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* ── Search Results Card ─────────────────────────────────────── */}
        {searched && (
          <div
            style={{
              background: isDarkMode ? "#1A1C21" : "#FFFFFF",
              border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
              borderRadius: "4px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              marginBottom: "20px",
            }}
          >
            {/* Card Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 16px",
                background: isDarkMode ? "#252830" : "#F5F5F5",
                borderBottom: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
                borderTopLeftRadius: "4px",
                borderTopRightRadius: "4px",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: isDarkMode ? "#F9FAFB" : "#6B7280",

                }}
              >
                Search Results
              </span>

              {/* Page select dropdown */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "13px", color: "#6C7589", }}>Page:</span>
                <select
                  value={page}
                  onChange={(e) => setPage(parseInt(e.target.value))}
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #D1D5DB",
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontWeight: 500,
                    padding: "2px 20px 2px 8px",
                    color: "#333333",
                    outline: "none",
                    cursor: "pointer",

                    appearance: "none",
                    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 24 24' fill='none' stroke='%23555555' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 6px center",
                  }}
                >
                  {Array.from({ length: Math.max(1, totalPages) }, (_, i) => i + 1).map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* List Body */}
            <div>
              {paginated.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    fontSize: "12px",
                    color: "#6C7589",
                  }}
                >
                  No records match your filters.
                </div>
              ) : (
                paginated.map((o) => (
                  <div key={o.searchId} style={{ display: "flex", flexDirection: "column" }}>
                    <div
                      onClick={() => setExpandedSearchId(expandedSearchId === o.searchId ? null : o.searchId)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 16px",
                        borderBottom: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
                        background: isDarkMode ? "#1A1C21" : "#FFFFFF",
                        cursor: "pointer",
                      }}
                    >
                      {/* Left: Search ID */}
                      <div style={{ fontSize: "13px", width: "160px" }}>
                        <span style={{ color: "#9CA3AF", fontWeight: 400 }}>Search ID: </span>
                        <span style={{ color: isDarkMode ? "#E5E7EB" : "#4B5563", fontWeight: 600 }}>{o.searchId}</span>
                      </div>

                      {/* Center: Applicant name + Verification type */}
                      <div style={{ fontSize: "13px", flex: 1, textAlign: "left", paddingLeft: "20px" }}>
                        <span style={{ color: isDarkMode ? "#E5E7EB" : "#4B5563", fontWeight: 600 }}>{o.applicantName}</span>
                        <span style={{ color: "#9CA3AF" }}> : {o.verificationType}</span>
                      </div>

                      {/* Right: Status badge */}
                      <div>
                        <StatusBadge status={o.status} />
                      </div>
                    </div>
                    {expandedSearchId === o.searchId && (
                      <div style={{ padding: "16px 20px", background: "#FFFFFF", borderBottom: "1px solid #E5E7EB", fontSize: "12px" }}>
                        {/* Row 1: Order Details */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px", background: "#F5F5F5", padding: "10px", marginBottom: "16px", color: "#555" }}>
                          <div><strong style={{ fontWeight: 600 }}>Order Date:</strong> {o.orderDate}</div>
                          <div><strong style={{ fontWeight: 600 }}>DOB:</strong> {o.dob || "05/17/1996"}</div>
                          <div><strong style={{ fontWeight: 600 }}>SSN:</strong> {o.ssn || "111-11-1111"}</div>
                          <div><strong style={{ fontWeight: 600 }}>Location:</strong> {o.county ? `${o.county}, ` : ""}{o.state || "El Paso, TX 79999"}</div>
                        </div>

                        {/* Row 2: Links */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px", marginBottom: "12px" }}>
                          <div style={{ color: "#555" }}>Order by: {o.orderedBy}</div>
                          <div style={{ color: "rgb(199, 0, 57)", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                            <Eye size={13} /> View Report #{o.reportId}
                          </div>
                          <div style={{ color: "rgb(199, 0, 57)", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                            <Eye size={13} /> View Search #{o.searchId}
                          </div>
                          <div style={{ color: "rgb(199, 0, 57)", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                            <Eye size={13} /> View Pricing
                          </div>
                        </div>

                        {/* Row 3: Links */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px", marginBottom: "24px" }}>
                          <div style={{ color: "rgb(199, 0, 57)", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                            <Upload size={13} /> Upload Document
                          </div>
                          <div style={{ color: "rgb(199, 0, 57)", cursor: "pointer" }}>+ Add Search to this Report</div>
                          <div style={{ gridColumn: "3 / 5", color: "rgb(199, 0, 57)", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                            <Eye size={13} /> View Employment Verification Info
                          </div>
                        </div>

                        {/* Files Uploaded Section */}
                        <div style={{ background: "#D9D9D9", padding: "6px 12px", fontWeight: 600, color: "#555", marginBottom: "12px" }}>
                          FILES UPLOADED
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px", paddingLeft: "12px", color: "#555" }}>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span>#1 Authorization_Disclosure_Form_{o.applicantName.replace(" ", "_")}_07-15-2025.pdf</span>
                            <span style={{ color: "#888" }}>Type: PDF | E-Signed on: 2025-07-15 13:54:18 - Online (Order /w Invite)</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span>#2 Authorization_Disclosure_Form_Suresh_Kumar_01-18-2024.pdf</span>
                            <span style={{ color: "#888" }}>Type: PDF | E-Signed on: 2024-01-18 14:12:51 - Online (Order /w Invite Process)</span>
                          </div>
                        </div>

                        {/* Upload File Section */}
                        <div style={{ background: "#D9D9D9", padding: "6px 12px", fontWeight: 600, color: "#555", marginBottom: "12px" }}>
                          SELECT A FILE TO UPLOAD
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingLeft: "12px" }}>
                          <div>
                            <input type="file" id={`upload-${o.searchId}`} style={{ display: "none" }} />
                            <label htmlFor={`upload-${o.searchId}`} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "12px" }}>
                              <div style={{ padding: "6px 16px", border: "1px solid #D1D5DB", background: "#FFFFFF", borderRadius: "3px", color: "#333" }}>Choose File</div>
                              <span style={{ color: "#888" }}>No file chosen</span>
                            </label>
                            <div style={{ fontSize: "11px", color: "#888", marginTop: "8px" }}>Allowed File Extensions: jpg/jpeg, png, doc/docx, pdf</div>
                          </div>
                          <div>
                            <button style={{ background: "rgb(199, 0, 57)", color: "white", border: "none", padding: "8px 16px", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontWeight: 500 }}>
                              Upload File <Upload size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

function StatusBadge({ status }: { status: SearchStatus }) {
  const s = BADGE_STYLES[status] || { bg: "#F3F4F6", color: "#374151", border: "#E5E7EB" };
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: "3px",
        fontSize: "10px",
        fontWeight: 600,
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        whiteSpace: "nowrap",

        letterSpacing: "0.02em",
      }}
    >
      {status}
    </span>
  );
}
