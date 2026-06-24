import { useState, useMemo, useEffect, useRef } from "react";
import { ChevronDown, Search, FileText, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Footer } from "../components/Footer";
import { CLIENT_LIST, DEMO_CLIENT } from "../data/mockData";

interface LostOrderRow {
  id: string;
  clientName: string;
  orderId: string;
  date: string;
  servicePackage: string;
  reasonForLoss: string;
  value: number;
  representative: string;
}

const MOCK_LOST_ORDERS: LostOrderRow[] = [
  {
    id: "o1",
    clientName: "3A Soft Inc",
    orderId: "OL-2026-1001",
    date: "06/24/2026",
    servicePackage: "Standard Background Check",
    reasonForLoss: "Candidate Refused",
    value: 2500,
    representative: "Puneet P"
  },
  {
    id: "o2",
    clientName: "3i Infotech Inc",
    orderId: "OL-2026-1002",
    date: "06/24/2026",
    servicePackage: "(AF) LabCorp - 10 Panel",
    reasonForLoss: "Price Too High",
    value: 4500,
    representative: "Ramesh R"
  },
  {
    id: "o3",
    clientName: "4i Americas LLC",
    orderId: "OL-2026-1003",
    date: "06/23/2026",
    servicePackage: "Employment Verification",
    reasonForLoss: "Verification Timeout",
    value: 1500,
    representative: "Raghu Adaveni"
  },
  {
    id: "o4",
    clientName: "AA TECH GROUP LLC",
    orderId: "OL-2026-1004",
    date: "06/20/2026",
    servicePackage: "Executive Screening Package",
    reasonForLoss: "Cancelled by Client",
    value: 8500,
    representative: "Dinesh Reddy"
  },
  {
    id: "o5",
    clientName: "Aasrita Consulting LLC",
    orderId: "OL-2026-1005",
    date: "06/18/2026",
    servicePackage: "Education Verification",
    reasonForLoss: "Candidate Refused",
    value: 1200,
    representative: "Puneet P"
  },
  {
    id: "o6",
    clientName: "3A Soft Inc",
    orderId: "OL-2026-1006",
    date: "06/15/2026",
    servicePackage: "Driving History Check",
    reasonForLoss: "Expired/No Response",
    value: 1800,
    representative: "Ramesh R"
  },
  {
    id: "o7",
    clientName: "Abacus Service Corporation",
    orderId: "OL-2026-1007",
    date: "06/10/2026",
    servicePackage: "Standard Background Check",
    reasonForLoss: "Price Too High",
    value: 2500,
    representative: "Raghu Adaveni"
  },
  {
    id: "o8",
    clientName: "Action Technology Solutions",
    orderId: "OL-2026-1008",
    date: "05/28/2026",
    servicePackage: "Comprehensive Drug Screening",
    reasonForLoss: "Cancelled by Client",
    value: 5000,
    representative: "Dinesh Reddy"
  },
  {
    id: "o9",
    clientName: "3i Infotech Inc",
    orderId: "OL-2026-1009",
    date: "05/15/2026",
    servicePackage: "Executive Screening Package",
    reasonForLoss: "Verification Timeout",
    value: 8500,
    representative: "Puneet P"
  },
  {
    id: "o10",
    clientName: "Adilink Tech Inc",
    orderId: "OL-2026-1010",
    date: "04/10/2026",
    servicePackage: "Identity & Criminal Search",
    reasonForLoss: "Expired/No Response",
    value: 3200,
    representative: "Ramesh R"
  }
];

const PRESET_DATE_RANGES = [
  "Today",
  "Yesterday",
  "This Week",
  "Last Week",
  "This Month",
  "Last Month",
  "This Year",
  "Custom"
];

const getPresetRange = (preset: string) => {
  const today = new Date(2026, 5, 24); // June 24, 2026
  let start = new Date(today);
  let end = new Date(today);

  switch (preset) {
    case "Today":
      break;
    case "Yesterday":
      start.setDate(today.getDate() - 1);
      end.setDate(today.getDate() - 1);
      break;
    case "This Week": {
      const day = today.getDay(); // 0 is Sunday
      start.setDate(today.getDate() - day);
      end.setDate(today.getDate() + (6 - day));
      break;
    }
    case "Last Week": {
      const day = today.getDay();
      start.setDate(today.getDate() - day - 7);
      end.setDate(today.getDate() - day - 1);
      break;
    }
    case "This Month":
      start = new Date(2026, 5, 1);
      end = new Date(2026, 5, 30);
      break;
    case "Last Month":
      start = new Date(2026, 4, 1);
      end = new Date(2026, 4, 31);
      break;
    case "This Year":
      start = new Date(2026, 0, 1);
      end = new Date(2026, 11, 31);
      break;
    default:
      break;
  }

  const formatDate = (d: Date) => {
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  };

  return { start: formatDate(start), end: formatDate(end) };
};

interface OrderLossReportProps {
  isDarkMode?: boolean;
  onViewClient?: (clientId: string) => void;
}

function getClientIdByName(name: string): string {
  const match = CLIENT_LIST.find((c) => c.companyName.toLowerCase() === name.toLowerCase());
  return match?.id ?? DEMO_CLIENT.id;
}

export function OrderLossReport({ isDarkMode = false, onViewClient }: OrderLossReportProps) {
  const [predefinedRange, setPredefinedRange] = useState("Today");
  const [dateRangeText, setDateRangeText] = useState("06/24/2026 - 06/24/2026");
  const [clientFilter, setClientFilter] = useState("All Clients");

  // Calendar Picker states
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(5); // June
  const [calendarYear, setCalendarYear] = useState(2026);
  const [rangeStart, setRangeStart] = useState<string | null>("06/24/2026");
  const [rangeEnd, setRangeEnd] = useState<string | null>("06/24/2026");

  // Dropdown open states
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Table & Report Generation states
  const [reportGenerated, setReportGenerated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPageNum, setCurrentPageNum] = useState(1);

  // Refs for click outside
  const dropdownRefs = {
    predefined: useRef<HTMLDivElement>(null),
    client: useRef<HTMLDivElement>(null),
    calendar: useRef<HTMLDivElement>(null),
  };

  // Close dropdowns on outside click
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

  // Handle Preset range changes
  const handlePresetChange = (preset: string) => {
    setPredefinedRange(preset);
    if (preset !== "Custom") {
      const { start, end } = getPresetRange(preset);
      setRangeStart(start);
      setRangeEnd(end);
      setDateRangeText(`${start} - ${end}`);
    }
    setActiveDropdown(null);
  };

  const handleGenerateReport = () => {
    setReportGenerated(true);
    setCurrentPageNum(1);
  };

  // Filtered rows calculation
  const filteredRows = useMemo(() => {
    if (!reportGenerated) return [];

    return MOCK_LOST_ORDERS.filter((row) => {
      // Client Filter
      if (clientFilter !== "All Clients" && row.clientName !== clientFilter) {
        return false;
      }

      // Date Range Filter
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

      // Search Box Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          row.clientName.toLowerCase().includes(q) ||
          row.orderId.toLowerCase().includes(q) ||
          row.servicePackage.toLowerCase().includes(q) ||
          row.reasonForLoss.toLowerCase().includes(q) ||
          row.representative.toLowerCase().includes(q) ||
          row.date.toLowerCase().includes(q) ||
          String(row.value).includes(q)
        );
      }

      return true;
    });
  }, [reportGenerated, clientFilter, rangeStart, rangeEnd, searchQuery]);

  // Paginated display rows
  const displayRows = useMemo(() => {
    const startIndex = (currentPageNum - 1) * entriesPerPage;
    return filteredRows.slice(startIndex, startIndex + entriesPerPage);
  }, [filteredRows, currentPageNum, entriesPerPage]);

  const totalPagesCount = useMemo(() => {
    return Math.max(1, Math.ceil(filteredRows.length / entriesPerPage));
  }, [filteredRows, entriesPerPage]);

  // Total Lost Value calculation (₹)
  const totalLostValue = useMemo(() => {
    return filteredRows.reduce((sum, r) => sum + r.value, 0);
  }, [filteredRows]);

  // Colors & Design tokens
  const primaryBrandColor = isDarkMode ? "#DF2A57" : "#C70039";
  const primaryBrandHover = isDarkMode ? "#F23F6C" : "#A60030";
  const bodyBg = isDarkMode ? "#1A1C21" : "#F4F5F7";
  const cardBg = isDarkMode ? "#252830" : "#FFFFFF";
  const cardBorder = isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB";
  const textPrimary = isDarkMode ? "#E5E7EB" : "#374151";
  const textMuted = isDarkMode ? "#8391a2" : "#777777";
  const tableHeaderBg = isDarkMode ? "#2D3039" : "#F3F4F6";
  const tableHeaderBorder = isDarkMode ? "1px solid #3A3E4A" : "1px solid #E5E7EB";
  const tableRowBorder = isDarkMode ? "1px solid #333333" : "1px solid #F3F4F6";
  const tableRowHoverBg = isDarkMode ? "rgba(255, 255, 255, 0.02)" : "#FBFBFB";
  const inputBg = isDarkMode ? "#1A1C21" : "#FFFFFF";
  const labelColor = isDarkMode ? "#8391a2" : "#8A8A8A";

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
    // Default outline on today
    return day === 24 && calendarMonth === 5 && calendarYear === 2026;
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
      setDateRangeText(`${clickedDateStr} - (select end date)`);
      setPredefinedRange("Custom");
    } else {
      const startDate = new Date(rangeStart);
      const clickedDate = new Date(clickedDateStr);
      if (clickedDate < startDate) {
        setRangeStart(clickedDateStr);
        setDateRangeText(`${clickedDateStr} - (select end date)`);
      } else {
        setRangeEnd(clickedDateStr);
        setDateRangeText(`${rangeStart} - ${clickedDateStr}`);
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
              <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "32px" }}>
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

  // Card-style dropdown renderer
  const renderCardDropdown = (
    label: string,
    value: string,
    onSelect: (val: string) => void,
    fieldKey: string,
    options: string[]
  ) => {
    const isOpen = activeDropdown === fieldKey;
    const ref = dropdownRefs[fieldKey as keyof typeof dropdownRefs];

    return (
      <div style={{ position: "relative", flex: 1 }} ref={ref}>
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
              maxHeight: "240px",
              overflowY: "auto",
            }}
          >
            {options.map((opt) => {
              const isSelected = value === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => onSelect(opt)}
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
          Order Loss Report
        </h1>

        {/* Filters Card Panel */}
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
          {/* Row 1: Filters */}
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", width: "100%" }}>
            {renderCardDropdown(
              "Pre-Defined Date Range",
              predefinedRange,
              handlePresetChange,
              "predefined",
              PRESET_DATE_RANGES
            )}

            {/* Custom Date Range Card */}
            <div style={{ position: "relative", flex: 1 }} ref={dropdownRefs.calendar}>
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
                  Custom Date Range
                </label>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13.5px", color: textPrimary }}>
                    {dateRangeText}
                  </span>
                  <Calendar size={15} style={{ color: textMuted }} />
                </div>
              </div>
              {showCalendar && renderRangeCalendar()}
            </div>

            {renderCardDropdown(
              "Client Filter",
              clientFilter,
              (val) => {
                setClientFilter(val);
                setActiveDropdown(null);
              },
              "client",
              ["All Clients", ...CLIENT_LIST.map((c) => c.companyName)]
            )}
          </div>

          {/* Action Row */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: "4px" }}>
            <button
              onClick={handleGenerateReport}
              style={{
                background: primaryBrandColor,
                color: "#FFFFFF",
                border: "none",
                borderRadius: "4px",
                padding: "10px 20px",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "background 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = primaryBrandHover)}
              onMouseLeave={(e) => (e.currentTarget.style.background = primaryBrandColor)}
            >
              <FileText size={16} />
              Generate Report
            </button>
          </div>
        </div>

        {/* Conditional warning banner */}
        {!reportGenerated && (
          <div
            style={{
              background: isDarkMode ? "rgba(245, 158, 11, 0.1)" : "#FEF3C7",
              border: isDarkMode ? "1px solid rgba(245, 158, 11, 0.2)" : "1px solid #FCD34D",
              borderRadius: "4px",
              padding: "12px 16px",
              textAlign: "center",
              fontSize: "14px",
              color: isDarkMode ? "#FBBF24" : "#D97706",
              fontWeight: 400,
              margin: "5px 4px 15px 4px",
            }}
          >
            Please select criteria and generate the report.
          </div>
        )}

        {/* Report Table Panel (Visible after generation) */}
        {reportGenerated && (
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
              margin: "5px 4px 15px 4px",
            }}
          >
            {/* Table Header Controls */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
              {/* Entries per page */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px", color: textPrimary }}>
                <span>Show</span>
                <select
                  value={entriesPerPage}
                  onChange={(e) => {
                    setEntriesPerPage(Number(e.target.value));
                    setCurrentPageNum(1);
                  }}
                  style={{
                    background: inputBg,
                    border: cardBorder,
                    borderRadius: "4px",
                    padding: "4px 8px",
                    color: textPrimary,
                    outline: "none",
                    fontSize: "13px",
                  }}
                >
                  {[10, 25, 50, 100].map((num) => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
                <span>entries</span>
              </div>

              {/* Real-time search */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: inputBg,
                  border: cardBorder,
                  borderRadius: "4px",
                  padding: "6px 12px",
                  width: "250px",
                  boxSizing: "border-box",
                }}
              >
                <Search size={15} style={{ color: textMuted }} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPageNum(1);
                  }}
                  style={{
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    width: "100%",
                    fontSize: "13.5px",
                    color: textPrimary,
                    padding: 0,
                  }}
                />
              </div>
            </div>

            {/* Table wrapper */}
            <div style={{ overflowX: "auto", width: "100%" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13.5px" }}>
                <thead>
                  <tr style={{ background: tableHeaderBg, borderBottom: tableHeaderBorder }}>
                    <th style={{ padding: "12px 16px", fontWeight: 600, color: textMuted }}>Client Name</th>
                    <th style={{ padding: "12px 16px", fontWeight: 600, color: textMuted }}>Order ID</th>
                    <th style={{ padding: "12px 16px", fontWeight: 600, color: textMuted }}>Date</th>
                    <th style={{ padding: "12px 16px", fontWeight: 600, color: textMuted }}>Service/Package</th>
                    <th style={{ padding: "12px 16px", fontWeight: 600, color: textMuted }}>Reason for Loss</th>
                    <th style={{ padding: "12px 16px", fontWeight: 600, color: textMuted }}>Value (₹)</th>
                    <th style={{ padding: "12px 16px", fontWeight: 600, color: textMuted }}>Representative</th>
                  </tr>
                </thead>
                <tbody>
                  {displayRows.length > 0 ? (
                    displayRows.map((row) => (
                      <tr
                        key={row.id}
                        style={{ borderBottom: tableRowBorder, transition: "background 0.15s ease" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = tableRowHoverBg)}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <td style={{ padding: "12px 16px" }}>
                          <button
                            onClick={() => onViewClient?.(getClientIdByName(row.clientName))}
                            style={{
                              background: "transparent",
                              border: "none",
                              color: primaryBrandColor,
                              fontWeight: 500,
                              cursor: "pointer",
                              padding: 0,
                              textAlign: "left",
                              fontFamily: "inherit",
                              fontSize: "inherit",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                          >
                            {row.clientName}
                          </button>
                        </td>
                        <td style={{ padding: "12px 16px", color: textPrimary }}>{row.orderId}</td>
                        <td style={{ padding: "12px 16px", color: textPrimary }}>{row.date}</td>
                        <td style={{ padding: "12px 16px", color: textPrimary }}>{row.servicePackage}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <span
                            style={{
                              background: isDarkMode ? "rgba(239, 68, 68, 0.1)" : "#FEE2E2",
                              color: isDarkMode ? "#F87171" : "#DC2626",
                              padding: "2px 8px",
                              borderRadius: "12px",
                              fontSize: "12px",
                              fontWeight: 500,
                            }}
                          >
                            {row.reasonForLoss}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px", fontWeight: 600, color: textPrimary }}>
                          ₹{row.value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td style={{ padding: "12px 16px", color: textPrimary }}>{row.representative}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} style={{ padding: "30px", textAlign: "center", color: textMuted }}>
                        No lost orders matched the selected criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
                {filteredRows.length > 0 && (
                  <tfoot>
                    <tr style={{ background: tableHeaderBg, borderTop: tableHeaderBorder, fontWeight: 600 }}>
                      <td colSpan={5} style={{ padding: "12px 16px", textAlign: "right", color: textPrimary }}>
                        Total Lost Revenue:
                      </td>
                      <td style={{ padding: "12px 16px", color: primaryBrandColor, fontSize: "14px" }}>
                        ₹{totalLostValue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: "12px 16px" }}></td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            {/* Pagination Controls */}
            {filteredRows.length > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginTop: "10px", fontSize: "13px", color: textMuted }}>
                <div>
                  Showing {Math.min(filteredRows.length, (currentPageNum - 1) * entriesPerPage + 1)} to{" "}
                  {Math.min(filteredRows.length, currentPageNum * entriesPerPage)} of {filteredRows.length} entries
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <button
                    disabled={currentPageNum === 1}
                    onClick={() => setCurrentPageNum((p) => p - 1)}
                    style={{
                      background: inputBg,
                      border: cardBorder,
                      color: currentPageNum === 1 ? (isDarkMode ? "#444" : "#ccc") : textPrimary,
                      padding: "6px 10px",
                      borderRadius: "4px",
                      cursor: currentPageNum === 1 ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ChevronLeft size={15} />
                  </button>

                  {Array.from({ length: totalPagesCount }, (_, i) => i + 1).map((page) => {
                    const isAct = page === currentPageNum;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPageNum(page)}
                        style={{
                          background: isAct ? primaryBrandColor : inputBg,
                          color: isAct ? "#FFFFFF" : textPrimary,
                          border: isAct ? "none" : cardBorder,
                          padding: "6px 12px",
                          borderRadius: "4px",
                          fontWeight: isAct ? 600 : 400,
                          cursor: "pointer",
                        }}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    disabled={currentPageNum === totalPagesCount}
                    onClick={() => setCurrentPageNum((p) => p + 1)}
                    style={{
                      background: inputBg,
                      border: cardBorder,
                      color: currentPageNum === totalPagesCount ? (isDarkMode ? "#444" : "#ccc") : textPrimary,
                      padding: "6px 10px",
                      borderRadius: "4px",
                      cursor: currentPageNum === totalPagesCount ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
