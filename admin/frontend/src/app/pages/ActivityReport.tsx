import { useState, useMemo, useEffect, useRef } from "react";
import { Download, FileText, Search, Calendar, Play, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { Footer } from "../components/Footer";
import { CLIENT_LIST, DEMO_CLIENT } from "../data/mockData";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const generateCalendarDays = (month: number, year: number) => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const days: { dayNum: number; isCurrentMonth: boolean; dateString: string }[] = [];

  // Previous month padding
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const dateString = `${String(prevMonth + 1).padStart(2, "0")}/${String(day).padStart(2, "0")}/${prevYear}`;
    days.push({ dayNum: day, isCurrentMonth: false, dateString });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const dateString = `${String(month + 1).padStart(2, "0")}/${String(i).padStart(2, "0")}/${year}`;
    days.push({ dayNum: i, isCurrentMonth: true, dateString });
  }

  // Next month padding
  const totalDays = days.length;
  const nextMonthDaysNeeded = 42 - totalDays;
  for (let i = 1; i <= nextMonthDaysNeeded; i++) {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    const dateString = `${String(nextMonth + 1).padStart(2, "0")}/${String(i).padStart(2, "0")}/${nextYear}`;
    days.push({ dayNum: i, isCurrentMonth: false, dateString });
  }

  return days;
};

interface ClientActivityRow {
  companyName: string;
  searchCount: number;
  totalRevenue: number;
  netRevenue: number;
  grossProfit: number;
  margin: string; // e.g. "66.67%"
  amountInvoiced: number;
}

interface PackageActivityRow {
  name: string;
  volume: number;
}

// 10 Customer rows from screenshot
const CLIENT_ACTIVITY_DATA: ClientActivityRow[] = [
  {
    companyName: "Bean Infosystems LLC",
    searchCount: 2,
    totalRevenue: 34.00,
    netRevenue: 30.00,
    grossProfit: 20.00,
    margin: "66.67%",
    amountInvoiced: 34.00,
  },
  {
    companyName: "Evalright Demo Account",
    searchCount: 1,
    totalRevenue: 75.00,
    netRevenue: 75.00,
    grossProfit: 33.02,
    margin: "44.03%",
    amountInvoiced: 0.00,
  },
  {
    companyName: "GVRINFOTEK LLC",
    searchCount: 6,
    totalRevenue: 70.00,
    netRevenue: 70.00,
    grossProfit: 57.79,
    margin: "82.56%",
    amountInvoiced: 70.00,
  },
  {
    companyName: "Mygo Consulting",
    searchCount: 6,
    totalRevenue: 82.00,
    netRevenue: 82.00,
    grossProfit: 50.45,
    margin: "61.52%",
    amountInvoiced: 82.00,
  },
  {
    companyName: "Pentangle Tech Services",
    searchCount: 15,
    totalRevenue: 245.00,
    netRevenue: 245.00,
    grossProfit: 127.21,
    margin: "51.92%",
    amountInvoiced: 245.00,
  },
  {
    companyName: "Pride Veteran Staffing, Inc",
    searchCount: 8,
    totalRevenue: 74.00,
    netRevenue: 74.00,
    grossProfit: 28.87,
    margin: "39.01%",
    amountInvoiced: 74.00,
  },
  {
    companyName: "Roshan Hospitality Management, LLC",
    searchCount: 7,
    totalRevenue: 85.00,
    netRevenue: 85.00,
    grossProfit: 65.08,
    margin: "76.56%",
    amountInvoiced: 85.00,
  },
  {
    companyName: "Thinklusive Inc",
    searchCount: 2,
    totalRevenue: 41.97,
    netRevenue: 30.00,
    grossProfit: 20.00,
    margin: "66.67%",
    amountInvoiced: 41.97,
  },
  {
    companyName: "Vaspire Technologies INC.",
    searchCount: 2,
    totalRevenue: 30.00,
    netRevenue: 30.00,
    grossProfit: 26.00,
    margin: "86.67%",
    amountInvoiced: 30.00,
  },
  {
    companyName: "VFACT SERVICES",
    searchCount: 1,
    totalRevenue: 30.00,
    netRevenue: 5.00,
    grossProfit: 3.45,
    margin: "69%",
    amountInvoiced: 30.00,
  },
];

// 19 Package/Search entries from screenshot and extended to sum to 50 volume
const PACKAGE_ACTIVITY_DATA: PackageActivityRow[] = [
  { name: "(AF) LabCorp - 10 Panel", volume: 1 },
  { name: "(AF) LabCorp - 8 Panel OXY/ MDMA", volume: 1 },
  { name: "County Criminal", volume: 16 },
  { name: "Driving History", volume: 1 },
  { name: "Education Verification", volume: 1 },
  { name: "Employment Verification", volume: 4 },
  { name: "ES - 4 Panel NO THC (1687)", volume: 1 },
  { name: "FACIS III (Medicaid Exclusions/OIG/EPLS/SAM/OFAC/Disciplinary Boards/Sanctions)", volume: 2 },
  { name: "International Government ID Verification", volume: 1 },
  { name: "SSN Trace/Address History", volume: 10 },
  { name: "Multi-State Criminal Database Search", volume: 5 },
  { name: "Drug Screen 5 Panel (Quest)", volume: 2 },
  { name: "Federal Criminal Search", volume: 2 },
  { name: "Sex Offender Registry Search", volume: 1 },
  { name: "Global Monitor List Search", volume: 1 },
  { name: "OIG Exclusion List", volume: 1 },
  { name: "OFAC/Patriot Act Search", volume: 0 },
  { name: "Employment Verification (Basic)", volume: 0 },
  { name: "Education Verification (Degree)", volume: 0 },
];

interface ActivityReportProps {
  isDarkMode?: boolean;
  onViewClient?: (clientId: string) => void;
}

type DateRangeKey =
  | "today"
  | "yesterday"
  | "current-week"
  | "one-week"
  | "last-week"
  | "current-month"
  | "last-month"
  | "one-month"
  | "six-months"
  | "current-year"
  | "one-year";

const DATE_RANGE_OPTIONS: { key: DateRangeKey; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "current-week", label: "Current Week" },
  { key: "one-week", label: "One Week" },
  { key: "last-week", label: "Last Week" },
  { key: "current-month", label: "Current Month" },
  { key: "last-month", label: "Last Month" },
  { key: "one-month", label: "One Month" },
  { key: "six-months", label: "Six Months" },
  { key: "current-year", label: "Current Year" },
  { key: "one-year", label: "One Year" },
];

function getClientIdByName(name: string): string {
  const match = CLIENT_LIST.find((c) => c.companyName.toLowerCase() === name.toLowerCase());
  return match?.id ?? DEMO_CLIENT.id;
}

export function ActivityReport({ isDarkMode = false, onViewClient }: ActivityReportProps) {
  const [selectedRange, setSelectedRange] = useState<DateRangeKey>("yesterday");
  const [dateFrom, setDateFrom] = useState("06/22/2026");
  const [dateTo, setDateTo] = useState("06/22/2026");
  
  const [clientSearch, setClientSearch] = useState("");
  const [packageSearch, setPackageSearch] = useState("");

  const [activeDateFrom, setActiveDateFrom] = useState("06/22/2026");
  const [activeDateTo, setActiveDateTo] = useState("06/22/2026");

  // Custom Datepicker States
  const [showCalendarFrom, setShowCalendarFrom] = useState(false);
  const [showCalendarTo, setShowCalendarTo] = useState(false);
  const [calendarMonthFrom, setCalendarMonthFrom] = useState(5); // June (0-indexed)
  const [calendarYearFrom, setCalendarYearFrom] = useState(2026);
  const [calendarMonthTo, setCalendarMonthTo] = useState(5); // June (0-indexed)
  const [calendarYearTo, setCalendarYearTo] = useState(2026);

  const calendarFromRef = useRef<HTMLDivElement>(null);
  const calendarToRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarFromRef.current && !calendarFromRef.current.contains(event.target as Node)) {
        setShowCalendarFrom(false);
      }
      if (calendarToRef.current && !calendarToRef.current.contains(event.target as Node)) {
        setShowCalendarTo(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update calendar month/year if values change from radio buttons
  useEffect(() => {
    if (dateFrom.includes("/")) {
      const parts = dateFrom.split("/");
      if (parts.length === 3) {
        const m = parseInt(parts[0], 10) - 1;
        const y = parseInt(parts[2], 10);
        if (!isNaN(m)) setCalendarMonthFrom(m);
        if (!isNaN(y)) setCalendarYearFrom(y);
      }
    }
  }, [dateFrom]);

  useEffect(() => {
    if (dateTo.includes("/")) {
      const parts = dateTo.split("/");
      if (parts.length === 3) {
        const m = parseInt(parts[0], 10) - 1;
        const y = parseInt(parts[2], 10);
        if (!isNaN(m)) setCalendarMonthTo(m);
        if (!isNaN(y)) setCalendarYearTo(y);
      }
    }
  }, [dateTo]);

  // Format currency helpers
  const formatCurrency = (val: number) => {
    return `₹${val.toFixed(2)}`;
  };

  const formatCurrencyOptionalDecimals = (val: number) => {
    if (val === 0) return "₹0.00"; // Replicate screenshot $0.00
    return `₹${val.toFixed(2)}`;
  };

  // Reusable Calendar Dropdown Renderer
  const renderCalendarDropdown = (
    value: string,
    setValue: (val: string) => void,
    show: boolean,
    setShow: (val: boolean) => void,
    month: number,
    setMonth: (m: number) => void,
    year: number,
    setYear: (y: number) => void
  ) => {
    if (!show) return null;

    return (
      <div
        style={{
          position: "absolute",
          top: "100%",
          left: 0,
          marginTop: "8px",
          background: cardBg,
          border: cardBorder,
          borderRadius: "8px",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          zIndex: 1010,
          width: "280px",
          fontFamily: "inherit",
        }}
      >
        <style>{`
          .calendar-day-btn {
            transition: background-color 0.15s ease, color 0.15s ease;
          }
          .calendar-day-btn:hover {
            background-color: ${isDarkMode ? "rgba(255, 255, 255, 0.08)" : "#F3F4F6"} !important;
          }
        `}</style>

        {/* Pointer triangle */}
        <div
          style={{
            position: "absolute",
            top: "-6px",
            left: "24px",
            width: "12px",
            height: "12px",
            background: primaryBrandColor,
            transform: "rotate(45deg)",
            zIndex: 999,
          }}
        />

        {/* Header */}
        <div
          style={{
            background: primaryBrandColor,
            color: "#FFFFFF",
            padding: "12px 14px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
            zIndex: 1000,
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
          }}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (month === 0) {
                setMonth(11);
                setYear(year - 1);
              } else {
                setMonth(month - 1);
              }
            }}
            style={{
              background: "transparent",
              border: "none",
              color: "#FFFFFF",
              fontSize: "16px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "4px",
            }}
          >
            <ChevronLeft size={16} />
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", fontSize: "14px" }}>
            <span>{MONTH_NAMES[month]}</span>
            <ChevronDown size={12} style={{ marginTop: "2px" }} />
            <span style={{ marginLeft: "2px" }}>{year}</span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (month === 11) {
                setMonth(0);
                setYear(year + 1);
              } else {
                setMonth(month + 1);
              }
            }}
            style={{
              background: "transparent",
              border: "none",
              color: "#FFFFFF",
              fontSize: "16px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "4px",
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Weekday headers */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            padding: "8px 0",
            background: "transparent",
            borderBottom: "1px solid " + (isDarkMode ? "#333333" : "#E5E7EB"),
          }}
        >
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              style={{
                textAlign: "center",
                fontSize: "11px",
                fontWeight: 600,
                color: isDarkMode ? "#8391a2" : "#8A8A8A",
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            padding: "8px",
            gap: "4px",
            background: "transparent",
            borderBottomLeftRadius: "8px",
            borderBottomRightRadius: "8px",
          }}
        >
          {generateCalendarDays(month, year).map((day, idx) => {
            const isSelected = day.dateString === value;
            const isToday = day.dateString === "06/23/2026"; // outline on day 23 matching screenshot

            let dayStyle: React.CSSProperties = {
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: isSelected ? 600 : 400,
              borderRadius: "50%",
              cursor: "pointer",
              border: "none",
              background: "transparent",
              color: day.isCurrentMonth
                ? (isDarkMode ? "#E5E7EB" : "#374151")
                : (isDarkMode ? "#4B5563" : "#CCCCCC"),
            };

            if (isSelected) {
              dayStyle = {
                ...dayStyle,
                background: primaryBrandColor,
                color: "#FFFFFF",
              };
            } else if (isToday) {
              dayStyle = {
                ...dayStyle,
                border: `1.5px solid ${primaryBrandColor}`,
              };
            }

            return (
              <button
                key={idx}
                type="button"
                className="calendar-day-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setValue(day.dateString);
                  setShow(false);
                }}
                style={dayStyle}
              >
                {day.dayNum}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Date Range click handler to automatically adjust inputs
  const handleRangeChange = (range: DateRangeKey) => {
    setSelectedRange(range);
    
    // Simulate setting date values relative to 06/23/2026 (assuming yesterday is 06/22/2026)
    switch (range) {
      case "today":
        setDateFrom("06/23/2026");
        setDateTo("06/23/2026");
        break;
      case "yesterday":
        setDateFrom("06/22/2026");
        setDateTo("06/22/2026");
        break;
      case "current-week":
        setDateFrom("06/21/2026");
        setDateTo("06/23/2026");
        break;
      case "one-week":
        setDateFrom("06/16/2026");
        setDateTo("06/23/2026");
        break;
      case "last-week":
        setDateFrom("06/14/2026");
        setDateTo("06/20/2026");
        break;
      case "current-month":
        setDateFrom("06/01/2026");
        setDateTo("06/23/2026");
        break;
      case "last-month":
        setDateFrom("05/01/2026");
        setDateTo("05/31/2026");
        break;
      case "one-month":
        setDateFrom("05/23/2026");
        setDateTo("06/23/2026");
        break;
      case "six-months":
        setDateFrom("12/23/2025");
        setDateTo("06/23/2026");
        break;
      case "current-year":
        setDateFrom("01/01/2026");
        setDateTo("06/23/2026");
        break;
      case "one-year":
        setDateFrom("06/23/2025");
        setDateTo("06/23/2026");
        break;
    }
  };

  const handleGenerateReport = () => {
    setActiveDateFrom(dateFrom);
    setActiveDateTo(dateTo);
  };

  // Filter client data based on search
  const filteredClients = useMemo(() => {
    return CLIENT_ACTIVITY_DATA.filter((row) =>
      row.companyName.toLowerCase().includes(clientSearch.toLowerCase())
    );
  }, [clientSearch]);

  // Filter package data based on search
  const filteredPackages = useMemo(() => {
    return PACKAGE_ACTIVITY_DATA.filter((row) =>
      row.name.toLowerCase().includes(packageSearch.toLowerCase())
    );
  }, [packageSearch]);

  // Totals for client table
  const totals = useMemo(() => {
    const counts = filteredClients.reduce((sum, r) => sum + r.searchCount, 0);
    const totalRev = filteredClients.reduce((sum, r) => sum + r.totalRevenue, 0);
    const netRev = filteredClients.reduce((sum, r) => sum + r.netRevenue, 0);
    const profit = filteredClients.reduce((sum, r) => sum + r.grossProfit, 0);
    const invoiced = filteredClients.reduce((sum, r) => sum + r.amountInvoiced, 0);
    const marginPercent = netRev > 0 ? (profit / netRev) * 100 : 0;
    
    return {
      clientCount: filteredClients.length,
      searchCount: counts,
      totalRevenue: totalRev,
      netRevenue: netRev,
      grossProfit: profit,
      amountInvoiced: invoiced,
      margin: `${marginPercent.toFixed(2)}%`,
    };
  }, [filteredClients]);

  // Theme colors
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
        
        {/* Date Filter Card */}
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
          }}
        >
          {/* Report Date Range Label & Radios */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <span style={{ fontSize: "14px", fontWeight: 600, color: textMuted }}>
              Report Date Range:
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px 20px" }}>
              {DATE_RANGE_OPTIONS.map((option) => {
                const isSelected = selectedRange === option.key;
                return (
                  <label
                    key={option.key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "13.5px",
                      color: textPrimary,
                      cursor: "pointer",
                      fontWeight: isSelected ? 500 : 400,
                    }}
                  >
                    <input
                      type="radio"
                      name="report-range"
                      checked={isSelected}
                      onChange={() => handleRangeChange(option.key)}
                      style={{
                        accentColor: primaryBrandColor,
                        width: "15px",
                        height: "15px",
                        cursor: "pointer",
                      }}
                    />
                    <span>{option.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Date Inputs & Button */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "16px" }}>
            
            {/* Date From Custom Input Box */}
            <div
              ref={calendarFromRef}
              onClick={() => setShowCalendarFrom(true)}
              style={{
                background: inputBg,
                border: cardBorder,
                borderRadius: "4px",
                padding: "8px 12px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                height: "58px",
                width: "200px",
                boxSizing: "border-box",
                position: "relative",
                cursor: "pointer",
              }}
            >
              <label style={{ fontSize: "11.5px", color: labelColor, fontWeight: 400, marginBottom: "3px", textAlign: "left" }}>
                Date From
              </label>
              <input
                type="text"
                value={dateFrom}
                onFocus={() => setShowCalendarFrom(true)}
                onChange={(e) => setDateFrom(e.target.value)}
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
              {renderCalendarDropdown(
                dateFrom,
                setDateFrom,
                showCalendarFrom,
                setShowCalendarFrom,
                calendarMonthFrom,
                setCalendarMonthFrom,
                calendarYearFrom,
                setCalendarYearFrom
              )}
            </div>

            {/* Date To Custom Input Box */}
            <div
              ref={calendarToRef}
              onClick={() => setShowCalendarTo(true)}
              style={{
                background: inputBg,
                border: cardBorder,
                borderRadius: "4px",
                padding: "8px 12px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                height: "58px",
                width: "200px",
                boxSizing: "border-box",
                position: "relative",
                cursor: "pointer",
              }}
            >
              <label style={{ fontSize: "11.5px", color: labelColor, fontWeight: 400, marginBottom: "3px", textAlign: "left" }}>
                Date To
              </label>
              <input
                type="text"
                value={dateTo}
                onFocus={() => setShowCalendarTo(true)}
                onChange={(e) => setDateTo(e.target.value)}
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
              {renderCalendarDropdown(
                dateTo,
                setDateTo,
                showCalendarTo,
                setShowCalendarTo,
                calendarMonthTo,
                setCalendarMonthTo,
                calendarYearTo,
                setCalendarYearTo
              )}
            </div>

            {/* Generate Report Button */}
            <button
              type="button"
              onClick={handleGenerateReport}
              style={{
                background: primaryBrandColor,
                color: "#FFFFFF",
                border: "none",
                borderRadius: "4px",
                height: "38px",
                padding: "0 20px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "background 0.15s ease",
                fontFamily: "'Wix Madefor Display', sans-serif",
              }}
            >
              <FileText size={15} />
              Generate Report
            </button>
          </div>
        </div>

        {/* ── Client Activity Report Card ─────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: 600, color: primaryBrandColor, margin: "0px 0px 4px 4px", fontFamily: "'Wix Madefor Display', sans-serif" }}>
            Client Activity Report from {activeDateFrom} → {activeDateTo}
          </h3>

          <div
            style={{
              background: cardBg,
              border: cardBorder,
              borderRadius: "6px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Table Search & Title Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 20px",
                borderBottom: cardBorder,
              }}
            >
              <span style={{ fontSize: "13px", color: textMuted, fontWeight: 500 }}>
                Showing {filteredClients.length} entries
              </span>
              
              {/* Search Box */}
              <div style={{ position: "relative", width: "220px" }}>
                <input
                  type="text"
                  placeholder="Search..."
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
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

            {/* Table */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: tableHeaderBg, borderBottom: tableHeaderBorder }}>
                    <th style={{ padding: "12px 20px", fontWeight: 600, color: textMuted }}>Company Name</th>
                    <th style={{ padding: "12px 20px", fontWeight: 600, color: textMuted, textAlign: "right", width: "130px" }}>Search Count</th>
                    <th style={{ padding: "12px 20px", fontWeight: 600, color: textMuted, textAlign: "right", width: "140px" }}>Total Revenue</th>
                    <th style={{ padding: "12px 20px", fontWeight: 600, color: textMuted, textAlign: "right", width: "140px" }}>Net Revenue</th>
                    <th style={{ padding: "12px 20px", fontWeight: 600, color: textMuted, textAlign: "right", width: "140px" }}>Gross Profit</th>
                    <th style={{ padding: "12px 20px", fontWeight: 600, color: textMuted, textAlign: "right", width: "120px" }}>Margin (%)</th>
                    <th style={{ padding: "12px 20px", fontWeight: 600, color: textMuted, textAlign: "right", width: "160px" }}>Amount Invoiced</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((row, index) => (
                    <tr
                      key={index}
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
                      <td style={{ padding: "12px 20px" }}>
                        <button
                          type="button"
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
                          onClick={() => onViewClient?.(getClientIdByName(row.companyName))}
                        >
                          {row.companyName}
                        </button>
                      </td>
                      <td style={{ padding: "12px 20px", color: primaryBrandColor, textAlign: "right", fontWeight: 500 }}>
                        {row.searchCount}
                      </td>
                      <td style={{ padding: "12px 20px", color: textPrimary, textAlign: "right" }}>
                        {formatCurrency(row.totalRevenue)}
                      </td>
                      <td style={{ padding: "12px 20px", color: textPrimary, textAlign: "right" }}>
                        {formatCurrency(row.netRevenue)}
                      </td>
                      <td style={{ padding: "12px 20px", color: textPrimary, textAlign: "right" }}>
                        {formatCurrency(row.grossProfit)}
                      </td>
                      <td style={{ padding: "12px 20px", color: textPrimary, textAlign: "right" }}>
                        {row.margin}
                      </td>
                      <td style={{ padding: "12px 20px", color: textPrimary, textAlign: "right" }}>
                        {formatCurrencyOptionalDecimals(row.amountInvoiced)}
                      </td>
                    </tr>
                  ))}

                  {/* Summary row */}
                  <tr style={{ background: isDarkMode ? "#2D3039" : "#F3F4F6", fontWeight: "bold" }}>
                    <td style={{ padding: "12px 20px", color: textPrimary }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span>Total:</span>
                        <span style={{ fontSize: "11px", fontWeight: 500, color: textMuted, marginRight: "40px" }}>
                          {totals.clientCount} Clients
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 20px", color: textPrimary, textAlign: "right" }}>
                      {totals.searchCount}
                    </td>
                    <td style={{ padding: "12px 20px", color: primaryBrandColor, textAlign: "right" }}>
                      {formatCurrency(totals.totalRevenue)}
                    </td>
                    <td style={{ padding: "12px 20px", color: primaryBrandColor, textAlign: "right" }}>
                      {formatCurrency(totals.netRevenue)}
                    </td>
                    <td style={{ padding: "12px 20px", color: primaryBrandColor, textAlign: "right" }}>
                      {formatCurrency(totals.grossProfit)}
                    </td>
                    <td style={{ padding: "12px 20px", color: textPrimary, textAlign: "right" }}>
                      {totals.margin}
                    </td>
                    <td style={{ padding: "12px 20px", color: primaryBrandColor, textAlign: "right" }}>
                      {formatCurrency(totals.amountInvoiced)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── Search/Package Activity Card ─────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: 600, color: primaryBrandColor, margin: "0px 0px 4px 4px", fontFamily: "'Wix Madefor Display', sans-serif" }}>
            Search/Package Activity from {activeDateFrom} → {activeDateTo}
          </h3>

          <div
            style={{
              background: cardBg,
              border: cardBorder,
              borderRadius: "6px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Table Search & Title Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 20px",
                borderBottom: cardBorder,
              }}
            >
              <span style={{ fontSize: "13px", color: textMuted, fontWeight: 500 }}>
                Showing {filteredPackages.length} entries
              </span>
              
              {/* Search Box */}
              <div style={{ position: "relative", width: "220px" }}>
                <input
                  type="text"
                  placeholder="Search..."
                  value={packageSearch}
                  onChange={(e) => setPackageSearch(e.target.value)}
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

            {/* Table */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: tableHeaderBg, borderBottom: tableHeaderBorder }}>
                    <th style={{ padding: "12px 20px", fontWeight: 600, color: textMuted }}>Package/Search Name</th>
                    <th style={{ padding: "12px 20px", fontWeight: 600, color: textMuted, textAlign: "right", width: "150px" }}>Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPackages.map((row, index) => (
                    <tr
                      key={index}
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
                      <td style={{ padding: "12px 20px", color: textPrimary }}>
                        {row.name}
                      </td>
                      <td style={{ padding: "12px 20px", color: textPrimary, textAlign: "right", fontWeight: 500 }}>
                        {row.volume}
                      </td>
                    </tr>
                  ))}

                  {/* Summary row */}
                  <tr style={{ background: isDarkMode ? "#2D3039" : "#F3F4F6", fontWeight: "bold" }}>
                    <td style={{ padding: "12px 20px", color: textPrimary }}>
                      Total:
                    </td>
                    <td style={{ padding: "12px 20px", color: textPrimary, textAlign: "right" }}>
                      {filteredPackages.reduce((sum, r) => sum + r.volume, 0)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
