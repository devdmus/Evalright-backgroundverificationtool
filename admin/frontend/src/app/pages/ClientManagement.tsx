import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Footer } from "../components/Footer";
import { Pagination } from "../components/Pagination";
import { CLIENT_LIST } from "../data/mockData";

interface ClientManagementProps {
  isDarkMode?: boolean;
  onViewClient?: (clientId: string) => void;
}

function SortIcon() {
  return (
    <span style={{ marginLeft: "6px", display: "inline-flex", flexDirection: "column", verticalAlign: "middle", opacity: 0.35 }}>
      <span style={{ fontSize: "8px", height: "5px", lineHeight: "1", color: "#A0AEC0" }}>▲</span>
      <span style={{ fontSize: "8px", height: "5px", lineHeight: "1", color: "#A0AEC0", marginTop: "2px" }}>▼</span>
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isActive = status === "ACTIVE";
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: "12px",
        fontSize: "11px",
        fontWeight: 600,
        background: isActive ? "#D1FAE5" : "#FEF3C7",
        color: isActive ? "#065F46" : "#92400E",
        letterSpacing: "0.03em",
      }}
    >
      {status}
    </span>
  );
}

export function ClientManagement({ isDarkMode = false, onViewClient }: ClientManagementProps) {
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [companyName, setCompanyName] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [clientUser, setClientUser] = useState("");
  const [salesRep, setSalesRep] = useState("Any");
  const [dateRange, setDateRange] = useState("");
  const [configGroup, setConfigGroup] = useState("Any");

  const cardBg = isDarkMode ? "#252830" : "#FFFFFF";
  const borderColor = isDarkMode ? "#333333" : "#E5E7EB";
  const textColor = isDarkMode ? "#E5E7EB" : "#333333";
  const mutedColor = isDarkMode ? "#9CA3AF" : "#6B7280";
  const inputBg = isDarkMode ? "#2A2D34" : "#FFFFFF";
  const theadBg = isDarkMode ? "#2A2D34" : "#F9FAFB";

  const filtered = CLIENT_LIST.filter((c) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (
        !c.companyName.toLowerCase().includes(q) &&
        !c.id.includes(q) &&
        !c.salesRep.toLowerCase().includes(q)
      ) return false;
    }
    if (companyName && !c.companyName.toLowerCase().includes(companyName.toLowerCase())) return false;
    if (companyId && !c.id.includes(companyId)) return false;
    if (clientUser && c.primaryUser && !c.primaryUser.toLowerCase().includes(clientUser.toLowerCase())) return false;
    if (salesRep !== "Any" && c.salesRep !== salesRep) return false;
    return true;
  });

  const totalEntries = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: "38px",
    padding: "0 12px",
    fontSize: "13px",
    border: `1px solid ${borderColor}`,
    borderRadius: "4px",
    background: inputBg,
    color: textColor,
    boxSizing: "border-box",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "13px",
    fontWeight: 500,
    color: mutedColor,
    marginBottom: "6px",
    display: "block",
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: isDarkMode ? "#1A1C21" : "#F4F5F7" }}>
      <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 600, color: isDarkMode ? "#DF2A57" : "#C70039", margin: "0 0 20px 0" }}>
          Client Management
        </h1>

        {/* Filter Section */}
        <div
          style={{
            background: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: "6px",
            padding: "20px 24px",
            marginBottom: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px 20px", marginBottom: "16px" }}>
            <div>
              <label style={labelStyle}>Company Name</label>
              <input style={inputStyle} value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Company ID</label>
              <input style={inputStyle} value={companyId} onChange={(e) => setCompanyId(e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>City</label>
              <input style={inputStyle} value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>State</label>
              <input style={inputStyle} value={state} onChange={(e) => setState(e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Client User</label>
              <input style={inputStyle} value={clientUser} onChange={(e) => setClientUser(e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Sales Representative</label>
              <select
                value={salesRep}
                onChange={(e) => setSalesRep(e.target.value)}
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                <option value="Any">Any</option>
                <option value="Suresh Ramakoti">Suresh Ramakoti</option>
                <option value="Raghavendra Polimera">Raghavendra Polimera</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Date Range</label>
              <input style={inputStyle} value={dateRange} onChange={(e) => setDateRange(e.target.value)} placeholder="" />
            </div>
            <div>
              <label style={labelStyle}>Configuration Group</label>
              <select
                value={configGroup}
                onChange={(e) => setConfigGroup(e.target.value)}
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                <option value="Any">Any</option>
                <option value="Evalright Group">Evalright Group</option>
              </select>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={() => setPage(1)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                height: "38px",
                padding: "0 20px",
                background: "#C70039",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "4px",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              <Filter size={16} />
              Filter
            </button>
          </div>
        </div>

        {/* Client List */}
        <div
          style={{
            background: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: "6px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${borderColor}` }}>
            <h2 style={{ fontSize: "15px", fontWeight: 600, color: textColor, margin: 0 }}>Client List</h2>
          </div>

          <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: mutedColor }}>
              <select
                value={perPage}
                onChange={(e) => { setPerPage(parseInt(e.target.value)); setPage(1); }}
                style={{
                  height: "32px",
                  padding: "0 8px",
                  fontSize: "13px",
                  border: `1px solid ${borderColor}`,
                  borderRadius: "4px",
                  background: inputBg,
                  color: textColor,
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span>entries per page</span>
            </div>

            <div style={{ position: "relative", width: "200px" }}>
              <Search size={15} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
              <input
                placeholder="Search..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                style={{
                  width: "100%",
                  height: "32px",
                  paddingLeft: "32px",
                  paddingRight: "10px",
                  fontSize: "13px",
                  border: `1px solid ${borderColor}`,
                  borderRadius: "4px",
                  background: inputBg,
                  color: textColor,
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ background: theadBg, borderBottom: `1px solid ${borderColor}` }}>
                  {["ID", "Company Name", "Sales Rep.", "Created", "Status"].map((col) => (
                    <th
                      key={col}
                      style={{
                        padding: "10px 16px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: mutedColor,
                        cursor: "pointer",
                        userSelect: "none",
                      }}
                    >
                      {col}
                      <SortIcon />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((client, idx) => (
                  <tr
                    key={client.id}
                    style={{
                      borderBottom: `1px solid ${borderColor}`,
                      background: idx % 2 === 0 ? "transparent" : (isDarkMode ? "rgba(255,255,255,0.02)" : "#FAFAFA"),
                    }}
                  >
                    <td style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 600, color: "#C70039" }}>
                      {client.id}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "13px" }}>
                      <button
                        onClick={() => onViewClient?.(client.id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#C70039",
                          fontWeight: 600,
                          fontSize: "13px",
                          cursor: "pointer",
                          padding: 0,
                          textAlign: "left",
                        }}
                      >
                        {client.companyName}
                      </button>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "13px", color: mutedColor }}>{client.salesRep}</td>
                    <td style={{ padding: "12px 16px", fontSize: "13px", color: mutedColor }}>{client.created}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <StatusBadge status={client.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            totalEntries={totalEntries}
            perPage={perPage}
            onPageChange={setPage}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
