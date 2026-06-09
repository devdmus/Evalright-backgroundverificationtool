import { useState } from "react";
import { X } from "lucide-react";
import {
  ORDERS,
  STATUS_STYLES,
  VERIFICATION_TYPES,
  US_STATES,
  type SearchStatus,
} from "../data/mockData";
import { Footer } from "../components/Footer";

const SELECT_ARROW = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236C7589' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") no-repeat right 8px center`;

const inputStyle: React.CSSProperties = {
  border: "1px solid #D0D5DD",
  borderRadius: "4px",
  height: "32px",
  padding: "0 10px",
  fontSize: "12px",
  color: "#333",
  background: "#fff",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  padding: "0 28px 0 10px",
  appearance: "none" as const,
  background: `#fff ${SELECT_ARROW}`,
  cursor: "pointer",
};

const labelStyle: React.CSSProperties = {
  fontSize: "11px",
  color: "#555",
  fontWeight: 500,
  marginBottom: "4px",
  display: "block",
  whiteSpace: "nowrap",
};

const cellStyle: React.CSSProperties = {
  padding: "8px 10px",
  borderRight: "1px solid #E0E0E0",
  borderBottom: "1px solid #E0E0E0",
  minWidth: 0,
};

const SEARCHES_PER_PAGE_OPTIONS = [10, 20, 50, 100];

export function ReportsOrders() {
  // Search fields
  const [searchId, setSearchId] = useState("");
  const [reportId, setReportId] = useState("");
  const [status, setStatus] = useState("");
  const [searchType, setSearchType] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [ssn, setSsn] = useState("");
  const [dob, setDob] = useState("");
  const [county, setCounty] = useState("");
  const [state, setState] = useState("");
  const [orderReference, setOrderReference] = useState("");
  const [orderDateFrom, setOrderDateFrom] = useState("");
  const [orderDateTo, setOrderDateTo] = useState("");
  const [sortOrder, setSortOrder] = useState("Status");
  const [searchesPerPage, setSearchesPerPage] = useState(20);
  const [age, setAge] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [criminalRecords, setCriminalRecords] = useState("");
  const [orderedBy, setOrderedBy] = useState("");

  // Results state
  const [searched, setSearched] = useState(true);
  const [showBanner, setShowBanner] = useState(true);
  const [page, setPage] = useState(1);

  // Filtered results
  const filtered = ORDERS.filter((o) => {
    const matchId = !searchId || o.searchId.toLowerCase().includes(searchId.toLowerCase());
    const matchReportId = !reportId || o.reportId.toLowerCase().includes(reportId.toLowerCase());
    const matchStatus = !status || o.status === status;
    const matchType = !searchType || o.verificationType === searchType;
    const matchFirst = !firstName || o.firstName.toLowerCase().includes(firstName.toLowerCase());
    const matchLast = !lastName || o.lastName.toLowerCase().includes(lastName.toLowerCase());
    const matchSsn = !ssn || (o.ssn || "").includes(ssn);
    const matchCounty = !county || (o.county || "").toLowerCase().includes(county.toLowerCase());
    const matchState = !state || o.state === state;
    const matchEmail = !applicantEmail || (o.applicantEmail || "").toLowerCase().includes(applicantEmail.toLowerCase());
    const matchBy = !orderedBy || o.orderedBy === orderedBy;
    return matchId && matchReportId && matchStatus && matchType && matchFirst && matchLast && matchSsn && matchCounty && matchState && matchEmail && matchBy;
  });

  const totalResults = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / searchesPerPage));
  const paginated = filtered.slice((page - 1) * searchesPerPage, page * searchesPerPage);

  function handleSearch() {
    setPage(1);
    setSearched(true);
    setShowBanner(true);
  }

  function handleReset() {
    setSearchId(""); setReportId(""); setStatus(""); setSearchType("");
    setFirstName(""); setLastName(""); setSsn(""); setDob("");
    setCounty(""); setState(""); setOrderReference(""); setOrderDateFrom("");
    setOrderDateTo(""); setSortOrder("Status"); setSearchesPerPage(20);
    setAge(""); setApplicantEmail(""); setCriminalRecords(""); setOrderedBy("");
    setPage(1); setSearched(false); setShowBanner(false);
  }

  const uniqueOrderedBy = Array.from(new Set(ORDERS.map((o) => o.orderedBy)));

  return (
    <div
      className="flex-1 flex flex-col min-h-0"
      style={{ fontFamily: "'Wix Madefor Display', sans-serif" }}
    >
      <div className="flex-1 overflow-auto p-5" style={{ background: "#F6F6F6" }}>
        {/* Page Title */}
        <h1
          style={{
            fontSize: "20px",
            fontWeight: 500,
            color: "rgb(199, 0, 57)",
            marginBottom: "0px",
            fontFamily: "\"Segoe UI\", Arial, sans-serif",
          }}
        >
          All Order Details
        </h1>

        {/* Search Form – bordered grid */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #D0D5DD",
            borderRadius: "4px",
            marginBottom: "14px",
            overflow: "hidden",
          }}
        >
          {/* Row 1 */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", borderTop: "1px solid #E0E0E0" }}>
            <div style={cellStyle}>
              <label style={labelStyle}>Search ID</label>
              <input style={inputStyle} value={searchId} onChange={(e) => setSearchId(e.target.value)} placeholder="" />
            </div>
            <div style={cellStyle}>
              <label style={labelStyle}>Report ID</label>
              <input style={inputStyle} value={reportId} onChange={(e) => setReportId(e.target.value)} placeholder="" />
            </div>
            <div style={cellStyle}>
              <label style={labelStyle}>Status</label>
              <select style={selectStyle} value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">Any Status</option>
                <option value="CLOSED">CLOSED</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="PENDING">PENDING</option>
                <option value="IN PROGRESS">IN PROGRESS</option>
              </select>
            </div>
            <div style={cellStyle}>
              <label style={labelStyle}>Search Type / Name</label>
              <select style={selectStyle} value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                <option value="">All Searches</option>
                {VERIFICATION_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div style={cellStyle}>
              <label style={labelStyle}>First Name</label>
              <input style={inputStyle} value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="" />
            </div>
            <div style={{ ...cellStyle, borderRight: "none" }}>
              <label style={labelStyle}>Last Name</label>
              <input style={inputStyle} value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="" />
            </div>
          </div>

          {/* Row 2 */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)" }}>
            <div style={cellStyle}>
              <label style={labelStyle}>SSN</label>
              <input style={inputStyle} value={ssn} onChange={(e) => setSsn(e.target.value)} placeholder="" />
            </div>
            <div style={cellStyle}>
              <label style={labelStyle}>DOB</label>
              <input style={{ ...inputStyle, colorScheme: "light" }} type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
            </div>
            <div style={cellStyle}>
              <label style={labelStyle}>County</label>
              <input style={inputStyle} value={county} onChange={(e) => setCounty(e.target.value)} placeholder="" />
            </div>
            <div style={cellStyle}>
              <label style={labelStyle}>State</label>
              <select style={selectStyle} value={state} onChange={(e) => setState(e.target.value)}>
                <option value=""></option>
                {US_STATES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div style={cellStyle}>
              <label style={labelStyle}>Order Reference</label>
              <input style={inputStyle} value={orderReference} onChange={(e) => setOrderReference(e.target.value)} placeholder="" />
            </div>
            <div style={{ ...cellStyle, borderRight: "none" }}>
              <label style={labelStyle}>Order Date From</label>
              <input style={{ ...inputStyle, colorScheme: "light" }} type="date" value={orderDateFrom} onChange={(e) => setOrderDateFrom(e.target.value)} />
            </div>
          </div>

          {/* Row 3 */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)" }}>
            <div style={cellStyle}>
              <label style={labelStyle}>Order Date To</label>
              <input style={{ ...inputStyle, colorScheme: "light" }} type="date" value={orderDateTo} onChange={(e) => setOrderDateTo(e.target.value)} />
            </div>
            <div style={cellStyle}>
              <label style={labelStyle}>Sort Order</label>
              <select style={selectStyle} value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="Status">Status</option>
                <option value="Date">Date</option>
                <option value="Name">Name</option>
                <option value="Search ID">Search ID</option>
              </select>
            </div>
            <div style={cellStyle}>
              <label style={labelStyle}>Searches per page</label>
              <select style={selectStyle} value={searchesPerPage} onChange={(e) => { setSearchesPerPage(Number(e.target.value)); setPage(1); }}>
                {SEARCHES_PER_PAGE_OPTIONS.map((n) => (
                  <option key={n} value={n}>{n} Searches</option>
                ))}
              </select>
            </div>
            <div style={cellStyle}>
              <label style={labelStyle}>Age</label>
              <select style={selectStyle} value={age} onChange={(e) => setAge(e.target.value)}>
                <option value="">All</option>
                <option value="18-25">18–25</option>
                <option value="26-35">26–35</option>
                <option value="36-45">36–45</option>
                <option value="46+">46+</option>
              </select>
            </div>
            <div style={cellStyle}>
              <label style={labelStyle}>Applicant Email</label>
              <input style={inputStyle} value={applicantEmail} onChange={(e) => setApplicantEmail(e.target.value)} placeholder="" />
            </div>
            <div style={{ ...cellStyle, borderRight: "none" }}>
              <label style={labelStyle}>Criminal Records Found</label>
              <select style={selectStyle} value={criminalRecords} onChange={(e) => setCriminalRecords(e.target.value)}>
                <option value="">All</option>
                <option value="None">None</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3+">3+</option>
              </select>
            </div>
          </div>

          {/* Row 4 – Ordered By (single cell) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", borderBottom: "none" }}>
            <div style={{ ...cellStyle, borderBottom: "none" }}>
              <label style={labelStyle}>Ordered By</label>
              <select style={selectStyle} value={orderedBy} onChange={(e) => setOrderedBy(e.target.value)}>
                <option value="">All Users</option>
                {uniqueOrderedBy.map((u) => (
                  <option key={u}>{u}</option>
                ))}
              </select>
            </div>
            {/* Empty filler cells */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} style={{ ...cellStyle, borderBottom: "none", borderRight: i === 5 ? "none" : "1px solid #E0E0E0" }} />
            ))}
          </div>
        </div>

        {/* Search & Reset buttons */}
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "16px" }}>
          <button
            onClick={handleSearch}
            style={{
              height: "34px",
              padding: "0 28px",
              borderRadius: "4px",
              border: "none",
              background: "#C8102E",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              letterSpacing: "0.2px",
            }}
          >
            Search
          </button>
          <button
            onClick={handleReset}
            style={{
              height: "34px",
              padding: "0 24px",
              borderRadius: "4px",
              border: "1px solid #C8102E",
              background: "#fff",
              color: "#C8102E",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        </div>

        {/* Records Found Banner */}
        {searched && showBanner && (
          <div
            style={{
              background: "#F0FBF0",
              border: "1px solid #B6DDB6",
              borderRadius: "4px",
              padding: "8px 14px",
              marginBottom: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: "13px", color: "#333", fontWeight: 500 }}>
              {totalResults} Records Found. Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setShowBanner(false)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "0 2px", display: "flex", alignItems: "center" }}
            >
              <X size={15} color="#555" />
            </button>
          </div>
        )}

        {/* Search Results */}
        {searched && (
          <div
            style={{
              background: "#fff",
              border: "1px solid #D0D5DD",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            {/* Header row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 14px",
                borderBottom: "1px solid #E0E0E0",
                background: "#fff",
              }}
            >
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#1A1A2E" }}>
                Search Results
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "12px", color: "#555" }}>Page:</span>
                <select
                  value={page}
                  onChange={(e) => setPage(Number(e.target.value))}
                  style={{
                    border: "1px solid #D0D5DD",
                    borderRadius: "4px",
                    height: "26px",
                    padding: "0 22px 0 6px",
                    fontSize: "12px",
                    color: "#333",
                    background: `#fff ${SELECT_ARROW}`,
                    appearance: "none",
                    cursor: "pointer",
                    outline: "none",
                  }}
                >
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Result rows */}
            {paginated.length === 0 ? (
              <div style={{ padding: "32px", textAlign: "center", fontSize: "13px", color: "#888" }}>
                No records found.
              </div>
            ) : (
              paginated.map((order, idx) => (
                <div
                  key={order.searchId}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "9px 14px",
                    borderBottom: idx < paginated.length - 1 ? "1px solid #F0F0F0" : "none",
                    background: idx % 2 === 0 ? "#fff" : "#FAFAFA",
                    gap: "16px",
                  }}
                >
                  {/* Search ID */}
                  <span style={{ fontSize: "12px", color: "#444", minWidth: "120px", flexShrink: 0 }}>
                    Search ID: <span style={{ fontWeight: 600 }}>{order.searchId}</span>
                  </span>

                  {/* Applicant + Verification */}
                  <span style={{ fontSize: "12px", color: "#333", flex: 1 }}>
                    <span style={{ fontWeight: 600, color: "#1A1A2E" }}>{order.applicantName}</span>
                    {": "}
                    <span style={{ color: "#555" }}>{order.verificationType}</span>
                  </span>

                  {/* Status Badge */}
                  <StatusBadge status={order.status} />
                </div>
              ))
            )}

            {/* Pagination footer */}
            {totalPages > 1 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  padding: "10px 14px",
                  borderTop: "1px solid #E0E0E0",
                  background: "#FAFAFA",
                }}
              >
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{
                    height: "28px",
                    padding: "0 10px",
                    border: "1px solid #D0D5DD",
                    borderRadius: "4px",
                    background: "#fff",
                    fontSize: "11px",
                    color: page === 1 ? "#bbb" : "#555",
                    cursor: page === 1 ? "not-allowed" : "pointer",
                  }}
                >
                  ‹ Prev
                </button>

                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "4px",
                        border: p === page ? "1px solid #C8102E" : "1px solid #D0D5DD",
                        background: p === page ? "#C8102E" : "#fff",
                        color: p === page ? "#fff" : "#555",
                        fontSize: "11px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {p}
                    </button>
                  );
                })}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={{
                    height: "28px",
                    padding: "0 10px",
                    border: "1px solid #D0D5DD",
                    borderRadius: "4px",
                    background: "#fff",
                    fontSize: "11px",
                    color: page === totalPages ? "#bbb" : "#555",
                    cursor: page === totalPages ? "not-allowed" : "pointer",
                  }}
                >
                  Next ›
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

function StatusBadge({ status }: { status: SearchStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 12px",
        borderRadius: "3px",
        fontSize: "10px",
        fontWeight: 700,
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        whiteSpace: "nowrap",
        letterSpacing: "0.3px",
        flexShrink: 0,
      }}
    >
      {status}
    </span>
  );
}
