import { useState, useMemo, useEffect, useRef } from "react";
import { ChevronDown, Search, FileText, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Footer } from "../components/Footer";
import { CLIENT_LIST, DEMO_CLIENT } from "../data/mockData";

interface JurisdictionRow {
  id: string;
  clientName: string;
  searchType: string;
  configGroup: string;
  researcher: string;
  state: string;
  county: string;
  cost: number;
  tat: number; // Turnaround time in hours
  date: string;
}

const MOCK_JURISDICTIONS: JurisdictionRow[] = [
  {
    id: "j1",
    clientName: "3A Soft Inc",
    searchType: "(AF) LabCorp - 10 Panel",
    configGroup: "Group #380 (name missing)",
    researcher: "Puneet P",
    state: "TX",
    county: "Harris",
    cost: 45.00,
    tat: 24,
    date: "06/18/2026",
  },
  {
    id: "j2",
    clientName: "3i Infotech Inc",
    searchType: "County Criminal",
    configGroup: "Group #381 (name missing)",
    researcher: "Ramesh R",
    state: "CA",
    county: "Los Angeles",
    cost: 15.00,
    tat: 12,
    date: "06/15/2026",
  },
  {
    id: "j3",
    clientName: "4i Americas LLC",
    searchType: "(AF) LabCorp - 10 Panel",
    configGroup: "New Sign-Ups EvalRight",
    researcher: "Raghu Adaveni",
    state: "IL",
    county: "Cook",
    cost: 45.00,
    tat: 18,
    date: "06/12/2026",
  },
  {
    id: "j4",
    clientName: "AA TECH GROUP LLC",
    searchType: "Driving History",
    configGroup: "Group #382 (name missing)",
    researcher: "Dinesh Reddy",
    state: "NY",
    county: "New York",
    cost: 20.00,
    tat: 8,
    date: "06/10/2026",
  },
  {
    id: "j5",
    clientName: "Aasrita Consulting LLC",
    searchType: "Employment Verification",
    configGroup: "New Sign-Ups EvalRight",
    researcher: "Puneet P",
    state: "FL",
    county: "Miami-Dade",
    cost: 35.00,
    tat: 36,
    date: "06/05/2026",
  }
];

const SEARCH_TYPES = ["(AF) LabCorp - 10 Panel", "County Criminal", "Driving History", "Employment Verification", "Education Verification"];
const CONFIG_GROUPS = ["All Groups", "Group #380 (name missing)", "Group #381 (name missing)", "Group #382 (name missing)", "New Sign-Ups EvalRight"];
const RESEARCHERS = ["All Researchers", "Puneet P", "Ramesh R", "Raghu Adaveni", "Dinesh Reddy"];
const STATES = ["All States", "AL", "CA", "FL", "IL", "NY", "TX"];

interface JurisdictionReportProps {
  isDarkMode?: boolean;
  onViewClient?: (clientId: string) => void;
}

function getClientIdByName(name: string): string {
  const match = CLIENT_LIST.find((c) => c.companyName.toLowerCase() === name.toLowerCase());
  return match?.id ?? DEMO_CLIENT.id;
}

export function JurisdictionReport({ isDarkMode = false, onViewClient }: JurisdictionReportProps) {
  // Primary States
  const [searchType, setSearchType] = useState("(AF) LabCorp - 10 Panel");
  const [dateRange, setDateRange] = useState("");
  const [configGroup, setConfigGroup] = useState("All Groups");
  const [clientFilter, setClientFilter] = useState("All Clients");
  const [researcher, setResearcher] = useState("All Researchers");
  
  // Jurisdiction Specific States
  const [stateFilter, setStateFilter] = useState("All States");
  const [countyFilter, setCountyFilter] = useState("");

  // Cost Range States (₹)
  const [costRangeType, setCostRangeType] = useState<"Not applicable" | "Less than" | "More than">("Not applicable");
  const [costAmount, setCostAmount] = useState("");

  // Turnaround Time States (Hours)
  const [tatType, setTatType] = useState<"Not applicable" | "Less than" | "More than">("Not applicable");
  const [tatHours, setTatHours] = useState("");

  // Dropdown open states
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Calendar states
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(5); // June
  const [calendarYear, setCalendarYear] = useState(2026);
  const [rangeStart, setRangeStart] = useState<string | null>(null);
  const [rangeEnd, setRangeEnd] = useState<string | null>(null);

  // Table states
  const [reportGenerated, setReportGenerated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // Refs for click outside
  const dropdownRefs = {
    searchType: useRef<HTMLDivElement>(null),
    configGroup: useRef<HTMLDivElement>(null),
    clientFilter: useRef<HTMLDivElement>(null),
    researcher: useRef<HTMLDivElement>(null),
    stateFilter: useRef<HTMLDivElement>(null),
    calendar: useRef<HTMLDivElement>(null),
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (activeDropdown) {
        const ref = dropdownRefs[activeDropdown as keyof typeof dropdownRefs];
        if (ref.current && !ref.current.contains(event.target as Node)) {
          setActiveDropdown(null);
        }
      }
      if (dropdownRefs.calendar.current && !dropdownRefs.calendar.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeDropdown]);

  const handleGenerateReport = () => {
    setReportGenerated(true);
  };

  // Filtered rows for the table
  const filteredRows = useMemo(() => {
    if (!reportGenerated) return [];

    return MOCK_JURISDICTIONS.filter((row) => {
      // Search Type filter
      if (searchType && row.searchType !== searchType) return false;

      // Config Group filter
      if (configGroup !== "All Groups" && row.configGroup !== configGroup) return false;

      // Client filter
      if (clientFilter !== "All Clients" && row.clientName !== clientFilter) return false;

      // Researcher filter
      if (researcher !== "All Researchers" && row.researcher !== researcher) return false;

      // State filter
      if (stateFilter !== "All States" && row.state !== stateFilter) return false;

      // County filter
      if (countyFilter.trim() && !row.county.toLowerCase().includes(countyFilter.toLowerCase().trim())) return false;

      // Date Range filter
      if (rangeStart) {
        const rowDate = new Date(row.date);
        const startDate = new Date(rangeStart);
        if (rowDate < startDate) return false;
      }
      if (rangeEnd) {
        const rowDate = new Date(row.date);
        const endDate = new Date(rangeEnd);
        if (rowDate > endDate) return false;
      }

      // Cost Range filter (₹)
      if (costRangeType !== "Not applicable" && costAmount) {
        const amt = parseFloat(costAmount);
        if (!isNaN(amt)) {
          if (costRangeType === "Less than" && row.cost >= amt) return false;
          if (costRangeType === "More than" && row.cost <= amt) return false;
        }
      }

      // Turnaround Time filter (Hours)
      if (tatType !== "Not applicable" && tatHours) {
        const hrs = parseInt(tatHours, 10);
        if (!isNaN(hrs)) {
          if (tatType === "Less than" && row.tat >= hrs) return false;
          if (tatType === "More than" && row.tat <= hrs) return false;
        }
      }

      // Search Box filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          row.clientName.toLowerCase().includes(q) ||
          row.searchType.toLowerCase().includes(q) ||
          row.state.toLowerCase().includes(q) ||
          row.county.toLowerCase().includes(q) ||
          row.researcher.toLowerCase().includes(q) ||
          row.date.toLowerCase().includes(q) ||
          String(row.cost).includes(q) ||
          String(row.tat).includes(q)
        );
      }

      return true;
    });
  }, [
    reportGenerated, searchType, configGroup, clientFilter, researcher, stateFilter, countyFilter,
    rangeStart, rangeEnd, costRangeType, costAmount, tatType, tatHours, searchQuery
  ]);

  const displayRows = useMemo(() => {
    return filteredRows.slice(0, entriesPerPage);
  }, [filteredRows, entriesPerPage]);

  const totalCost = useMemo(() => {
    return filteredRows.reduce((sum, r) => sum + r.cost, 0);
  }, [filteredRows]);

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

  // Radio button renderer
  const renderRadio = (
    label: string,
    checked: boolean,
    onChange: () => void
  ) => {
    return (
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "13px",
          color: textPrimary,
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <span
          onClick={onChange}
          style={{
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            border: checked ? `2px solid ${primaryBrandColor}` : isDarkMode ? "2px solid #555555" : "2px solid #CCCCCC",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxSizing: "border-box",
            transition: "border-color 0.15s ease",
            background: "transparent",
          }}
        >
          {checked && (
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: primaryBrandColor,
              }}
            />
          )}
        </span>
        <span onClick={onChange}>{label}</span>
      </label>
    );
  };

  // Helper to generate calendar grid
  const getCalendarDays = (year: number, month: number) => {
    const days = [];
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Previous month tail
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({ day: daysInPrevMonth - i, isCurrentMonth: false, monthOffset: -1 });
    }
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true, monthOffset: 0 });
    }
    // Next month head
    const totalSlots = days.length <= 35 ? 35 : 42;
    const nextMonthDaysNeeded = totalSlots - days.length;
    for (let i = 1; i <= nextMonthDaysNeeded; i++) {
      days.push({ day: i, isCurrentMonth: false, monthOffset: 1 });
    }
    return days;
  };

  const isStart = (day: number, isCurrentMonth: boolean, monthOffset: number) => {
    if (!isCurrentMonth || !rangeStart) return false;
    const [m, d, y] = rangeStart.split("/").map(Number);
    return d === day && (m - 1) === (calendarMonth + monthOffset) && y === calendarYear;
  };

  const isEnd = (day: number, isCurrentMonth: boolean, monthOffset: number) => {
    if (!isCurrentMonth) return false;
    if (rangeEnd) {
      const [m, d, y] = rangeEnd.split("/").map(Number);
      return d === day && (m - 1) === (calendarMonth + monthOffset) && y === calendarYear;
    }
    // Highlight June 23, 2026 as default outline
    return day === 23 && calendarMonth === 5 && calendarYear === 2026;
  };

  const handleDayClick = (day: number, monthOffset: number) => {
    const targetMonth = calendarMonth + monthOffset;
    let targetYear = calendarYear;
    let adjustedMonth = targetMonth;
    if (targetMonth < 0) {
      adjustedMonth = 11;
      targetYear -= 1;
    } else if (targetMonth > 11) {
      adjustedMonth = 0;
      targetYear += 1;
    }
    const formattedMonth = String(adjustedMonth + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    const clickedDateStr = `${formattedMonth}/${formattedDay}/${targetYear}`;

    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(clickedDateStr);
      setRangeEnd(null);
      setDateRange(`${clickedDateStr} - (select end date)`);
    } else {
      const startDate = new Date(rangeStart);
      const clickedDate = new Date(clickedDateStr);
      if (clickedDate < startDate) {
        setRangeStart(clickedDateStr);
        setDateRange(`${clickedDateStr} - (select end date)`);
      } else {
        setRangeEnd(clickedDateStr);
        setDateRange(`${rangeStart} - ${clickedDateStr}`);
        setShowCalendar(false);
      }
    }
  };

  // Custom Range Calendar Picker
  const renderRangeCalendar = () => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const days = getCalendarDays(calendarYear, calendarMonth);

    const handlePrevMonth = () => {
      if (calendarMonth === 0) {
        setCalendarMonth(11);
        setCalendarYear(calendarYear - 1);
      } else {
        setCalendarMonth(calendarMonth - 1);
      }
    };

    const handleNextMonth = () => {
      if (calendarMonth === 11) {
        setCalendarMonth(0);
        setCalendarYear(calendarYear + 1);
      } else {
        setCalendarMonth(calendarMonth + 1);
      }
    };

    return (
      <div
        style={{
          position: "absolute",
          top: "100%",
          left: 0,
          marginTop: "6px",
          background: cardBg,
          border: cardBorder,
          borderRadius: "6px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          zIndex: 1100,
          width: "280px",
          overflow: "visible",
        }}
      >
        {/* Triangle pointer */}
        <div
          style={{
            position: "absolute",
            top: "-5px",
            left: "24px",
            width: "10px",
            height: "10px",
            background: primaryBrandColor,
            transform: "rotate(45deg)",
            zIndex: 1,
          }}
        />

        {/* Header */}
        <div
          style={{
            background: primaryBrandColor,
            color: "#FFFFFF",
            padding: "12px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTopLeftRadius: "5px",
            borderTopRightRadius: "5px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <button
            type="button"
            onClick={handlePrevMonth}
            style={{ background: "transparent", border: "none", color: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
          >
            &lt;
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "14px", fontWeight: 600 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "2px", cursor: "pointer" }}>
              <span>{months[calendarMonth]}</span>
              <ChevronDown size={12} style={{ color: "#FFFFFF" }} />
            </div>
            <span style={{ marginLeft: "4px" }}>{calendarYear}</span>
          </div>
          <button
            type="button"
            onClick={handleNextMonth}
            style={{ background: "transparent", border: "none", color: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
          >
            &gt;
          </button>
        </div>

        {/* Week Days */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: "10px 14px 4px 14px", textAlign: "center", borderBottom: isDarkMode ? "1px solid #333" : "1px solid #F0F0F0" }}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <span key={d} style={{ fontSize: "11px", fontWeight: 500, color: textMuted }}>{d}</span>
          ))}
        </div>

        {/* Days Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", rowGap: "6px", columnGap: "4px", padding: "8px 14px 12px 14px" }}>
          {days.map((cell, idx) => {
            const isCurr = cell.isCurrentMonth;
            const dayVal = cell.day;
            const isStartDay = isStart(dayVal, isCurr, cell.monthOffset);
            const isEndDay = isEnd(dayVal, isCurr, cell.monthOffset);
            const isSel = isStartDay || isEndDay;
            const isOutline = !isStartDay && isEndDay;

            return (
              <div key={idx} style={{ display: "flex", alignItems: "center", justifyCenter: "center", height: "32px" }}>
                <button
                  type="button"
                  onClick={() => handleDayClick(dayVal, cell.monthOffset)}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    border: isStartDay ? "none" : isOutline ? `2px solid ${primaryBrandColor}` : "none",
                    background: isStartDay ? primaryBrandColor : "transparent",
                    color: isStartDay ? "#FFFFFF" : isCurr ? textPrimary : isDarkMode ? "#555555" : "#CCCCCC",
                    fontSize: "12px",
                    fontWeight: isSel ? 600 : 400,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                    boxSizing: "border-box",
                    transition: "background 0.1s, border 0.1s",
                  }}
                  onMouseEnter={(e) => { if (!isStartDay && !isOutline) e.currentTarget.style.background = isDarkMode ? "#33353F" : "#F3F4F6"; }}
                  onMouseLeave={(e) => { if (!isStartDay && !isOutline) e.currentTarget.style.background = "transparent"; }}
                >
                  {dayVal}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render Premium Filter Dropdown Card
  const renderFilterDropdown = (
    label: string,
    value: string,
    setValue: (val: string) => void,
    fieldKey: string,
    options: string[]
  ) => {
    const isOpen = activeDropdown === fieldKey;
    const ref = dropdownRefs[fieldKey as keyof typeof dropdownRefs];

    return (
      <div style={{ position: "relative" }} ref={ref}>
        <div
          onClick={() => setActiveDropdown(isOpen ? null : fieldKey)}
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
            {label}
          </label>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "13.5px", color: textPrimary }}>{value}</span>
            <ChevronDown size={15} style={{ color: textMuted }} />
          </div>
        </div>

        {isOpen && (
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
            {options.map((opt) => {
              const isSelected = value === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setValue(opt);
                    setActiveDropdown(null);
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
    );
  };

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
          Generate Jurisdiction Report
        </h1>

        {/* Main Filters Card Panel */}
        <div
          style={{
            background: cardBg,
            border: cardBorder,
            borderRadius: "6px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
            padding: "24px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            marginBottom: "10px",
          }}
        >
          {/* Row 1: Search Type & Date Range */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {renderFilterDropdown("Search Type", searchType, setSearchType, "searchType", SEARCH_TYPES)}
            
            {/* Date Range Card Picker */}
            <div style={{ position: "relative" }} ref={dropdownRefs.calendar}>
              <div
                onClick={() => setShowCalendar(!showCalendar)}
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
                  Date Range
                </label>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13.5px", color: dateRange ? textPrimary : textMuted }}>
                    {dateRange || "Select date range"}
                  </span>
                  <Calendar size={15} style={{ color: textMuted }} />
                </div>
              </div>
              {showCalendar && renderRangeCalendar()}
            </div>
          </div>

          {/* Row 2: Configuration Group, Client, Researcher */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
            {renderFilterDropdown("Configuration Group", configGroup, setConfigGroup, "configGroup", CONFIG_GROUPS)}
            
            {/* Client dropdown */}
            {renderFilterDropdown(
              "Client",
              clientFilter,
              setClientFilter,
              "clientFilter",
              ["All Clients", ...CLIENT_LIST.map((c) => c.companyName)]
            )}

            {renderFilterDropdown("Researcher", researcher, setResearcher, "researcher", RESEARCHERS)}
          </div>

          {/* Subsection: Jurisdiction Specific */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", textAlign: "left" }}>
            <h3 style={{ fontSize: "13.5px", fontWeight: 500, color: textMuted, margin: "5px 0px 5px 0px" }}>
              Jurisdiction Specific (search in specific jurisdiction)
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "16px" }}>
              {renderFilterDropdown("State", stateFilter, setStateFilter, "stateFilter", STATES)}
              
              {/* County Input Box */}
              <div
                style={{
                  background: inputBg,
                  border: cardBorder,
                  borderRadius: "4px",
                  padding: "8px 12px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  height: "58px",
                  boxSizing: "border-box",
                }}
              >
                <label style={{ fontSize: "11.5px", color: labelColor, fontWeight: 400, marginBottom: "3px" }}>
                  County
                </label>
                <input
                  type="text"
                  placeholder="County"
                  value={countyFilter}
                  onChange={(e) => setCountyFilter(e.target.value)}
                  style={{
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    width: "100%",
                    fontSize: "13.5px",
                    color: textPrimary,
                    padding: 0,
                    margin: 0,
                    fontFamily: "inherit",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Subsection: Cost Range (₹) */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", textAlign: "left" }}>
            <span style={{ fontSize: "12px", color: labelColor, fontWeight: 500 }}>
              Cost Range (₹)
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
              {renderRadio("Not applicable", costRangeType === "Not applicable", () => setCostRangeType("Not applicable"))}
              {renderRadio("Less than:", costRangeType === "Less than", () => setCostRangeType("Less than"))}
              {renderRadio("More than:", costRangeType === "More than", () => setCostRangeType("More than"))}
              
              <div
                style={{
                  background: inputBg,
                  border: cardBorder,
                  borderRadius: "4px",
                  padding: "4px 8px",
                  display: "flex",
                  alignItems: "center",
                  height: "32px",
                  width: "150px",
                  boxSizing: "border-box",
                  marginLeft: "10px",
                }}
              >
                <input
                  type="number"
                  placeholder="Amount (₹)"
                  value={costAmount}
                  onChange={(e) => setCostAmount(e.target.value)}
                  style={{
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    width: "100%",
                    fontSize: "12.5px",
                    color: textPrimary,
                    padding: 0,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Subsection: Turnaround Time (Hours) */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", textAlign: "left" }}>
            <span style={{ fontSize: "12px", color: labelColor, fontWeight: 500 }}>
              Turnaround Time (Hours)
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
              {renderRadio("Not applicable", tatType === "Not applicable", () => setTatType("Not applicable"))}
              {renderRadio("Less than:", tatType === "Less than", () => setTatType("Less than"))}
              {renderRadio("More than:", tatType === "More than", () => setTatType("More than"))}
              
              <div
                style={{
                  background: inputBg,
                  border: cardBorder,
                  borderRadius: "4px",
                  padding: "4px 8px",
                  display: "flex",
                  alignItems: "center",
                  height: "32px",
                  width: "150px",
                  boxSizing: "border-box",
                  marginLeft: "10px",
                }}
              >
                <input
                  type="number"
                  placeholder="Hours"
                  value={tatHours}
                  onChange={(e) => setTatHours(e.target.value)}
                  style={{
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    width: "100%",
                    fontSize: "12.5px",
                    color: textPrimary,
                    padding: 0,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Action Row - Generate Report Button */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
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
          /* Generated Jurisdiction Report Table Panel */
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
            {/* Table Controller Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 20px",
                borderBottom: cardBorder,
              }}
            >
              {/* Entries Selector */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: textMuted }}>
                <select
                  value={entriesPerPage}
                  onChange={(e) => setEntriesPerPage(parseInt(e.target.value, 10))}
                  style={{
                    background: inputBg,
                    border: cardBorder,
                    borderRadius: "4px",
                    padding: "4px 8px",
                    color: textPrimary,
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span>entries per page</span>
              </div>

              {/* Search Box */}
              <div style={{ position: "relative", width: "220px" }}>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "6px 12px 6px 32px",
                    fontSize: "13px",
                    background: inputBg,
                    border: cardBorder,
                    borderRadius: "4px",
                    color: textPrimary,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <Search size={14} style={{ position: "absolute", left: "10px", top: "9px", color: textMuted }} />
              </div>
            </div>

            {/* Table Container */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: tableHeaderBg, borderBottom: tableHeaderBorder }}>
                    <th style={{ padding: "12px 20px", fontWeight: 600, color: textMuted }}>Client Name</th>
                    <th style={{ padding: "12px 20px", fontWeight: 600, color: textMuted }}>Search Type</th>
                    <th style={{ padding: "12px 20px", fontWeight: 600, color: textMuted }}>Jurisdiction (State/County)</th>
                    <th style={{ padding: "12px 20px", fontWeight: 600, color: textMuted }}>Researcher</th>
                    <th style={{ padding: "12px 20px", fontWeight: 600, color: textMuted, textAlign: "right" }}>Cost</th>
                    <th style={{ padding: "12px 20px", fontWeight: 600, color: textMuted, textAlign: "right" }}>Turnaround Time</th>
                    <th style={{ padding: "12px 20px", fontWeight: 600, color: textMuted }}>Date of Search</th>
                  </tr>
                </thead>
                <tbody>
                  {displayRows.map((row) => (
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
                      {/* Clickable Client Name Link */}
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

                      {/* Search Type */}
                      <td style={{ padding: "12px 20px", color: textPrimary }}>
                        {row.searchType}
                      </td>

                      {/* State / County */}
                      <td style={{ padding: "12px 20px", color: textPrimary }}>
                        {row.state} / {row.county}
                      </td>

                      {/* Researcher */}
                      <td style={{ padding: "12px 20px", color: textPrimary }}>
                        {row.researcher}
                      </td>

                      {/* Cost */}
                      <td style={{ padding: "12px 20px", color: textPrimary, textAlign: "right", fontWeight: 600 }}>
                        ₹{row.cost.toFixed(2)}
                      </td>

                      {/* Turnaround Time */}
                      <td style={{ padding: "12px 20px", color: textPrimary, textAlign: "right" }}>
                        {row.tat} hours
                      </td>

                      {/* Date */}
                      <td style={{ padding: "12px 20px", color: textPrimary }}>
                        {row.date}
                      </td>
                    </tr>
                  ))}
                  {filteredRows.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ padding: "24px", color: textMuted, textAlign: "center" }}>
                        No jurisdiction searches matched the selected criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Total Summary Footer */}
            {filteredRows.length > 0 && (
              <div
                style={{
                  padding: "16px 20px",
                  background: tableHeaderBg,
                  borderTop: tableHeaderBorder,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ fontSize: "13px", color: textMuted }}>
                  Total Searches: <strong style={{ color: textPrimary }}>{filteredRows.length}</strong>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: textPrimary }}>
                  <span style={{ fontWeight: 500 }}>Total Cost:</span>
                  <span style={{ fontSize: "16px", fontWeight: 700, color: primaryBrandColor }}>
                    ₹{totalCost.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
