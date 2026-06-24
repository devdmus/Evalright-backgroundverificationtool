import { useState, useMemo, useEffect, useRef } from "react";
import { ChevronDown, Search, Calendar, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { Footer } from "../components/Footer";
import { CLIENT_LIST, DEMO_CLIENT } from "../data/mockData";

interface DailyUsageRow {
  id: string;
  clientName: string;
  activityType: string;
  volume: number;
  time: string;
  amount: number;
}

const MOCK_DAILY_USAGE: Record<string, DailyUsageRow[]> = {
  "06/23/2026": [
    {
      id: "du1",
      clientName: "3A Soft Inc",
      activityType: "County Criminal Search",
      volume: 2,
      time: "06/23/2026 09:15 AM",
      amount: 60.00,
    },
    {
      id: "du2",
      clientName: "4i Americas LLC",
      activityType: "SSN Trace/Address History",
      volume: 5,
      time: "06/23/2026 10:30 AM",
      amount: 40.00,
    },
    {
      id: "du3",
      clientName: "Aasrita Consulting LLC",
      activityType: "Employment Verification",
      volume: 1,
      time: "06/23/2026 11:45 AM",
      amount: 35.00,
    },
    {
      id: "du4",
      clientName: "ABAL Technologies Inc",
      activityType: "Multi-State Criminal Database Search",
      volume: 3,
      time: "06/23/2026 02:00 PM",
      amount: 45.00,
    },
    {
      id: "du5",
      clientName: "ACS Consultancy Services, Inc",
      activityType: "Drug Screen 5 Panel (Quest)",
      volume: 1,
      time: "06/23/2026 04:30 PM",
      amount: 55.00,
    }
  ],
  "06/22/2026": [
    {
      id: "du6",
      clientName: "3i Infotech Inc",
      activityType: "Federal Criminal Search",
      volume: 1,
      time: "06/22/2026 11:00 AM",
      amount: 30.00,
    },
    {
      id: "du7",
      clientName: "AA TECH GROUP LLC",
      activityType: "Education Verification",
      volume: 2,
      time: "06/22/2026 03:15 PM",
      amount: 70.00,
    }
  ]
};

interface DailyUsageReportProps {
  isDarkMode?: boolean;
  onViewClient?: (clientId: string) => void;
}

function getClientIdByName(name: string): string {
  const match = CLIENT_LIST.find((c) => c.companyName.toLowerCase() === name.toLowerCase());
  return match?.id ?? DEMO_CLIENT.id;
}

export function DailyUsageReport({ isDarkMode = false, onViewClient }: DailyUsageReportProps) {
  const [selectedDate, setSelectedDate] = useState("06/24/2026"); // Defaults to today as in the screenshot
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // Calendar popover states
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(5); // June
  const [calendarYear, setCalendarYear] = useState(2026);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
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

  // Helper to check if a day is selected
  const isDateSelected = (day: number, isCurrentMonth: boolean, monthOffset: number) => {
    if (!isCurrentMonth || !selectedDate) return false;
    const [m, d, y] = selectedDate.split("/").map(Number);
    return d === day && (m - 1) === (calendarMonth + monthOffset) && y === calendarYear;
  };

  // Custom calendar component
  const renderCalendar = () => {
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
            const isSel = isDateSelected(dayVal, isCurr, cell.monthOffset);
            // Highlight June 23, 2026 as the outline hover/today day (matches screenshot)
            const isOutline = isCurr && dayVal === 23 && calendarMonth === 5 && calendarYear === 2026;

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
                    const targetMonth = calendarMonth + cell.monthOffset;
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
                    const formattedDay = String(dayVal).padStart(2, "0");
                    setSelectedDate(`${formattedMonth}/${formattedDay}/${targetYear}`);
                    setShowCalendar(false);
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

  // Get data for selected date
  const selectedDateData = useMemo(() => {
    return MOCK_DAILY_USAGE[selectedDate] || [];
  }, [selectedDate]);

  // Filtered rows for the table
  const filteredRows = useMemo(() => {
    if (selectedDateData.length === 0) return [];
    if (!searchQuery.trim()) return selectedDateData;

    const q = searchQuery.toLowerCase().trim();
    return selectedDateData.filter(
      (row) =>
        row.clientName.toLowerCase().includes(q) ||
        row.activityType.toLowerCase().includes(q) ||
        row.time.toLowerCase().includes(q) ||
        String(row.volume).includes(q) ||
        String(row.amount).includes(q)
    );
  }, [selectedDateData, searchQuery]);

  const totalVolume = useMemo(() => {
    return filteredRows.reduce((sum, r) => sum + r.volume, 0);
  }, [filteredRows]);

  const totalAmount = useMemo(() => {
    return filteredRows.reduce((sum, r) => sum + r.amount, 0);
  }, [filteredRows]);

  const displayRows = useMemo(() => {
    return filteredRows.slice(0, entriesPerPage);
  }, [filteredRows, entriesPerPage]);

  // Colors
  const primaryBrandColor = isDarkMode ? "#DF2A57" : "#C70039";
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

  const isToday = selectedDate === "06/24/2026";
  const showNoActivity = selectedDateData.length === 0;

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
          Daily Usage Report
        </h1>

        {/* Date Filter Card (Premium Selector) */}
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
          <div style={{ position: "relative", maxWidth: "320px" }} ref={calendarRef}>
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
              <label style={{ fontSize: "11px", color: labelColor, fontWeight: 400, marginBottom: "3px", textAlign: "left" }}>
                Select Date (MM/DD/YYYY)
              </label>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "13px", color: textPrimary }}>{selectedDate}</span>
                <ChevronDown size={14} style={{ color: textMuted }} />
              </div>
            </div>

            {showCalendar && renderCalendar()}
          </div>
        </div>

        {/* ── Conditionals: Blue No Activity Banner or Activity Table ── */}
        {showNoActivity ? (
          /* Light-blue banner alert matches screenshot */
          <div
            style={{
              background: isDarkMode ? "rgba(3, 102, 214, 0.1)" : "#E6F7FF",
              border: "1px solid " + (isDarkMode ? "rgba(3, 102, 214, 0.3)" : "#91D5FF"),
              borderRadius: "4px",
              padding: "14px 24px",
              textAlign: "center",
              fontSize: "14.5px",
              fontWeight: 500,
              color: isDarkMode ? "#58a6ff" : "#0050B3",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.01)",
              marginTop: "5px",
            }}
          >
            {isToday ? "No daily activity found for today." : `No daily activity found for ${selectedDate}.`}
          </div>
        ) : (
          /* Report Table Panel showing Daily Activity */
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
                    <th style={{ padding: "12px 20px", fontWeight: 600, color: textMuted }}>Activity Type / Package</th>
                    <th style={{ padding: "12px 20px", fontWeight: 600, color: textMuted, textAlign: "right" }}>Volume</th>
                    <th style={{ padding: "12px 20px", fontWeight: 600, color: textMuted }}>Activity Time</th>
                    <th style={{ padding: "12px 20px", fontWeight: 600, color: textMuted, textAlign: "right" }}>Amount</th>
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

                      {/* Activity Type */}
                      <td style={{ padding: "12px 20px", color: textPrimary }}>
                        {row.activityType}
                      </td>

                      {/* Volume */}
                      <td style={{ padding: "12px 20px", color: textPrimary, textAlign: "right" }}>
                        {row.volume}
                      </td>

                      {/* Activity Time */}
                      <td style={{ padding: "12px 20px", color: textPrimary }}>
                        {row.time}
                      </td>

                      {/* Amount */}
                      <td style={{ padding: "12px 20px", color: textPrimary, textAlign: "right", fontWeight: 600 }}>
                        ₹{row.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
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
                  Total Volume: <strong style={{ color: textPrimary }}>{totalVolume}</strong>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: textPrimary }}>
                  <span style={{ fontWeight: 500 }}>Total Amount:</span>
                  <span style={{ fontSize: "16px", fontWeight: 700, color: primaryBrandColor }}>
                    ₹{totalAmount.toFixed(2)}
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
