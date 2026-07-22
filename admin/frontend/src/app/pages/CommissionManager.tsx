import { useState, useMemo, useEffect, useRef } from "react";
import { ChevronDown, Search, Eye, X, Calendar, ArrowRight } from "lucide-react";
import { Footer } from "../components/Footer";
import { CLIENT_LIST, DEMO_CLIENT } from "../data/mockData";

interface CommissionRow {
  id: string;
  clientName: string;
  invoiceNumber: string;
  invoiceDate: string;
  invoiceAmount: number;
  rate: number;
  amount: number;
  status: "Paid" | "Unpaid";
  salesperson: string;
  commissionType: "Sales Person" | "Manager";
}

const MOCK_COMMISSIONS: CommissionRow[] = [
  {
    id: "com1",
    clientName: "3A Soft Inc",
    invoiceNumber: "INV-2026-001",
    invoiceDate: "06/15/2026",
    invoiceAmount: 1500.00,
    rate: 10,
    amount: 150.00,
    status: "Unpaid",
    salesperson: "Ramesh R",
    commissionType: "Sales Person",
  },
  {
    id: "com2",
    clientName: "3i Infotech Inc",
    invoiceNumber: "INV-2026-002",
    invoiceDate: "06/12/2026",
    invoiceAmount: 2500.00,
    rate: 10,
    amount: 250.00,
    status: "Unpaid",
    salesperson: "Ramesh R",
    commissionType: "Sales Person",
  },
  {
    id: "com3",
    clientName: "4i Americas LLC",
    invoiceNumber: "INV-2026-003",
    invoiceDate: "06/10/2026",
    invoiceAmount: 800.00,
    rate: 8,
    amount: 64.00,
    status: "Paid",
    salesperson: "Ramesh R",
    commissionType: "Sales Person",
  },
  {
    id: "com4",
    clientName: "A Fractional CFO, LLC",
    invoiceNumber: "INV-2026-004",
    invoiceDate: "05/20/2026",
    invoiceAmount: 3200.00,
    rate: 12,
    amount: 384.00,
    status: "Unpaid",
    salesperson: "Ramesh R",
    commissionType: "Sales Person",
  },
  {
    id: "com5",
    clientName: "AA TECH GROUP LLC",
    invoiceNumber: "INV-2026-005",
    invoiceDate: "05/18/2026",
    invoiceAmount: 1200.00,
    rate: 10,
    amount: 120.00,
    status: "Paid",
    salesperson: "Ramesh R",
    commissionType: "Sales Person",
  },
  {
    id: "com6",
    clientName: "AADYAM TECHNOLOGIES LLC",
    invoiceNumber: "INV-2026-006",
    invoiceDate: "06/01/2026",
    invoiceAmount: 4500.00,
    rate: 10,
    amount: 450.00,
    status: "Unpaid",
    salesperson: "Raghu Adaveni",
    commissionType: "Sales Person",
  },
  {
    id: "com7",
    clientName: "Aasrita Consulting LLC",
    invoiceNumber: "INV-2026-007",
    invoiceDate: "05/25/2026",
    invoiceAmount: 2000.00,
    rate: 8,
    amount: 160.00,
    status: "Paid",
    salesperson: "Raghu Adaveni",
    commissionType: "Sales Person",
  },
  {
    id: "com8",
    clientName: "ABAL Technologies Inc",
    invoiceNumber: "INV-2026-008",
    invoiceDate: "04/15/2026",
    invoiceAmount: 5000.00,
    rate: 10,
    amount: 500.00,
    status: "Unpaid",
    salesperson: "Dinesh Reddy",
    commissionType: "Sales Person",
  },
  {
    id: "com9",
    clientName: "ACS Consultancy Services, Inc",
    invoiceNumber: "INV-2026-009",
    invoiceDate: "06/08/2026",
    invoiceAmount: 1800.00,
    rate: 15,
    amount: 270.00,
    status: "Unpaid",
    salesperson: "Ramesh R",
    commissionType: "Manager",
  },
  {
    id: "com10",
    clientName: "Amity Tech Corporation",
    invoiceNumber: "INV-2026-010",
    invoiceDate: "05/14/2026",
    invoiceAmount: 2200.00,
    rate: 12,
    amount: 264.00,
    status: "Paid",
    salesperson: "Ramesh R",
    commissionType: "Manager",
  }
];

const SALES_PERSONS = ["Ramesh R", "Raghu Adaveni", "Dinesh Reddy", "Admin User"];

interface CommissionManagerProps {
  isDarkMode?: boolean;
  onViewClient?: (clientId: string) => void;
}

function getClientIdByName(name: string): string {
  const match = CLIENT_LIST.find((c) => c.companyName.toLowerCase() === name.toLowerCase());
  return match?.id ?? DEMO_CLIENT.id;
}

export function CommissionManager({ isDarkMode = false, onViewClient }: CommissionManagerProps) {
  // Primary States
  const [selectedSalesPerson, setSelectedSalesPerson] = useState("");
  const [commissionType, setCommissionType] = useState<"Sales Person" | "Manager" | "">("");
  
  // Advanced States (Revealed dynamically)
  const [showCommissions, setShowCommissions] = useState<"Unpaid" | "Paid" | "All">("Unpaid");
  const [predefinedRange, setPredefinedRange] = useState<"This month" | "Last month" | "Last year" | "">("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedClient, setSelectedClient] = useState("");

  // Report table states
  const [reportGenerated, setReportGenerated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // Dropdown open states
  const [showSalesPersonDropdown, setShowSalesPersonDropdown] = useState(false);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  
  // Calendar open states
  const [showCalendarFrom, setShowCalendarFrom] = useState(false);
  const [showCalendarTo, setShowCalendarTo] = useState(false);
  const [calendarMonthFrom, setCalendarMonthFrom] = useState(5); // June (0-indexed)
  const [calendarYearFrom, setCalendarYearFrom] = useState(2026);
  const [calendarMonthTo, setCalendarMonthTo] = useState(5); // June (0-indexed)
  const [calendarYearTo, setCalendarYearTo] = useState(2026);

  // Refs for click outside
  const salesPersonRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<HTMLDivElement>(null);
  const calendarFromRef = useRef<HTMLDivElement>(null);
  const calendarToRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (salesPersonRef.current && !salesPersonRef.current.contains(event.target as Node)) {
        setShowSalesPersonDropdown(false);
      }
      if (clientRef.current && !clientRef.current.contains(event.target as Node)) {
        setShowClientDropdown(false);
      }
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

  // Preset date ranges handler
  const handlePresetDateRange = (range: "This month" | "Last month" | "Last year") => {
    setPredefinedRange(range);
    const today = new Date(2026, 5, 24); // mock current date as June 24, 2026
    
    if (range === "This month") {
      setDateFrom("06/01/2026");
      setDateTo("06/30/2026");
    } else if (range === "Last month") {
      setDateFrom("05/01/2026");
      setDateTo("05/31/2026");
    } else if (range === "Last year") {
      setDateFrom("01/01/2025");
      setDateTo("12/31/2025");
    }
  };

  const handleGenerateReport = () => {
    if (!selectedSalesPerson || !commissionType) return;
    setReportGenerated(true);
  };

  // Filtered rows for the generated table
  const filteredRows = useMemo(() => {
    if (!reportGenerated) return [];

    return MOCK_COMMISSIONS.filter((row) => {
      // Salesperson filter
      if (row.salesperson !== selectedSalesPerson) return false;
      
      // Commission Type filter
      if (row.commissionType !== commissionType) return false;

      // Status filter
      if (showCommissions !== "All" && row.status !== showCommissions) return false;

      // Client filter
      if (selectedClient && selectedClient !== "Select a client" && row.clientName !== selectedClient) return false;

      // Date range filter
      if (dateFrom) {
        const rowDate = new Date(row.invoiceDate);
        const fromDate = new Date(dateFrom);
        if (rowDate < fromDate) return false;
      }
      if (dateTo) {
        const rowDate = new Date(row.invoiceDate);
        const toDate = new Date(dateTo);
        if (rowDate > toDate) return false;
      }

      // Search Box filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          row.clientName.toLowerCase().includes(q) ||
          row.invoiceNumber.toLowerCase().includes(q) ||
          row.invoiceDate.toLowerCase().includes(q) ||
          row.status.toLowerCase().includes(q) ||
          String(row.invoiceAmount).includes(q) ||
          String(row.amount).includes(q)
        );
      }

      return true;
    });
  }, [reportGenerated, selectedSalesPerson, commissionType, showCommissions, selectedClient, dateFrom, dateTo, searchQuery]);

  const totalCommissionAmount = useMemo(() => {
    return filteredRows.reduce((sum, r) => sum + r.amount, 0);
  }, [filteredRows]);

  const displayRows = useMemo(() => {
    return filteredRows.slice(0, entriesPerPage);
  }, [filteredRows, entriesPerPage]);

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

  // Helper to generate full calendar days grid (including prev/next month tails)
  const getCalendarDays = (year: number, month: number) => {
    const days = [];
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Previous month days tail
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        monthOffset: -1,
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        monthOffset: 0,
      });
    }
    
    // Next month days head
    const totalSlots = days.length <= 35 ? 35 : 42;
    const nextMonthDaysNeeded = totalSlots - days.length;
    for (let i = 1; i <= nextMonthDaysNeeded; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        monthOffset: 1,
      });
    }
    
    return days;
  };

  // Helper to check if a day is selected
  const isDateSelected = (
    day: number,
    isCurrentMonth: boolean,
    monthOffset: number,
    calMonth: number,
    calYear: number,
    compareDateStr: string
  ) => {
    if (!isCurrentMonth || !compareDateStr) return false;
    const [m, d, y] = compareDateStr.split("/").map(Number);
    return d === day && (m - 1) === (calMonth + monthOffset) && y === calYear;
  };

  // Custom calendar component
  const renderCalendar = (
    month: number,
    setMonth: (m: number) => void,
    year: number,
    setYear: (y: number) => void,
    onSelectDate: (d: string) => void,
    onClose: () => void,
    compareDateStr: string
  ) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const days = getCalendarDays(year, month);

    const handlePrevMonth = () => {
      if (month === 0) {
        setMonth(11);
        setYear(year - 1);
      } else {
        setMonth(month - 1);
      }
    };

    const handleNextMonth = () => {
      if (month === 11) {
        setMonth(0);
        setYear(year + 1);
      } else {
        setMonth(month + 1);
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

        {/* Calendar Header */}
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
            style={{
              background: "transparent",
              border: "none",
              color: "#FFFFFF",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
          >
            &lt;
          </button>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "2px", cursor: "pointer" }}>
              <span>{months[month]}</span>
              <ChevronDown size={12} style={{ color: "#FFFFFF" }} />
            </div>
            <span style={{ marginLeft: "4px" }}>{year}</span>
          </div>
          <button
            type="button"
            onClick={handleNextMonth}
            style={{
              background: "transparent",
              border: "none",
              color: "#FFFFFF",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
          >
            &gt;
          </button>
        </div>

        {/* Week Days */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            padding: "10px 14px 4px 14px",
            textAlign: "center",
            borderBottom: isDarkMode ? "1px solid #333" : "1px solid #F0F0F0",
          }}
        >
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <span key={d} style={{ fontSize: "11px", fontWeight: 500, color: textMuted }}>
              {d}
            </span>
          ))}
        </div>

        {/* Days Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            rowGap: "6px",
            columnGap: "4px",
            padding: "8px 14px 12px 14px",
          }}
        >
          {days.map((cell, idx) => {
            const isCurr = cell.isCurrentMonth;
            const dayVal = cell.day;
            const isSel = isDateSelected(dayVal, isCurr, cell.monthOffset, month, year, compareDateStr);
            // Highlight June 23, 2026 as the outline hover/today day (matches screenshot)
            const isOutline = isCurr && dayVal === 23 && month === 5 && year === 2026;

            return (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "32px",
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    const targetMonth = month + cell.monthOffset;
                    let targetYear = year;
                    let adjustedMonth = targetMonth;
                    if (targetMonth < 0) {
                      adjustedMonth = 11;
                      targetYear -= 1;
                    } else if (targetMonth > 11) {
                      adjustedMonth = 0;
                      targetYear += 1;
                    }
                    const formattedMonth = String(adjustedMonth + 1).padStart(2, "0");
                    const formattedDay = String(dayVal).padStart(2, "0");
                    onSelectDate(`${formattedMonth}/${formattedDay}/${targetYear}`);
                    onClose();
                  }}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    border: isSel
                      ? "none"
                      : isOutline
                      ? `2px solid ${primaryBrandColor}`
                      : "none",
                    background: isSel ? primaryBrandColor : "transparent",
                    color: isSel
                      ? "#FFFFFF"
                      : isCurr
                      ? textPrimary
                      : isDarkMode
                      ? "#555555"
                      : "#CCCCCC",
                    fontSize: "12px",
                    fontWeight: isSel || isOutline ? 600 : 400,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                    boxSizing: "border-box",
                    transition: "background 0.1s, border 0.1s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSel && !isOutline) {
                      e.currentTarget.style.background = isDarkMode ? "#33353F" : "#F3F4F6";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSel && !isOutline) {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
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

  // Has advanced filter options been revealed?
  const hasAdvancedFilters = selectedSalesPerson !== "";

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
          Commission by Sales Person
        </h1>

        {/* Dynamic Filters Form Panel */}
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
          {/* Sale Person Dropdown */}
          <div style={{ position: "relative", width: "100%" }} ref={salesPersonRef}>
            <div
              onClick={() => setShowSalesPersonDropdown(!showSalesPersonDropdown)}
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
              <label style={{ fontSize: "11px", color: labelColor, fontWeight: 400, marginBottom: "3px", textAlign: "left" }}>
                Sale Person
              </label>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "13px", color: selectedSalesPerson ? textPrimary : textMuted }}>
                  {selectedSalesPerson || "Select a Sales Person"}
                </span>
                <ChevronDown size={14} style={{ color: textMuted }} />
              </div>
            </div>

            {showSalesPersonDropdown && (
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
                {SALES_PERSONS.map((person) => {
                  const isSelected = selectedSalesPerson === person;
                  return (
                    <button
                      key={person}
                      type="button"
                      onClick={() => {
                        setSelectedSalesPerson(person);
                        setShowSalesPersonDropdown(false);
                        setReportGenerated(false); // Reset report when selection changes
                      }}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
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
                      {person}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Commission Type Radios */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", textAlign: "left" }}>
            <span style={{ fontSize: "12px", color: labelColor, fontWeight: 500 }}>
              Commission Type:
            </span>
            <div style={{ display: "flex", gap: "24px" }}>
              {renderRadio("Sales Person", commissionType === "Sales Person", () => {
                setCommissionType("Sales Person");
                setReportGenerated(false);
              })}
              {renderRadio("Manager", commissionType === "Manager", () => {
                setCommissionType("Manager");
                setReportGenerated(false);
              })}
            </div>
          </div>

          {/* Dynamic Revealing Section (Screenshot 2) */}
          {hasAdvancedFilters && commissionType && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "4px" }}>
              {/* Show Commissions */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", textAlign: "left" }}>
                <span style={{ fontSize: "12px", color: labelColor, fontWeight: 500 }}>
                  Show commissions:
                </span>
                <div style={{ display: "flex", gap: "24px" }}>
                  {renderRadio("Unpaid", showCommissions === "Unpaid", () => {
                    setShowCommissions("Unpaid");
                    setReportGenerated(false);
                  })}
                  {renderRadio("Paid", showCommissions === "Paid", () => {
                    setShowCommissions("Paid");
                    setReportGenerated(false);
                  })}
                  {renderRadio("All", showCommissions === "All", () => {
                    setShowCommissions("All");
                    setReportGenerated(false);
                  })}
                </div>
              </div>

              {/* Pre-defined Date Range */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", textAlign: "left" }}>
                <span style={{ fontSize: "12px", color: labelColor, fontWeight: 500 }}>
                  Pre-defined date range:
                </span>
                <div style={{ display: "flex", gap: "24px" }}>
                  {renderRadio("This month", predefinedRange === "This month", () => {
                    handlePresetDateRange("This month");
                    setReportGenerated(false);
                  })}
                  {renderRadio("Last month", predefinedRange === "Last month", () => {
                    handlePresetDateRange("Last month");
                    setReportGenerated(false);
                  })}
                  {renderRadio("Last year", predefinedRange === "Last year", () => {
                    handlePresetDateRange("Last year");
                    setReportGenerated(false);
                  })}
                </div>
              </div>

              {/* Date From & Date To (Grid) */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {/* Date From */}
                <div style={{ position: "relative" }} ref={calendarFromRef}>
                  <div
                    onClick={() => setShowCalendarFrom(!showCalendarFrom)}
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
                    <label style={{ fontSize: "11px", color: labelColor, fontWeight: 400, marginBottom: "3px", textAlign: "left" }}>
                      Date From (MM/DD/YYYY)
                    </label>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "13px", color: dateFrom ? textPrimary : textMuted }}>
                        {dateFrom || "Select a date"}
                      </span>
                      <Calendar size={14} style={{ color: textMuted }} />
                    </div>
                  </div>

                  {showCalendarFrom && renderCalendar(
                    calendarMonthFrom,
                    setCalendarMonthFrom,
                    calendarYearFrom,
                    setCalendarYearFrom,
                    (d) => {
                      setDateFrom(d);
                      setPredefinedRange(""); // Clear preset since user is choosing custom
                    },
                    () => setShowCalendarFrom(false),
                    dateFrom
                  )}
                </div>

                {/* Date To */}
                <div style={{ position: "relative" }} ref={calendarToRef}>
                  <div
                    onClick={() => setShowCalendarTo(!showCalendarTo)}
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
                    <label style={{ fontSize: "11px", color: labelColor, fontWeight: 400, marginBottom: "3px", textAlign: "left" }}>
                      Date To (MM/DD/YYYY)
                    </label>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "13px", color: dateTo ? textPrimary : textMuted }}>
                        {dateTo || "Select a date"}
                      </span>
                      <Calendar size={14} style={{ color: textMuted }} />
                    </div>
                  </div>

                  {showCalendarTo && renderCalendar(
                    calendarMonthTo,
                    setCalendarMonthTo,
                    calendarYearTo,
                    setCalendarYearTo,
                    (d) => {
                      setDateTo(d);
                      setPredefinedRange(""); // Clear preset since user is choosing custom
                    },
                    () => setShowCalendarTo(false),
                    dateTo
                  )}
                </div>
              </div>

              {/* Client Filter Dropdown */}
              <div style={{ position: "relative", width: "100%" }} ref={clientRef}>
                <div
                  onClick={() => setShowClientDropdown(!showClientDropdown)}
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
                  <label style={{ fontSize: "11px", color: labelColor, fontWeight: 400, marginBottom: "3px", textAlign: "left" }}>
                    Client Filter
                  </label>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "13px", color: selectedClient ? textPrimary : textMuted }}>
                      {selectedClient || "Select a client"}
                    </span>
                    <ChevronDown size={14} style={{ color: textMuted }} />
                  </div>
                </div>

                {showClientDropdown && (
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
                      maxHeight: "200px",
                      overflowY: "auto",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedClient("");
                        setShowClientDropdown(false);
                        setReportGenerated(false);
                      }}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        fontSize: "13px",
                        color: textPrimary,
                        background: "transparent",
                        border: "none",
                        textAlign: "left",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = isDarkMode ? "#33353F" : "#F3F4F6")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      Select a client
                    </button>
                    {CLIENT_LIST.map((client) => {
                      const name = client.companyName;
                      const isSelected = selectedClient === name;
                      return (
                        <button
                          key={client.id}
                          type="button"
                          onClick={() => {
                            setSelectedClient(name);
                            setShowClientDropdown(false);
                            setReportGenerated(false);
                          }}
                          style={{
                            width: "100%",
                            padding: "10px 12px",
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
                          {name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Action Button Row */}
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "4px" }}>
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
                    transition: "background 0.15s ease",
                    fontFamily: "'Wix Madefor Display', sans-serif",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = primaryBrandHover)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = primaryBrandColor)}
                >
                  Generate Report
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Report Card Panel (Generated Report Table) ── */}
        {reportGenerated && (
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
              {/* Entries Per Page */}
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
                    <th style={{ padding: "12px 20px", fontWeight: 600, color: textMuted }}>Invoice Number</th>
                    <th style={{ padding: "12px 20px", fontWeight: 600, color: textMuted }}>Invoice Date</th>
                    <th style={{ padding: "12px 20px", fontWeight: 600, color: textMuted, textAlign: "right" }}>Invoice Amount</th>
                    <th style={{ padding: "12px 20px", fontWeight: 600, color: textMuted, textAlign: "right" }}>Commission Rate</th>
                    <th style={{ padding: "12px 20px", fontWeight: 600, color: textMuted, textAlign: "right" }}>Commission Amount</th>
                    <th style={{ padding: "12px 20px", fontWeight: 600, color: textMuted, textAlign: "center" }}>Status</th>
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
                      {/* Clickable Client Name */}
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

                      {/* Invoice Number */}
                      <td style={{ padding: "12px 20px", color: textPrimary }}>
                        {row.invoiceNumber}
                      </td>

                      {/* Invoice Date */}
                      <td style={{ padding: "12px 20px", color: textPrimary }}>
                        {row.invoiceDate}
                      </td>

                      {/* Invoice Amount */}
                      <td style={{ padding: "12px 20px", color: textPrimary, textAlign: "right" }}>
                        ₹{row.invoiceAmount.toFixed(2)}
                      </td>

                      {/* Commission Rate */}
                      <td style={{ padding: "12px 20px", color: textPrimary, textAlign: "right" }}>
                        {row.rate}%
                      </td>

                      {/* Commission Amount */}
                      <td style={{ padding: "12px 20px", color: textPrimary, textAlign: "right", fontWeight: 600 }}>
                        ₹{row.amount.toFixed(2)}
                      </td>

                      {/* Status */}
                      <td style={{ padding: "12px 20px", textAlign: "center" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "3px 8px",
                            borderRadius: "4px",
                            fontSize: "11px",
                            fontWeight: 600,
                            background: row.status === "Paid" ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                            color: row.status === "Paid" ? "#10B981" : "#EF4444",
                          }}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {displayRows.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ padding: "24px", color: textMuted, textAlign: "center" }}>
                        No commission records matched the selected criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Premium Table Footer summary card */}
            {filteredRows.length > 0 && (
              <div
                style={{
                  padding: "16px 20px",
                  background: tableHeaderBg,
                  borderTop: tableHeaderBorder,
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: textPrimary }}>
                  <span style={{ fontWeight: 500 }}>Total Commission:</span>
                  <span style={{ fontSize: "16px", fontWeight: 700, color: primaryBrandColor }}>
                    ₹{totalCommissionAmount.toFixed(2)}
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
