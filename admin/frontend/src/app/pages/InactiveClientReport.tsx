import { useState, useMemo, useEffect, useRef } from "react";
import { ChevronDown, Search, FileText } from "lucide-react";
import { Footer } from "../components/Footer";
import { CLIENT_LIST, DEMO_CLIENT } from "../data/mockData";

interface InactiveClientRow {
  id: string;
  clientName: string;
  dateJoined: string;
  salesperson: string;
}

const MOCK_INACTIVE_CLIENTS: InactiveClientRow[] = [
  { id: "ic1", clientName: "Arokee Online Service", dateJoined: "02/13/2026", salesperson: "Puneet P" },
  { id: "ic2", clientName: "Comptech Associates India Pvt. Ltd", dateJoined: "03/27/2024", salesperson: "Puneet P" },
  { id: "ic3", clientName: "Droisys Inc", dateJoined: "02/19/2026", salesperson: "Puneet P" },
  { id: "ic4", clientName: "ERP initiatives", dateJoined: "10/21/2025", salesperson: "Puneet P" },
  { id: "ic5", clientName: "Frontage Technologies Inc.", dateJoined: "04/30/2024", salesperson: "Puneet P" },
  { id: "ic6", clientName: "Glaze Technologies Inc", dateJoined: "04/06/2026", salesperson: "Puneet P" },
  { id: "ic7", clientName: "Global Checks AI Private Limited", dateJoined: "04/02/2026", salesperson: "Puneet P" },
  { id: "ic8", clientName: "INSOURCE TECH LLC", dateJoined: "09/30/2024", salesperson: "Puneet P" },
  { id: "ic9", clientName: "JSRM GROUP LLC", dateJoined: "12/01/2024", salesperson: "Puneet P" },
  { id: "ic10", clientName: "Logan Data", dateJoined: "06/16/2025", salesperson: "Puneet P" },
  { id: "ic11", clientName: "MS INFO TECH LLC", dateJoined: "10/17/2024", salesperson: "Puneet P" },
  { id: "ic12", clientName: "NAAV Business Solutions LLC", dateJoined: "02/20/2025", salesperson: "Puneet P" },
  { id: "ic13", clientName: "NEXTGENPROS INC", dateJoined: "01/30/2025", salesperson: "Puneet P" },
  { id: "ic14", clientName: "PeopleTech Group Inc", dateJoined: "07/22/2025", salesperson: "Puneet P" },
  { id: "ic15", clientName: "Premier Lighting and Sign, LLC", dateJoined: "11/20/2024", salesperson: "Puneet P" },
  
  // Extra salesperson clients for variety
  { id: "ic16", clientName: "3A Soft Inc", dateJoined: "07/15/2025", salesperson: "Ramesh R" },
  { id: "ic17", clientName: "3i Infotech Inc", dateJoined: "08/21/2024", salesperson: "Ramesh R" },
  { id: "ic18", clientName: "4i Americas LLC", dateJoined: "01/07/2026", salesperson: "Raghu Adaveni" },
  { id: "ic19", clientName: "A Fractional CFO, LLC", dateJoined: "08/06/2025", salesperson: "Dinesh Reddy" },
];

const SALESPEOPLE = ["All Sales People", "P, Puneet", "Ramesh R", "Raghu Adaveni", "Dinesh Reddy"];
const SORT_OPTIONS = [
  "Company Name (A-Z)",
  "Company Name (Z-A)",
  "Date Joined (Oldest First)",
  "Date Joined (Newest First)"
];

interface InactiveClientReportProps {
  isDarkMode?: boolean;
  onViewClient?: (clientId: string) => void;
}

function getClientIdByName(name: string): string {
  const match = CLIENT_LIST.find((c) => c.companyName.toLowerCase() === name.toLowerCase());
  return match?.id ?? DEMO_CLIENT.id;
}

export function InactiveClientReport({ isDarkMode = false, onViewClient }: InactiveClientReportProps) {
  const [salesperson, setSalesperson] = useState("All Sales People");
  const [sortBy, setSortBy] = useState("Company Name (A-Z)");
  
  const [appliedFilters, setAppliedFilters] = useState({
    salesperson: "All Sales People",
    sortBy: "Company Name (A-Z)"
  });

  const [reportGenerated, setReportGenerated] = useState(false);

  // Dropdown open states
  const [showSalespersonDropdown, setShowSalespersonDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const salespersonRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (salespersonRef.current && !salespersonRef.current.contains(event.target as Node)) {
        setShowSalespersonDropdown(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setShowSortDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleGenerateReport = () => {
    setAppliedFilters({
      salesperson,
      sortBy
    });
    setReportGenerated(true);
  };

  // Filtered and sorted rows
  const filteredRows = useMemo(() => {
    if (!reportGenerated) return [];

    let result = [...MOCK_INACTIVE_CLIENTS];

    // Filter by Salesperson
    const salesFilter = appliedFilters.salesperson;
    if (salesFilter !== "All Sales People") {
      // Map "P, Puneet" dropdown value to "Puneet P" mock data value
      const targetSales = salesFilter === "P, Puneet" ? "Puneet P" : salesFilter;
      result = result.filter((r) => r.salesperson === targetSales);
    }

    // Sort By
    const sortVal = appliedFilters.sortBy;
    if (sortVal === "Company Name (A-Z)") {
      result.sort((a, b) => a.clientName.localeCompare(b.clientName));
    } else if (sortVal === "Company Name (Z-A)") {
      result.sort((a, b) => b.clientName.localeCompare(a.clientName));
    } else if (sortVal === "Date Joined (Oldest First)") {
      result.sort((a, b) => new Date(a.dateJoined).getTime() - new Date(b.dateJoined).getTime());
    } else if (sortVal === "Date Joined (Newest First)") {
      result.sort((a, b) => new Date(b.dateJoined).getTime() - new Date(a.dateJoined).getTime());
    }

    return result;
  }, [reportGenerated, appliedFilters]);

  // Colors
  const primaryBrandColor = isDarkMode ? "#DF2A57" : "#C70039";
  const primaryBrandHover = isDarkMode ? "#F23F6C" : "#A60030";
  const bodyBg = isDarkMode ? "#1A1C21" : "#F4F5F7";
  const cardBg = isDarkMode ? "#252830" : "#FFFFFF";
  const cardBorder = isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB";
  const textPrimary = isDarkMode ? "#E5E7EB" : "#374151";
  const textMuted = isDarkMode ? "#8391a2" : "#777777";
  const textTitle = isDarkMode ? "#FFFFFF" : "#1F2937";
  const tableHeaderBg = isDarkMode ? "#2D3039" : "#F3F4F6";
  const tableHeaderBorder = isDarkMode ? "1px solid #3A3E4A" : "1px solid #E5E7EB";
  const tableRowBorder = isDarkMode ? "1px solid #333333" : "1px solid #F3F4F6";
  const tableRowHoverBg = isDarkMode ? "rgba(255, 255, 255, 0.02)" : "#FBFBFB";
  const inputBg = isDarkMode ? "#1A1C21" : "#FFFFFF";
  const labelColor = isDarkMode ? "#8391a2" : "#8A8A8A";

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        background: bodyBg,
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          flex: "20 1 0%",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          gap: "5px",
        }}
      >
        {/* Page Title */}
        <h1 style={{ fontSize: "20px", fontWeight: 600, color: primaryBrandColor, margin: "10px 0px 10px 4px", fontFamily: "'Wix Madefor Display', sans-serif" }}>
          Inactive Client Report
        </h1>

        {/* Filters Card Grid */}
        <div
          style={{
            background: cardBg,
            border: cardBorder,
            borderRadius: "6px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginBottom: "10px",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            
            {/* Salesperson Dropdown */}
            <div style={{ position: "relative" }} ref={salespersonRef}>
              <div
                onClick={() => {
                  setShowSalespersonDropdown(!showSalespersonDropdown);
                  setShowSortDropdown(false);
                }}
                style={{
                  background: inputBg,
                  border: cardBorder,
                  borderRadius: "4px",
                  padding: "8px 12px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  height: "58px",
                  cursor: "pointer",
                  boxSizing: "border-box",
                }}
              >
                <label style={{ fontSize: "11.5px", color: labelColor, fontWeight: 400, marginBottom: "3px", textAlign: "left" }}>
                  Salesperson
                </label>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13.5px", color: textPrimary }}>{salesperson}</span>
                  <ChevronDown size={15} style={{ color: textMuted }} />
                </div>
              </div>

              {showSalespersonDropdown && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    marginTop: "4px",
                    background: cardBg,
                    border: cardBorder,
                    borderRadius: "4px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    zIndex: 1020,
                    overflow: "hidden",
                  }}
                >
                  {SALESPEOPLE.map((sp) => {
                    const isSelected = salesperson === sp;
                    return (
                      <button
                        key={sp}
                        type="button"
                        onClick={() => {
                          setSalesperson(sp);
                          setShowSalespersonDropdown(false);
                        }}
                        style={{
                          width: "100%",
                          padding: "10px 16px",
                          fontSize: "13px",
                          color: isSelected ? primaryBrandColor : textPrimary,
                          fontWeight: isSelected ? 600 : 400,
                          background: "transparent",
                          border: "none",
                          textAlign: "left",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = isDarkMode ? "#33353F" : "#F3F4F6")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        {sp}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sort By Dropdown */}
            <div style={{ position: "relative" }} ref={sortRef}>
              <div
                onClick={() => {
                  setShowSortDropdown(!showSortDropdown);
                  setShowSalespersonDropdown(false);
                }}
                style={{
                  background: inputBg,
                  border: cardBorder,
                  borderRadius: "4px",
                  padding: "8px 12px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  height: "58px",
                  cursor: "pointer",
                  boxSizing: "border-box",
                }}
              >
                <label style={{ fontSize: "11.5px", color: labelColor, fontWeight: 400, marginBottom: "3px", textAlign: "left" }}>
                  Sort By
                </label>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13.5px", color: textPrimary }}>{sortBy}</span>
                  <ChevronDown size={15} style={{ color: textMuted }} />
                </div>
              </div>

              {showSortDropdown && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    marginTop: "4px",
                    background: cardBg,
                    border: cardBorder,
                    borderRadius: "4px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    zIndex: 1020,
                    overflow: "hidden",
                  }}
                >
                  {SORT_OPTIONS.map((opt) => {
                    const isSelected = sortBy === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setSortBy(opt);
                          setShowSortDropdown(false);
                        }}
                        style={{
                          width: "100%",
                          padding: "10px 16px",
                          fontSize: "13px",
                          color: isSelected ? primaryBrandColor : textPrimary,
                          fontWeight: isSelected ? 600 : 400,
                          background: "transparent",
                          border: "none",
                          textAlign: "left",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = isDarkMode ? "#33353F" : "#F3F4F6")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* Action Row - Generate Report Button */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: "4px" }}>
            <button
              type="button"
              onClick={handleGenerateReport}
              style={{
                background: primaryBrandColor,
                color: "#FFFFFF",
                border: "none",
                borderRadius: "4px",
                height: "38px",
                padding: "0 24px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "background 0.15s ease",
                fontFamily: "'Wix Madefor Display', sans-serif",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = primaryBrandHover)}
              onMouseLeave={(e) => (e.currentTarget.style.background = primaryBrandColor)}
            >
              <FileText size={15} />
              Generate Report
            </button>
          </div>
        </div>

        {/* ── Conditionals: Banner or Table ── */}
        {!reportGenerated ? (
          /* Yellow banner warning when no report has been generated */
          <div
            style={{
              background: isDarkMode ? "#3D2B1F" : "#FFF7E6",
              border: "1px solid " + (isDarkMode ? "#E67E22" : "#FFE58F"),
              borderRadius: "4px",
              padding: "14px 24px",
              textAlign: "center",
              fontSize: "14px",
              fontWeight: 500,
              color: isDarkMode ? "#F39C12" : "#D48806",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.02)",
              marginTop: "5px",
            }}
          >
            Please select your criteria and generate the report.
          </div>
        ) : (
          /* Generated Report Table Panel */
          <div
            style={{
              background: cardBg,
              border: cardBorder,
              borderRadius: "6px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              marginTop: "10px",
            }}
          >
            {/* Salesperson Subtitle header */}
            <div
              style={{
                padding: "16px 20px",
                borderBottom: cardBorder,
                fontSize: "14px",
                color: textPrimary,
                fontWeight: 500,
                textAlign: "left",
              }}
            >
              Salesperson: {appliedFilters.salesperson === "All Sales People" ? "All" : appliedFilters.salesperson === "P, Puneet" ? "Puneet P" : appliedFilters.salesperson}
            </div>

            {/* Table Container */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: tableHeaderBg, borderBottom: tableHeaderBorder }}>
                    <th style={{ padding: "12px 20px", fontWeight: 600, color: textMuted }}>Client / Company Name</th>
                    <th style={{ padding: "12px 20px", fontWeight: 600, color: textMuted, textAlign: "right", width: "180px" }}>Date Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row) => (
                    <tr
                      key={row.id}
                      style={{
                        borderBottom: tableRowBorder,
                        transition: "background 0.15s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = tableRowHoverBg;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      {/* Clickable Red Company Name Link */}
                      <td style={{ padding: "12px 20px" }}>
                        <button
                          type="button"
                          onClick={() => onViewClient?.(getClientIdByName(row.clientName))}
                          style={{
                            background: "transparent",
                            border: "none",
                            padding: 0,
                            color: primaryBrandColor,
                            fontWeight: 500,
                            cursor: "pointer",
                            textAlign: "left",
                            textDecoration: "none",
                            fontFamily: "inherit",
                            fontSize: "inherit",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.textDecoration = "underline";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.textDecoration = "none";
                          }}
                        >
                          {row.clientName}
                        </button>
                      </td>
                      {/* Date Joined */}
                      <td style={{ padding: "12px 20px", color: textPrimary, textAlign: "right" }}>
                        {row.dateJoined}
                      </td>
                    </tr>
                  ))}
                  {filteredRows.length === 0 && (
                    <tr>
                      <td colSpan={2} style={{ padding: "24px", color: textMuted, textAlign: "center" }}>
                        No inactive clients matched the selected criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Premium Table Footer summary */}
            {filteredRows.length > 0 && (
              <div
                style={{
                  padding: "12px 20px",
                  background: tableHeaderBg,
                  borderTop: tableHeaderBorder,
                  fontSize: "12.5px",
                  color: textMuted,
                  textAlign: "left",
                }}
              >
                Total Inactive Clients found: <strong style={{ color: textPrimary }}>{filteredRows.length}</strong>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
