import { useState, useMemo, useEffect, useRef } from "react";
import { ChevronDown, Search, FileText, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Footer } from "../components/Footer";
import { CLIENT_LIST, DEMO_CLIENT } from "../data/mockData";

interface GroupReportRow {
  clientName: string;
  firstOrder: string;
  lastOrder: string;
  totalPurchases: number;
}

const CONFIG_GROUPS = [
  "Group #380 (name missing)",
  "Group #381 (name missing)",
  "Group #382 (name missing)",
  "Group #389 (name missing)",
  "Group #714 (name missing)",
  "New Sign-Ups EvalRight",
];

const ORDER_STATUSES = [
  "All Clients",
  "Active Clients",
  "Inactive Clients",
];

// 18 Rows from screenshot
const GROUP_REPORT_DATA: GroupReportRow[] = [
  { clientName: "3A Soft Inc", firstOrder: "07/15/2025 03:20PM", lastOrder: "06/15/2026 11:56AM", totalPurchases: 798.35 },
  { clientName: "3B Healthcare Inc.", firstOrder: "No orders made", lastOrder: "-", totalPurchases: 0.00 },
  { clientName: "3i Infotech Inc", firstOrder: "08/21/2024 05:30PM", lastOrder: "08/29/2024 11:10AM", totalPurchases: 33.50 },
  { clientName: "4i Americas LLC", firstOrder: "01/08/2026 11:41AM", lastOrder: "06/16/2026 01:02PM", totalPurchases: 1582.94 },
  { clientName: "A Fractional CFO, LLC", firstOrder: "No orders made", lastOrder: "-", totalPurchases: 0.00 },
  { clientName: "AA TECH GROUP LLC", firstOrder: "08/16/2023 05:42PM", lastOrder: "11/09/2023 09:03AM", totalPurchases: 201.44 },
  { clientName: "AADYAM TECHNOLOGIES LLC", firstOrder: "06/05/2025 07:44PM", lastOrder: "10/20/2025 05:35PM", totalPurchases: 158.00 },
  { clientName: "Aasrita Consulting LLC", firstOrder: "06/16/2025 12:22PM", lastOrder: "06/04/2026 12:43PM", totalPurchases: 410.50 },
  { clientName: "ABAL Technologies Inc", firstOrder: "07/20/2023 03:03PM", lastOrder: "06/05/2026 09:29AM", totalPurchases: 1320.35 },
  { clientName: "abc", firstOrder: "03/16/2022 02:03PM", lastOrder: "03/16/2022 03:42PM", totalPurchases: 35.85 },
  { clientName: "Accusaga Inc", firstOrder: "10/21/2024 11:48PM", lastOrder: "10/22/2024 06:09AM", totalPurchases: 138.94 },
  { clientName: "Ace IT World, Inc", firstOrder: "No orders made", lastOrder: "-", totalPurchases: 0.00 },
  { clientName: "AceQuest Corporation", firstOrder: "02/26/2025 02:43PM", lastOrder: "02/26/2025 02:43PM", totalPurchases: 57.50 },
  { clientName: "Acetech Group Corporation", firstOrder: "09/08/2025 06:03PM", lastOrder: "04/29/2026 10:32AM", totalPurchases: 2260.88 },
  { clientName: "ACI Infotech Inc", firstOrder: "03/07/2025 03:31PM", lastOrder: "02/17/2026 02:34PM", totalPurchases: 1090.98 },
  { clientName: "ACS Consultancy Services, Inc", firstOrder: "10/30/2025 02:31PM", lastOrder: "06/18/2026 12:31PM", totalPurchases: 314.94 },
  { clientName: "Adept AI Solutions LLC", firstOrder: "02/04/2026 12:42PM", lastOrder: "02/04/2026 12:42PM", totalPurchases: 73.47 },
  { clientName: "Adept Technical Services, Inc", firstOrder: "02/23/2024 04:34PM", lastOrder: "03/18/2025 11:52AM", totalPurchases: 640.47 },
];

interface ClientGroupActivityProps {
  isDarkMode?: boolean;
  onViewClient?: (clientId: string) => void;
}

function getClientIdByName(name: string): string {
  const match = CLIENT_LIST.find((c) => c.companyName.toLowerCase() === name.toLowerCase());
  return match?.id ?? DEMO_CLIENT.id;
}

export function ClientGroupActivity({ isDarkMode = false, onViewClient }: ClientGroupActivityProps) {
  const [selectedGroup, setSelectedGroup] = useState("Group #380 (name missing)");
  const [orderStatus, setOrderStatus] = useState("All Clients");
  const [dateRange, setDateRange] = useState("06/22/2026 - 06/22/2026");

  const [groupSearchText, setGroupSearchText] = useState("");
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // Calendar states
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(5); // June
  const [calendarYear, setCalendarYear] = useState(2026);
  const [rangeStart, setRangeStart] = useState<string | null>("06/22/2026");
  const [rangeEnd, setRangeEnd] = useState<string | null>("06/22/2026");

  const [reportGenerated, setReportGenerated] = useState(false);
  const [activeGroup, setActiveGroup] = useState("");

  const groupDropdownRef = useRef<HTMLDivElement>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (groupDropdownRef.current && !groupDropdownRef.current.contains(event.target as Node)) {
        setShowGroupDropdown(false);
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    // Default outline for June 23, 2026 (hover/today date) to match the screenshot
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

  // Custom range calendar component
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
              <span>{months[calendarMonth]}</span>
              <ChevronDown size={12} style={{ color: "#FFFFFF" }} />
            </div>
            <span style={{ marginLeft: "4px" }}>{calendarYear}</span>
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
            const isStartDay = isStart(dayVal, isCurr, cell.monthOffset);
            const isEndDay = isEnd(dayVal, isCurr, cell.monthOffset);
            
            const isSel = isStartDay || isEndDay;
            const isOutline = !isStartDay && isEndDay;

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
                  onClick={() => handleDayClick(dayVal, cell.monthOffset)}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    border: isStartDay
                      ? "none"
                      : isOutline
                      ? `2px solid ${primaryBrandColor}`
                      : "none",
                    background: isStartDay ? primaryBrandColor : "transparent",
                    color: isStartDay
                      ? "#FFFFFF"
                      : isCurr
                      ? textPrimary
                      : isDarkMode
                      ? "#555555"
                      : "#CCCCCC",
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
                  onMouseEnter={(e) => {
                    if (!isStartDay && !isOutline) {
                      e.currentTarget.style.background = isDarkMode ? "#33353F" : "#F3F4F6";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isStartDay && !isOutline) {
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

  const handleGenerateReport = () => {
    setReportGenerated(true);
    setActiveGroup(selectedGroup);
  };

  // Filter groups in dropdown
  const filteredGroups = useMemo(() => {
    return CONFIG_GROUPS.filter((g) =>
      g.toLowerCase().includes(groupSearchText.toLowerCase())
    );
  }, [groupSearchText]);

  // If active group is not New Sign-Ups, render an empty/smaller report
  const tableData = useMemo(() => {
    if (activeGroup === "New Sign-Ups EvalRight") {
      return GROUP_REPORT_DATA;
    }
    // Replicate empty or placeholder records for other groups
    return [
      { clientName: "Evalright Demo Account", firstOrder: "No orders made", lastOrder: "-", totalPurchases: 0.00 }
    ];
  }, [activeGroup]);

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
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: bodyBg }}>
      <div
        style={{
          flex: "20 1 0%",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          overflowY: "auto",
        }}
      >
        
        {/* Page Title */}
        <h1 style={{ fontSize: "20px", fontWeight: 600, color: primaryBrandColor, margin: "10px 0px 10px 4px", fontFamily: "'Wix Madefor Display', sans-serif" }}>
          Generate Client Config Group Report
        </h1>

        {/* Filters Grid Card */}
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
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.2fr", gap: "16px" }}>
            
            {/* Configuration Group Dropdown */}
            <div style={{ position: "relative" }} ref={groupDropdownRef}>
              <div
                onClick={() => {
                  setShowGroupDropdown(!showGroupDropdown);
                  setShowStatusDropdown(false);
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
                  Configuration Group
                </label>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13.5px", color: textPrimary }}>{selectedGroup}</span>
                  <ChevronDown size={15} style={{ color: textMuted }} />
                </div>
              </div>

              {showGroupDropdown && (
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
                    maxHeight: "260px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Dropdown Search Box */}
                  <div style={{ padding: "8px", borderBottom: cardBorder }}>
                    <div style={{ position: "relative" }}>
                      <input
                        type="text"
                        placeholder="Search..."
                        value={groupSearchText}
                        onChange={(e) => setGroupSearchText(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "6px 8px 6px 28px",
                          fontSize: "12.5px",
                          background: inputBg,
                          border: cardBorder,
                          borderRadius: "4px",
                          color: textPrimary,
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      />
                      <Search size={13} style={{ position: "absolute", left: "8px", top: "8px", color: textMuted }} />
                    </div>
                  </div>

                  {/* Options List */}
                  <div style={{ overflowY: "auto", display: "flex", flexDirection: "column" }}>
                    {filteredGroups.map((group) => {
                      const isSelected = selectedGroup === group;
                      return (
                        <button
                          key={group}
                          type="button"
                          onClick={() => {
                            setSelectedGroup(group);
                            setShowGroupDropdown(false);
                            setGroupSearchText("");
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
                            transition: "background 0.1s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = isDarkMode ? "#33353F" : "#F3F4F6")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          {group}
                        </button>
                      );
                    })}
                    {filteredGroups.length === 0 && (
                      <div style={{ padding: "12px 16px", fontSize: "13px", color: textMuted, textAlign: "center" }}>
                        No groups found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Client Order Status Dropdown */}
            <div style={{ position: "relative" }} ref={statusDropdownRef}>
              <div
                onClick={() => {
                  setShowStatusDropdown(!showStatusDropdown);
                  setShowGroupDropdown(false);
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
                  Client Order Status
                </label>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13.5px", color: textPrimary }}>{orderStatus}</span>
                  <ChevronDown size={15} style={{ color: textMuted }} />
                </div>
              </div>

              {showStatusDropdown && (
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
                  {ORDER_STATUSES.map((status) => {
                    const isSelected = orderStatus === status;
                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => {
                          setOrderStatus(status);
                          setShowStatusDropdown(false);
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
                        {status}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Date Range Clickable Card Input */}
            <div style={{ position: "relative" }} ref={calendarRef}>
              <div
                onClick={() => {
                  setShowCalendar(!showCalendar);
                  setShowGroupDropdown(false);
                  setShowStatusDropdown(false);
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
                  Date Range
                </label>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13.5px", color: textPrimary }}>{dateRange}</span>
                  <Calendar size={15} style={{ color: textMuted }} />
                </div>
              </div>

              {showCalendar && renderRangeCalendar()}
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
            >
              <FileText size={15} />
              Generate Report
            </button>
          </div>
        </div>

        {/* ── Conditionals: Banner or Table ───────────────────────────────────── */}
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
            }}
          >
            Please select your criteria and generate the report.
          </div>
        ) : (
          /* Generated Report Card */
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
            
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
              {/* Card Header Title */}
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: cardBorder,
                }}
              >
                <h2 style={{ fontSize: "15px", fontWeight: 600, color: textTitle, margin: 0, fontFamily: "'Wix Madefor Display', sans-serif" }}>
                  Group Report
                </h2>
              </div>

              {/* Table Container */}
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ background: tableHeaderBg, borderBottom: tableHeaderBorder }}>
                      <th style={{ padding: "12px 20px", fontWeight: 600, color: textMuted }}>Client (Company Name)</th>
                      <th style={{ padding: "12px 20px", fontWeight: 600, color: textMuted, width: "180px" }}>First Order</th>
                      <th style={{ padding: "12px 20px", fontWeight: 600, color: textMuted, width: "180px" }}>Last Order</th>
                      <th style={{ padding: "12px 20px", fontWeight: 600, color: textMuted, textAlign: "right", width: "180px" }}>Total Purchases (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, index) => (
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
                            onClick={() => onViewClient?.(getClientIdByName(row.clientName))}
                          >
                            {row.clientName}
                          </button>
                        </td>
                        <td style={{ padding: "12px 20px", color: textPrimary }}>
                          {row.firstOrder}
                        </td>
                        <td style={{ padding: "12px 20px", color: textPrimary }}>
                          {row.lastOrder}
                        </td>
                        <td style={{ padding: "12px 20px", color: textPrimary, textAlign: "right", fontWeight: 500 }}>
                          {row.totalPurchases.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        )}

      </div>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
