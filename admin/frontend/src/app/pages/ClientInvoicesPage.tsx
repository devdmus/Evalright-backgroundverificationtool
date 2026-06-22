import { useState, useMemo, useEffect, useRef } from "react";
import { Filter, Search, Edit2, ChevronDown, Check, ChevronLeft, ChevronRight, ArrowLeft, Download } from "lucide-react";

interface InvoiceItem {
  id: string;
  companyName: string;
  viewed: "Yes" | "No";
  date: string;
  total: number;
  paymentMethod: string;
  approvedOn: string;
  status: "PAID" | "UNPAID" | "UNSENT" | "OVERDUE" | "CANCELLED" | "REFUNDED" | "COLLECTIONS";
}

const INITIAL_INVOICES: InvoiceItem[] = [
  {
    id: "256602",
    companyName: "ZScale LLC",
    viewed: "No",
    date: "2026-06-17",
    total: 14.00,
    paymentMethod: "Credit Card",
    approvedOn: "06/17/26",
    status: "UNPAID",
  },
  {
    id: "256596",
    companyName: "ZScale LLC",
    viewed: "No",
    date: "2026-06-16",
    total: 14.00,
    paymentMethod: "Credit Card",
    approvedOn: "06/16/26",
    status: "UNSENT",
  },
  {
    id: "256595",
    companyName: "CHAPEL STREET PHARMACY",
    viewed: "No",
    date: "2026-06-16",
    total: 13.00,
    paymentMethod: "Credit Card",
    approvedOn: "06/16/26",
    status: "OVERDUE",
  },
  {
    id: "256593",
    companyName: "Pentangle Tech Services",
    viewed: "No",
    date: "2026-06-16",
    total: 52.00,
    paymentMethod: "Credit Card",
    approvedOn: "06/16/26",
    status: "PAID",
  },
  {
    id: "256584",
    companyName: "Pride Veteran Staffing, Inc",
    viewed: "No",
    date: "2026-06-16",
    total: 74.00,
    paymentMethod: "Credit Card",
    approvedOn: "06/16/26",
    status: "COLLECTIONS",
  },
];

interface ClientInvoicesPageProps {
  isDarkMode?: boolean;
}

export function ClientInvoicesPage({ isDarkMode = false }: ClientInvoicesPageProps) {
  // Mock State
  const [invoices, setInvoices] = useState<InvoiceItem[]>(INITIAL_INVOICES);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchText, setSearchText] = useState("");

  // Filters State
  const [filterCompanyName, setFilterCompanyName] = useState("");
  const [filterDateRange, setFilterDateRange] = useState("");
  const [filterInvoiceNum, setFilterInvoiceNum] = useState("");
  const [filterStatus, setFilterStatus] = useState("Any");

  // Submitted Filters
  const [appliedFilters, setAppliedFilters] = useState({
    companyName: "",
    dateRange: "",
    invoiceNum: "",
    status: "Any",
  });

  // Edit Modal State
  const [editingInvoice, setEditingInvoice] = useState<InvoiceItem | null>(null);

  // Detail View State
  const [viewingInvoiceId, setViewingInvoiceId] = useState<string | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<string>("Summary");
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [invoiceNotes, setInvoiceNotes] = useState<Record<string, { date: string; author: string; text: string }[]>>({});
  const [adjustmentRate, setAdjustmentRate] = useState<string>("14.00");
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [paymentMethodSelect, setPaymentMethodSelect] = useState<string>("Credit Card");
  const [txnIdInput, setTxnIdInput] = useState<string>("");
  const [creditAmount, setCreditAmount] = useState<string>("");
  const [refundAmount, setRefundAmount] = useState<string>("");
  const [refundReason, setRefundReason] = useState<string>("Client Request");
  const [newNoteText, setNewNoteText] = useState<string>("");


  // Sorting State
  const [sortField, setSortField] = useState<keyof InvoiceItem>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Calendar Dropdown State
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(5); // June (0-indexed)
  const [calendarYear, setCalendarYear] = useState(2026);
  const calendarRef = useRef<HTMLDivElement>(null);
  const quickActionsRef = useRef<HTMLDivElement>(null);
  const downloadRef = useRef<HTMLDivElement>(null);

  // Click outside to close calendar and action dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
      if (quickActionsRef.current && !quickActionsRef.current.contains(event.target as Node)) {
        setQuickActionsOpen(false);
      }
      if (downloadRef.current && !downloadRef.current.contains(event.target as Node)) {
        setDownloadOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      const dateString = `${prevYear}-${String(prevMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      days.push({ dayNum: day, isCurrentMonth: false, dateString });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      days.push({ dayNum: i, isCurrentMonth: true, dateString });
    }

    // Next month padding
    const totalDays = days.length;
    const nextMonthDaysNeeded = 42 - totalDays;
    for (let i = 1; i <= nextMonthDaysNeeded; i++) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      const dateString = `${nextYear}-${String(nextMonth + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      days.push({ dayNum: i, isCurrentMonth: false, dateString });
    }

    return days;
  };

  // Brand Colors
  const primaryBrandColor = isDarkMode ? "#DF2A57" : "#C70039";
  const bodyBg = isDarkMode ? "#1A1C21" : "#F4F5F7";
  const cardBg = isDarkMode ? "#252830" : "#ffffff";
  const cardBorder = isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB";
  const textPrimary = isDarkMode ? "#E5E7EB" : "#374151";
  const textMuted = isDarkMode ? "#8391a2" : "#8A8A8A";
  const inputBg = isDarkMode ? "#1A1C21" : "#ffffff";

  // Date Formatter Helper
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return `${parts[1]}/${parts[2]}/${parts[0]}`;
    }
    return dateStr;
  };

  const renderSummaryTab = (invoice: InvoiceItem) => {
    const isPaid = invoice.status === "PAID";
    const balance = isPaid ? 0.0 : invoice.total;
    const balanceColor = isPaid ? "#8F9B00" : "#C70039";

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "14px", color: textPrimary }}>
        <div>
          <span style={{ fontWeight: 500 }}>Company Name: </span>
          <span style={{ color: primaryBrandColor, fontWeight: 600 }}>{invoice.companyName}</span>
        </div>

        <div>
          <span style={{ fontWeight: 500 }}>Invoice Date: </span>
          <span>{formatDate(invoice.date)}</span>
        </div>

        <div>
          <span style={{ fontWeight: 500 }}>Invoice Due Date: </span>
          <span>{formatDate(invoice.date)}</span>
        </div>

        <div>
          <span style={{ fontWeight: 500 }}>Balance: </span>
          <span style={{ color: balanceColor, fontWeight: 600 }}>${balance.toFixed(2)}</span>
        </div>

        <div>
          <span style={{ fontWeight: 500 }}>Approved By: </span>
          <span>{isPaid ? "Autopay" : "N/A"}</span>
        </div>

        <div>
          <span style={{ fontWeight: 500 }}>Approved On: </span>
          <span>{isPaid ? (invoice.approvedOn ? (invoice.approvedOn.includes("/") ? invoice.approvedOn : formatDate(invoice.approvedOn.split(" ")[0]) + " " + (invoice.approvedOn.split(" ")[1] || "07:32:48")) : "06-17-2026 07:32:48") : "N/A"}</span>
        </div>

        <div>
          <span style={{ fontWeight: 500 }}>Credit Card on File: </span>
          <span style={{ color: textMuted }}>No users found with valid credit card</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span style={{ fontWeight: 500 }}>Invoice Status: </span>
          {isPaid ? (
            <span>
              <strong style={{ color: "#385623" }}>PAID</strong> on{" "}
              <button
                type="button"
                style={{
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  textDecoration: "underline",
                  color: textPrimary,
                  fontFamily: "inherit",
                  fontSize: "inherit",
                  cursor: "pointer",
                }}
                onClick={() => alert("Showing payment date logs...")}
              >
                {formatDate(invoice.date)} 07:32
              </button>{" "}
              via{" "}
              <button
                type="button"
                style={{
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  textDecoration: "underline",
                  color: textPrimary,
                  fontFamily: "inherit",
                  fontSize: "inherit",
                  cursor: "pointer",
                }}
                onClick={() => alert("Showing payment method details...")}
              >
                {invoice.paymentMethod || "Credit Card"}
              </button>
            </span>
          ) : (
            <strong style={{ color: invoice.status === "UNPAID" || invoice.status === "OVERDUE" || invoice.status === "COLLECTIONS" ? "#721C24" : "#374151" }}>
              {invoice.status}
            </strong>
          )}
        </div>
      </div>
    );
  };

  const renderAdjustInvoiceTab = (invoice: InvoiceItem) => {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", color: textPrimary }}>
        <h4 style={{ margin: "0 0 8px 0", fontSize: "15px", fontWeight: 600 }}>Adjust Invoice Details</h4>
        
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
          <thead>
            <tr style={{ borderBottom: cardBorder, background: isDarkMode ? "#2A2D34" : "#F9FAFB" }}>
              <th style={{ padding: "10px", fontWeight: 600 }}>Description</th>
              <th style={{ padding: "10px", fontWeight: 600 }}>Quantity</th>
              <th style={{ padding: "10px", fontWeight: 600, textAlign: "right" }}>Rate</th>
              <th style={{ padding: "10px", fontWeight: 600, textAlign: "right" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: cardBorder }}>
              <td style={{ padding: "12px 10px" }}>Background Verification Services</td>
              <td style={{ padding: "12px 10px" }}>1</td>
              <td style={{ padding: "12px 10px", textAlign: "right" }}>
                ${invoice.total.toFixed(2)}
              </td>
              <td style={{ padding: "12px 10px", textAlign: "right", fontWeight: 600 }}>
                ${invoice.total.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxWidth: "300px", marginTop: "12px" }}>
          <label style={{ fontSize: "12px", fontWeight: 500, color: textMuted }}>Adjust Rate / Price ($)</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="number"
              placeholder={invoice.total.toString()}
              value={adjustmentRate}
              onChange={(e) => setAdjustmentRate(e.target.value)}
              style={{
                background: inputBg,
                border: cardBorder,
                borderRadius: "4px",
                padding: "8px 12px",
                fontSize: "14px",
                color: textPrimary,
                outline: "none",
                flex: 1,
              }}
            />
            <button
              type="button"
              onClick={() => {
                const rate = parseFloat(adjustmentRate);
                if (isNaN(rate) || rate < 0) {
                  alert("Please enter a valid positive number.");
                  return;
                }
                setInvoices(
                  invoices.map((inv) =>
                    inv.id === invoice.id ? { ...inv, total: rate } : inv
                  )
                );
                alert("Invoice rate updated successfully!");
                setAdjustmentRate(rate.toString());
              }}
              style={{
                background: primaryBrandColor,
                color: "#FFFFFF",
                border: "none",
                borderRadius: "4px",
                padding: "8px 16px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Update
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderAddPaymentTab = (invoice: InvoiceItem) => {
    const isPaid = invoice.status === "PAID";
    const balance = isPaid ? 0.0 : invoice.total;

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", color: textPrimary }}>
        <h4 style={{ margin: "0 0 8px 0", fontSize: "15px", fontWeight: 600 }}>Record Payment</h4>

        {isPaid ? (
          <div style={{ padding: "12px", background: isDarkMode ? "#1C3524" : "#E2F0D9", color: isDarkMode ? "#A3E2AB" : "#385623", borderRadius: "4px", fontSize: "13.5px" }}>
            This invoice is fully paid. No further payments are required.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "400px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <label style={{ fontSize: "12px", fontWeight: 500, color: textMuted }}>Payment Method</label>
              <select
                value={paymentMethodSelect}
                onChange={(e) => setPaymentMethodSelect(e.target.value)}
                style={{
                  background: inputBg,
                  border: cardBorder,
                  borderRadius: "4px",
                  padding: "8px 12px",
                  fontSize: "14px",
                  color: textPrimary,
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="Credit Card">Credit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Check">Check</option>
                <option value="Cash">Cash</option>
              </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <label style={{ fontSize: "12px", fontWeight: 500, color: textMuted }}>Amount ($)</label>
              <input
                type="number"
                placeholder={balance.toFixed(2)}
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                style={{
                  background: inputBg,
                  border: cardBorder,
                  borderRadius: "4px",
                  padding: "8px 12px",
                  fontSize: "14px",
                  color: textPrimary,
                  outline: "none",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <label style={{ fontSize: "12px", fontWeight: 500, color: textMuted }}>Transaction ID / Ref #</label>
              <input
                type="text"
                placeholder="TXN-12345"
                value={txnIdInput}
                onChange={(e) => setTxnIdInput(e.target.value)}
                style={{
                  background: inputBg,
                  border: cardBorder,
                  borderRadius: "4px",
                  padding: "8px 12px",
                  fontSize: "14px",
                  color: textPrimary,
                  outline: "none",
                }}
              />
            </div>

            <button
              type="button"
              onClick={() => {
                const amt = parseFloat(paymentAmount || balance.toString());
                if (isNaN(amt) || amt <= 0) {
                  alert("Please enter a valid payment amount.");
                  return;
                }
                
                // Update Invoice
                setInvoices(
                  invoices.map((inv) =>
                    inv.id === invoice.id
                      ? {
                          ...inv,
                          status: "PAID",
                          paymentMethod: paymentMethodSelect,
                          approvedOn: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
                        }
                      : inv
                  )
                );
                
                alert(`Successfully recorded payment of $${amt.toFixed(2)} via ${paymentMethodSelect}!`);
                setPaymentAmount("");
                setTxnIdInput("");
              }}
              style={{
                background: primaryBrandColor,
                color: "#FFFFFF",
                border: "none",
                borderRadius: "4px",
                padding: "10px 16px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                marginTop: "6px",
                alignSelf: "flex-start",
              }}
            >
              Record Payment
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderCreditTab = (invoice: InvoiceItem) => {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", color: textPrimary }}>
        <h4 style={{ margin: "0 0 8px 0", fontSize: "15px", fontWeight: 600 }}>Apply Credit Note</h4>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "400px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={{ fontSize: "12px", fontWeight: 500, color: textMuted }}>Credit Note Amount ($)</label>
            <input
              type="number"
              placeholder="0.00"
              value={creditAmount}
              onChange={(e) => setCreditAmount(e.target.value)}
              style={{
                background: inputBg,
                border: cardBorder,
                borderRadius: "4px",
                padding: "8px 12px",
                fontSize: "14px",
                color: textPrimary,
                outline: "none",
              }}
            />
          </div>

          <button
            type="button"
            onClick={() => {
              const amt = parseFloat(creditAmount);
              if (isNaN(amt) || amt <= 0) {
                alert("Please enter a valid credit amount.");
                return;
              }
              const newTotal = Math.max(0, invoice.total - amt);
              setInvoices(
                invoices.map((inv) =>
                  inv.id === invoice.id ? { ...inv, total: newTotal, status: newTotal === 0 ? "PAID" : inv.status } : inv
                )
              );
              alert(`Successfully applied $${amt.toFixed(2)} credit to Invoice #${invoice.id}!`);
              setCreditAmount("");
            }}
            style={{
              background: primaryBrandColor,
              color: "#FFFFFF",
              border: "none",
              borderRadius: "4px",
              padding: "10px 16px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              alignSelf: "flex-start",
            }}
          >
            Apply Credit
          </button>
        </div>
      </div>
    );
  };

  const renderRefundTab = (invoice: InvoiceItem) => {
    const isPaid = invoice.status === "PAID";

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", color: textPrimary }}>
        <h4 style={{ margin: "0 0 8px 0", fontSize: "15px", fontWeight: 600 }}>Refund Payment</h4>

        {!isPaid ? (
          <div style={{ padding: "12px", background: isDarkMode ? "#421C16" : "#FADBD8", color: isDarkMode ? "#F3A196" : "#721C24", borderRadius: "4px", fontSize: "13.5px" }}>
            Only fully paid invoices can be refunded.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "400px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <label style={{ fontSize: "12px", fontWeight: 500, color: textMuted }}>Refund Amount ($)</label>
              <input
                type="number"
                placeholder={invoice.total.toFixed(2)}
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                style={{
                  background: inputBg,
                  border: cardBorder,
                  borderRadius: "4px",
                  padding: "8px 12px",
                  fontSize: "14px",
                  color: textPrimary,
                  outline: "none",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <label style={{ fontSize: "12px", fontWeight: 500, color: textMuted }}>Reason for Refund</label>
              <select
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                style={{
                  background: inputBg,
                  border: cardBorder,
                  borderRadius: "4px",
                  padding: "8px 12px",
                  fontSize: "14px",
                  color: textPrimary,
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="Client Request">Client Request</option>
                <option value="Overcharged">Overcharged</option>
                <option value="Verification Cancelled">Verification Cancelled</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                const amt = parseFloat(refundAmount || invoice.total.toString());
                if (isNaN(amt) || amt <= 0 || amt > invoice.total) {
                  alert(`Please enter a valid refund amount (maximum $${invoice.total.toFixed(2)}).`);
                  return;
                }
                
                setInvoices(
                  invoices.map((inv) =>
                    inv.id === invoice.id ? { ...inv, status: "REFUNDED" } : inv
                  )
                );
                alert(`Successfully processed a refund of $${amt.toFixed(2)} for Reason: "${refundReason}"!`);
                setRefundAmount("");
              }}
              style={{
                background: primaryBrandColor,
                color: "#FFFFFF",
                border: "none",
                borderRadius: "4px",
                padding: "10px 16px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                alignSelf: "flex-start",
              }}
            >
              Process Refund
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderNotesTab = (invoice: InvoiceItem) => {
    const customNotes = invoiceNotes[invoice.id] || [];
    
    const allNotes = [
      {
        date: formatDate(invoice.date) + " 07:30:12",
        author: "System",
        text: `Invoice generated for ${invoice.companyName} with amount $${invoice.total.toFixed(2)}.`,
      },
      ...customNotes,
    ];

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", color: textPrimary }}>
        <h4 style={{ margin: "0 0 8px 0", fontSize: "15px", fontWeight: 600 }}>Invoice Notes & History</h4>

        {/* Notes List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "250px", overflowY: "auto" }}>
          {allNotes.map((note, index) => (
            <div
              key={index}
              style={{
                padding: "12px",
                background: isDarkMode ? "#33353F" : "#F9FAFB",
                border: cardBorder,
                borderRadius: "4px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", fontSize: "11.5px", color: textMuted }}>
                <span style={{ fontWeight: 600 }}>By: {note.author}</span>
                <span>{note.date}</span>
              </div>
              <div style={{ fontSize: "13px", color: textPrimary }}>{note.text}</div>
            </div>
          ))}
        </div>

        {/* Add Note Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
          <label style={{ fontSize: "12px", fontWeight: 500, color: textMuted }}>Add Internal Note</label>
          <textarea
            rows={3}
            placeholder="Type note details here..."
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            style={{
              background: inputBg,
              border: cardBorder,
              borderRadius: "4px",
              padding: "10px 12px",
              fontSize: "13.5px",
              color: textPrimary,
              outline: "none",
              fontFamily: "inherit",
              resize: "vertical",
            }}
          />
          <button
            type="button"
            onClick={() => {
              if (!newNoteText.trim()) {
                alert("Please type a note first.");
                return;
              }
              const newNote = {
                date: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
                author: "Raghu Adaveni",
                text: newNoteText.trim(),
              };
              setInvoiceNotes({
                ...invoiceNotes,
                [invoice.id]: [...customNotes, newNote],
              });
              setNewNoteText("");
            }}
            style={{
              background: primaryBrandColor,
              color: "#FFFFFF",
              border: "none",
              borderRadius: "4px",
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              alignSelf: "flex-end",
            }}
          >
            Add Note
          </button>
        </div>
      </div>
    );
  };

  const renderInvoiceDetail = () => {
    const invoice = invoices.find((inv) => inv.id === viewingInvoiceId);
    if (!invoice) return null;

    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
        {/* Page Title */}
        <h1
          style={{
            fontSize: "20px",
            fontWeight: 600,
            color: primaryBrandColor,
            margin: "0 0 10px 0",
          }}
        >
          Invoice #{invoice.id}
        </h1>

        {/* Actions Row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          {/* Go Back Link */}
          <button
            type="button"
            onClick={() => {
              setViewingInvoiceId(null);
              setQuickActionsOpen(false);
              setDownloadOpen(false);
            }}
            style={{
              background: "transparent",
              border: "none",
              color: textMuted,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "14px",
              fontWeight: 500,
              padding: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = primaryBrandColor)}
            onMouseLeave={(e) => (e.currentTarget.style.color = textMuted)}
          >
            <ArrowLeft size={16} />
            Go Back
          </button>

          {/* Buttons Container */}
          <div style={{ display: "flex", gap: "12px" }}>
            {/* Quick Actions Dropdown */}
            <div style={{ position: "relative" }} ref={quickActionsRef}>
              <button
                type="button"
                onClick={() => {
                  setQuickActionsOpen(!quickActionsOpen);
                  setDownloadOpen(false);
                }}
                style={{
                  background: isDarkMode ? "#33353F" : "#FFFFFF",
                  color: textPrimary,
                  border: cardBorder,
                  borderRadius: "4px",
                  padding: "8px 16px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>Quick Actions</span>
                <ChevronDown size={14} />
              </button>

              {quickActionsOpen && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "100%",
                    marginTop: "4px",
                    background: cardBg,
                    border: cardBorder,
                    borderRadius: "4px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    zIndex: 1010,
                    width: "160px",
                    overflow: "hidden",
                  }}
                >
                  {[
                    { label: "Mark as Paid", status: "PAID" },
                    { label: "Mark as Unpaid", status: "UNPAID" },
                    { label: "Mark as Overdue", status: "OVERDUE" },
                    { label: "Mark as Cancelled", status: "CANCELLED" },
                    { label: "Mark as Refunded", status: "REFUNDED" },
                    { label: "Mark as Collections", status: "COLLECTIONS" },
                  ].map((action) => (
                    <button
                      key={action.label}
                      type="button"
                      onClick={() => {
                        setInvoices(
                          invoices.map((inv) =>
                            inv.id === invoice.id ? { ...inv, status: action.status as InvoiceItem["status"] } : inv
                          )
                        );
                        setQuickActionsOpen(false);
                        alert(`Invoice status updated to ${action.status}`);
                      }}
                      style={{
                        width: "100%",
                        padding: "10px 16px",
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
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Download Dropdown */}
            <div style={{ position: "relative" }} ref={downloadRef}>
              <button
                type="button"
                onClick={() => {
                  setDownloadOpen(!downloadOpen);
                  setQuickActionsOpen(false);
                }}
                style={{
                  background: "#3B82F6",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "4px",
                  padding: "8px 16px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Download size={14} />
                <span>Download</span>
                <ChevronDown size={14} />
              </button>

              {downloadOpen && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "100%",
                    marginTop: "4px",
                    background: cardBg,
                    border: cardBorder,
                    borderRadius: "4px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    zIndex: 1010,
                    width: "150px",
                    overflow: "hidden",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setDownloadOpen(false);
                      window.print();
                    }}
                    style={{
                      width: "100%",
                      padding: "10px 16px",
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
                    Download PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDownloadOpen(false);
                      alert("Downloading CSV report...");
                    }}
                    style={{
                      width: "100%",
                      padding: "10px 16px",
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
                    Download CSV
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Row */}
        <div
          style={{
            display: "flex",
            gap: "4px",
            borderBottom: "1px solid " + (isDarkMode ? "#333333" : "#E5E7EB"),
            marginBottom: "20px",
          }}
        >
          {["Summary", "Adjust Invoice", "Add Payment", "Credit", "Refund", "Notes"].map((tab) => {
            const isActive = activeDetailTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveDetailTab(tab)}
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: isActive ? "2px solid " + primaryBrandColor : "2px solid transparent",
                  color: isActive ? primaryBrandColor : textMuted,
                  padding: "10px 16px",
                  fontSize: "14px",
                  fontWeight: isActive ? 600 : 500,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  marginBottom: "-1px",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = primaryBrandColor;
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = textMuted;
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Detail Card Panel */}
        <div
          style={{
            background: cardBg,
            border: cardBorder,
            borderRadius: "6px",
            padding: "24px",
            marginBottom: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          {activeDetailTab === "Summary" && renderSummaryTab(invoice)}
          {activeDetailTab === "Adjust Invoice" && renderAdjustInvoiceTab(invoice)}
          {activeDetailTab === "Add Payment" && renderAddPaymentTab(invoice)}
          {activeDetailTab === "Credit" && renderCreditTab(invoice)}
          {activeDetailTab === "Refund" && renderRefundTab(invoice)}
          {activeDetailTab === "Notes" && renderNotesTab(invoice)}
        </div>
      </div>
    );
  };

  // Filter Action
  const handleFilterSubmit = () => {
    setAppliedFilters({
      companyName: filterCompanyName,
      dateRange: filterDateRange,
      invoiceNum: filterInvoiceNum,
      status: filterStatus,
    });
  };

  const handleResetFilters = () => {
    setFilterCompanyName("");
    setFilterDateRange("");
    setFilterInvoiceNum("");
    setFilterStatus("Any");
    setAppliedFilters({
      companyName: "",
      dateRange: "",
      invoiceNum: "",
      status: "Any",
    });
  };

  // Sort Handler
  const handleSort = (field: keyof InvoiceItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filtered & Sorted Invoices
  const filteredInvoices = useMemo(() => {
    let result = [...invoices];

    // Form Filters
    if (appliedFilters.companyName.trim()) {
      const q = appliedFilters.companyName.toLowerCase().trim();
      result = result.filter((inv) => inv.companyName.toLowerCase().includes(q));
    }
    if (appliedFilters.invoiceNum.trim()) {
      const q = appliedFilters.invoiceNum.toLowerCase().trim();
      result = result.filter((inv) => inv.id.toLowerCase().includes(q));
    }
    if (appliedFilters.status !== "Any") {
      result = result.filter((inv) => inv.status === appliedFilters.status.toUpperCase());
    }
    if (appliedFilters.dateRange.trim()) {
      const q = appliedFilters.dateRange.toLowerCase().trim();
      result = result.filter((inv) => inv.date.includes(q));
    }

    // Search bar filter
    if (searchText.trim()) {
      const q = searchText.toLowerCase().trim();
      result = result.filter(
        (inv) =>
          inv.id.toLowerCase().includes(q) ||
          inv.companyName.toLowerCase().includes(q) ||
          inv.paymentMethod.toLowerCase().includes(q) ||
          inv.status.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === "number" && typeof valB === "number") {
        return sortDirection === "asc" ? valA - valB : valB - valA;
      }

      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      return sortDirection === "asc" ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });

    return result;
  }, [invoices, appliedFilters, searchText, sortField, sortDirection]);

  // Checkbox handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredInvoices.map((inv) => inv.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((rowId) => rowId !== id));
    }
  };

  const isAllSelected =
    filteredInvoices.length > 0 && selectedIds.length === filteredInvoices.length;

  if (viewingInvoiceId) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          background: bodyBg,
          padding: "20px 24px",
          overflowY: "auto",
          overflowX: "hidden",
          fontFamily: "'Wix Madefor Display', sans-serif",
        }}
      >
        {renderInvoiceDetail()}

        {/* Footer */}
        <div
          style={{
            marginTop: "auto",
            paddingTop: "24px",
            paddingBottom: "8px",
            borderTop: "1px solid " + (isDarkMode ? "#333333" : "#E5E7EB"),
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "12px",
            color: textMuted,
          }}
        >
          <span>© 2026 EvalRight</span>
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              📞 1-800-935-9025
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              ✉️ support@evalright.com
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        background: bodyBg,
        padding: "20px 24px",
        overflowY: "auto",
        overflowX: "hidden",
        fontFamily: "'Wix Madefor Display', sans-serif",
      }}
    >
      {/* Page Title */}
      <h1
        style={{
          fontSize: "20px",
          fontWeight: 600,
          color: primaryBrandColor,
          margin: "0 0 20px 0",
        }}
      >
        Invoices
      </h1>

      {/* ── Filters Card Grid ────────────────────────────────────────── */}
      <div
        style={{
          background: cardBg,
          border: cardBorder,
          borderRadius: "6px",
          padding: "20px",
          marginBottom: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
          }}
        >
          {/* Company Name Input */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: 500, color: textMuted }}>Company Name</label>
            <input
              type="text"
              placeholder="Company Name"
              value={filterCompanyName}
              onChange={(e) => setFilterCompanyName(e.target.value)}
              style={{
                background: inputBg,
                border: cardBorder,
                borderRadius: "4px",
                padding: "10px 12px",
                fontSize: "14px",
                color: textPrimary,
                outline: "none",
              }}
            />
          </div>

          {/* Date Range Input */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", position: "relative" }} ref={calendarRef}>
            <label style={{ fontSize: "12px", fontWeight: 500, color: textMuted }}>Date Range</label>
            <input
              type="text"
              placeholder="Date Range"
              value={filterDateRange}
              onFocus={() => setShowCalendar(true)}
              onChange={(e) => setFilterDateRange(e.target.value)}
              style={{
                background: inputBg,
                border: cardBorder,
                borderRadius: "4px",
                padding: "10px 12px",
                fontSize: "14px",
                color: textPrimary,
                outline: "none",
                cursor: "pointer",
              }}
            />

            {showCalendar && (
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
                  zIndex: 1000,
                  width: "280px",
                  fontFamily: "inherit",
                }}
              >
                {/* Style block for hover effect on days */}
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
                    onClick={() => {
                      if (calendarMonth === 0) {
                        setCalendarMonth(11);
                        setCalendarYear(calendarYear - 1);
                      } else {
                        setCalendarMonth(calendarMonth - 1);
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
                    <span>{MONTH_NAMES[calendarMonth]}</span>
                    <ChevronDown size={12} style={{ marginTop: "2px" }} />
                    <span style={{ marginLeft: "2px" }}>{calendarYear}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (calendarMonth === 11) {
                        setCalendarMonth(0);
                        setCalendarYear(calendarYear + 1);
                      } else {
                        setCalendarMonth(calendarMonth + 1);
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
                  {generateCalendarDays(calendarMonth, calendarYear).map((day, idx) => {
                    const isSelected =
                      filterDateRange === day.dateString ||
                      (day.dateString === "2026-06-17" && !filterDateRange);

                    return (
                      <div
                        key={idx}
                        className="calendar-day-btn"
                        onClick={() => {
                          setFilterDateRange(day.dateString);
                          setShowCalendar(false);
                        }}
                        style={{
                          textAlign: "center",
                          fontSize: "12px",
                          color: day.isCurrentMonth
                            ? (isDarkMode ? "#E5E7EB" : "#333333")
                            : (isDarkMode ? "#4B5563" : "#CCCCCC"),
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "34px",
                          borderRadius: "50%",
                        }}
                      >
                        {isSelected ? (
                          <div
                            style={{
                              border: isDarkMode ? "1px solid #8A8A8A" : "1px solid #CCCCCC",
                              borderRadius: "50%",
                              width: "30px",
                              height: "30px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: "bold",
                            }}
                          >
                            {day.dayNum}
                          </div>
                        ) : (
                          day.dayNum
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Invoice # Input */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: 500, color: textMuted }}>Invoice #</label>
            <input
              type="text"
              placeholder="Invoice #"
              value={filterInvoiceNum}
              onChange={(e) => setFilterInvoiceNum(e.target.value)}
              style={{
                background: inputBg,
                border: cardBorder,
                borderRadius: "4px",
                padding: "10px 12px",
                fontSize: "14px",
                color: textPrimary,
                outline: "none",
              }}
            />
          </div>

          {/* Status Dropdown */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: 500, color: textMuted }}>Status</label>
            <div style={{ position: "relative" }}>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{
                  width: "100%",
                  background: inputBg,
                  border: cardBorder,
                  borderRadius: "4px",
                  padding: "10px 12px",
                  fontSize: "14px",
                  color: textPrimary,
                  outline: "none",
                  appearance: "none",
                  cursor: "pointer",
                }}
              >
                <option value="Any">Any</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Unsent">Unsent</option>
                <option value="Overdue">Overdue</option>
                <option value="Paid">Paid</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Refunded">Refunded</option>
                <option value="Collections">Collections</option>
              </select>
              <ChevronDown
                size={14}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  color: textMuted,
                }}
              />
            </div>
          </div>
        </div>

        {/* Buttons Row */}
        <div style={{ display: "flex", gap: "12px", marginTop: "4px" }}>
          <button
            onClick={handleFilterSubmit}
            style={{
              background: primaryBrandColor,
              color: "#ffffff",
              border: "none",
              borderRadius: "4px",
              padding: "10px 24px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 2px 4px rgba(199, 0, 57, 0.15)",
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = isDarkMode ? "#C01F49" : "#A3002E")}
            onMouseLeave={(e) => (e.currentTarget.style.background = primaryBrandColor)}
          >
            <Filter size={15} />
            Filter
          </button>

          <button
            onClick={handleResetFilters}
            style={{
              background: "transparent",
              color: textPrimary,
              border: cardBorder,
              borderRadius: "4px",
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = isDarkMode ? "#33353F" : "#F3F4F6")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            Reset
          </button>
        </div>
      </div>

      {/* ── Invoice List Section ───────────────────────────────────── */}
      <div
        style={{
          background: cardBg,
          border: cardBorder,
          borderRadius: "6px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Table Title Header */}
        <div
          style={{
            padding: "14px 20px",
            borderBottom: cardBorder,
            fontSize: "15px",
            fontWeight: 600,
            color: textPrimary,
          }}
        >
          Invoice List
        </div>

        {/* Controls Row */}
        <div
          style={{
            padding: "12px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: cardBorder,
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          {/* Entries per page dropdown */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px", color: textMuted }}>
            <div style={{ position: "relative", display: "flex", alignItems: "center", background: inputBg, border: cardBorder, borderRadius: "4px", padding: "4px 24px 4px 10px" }}>
              <select
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "13px",
                  color: textPrimary,
                  cursor: "pointer",
                  appearance: "none",
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <ChevronDown size={12} style={{ color: "#9CA3AF", pointerEvents: "none", position: "absolute", right: 8 }} />
            </div>
            <span>entries per page</span>
          </div>

          {/* Search Input */}
          <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
            <input
              type="text"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{
                background: inputBg,
                border: cardBorder,
                borderRadius: "4px",
                padding: "6px 12px 6px 32px",
                fontSize: "13.5px",
                color: textPrimary,
                outline: "none",
                width: "200px",
              }}
            />
            <Search
              size={14}
              style={{
                position: "absolute",
                left: "10px",
                color: textMuted,
              }}
            />
          </div>
        </div>

        {/* Data Table */}
        <div style={{ width: "100%", overflowX: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: isDarkMode ? "#2A2D34" : "#F8FAFC", borderBottom: cardBorder }}>
                {/* Select All Checkbox */}
                <th style={{ padding: "12px 8px", width: "40px" }}>
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    style={{ cursor: "pointer", width: "15px", height: "15px" }}
                  />
                </th>

                {/* Sortable Columns */}
                {[
                  { field: "id", label: "Invoice #" },
                  { field: "companyName", label: "Company Name" },
                  { field: "viewed", label: "Viewed" },
                  { field: "date", label: "Invoice Date" },
                  { field: "total", label: "Total" },
                  { field: "paymentMethod", label: "Payment Method" },
                  { field: "approvedOn", label: "Approved On" },
                  { field: "status", label: "Status" },
                ].map((col) => (
                  <th
                    key={col.field}
                    onClick={() => handleSort(col.field as keyof InvoiceItem)}
                    style={{
                      padding: "12px 8px",
                      fontSize: "12.5px",
                      fontWeight: 600,
                      color: textMuted,
                      cursor: "pointer",
                      userSelect: "none",
                      borderBottom: cardBorder,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span>{col.label}</span>
                      <span style={{ fontSize: "10px", opacity: sortField === col.field ? 1 : 0.3 }}>
                        {sortField === col.field ? (sortDirection === "asc" ? "▲" : "▼") : "⇅"}
                      </span>
                    </div>
                  </th>
                ))}
                {/* Action header */}
                <th style={{ padding: "12px 8px", borderBottom: cardBorder }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ padding: "40px", textAlign: "center", color: textMuted, fontSize: "14px" }}>
                    No matching invoices found.
                  </td>
                </tr>
              ) : (
                filteredInvoices.slice(0, entriesPerPage).map((invoice) => {
                  const isChecked = selectedIds.includes(invoice.id);
                  return (
                    <tr
                      key={invoice.id}
                      style={{
                        borderBottom: cardBorder,
                        background: isChecked ? (isDarkMode ? "rgba(255,255,255,0.02)" : "rgba(199, 0, 57, 0.02)") : "transparent",
                        transition: "background 0.1s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = isDarkMode ? "rgba(255,255,255,0.04)" : "#F9FAFB";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = isChecked
                          ? (isDarkMode ? "rgba(255,255,255,0.02)" : "rgba(199, 0, 57, 0.02)")
                          : "transparent";
                      }}
                    >
                      {/* Checkbox */}
                      <td style={{ padding: "10px 8px" }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => handleSelectRow(invoice.id, e.target.checked)}
                          style={{ cursor: "pointer", width: "15px", height: "15px" }}
                        />
                      </td>

                      {/* Invoice Link */}
                      <td style={{ padding: "10px 8px", fontSize: "13.5px", fontWeight: 600 }}>
                        <button
                          style={{
                            background: "transparent",
                            border: "none",
                            padding: 0,
                            color: primaryBrandColor,
                            fontWeight: 600,
                            cursor: "pointer",
                            textDecoration: "none",
                            fontSize: "inherit",
                            fontFamily: "inherit",
                          }}
                          onClick={() => {
                            setViewingInvoiceId(invoice.id);
                            setActiveDetailTab("Summary");
                          }}
                        >
                          {invoice.id}
                        </button>
                      </td>

                      {/* Company Name */}
                      <td style={{ padding: "10px 8px", fontSize: "13.5px", fontWeight: 600, color: primaryBrandColor }}>
                        {invoice.companyName}
                      </td>

                      {/* Viewed */}
                      <td style={{ padding: "10px 8px", fontSize: "13.5px", color: textPrimary }}>
                        {invoice.viewed}
                      </td>

                      {/* Invoice Date */}
                      <td style={{ padding: "10px 8px", fontSize: "13.5px", color: textPrimary }}>
                        {invoice.date}
                      </td>

                      {/* Total */}
                      <td style={{ padding: "10px 8px", fontSize: "13.5px", color: textPrimary, fontWeight: 500 }}>
                        ${invoice.total.toFixed(2)}
                      </td>

                      {/* Payment Method */}
                      <td style={{ padding: "10px 8px", fontSize: "13.5px", color: textPrimary }}>
                        {invoice.paymentMethod}
                      </td>

                      {/* Approved On */}
                      <td style={{ padding: "10px 8px", fontSize: "13.5px", color: textPrimary }}>
                        {invoice.approvedOn}
                      </td>

                      {/* Status */}
                      <td style={{ padding: "10px 8px" }}>
                        {(() => {
                          let bg = "#E2F0D9";
                          let color = "#385623";

                          switch (invoice.status) {
                            case "PAID":
                              bg = isDarkMode ? "#1C3524" : "#E2F0D9";
                              color = isDarkMode ? "#A3E2AB" : "#385623";
                              break;
                            case "UNPAID":
                            case "OVERDUE":
                            case "COLLECTIONS":
                              bg = isDarkMode ? "#421C16" : "#FADBD8";
                              color = isDarkMode ? "#F3A196" : "#721C24";
                              break;
                            case "UNSENT":
                            case "CANCELLED":
                            case "REFUNDED":
                            default:
                              bg = isDarkMode ? "#30343C" : "#F3F4F6";
                              color = isDarkMode ? "#C0C4CC" : "#374151";
                              break;
                          }

                          return (
                            <span
                              style={{
                                background: bg,
                                color: color,
                                padding: "3px 10px",
                                borderRadius: "4px",
                                fontSize: "11px",
                                fontWeight: 700,
                                letterSpacing: "0.05em",
                              }}
                            >
                              {invoice.status}
                            </span>
                          );
                        })()}
                      </td>

                      {/* Edit Action Icon */}
                      <td style={{ padding: "10px 8px", textAlign: "right" }}>
                        <button
                          onClick={() => {
                            setViewingInvoiceId(invoice.id);
                            setActiveDetailTab("Summary");
                          }}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: primaryBrandColor,
                            cursor: "pointer",
                            padding: "4px",
                            display: "inline-flex",
                            alignItems: "center",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                        >
                          <Edit2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: "24px",
          paddingBottom: "8px",
          borderTop: "1px solid " + (isDarkMode ? "#333333" : "#E5E7EB"),
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "12px",
          color: textMuted,
        }}
      >
        <span>© 2026 EvalRight</span>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            📞 1-800-935-9025
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            ✉️ support@evalright.com
          </span>
        </div>
      </div>
    </div>
  );
}
