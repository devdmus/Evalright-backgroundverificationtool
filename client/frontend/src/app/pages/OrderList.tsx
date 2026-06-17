import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search, ChevronDown } from "lucide-react";
import { ORDERS, STATUS_STYLES } from "../data/mockData";
import { Footer } from "../components/Footer";
import { getPageTheme } from "../theme/pageTheme";
import { getListPageStyles } from "../theme/listPageStyles";

function getAmountVal(verificationType: string): number {
  switch (verificationType) {
    case "I-9 Verifications (E-Verify)": return 29.00;
    case "Military Service Verification": return 35.00;
    case "SSN Trace/Address History": return 15.00;
    case "Federal Search": return 45.00;
    case "Global Watch List": return 20.00;
    case "Reference Verification": return 30.00;
    case "SSN Trace": return 12.00;
    case "Employment Verification": return 40.00;
    case "Criminal Search": return 45.00;
    case "Education Verification": return 40.00;
    default: return 25.00;
  }
}

function SortIcon({ active, direction, isDarkMode = false }: { active: boolean; direction: "asc" | "desc"; isDarkMode?: boolean }) {
  const colors = getListPageStyles(isDarkMode).sortColors(active, direction);
  return (
    <span style={{ marginLeft: "6px", display: "inline-flex", flexDirection: "column", verticalAlign: "middle", opacity: active ? 1 : 0.35 }}>
      <span style={{ fontSize: "8px", height: "5px", lineHeight: "1", color: colors.asc }}>▲</span>
      <span style={{ fontSize: "8px", height: "5px", lineHeight: "1", color: colors.desc, marginTop: "2px" }}>▼</span>
    </span>
  );
}

interface CalendarDay {
  dateStr: string;
  dayNum: number;
  isCurrentMonth: boolean;
  isPrevMonth: boolean;
  isNextMonth: boolean;
}

function getCalendarGrid(year: number, month: number): CalendarDay[] {
  const grid: CalendarDay[] = [];
  
  // First day of current month (0-6)
  const firstDayIndex = new Date(year, month, 1).getDay();
  
  // Days in current month
  const daysInCurrent = new Date(year, month + 1, 0).getDate();
  
  // Days in previous month
  const daysInPrev = new Date(year, month, 0).getDate();
  
  // 1. Previous month padding days
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
  
  // 2. Current month days
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
  
  // 3. Next month padding days
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
  onLoad: () => void;
  isDarkMode?: boolean;
}

function DateRangePicker({ value, onChange, onLoad, isDarkMode = false }: DateRangePickerProps) {
  const t = getPageTheme(isDarkMode);
  const rangeBg = isDarkMode ? "#3A3D45" : "#EAEAEA";
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse current selected start & end dates
  const parts = value.split(" to ");
  const startDateStr = parts[0]?.trim() || "";
  const endDateStr = parts[1]?.trim() || "";

  // View calendar state defaulting to March 2026 as shown in screenshot
  const [viewMonth, setViewMonth] = useState(2); // 0 = Jan, 1 = Feb, 2 = Mar
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
    <div ref={containerRef} style={{ position: "relative", display: "flex", alignItems: "center", gap: "12px" }}>
      {/* Box Input Wrapper */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: t.inputBg,
          border: t.inputBorder,
          borderRadius: "4px",
          padding: "6px 12px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "56px",
          width: "260px",
          boxSizing: "border-box",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <label style={{ fontSize: "12px", color: t.textMuted, fontWeight: 400, marginBottom: "2px", cursor: "pointer" }}>
          Order Date Range
        </label>
        <div style={{ fontSize: "14px", color: t.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {value}
        </div>
      </div>

      <button
        onClick={onLoad}
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
          alignSelf: "center",
        }}
      >
        Load By Range
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: "0",
            width: "320px",
            background: t.cardBg,
            border: t.inputBorder,
            borderRadius: "4px",
            boxShadow: isDarkMode ? "0 4px 12px rgba(0,0,0,0.4)" : "0 4px 12px rgba(0,0,0,0.1)",
            zIndex: 1000,
            boxSizing: "border-box",
            paddingBottom: "8px",
          }}
        >
          {/* Top Triangle Pointer matching header background */}
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

          {/* Month/Year Selection Header */}
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
              style={{
                background: "none",
                border: "none",
                color: "#FFFFFF",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
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
              style={{
                background: "none",
                border: "none",
                color: "#FFFFFF",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Calendar Weekdays labels */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              textAlign: "center",
              padding: "8px 8px 4px 8px",
              fontWeight: 600,
              fontSize: "13px",
              color: t.label,
            }}
          >
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} style={{ padding: "4px 0" }}>{day}</div>
            ))}
          </div>

          {/* Calendar Days grid */}
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
                cellBg = rangeBg;
              } else if (isStart && endDateStr) {
                cellBg = `linear-gradient(90deg, transparent 50%, ${rangeBg} 50%)`;
              } else if (isEnd) {
                cellBg = `linear-gradient(90deg, ${rangeBg} 50%, transparent 50%)`;
              }

              // Styles for the day circle indicator
              let dayBg = "transparent";
              let dayColor = t.text;
              let dayWeight = "normal";

              if (isStart || isEnd) {
                dayBg = "#C70039";
                dayColor = "#FFFFFF";
                dayWeight = "bold";
              } else if (inRange) {
                dayColor = t.link;
                dayWeight = "500";
              } else if (!isCurrentMonth) {
                dayColor = t.textMuted;
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

export function OrderList({ isDarkMode = false }: { isDarkMode?: boolean }) {
  const s = getListPageStyles(isDarkMode);
  const [dateRangeInput, setDateRangeInput] = useState("2026-03-12 to 2026-06-12");
  const [appliedDateRange, setAppliedDateRange] = useState({ startDate: "2026-03-12", endDate: "2026-03-12" });
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("orderDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  function handleLoadByRange() {
    const parts = dateRangeInput.split(" to ");
    const start = parts[0]?.trim() || "";
    const end = parts[1]?.trim() || "";
    setAppliedDateRange({ startDate: start, endDate: end });
    setPage(1);
  }

  function handleSort(field: string) {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setPage(1);
  }

  // Filter orders
  const filtered = ORDERS.filter((o) => {
    // Date range
    if (appliedDateRange.startDate && o.orderDate < appliedDateRange.startDate) return false;
    if (appliedDateRange.endDate && o.orderDate > appliedDateRange.endDate) return false;

    // Live search
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchId = o.searchId.toLowerCase().includes(q);
      const matchName = o.applicantName.toLowerCase().includes(q);
      if (!matchId && !matchName) return false;
    }

    return true;
  });

  // Sort orders
  const sorted = [...filtered].sort((a, b) => {
    let valA: any = "";
    let valB: any = "";

    if (sortField === "searchId") {
      valA = a.searchId;
      valB = b.searchId;
    } else if (sortField === "applicantName") {
      valA = a.applicantName;
      valB = b.applicantName;
    } else if (sortField === "orderDate") {
      valA = a.orderDate;
      valB = b.orderDate;
    } else if (sortField === "status") {
      valA = a.status;
      valB = b.status;
    } else if (sortField === "amount") {
      valA = getAmountVal(a.verificationType);
      valB = getAmountVal(b.verificationType);
    }

    if (typeof valA === "number" && typeof valB === "number") {
      return sortDirection === "asc" ? valA - valB : valB - valA;
    }

    return sortDirection === "asc"
      ? valA.toString().localeCompare(valB.toString())
      : valB.toString().localeCompare(valA.toString());
  });

  const totalEntries = sorted.length;
  const totalPages = Math.ceil(totalEntries / perPage);
  const startIndex = totalEntries === 0 ? 0 : (page - 1) * perPage + 1;
  const endIndex = Math.min(page * perPage, totalEntries);
  const paginated = sorted.slice((page - 1) * perPage, page * perPage);

  return (
    <div style={s.outer}>
      <div style={s.content}>
        
        {/* Page Title */}
        <h1 style={s.title}>
          Orders List
        </h1>

        {/* Card Container */}
        <div style={s.card}>
          
          {/* Date Range Row */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
            <DateRangePicker
              value={dateRangeInput}
              onChange={setDateRangeInput}
              onLoad={handleLoadByRange}
              isDarkMode={isDarkMode}
            />
          </div>

          {/* Table Controls Row */}
          <div style={s.controlsRow}>
            
            {/* Entries Selection */}
            <div style={s.controlsLabel}>
              <select
                value={perPage}
                onChange={(e) => { setPerPage(parseInt(e.target.value)); setPage(1); }}
                style={s.select}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>entries per page</span>
            </div>

            {/* Live Search Input */}
            <div style={{ position: "relative", width: "240px" }}>
              <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: s.t.textMuted, display: "flex", alignItems: "center" }}>
                <Search size={15} />
              </span>
              <input
                placeholder="Search..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                style={s.search}
              />
            </div>
          </div>

          {/* Main Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={s.theadRow}>
                  <th onClick={() => handleSort("searchId")} style={s.th}>
                    Order ID <SortIcon active={sortField === "searchId"} direction={sortDirection} isDarkMode={isDarkMode} />
                  </th>
                  <th onClick={() => handleSort("applicantName")} style={s.th}>
                    Applicant Name <SortIcon active={sortField === "applicantName"} direction={sortDirection} isDarkMode={isDarkMode} />
                  </th>
                  <th onClick={() => handleSort("orderDate")} style={s.th}>
                    Order Date <SortIcon active={sortField === "orderDate"} direction={sortDirection} isDarkMode={isDarkMode} />
                  </th>
                  <th onClick={() => handleSort("amount")} style={s.th}>
                    Amount <SortIcon active={sortField === "amount"} direction={sortDirection} isDarkMode={isDarkMode} />
                  </th>
                  <th onClick={() => handleSort("status")} style={s.th}>
                    Order Status <SortIcon active={sortField === "status"} direction={sortDirection} isDarkMode={isDarkMode} />
                  </th>
                  <th style={s.thStatic}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={s.emptyCell}>
                      No records found
                    </td>
                  </tr>
                ) : (
                  paginated.map((o, idx) => {
                    const amount = getAmountVal(o.verificationType);
                    return (
                      <tr key={o.searchId} style={s.row(idx)}>
                        <td style={{ ...s.tdPrimary, color: isDarkMode ? "#A78BFA" : "#3B1D7D" }}>{o.searchId}</td>
                        <td style={s.tdPrimary}>{o.applicantName}</td>
                        <td style={s.td}>{o.orderDate}</td>
                        <td style={s.tdPrimary}>${amount.toFixed(2)}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{
                            display: "inline-block",
                            padding: "2px 8px",
                            borderRadius: "3px",
                            fontSize: "10px",
                            fontWeight: 600,
                            background: STATUS_STYLES[o.status].bg,
                            color: STATUS_STYLES[o.status].color,
                            border: `1px solid ${STATUS_STYLES[o.status].border}`,
                          }}>
                            {o.status}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <button style={s.actionLink}>
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Row */}
          <div style={s.pagination}>
            <div>
              Showing {startIndex} to {endIndex} of {totalEntries} entries
            </div>
            
            <div style={{ display: "flex", gap: "4px" }}>
              <button
                disabled={page === 1}
                onClick={() => setPage(1)}
                style={s.navBtn(page === 1)}
              >
                «
              </button>
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                style={s.navBtn(page === 1)}
              >
                &lt;
              </button>

              {totalPages > 0 && Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  style={s.pageBtn(p === page)}
                >
                  {p}
                </button>
              ))}

              <button
                disabled={page === totalPages || totalPages === 0}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                style={s.navBtn(page === totalPages || totalPages === 0)}
              >
                &gt;
              </button>
              <button
                disabled={page === totalPages || totalPages === 0}
                onClick={() => setPage(totalPages)}
                style={s.navBtn(page === totalPages || totalPages === 0)}
              >
                »
              </button>
            </div>
          </div>

        </div>
      </div>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
