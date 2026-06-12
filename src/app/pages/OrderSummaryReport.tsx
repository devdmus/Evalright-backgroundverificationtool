import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { ORDERS } from "../data/mockData";
import { Footer } from "../components/Footer";

interface CalendarDay {
  dateStr: string;
  dayNum: number;
  isCurrentMonth: boolean;
  isPrevMonth: boolean;
  isNextMonth: boolean;
}

function getCalendarGrid(year: number, month: number): CalendarDay[] {
  const grid: CalendarDay[] = [];
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInCurrent = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const dayNum = daysInPrev - i;
    const dateStr = `${prevYear}-${(prevMonth + 1).toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
    grid.push({
      dateStr,
      dayNum,
      isCurrentMonth: false,
      isPrevMonth: true,
      isNextMonth: false
    });
  }
  
  for (let i = 1; i <= daysInCurrent; i++) {
    const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
    grid.push({
      dateStr,
      dayNum: i,
      isCurrentMonth: true,
      isPrevMonth: false,
      isNextMonth: false
    });
  }
  
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  const remaining = 42 - grid.length;
  for (let i = 1; i <= remaining; i++) {
    const dateStr = `${nextYear}-${(nextMonth + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
    grid.push({
      dateStr,
      dayNum: i,
      isCurrentMonth: false,
      isPrevMonth: false,
      isNextMonth: true
    });
  }
  
  return grid;
}

interface DateRangePickerProps {
  value: string;
  onChange: (val: string) => void;
}

function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const parts = value.split(" to ");
  const startDateStr = parts[0]?.trim() || "";
  const endDateStr = parts[1]?.trim() || "";

  const [viewMonth, setViewMonth] = useState(2); // March
  const [viewYear, setViewYear] = useState(2026);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  function handlePrevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  }

  function handleNextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  }

  function handleDayClick(dateStr: string) {
    if (!startDateStr || (startDateStr && endDateStr)) {
      onChange(`${dateStr} to `);
    } else {
      if (dateStr < startDateStr) {
        onChange(`${dateStr} to `);
      } else {
        onChange(`${startDateStr} to ${dateStr}`);
        setIsOpen(false);
      }
    }
  }

  const calendarDays = getCalendarGrid(viewYear, viewMonth);

  return (
    <div ref={containerRef} style={{ position: "relative", width: "260px" }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: "#FFFFFF",
          border: "1px solid #cbd5e1",
          borderRadius: "4px",
          padding: "6px 12px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "56px",
          width: "100%",
          boxSizing: "border-box",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <label style={{ fontSize: "12px", color: "#9CA3AF", fontWeight: 400, marginBottom: "2px", cursor: "pointer" }}>
          Order Date Range
        </label>
        <div style={{ fontSize: "14px", color: value ? "#333" : "#9CA3AF", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {value || ""}
        </div>
      </div>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: "0",
            width: "320px",
            background: "#FFFFFF",
            border: "1px solid #cbd5e1",
            borderRadius: "4px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            zIndex: 1000,
            boxSizing: "border-box",
            paddingBottom: "8px",
          }}
        >
          {/* Triangle Pointer */}
          <div
            style={{
              position: "absolute",
              top: "-6px",
              left: "24px",
              width: "0",
              height: "0",
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderBottom: "6px solid #C70039",
            }}
          />

          {/* Header */}
          <div
            style={{
              background: "#C70039",
              color: "#FFFFFF",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 14px",
              borderTopLeftRadius: "3px",
              borderTopRightRadius: "3px",
            }}
          >
            <button
              onClick={handlePrevMonth}
              style={{ background: "none", border: "none", color: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center" }}
            >
              <ChevronLeft size={16} />
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 600, fontSize: "16px" }}>
              <span>{monthNames[viewMonth]}</span>
              <ChevronDown size={14} style={{ marginTop: "2px" }} />
              <span>{viewYear}</span>
            </div>
            <button
              onClick={handleNextMonth}
              style={{ background: "none", border: "none", color: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center" }}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Weekday labels */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              textAlign: "center",
              padding: "8px 8px 4px 8px",
              fontWeight: 600,
              fontSize: "13px",
              color: "#4B5563",
            }}
          >
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} style={{ padding: "4px 0" }}>{day}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              padding: "0 8px",
              rowGap: "2px",
            }}
          >
            {calendarDays.map((day) => {
              const { dateStr, dayNum, isCurrentMonth } = day;
              
              const isStart = dateStr === startDateStr;
              const isEnd = dateStr === endDateStr;
              
              const inRange =
                startDateStr &&
                endDateStr &&
                dateStr > startDateStr &&
                dateStr < endDateStr;

              let cellBg = "transparent";
              if (inRange) {
                cellBg = "#EAEAEA";
              } else if (isStart && endDateStr) {
                cellBg = "linear-gradient(90deg, transparent 50%, #EAEAEA 50%)";
              } else if (isEnd) {
                cellBg = "linear-gradient(90deg, #EAEAEA 50%, transparent 50%)";
              }

              let dayBg = "transparent";
              let dayColor = "#374151";
              let dayWeight = "normal";

              if (isStart || isEnd) {
                dayBg = "#C70039";
                dayColor = "#FFFFFF";
                dayWeight = "bold";
              } else if (inRange) {
                dayColor = "#C70039";
                dayWeight = "500";
              } else if (!isCurrentMonth) {
                dayColor = "#D1D5DB";
              }

              return (
                <div
                  key={dateStr}
                  onClick={() => handleDayClick(dateStr)}
                  style={{
                    background: cellBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "36px",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: dayBg,
                      color: dayColor,
                      fontWeight: dayWeight as any,
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {dayNum}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function OrderSummaryReport() {
  const [scope, setScope] = useState<"all" | "logged-in">("all");
  const [dateRange, setDateRange] = useState("");

  function handleDownloadCSV() {
    let list = ORDERS;
    
    // Filter by scope
    if (scope === "logged-in") {
      list = ORDERS.filter((o) => o.orderedBy === "Suresh Ramakoti");
    }

    // Filter by date range if selected
    if (dateRange && dateRange.includes(" to ")) {
      const parts = dateRange.split(" to ");
      const start = parts[0]?.trim();
      const end = parts[1]?.trim();
      if (start) {
        list = list.filter((o) => o.orderDate >= start);
      }
      if (end) {
        list = list.filter((o) => o.orderDate <= end);
      }
    }

    // Generate CSV content
    const headers = ["Order ID", "Applicant Name", "Order Date", "Verification Type", "Status", "Ordered By"];
    const rows = list.map((o) => [
      o.searchId,
      o.applicantName,
      o.orderDate,
      o.verificationType,
      o.status,
      o.orderedBy,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map(val => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Order_Summary_Report_${scope}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, fontFamily: "'Wix Madefor Display', sans-serif" }}>
      <div style={{ flex: 1, padding: "16px 20px", background: "#F5F5F5", overflowY: "auto" }}>
        
        {/* Page Title */}
        <h1 style={{ fontSize: "20px", fontWeight: 500, color: "rgb(199, 0, 57)", marginBottom: "14px" }}>
          Order Summary Report
        </h1>

        {/* Card Container */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: "4px",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          {/* Scope selection block */}
          <div>
            <div style={{ fontSize: "14px", color: "#4B5563", fontWeight: 500, marginBottom: "12px" }}>
              Scope
            </div>
            <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
              
              {/* All users option */}
              <label
                style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", userSelect: "none" }}
                onClick={() => setScope("all")}
              >
                <div
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    border: scope === "all" ? "2px solid #C70039" : "2px solid #D1D5DB",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxSizing: "border-box",
                  }}
                >
                  {scope === "all" && (
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#C70039" }} />
                  )}
                </div>
                <span style={{ fontSize: "14px", color: "#374151" }}>All users</span>
              </label>

              {/* Logged in user only option */}
              <label
                style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", userSelect: "none" }}
                onClick={() => setScope("logged-in")}
              >
                <div
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    border: scope === "logged-in" ? "2px solid #C70039" : "2px solid #D1D5DB",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxSizing: "border-box",
                  }}
                >
                  {scope === "logged-in" && (
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#C70039" }} />
                  )}
                </div>
                <span style={{ fontSize: "14px", color: "#374151" }}>Currently logged-in user only</span>
              </label>

            </div>
          </div>

          {/* Date range picker block */}
          <div>
            <DateRangePicker value={dateRange} onChange={setDateRange} />
          </div>

          {/* Action button block */}
          <div>
            <button
              onClick={handleDownloadCSV}
              style={{
                background: "#C70039",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "4px",
                padding: "0 24px",
                height: "40px",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Download CSV Report
            </button>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}
