import { useState, useMemo, useEffect, useRef } from "react";
import { ChevronDown, Search, Eye, X, ExternalLink, Settings } from "lucide-react";
import { Footer } from "../components/Footer";
import { CLIENT_LIST, DEMO_CLIENT } from "../data/mockData";

interface PaymentTypeRow {
  id: string;
  numClients: number;
  paymentType: string;
  invoiceCycle: string;
  paymentTerms: string;
  paymentMethod: string;
  autoApprove: number;
  clients: string[];
}

const INITIAL_ROWS: PaymentTypeRow[] = [
  {
    id: "1",
    numClients: 2,
    paymentType: "Immediate",
    invoiceCycle: "Monthly",
    paymentTerms: "Net30",
    paymentMethod: "Auto",
    autoApprove: 0,
    clients: ["ACS Consultancy Services, Inc", "Amity Tech Corporation"],
  },
  {
    id: "2",
    numClients: 15,
    paymentType: "Immediate",
    invoiceCycle: "Monthly",
    paymentTerms: "Immediate",
    paymentMethod: "Check",
    clients: [
      "Caliber Management LLC",
      "Pentangle Tech Services",
      "Roshan Hospitality Management, LLC",
      "Orbit Tech Solutions LLC",
      "Capital Tech Solutions, Inc.",
      "Orbit Tech Solutions LLC",
      "Jeevan Technologies",
      "ValueVista Soft Solutions Inc",
      "Red Maple Tech Inc",
      "Capital Tech Solutions, Inc.",
      "Orbit Tech Solutions LLC",
      "Merlin Solutions LLC",
      "Brinnae LLC",
      "Us Royal Management LLC",
      "Client Company 16479 LLC"
    ],
    autoApprove: 1,
  },
  {
    id: "3",
    numClients: 632,
    paymentType: "Immediate",
    invoiceCycle: "Monthly",
    paymentTerms: "Immediate",
    paymentMethod: "Auto",
    clients: ["Akash SoftSystems Inc", "GVRINFOTEK LLC", "Mygo Consulting", "Thinklusive Inc", "Vaspire Technologies INC."],
    autoApprove: 1,
  },
  {
    id: "4",
    numClients: 1,
    paymentType: "Open",
    invoiceCycle: "Monthly",
    paymentTerms: "Net15",
    paymentMethod: "Check",
    clients: ["Pride Veteran Staffing, Inc"],
    autoApprove: 1,
  },
  {
    id: "5",
    numClients: 1,
    paymentType: "Open",
    invoiceCycle: "Monthly",
    paymentTerms: "Immediate",
    paymentMethod: "",
    clients: ["BALDOR TECHNOLOGIES PRIVATE LIMITED"],
    autoApprove: 1,
  },
  {
    id: "6",
    numClients: 28,
    paymentType: "Open",
    invoiceCycle: "Monthly",
    paymentTerms: "Immediate",
    paymentMethod: "Check",
    clients: ["Dataflow Group", "Destin IT Solutions INC", "Global Business Consulting Services, Inc.", "Greycell Labs Inc"],
    autoApprove: 1,
  },
  {
    id: "7",
    numClients: 2,
    paymentType: "Open",
    invoiceCycle: "Monthly",
    paymentTerms: "Immediate",
    paymentMethod: "Auto",
    clients: ["IDA Automation Inc", "Evalright Demo Account"],
    autoApprove: 1,
  },
];

const FILTER_OPTIONS = {
  paymentType: ["Any", "Escrow", "Immediate", "Open"],
  payMethod: ["Any", "Check", "Auto", "Client"],
  unpaidInvoices: ["Any", "Yes", "No"],
  autoApprove: ["Any", "Yes", "No"],
  invoiceCycle: ["Any", "Monthly", "Weekly"],
  paymentTerms: ["Any", "Immediate", "Net15", "Net30"],
};

interface IndividualClientRow {
  id: string;
  company: string;
  cardOnFile: string;
  unpaidInvoices: string;
  totalDue: number;
  dateCreated: string;
  payMethod: string;
  unpaidInvoicesStatus: string;
  autoApprove: string;
  invoiceCycle: string;
  paymentTerms: string;
}

const INDIVIDUAL_CLIENTS: IndividualClientRow[] = [
  {
    id: "c1",
    company: "3A Soft Inc",
    cardOnFile: "**** **** **** 5185",
    unpaidInvoices: "",
    totalDue: 0.00,
    dateCreated: "2025-07-15",
    payMethod: "Auto",
    unpaidInvoicesStatus: "No",
    autoApprove: "Yes",
    invoiceCycle: "Monthly",
    paymentTerms: "Immediate",
  },
  {
    id: "c2",
    company: "3i Infotech Inc",
    cardOnFile: "**** **** **** 3911",
    unpaidInvoices: "",
    totalDue: 0.00,
    dateCreated: "2024-08-21",
    payMethod: "Check",
    unpaidInvoicesStatus: "No",
    autoApprove: "Yes",
    invoiceCycle: "Monthly",
    paymentTerms: "Immediate",
  },
  {
    id: "c3",
    company: "4i Americas LLC",
    cardOnFile: "None",
    unpaidInvoices: "",
    totalDue: 0.00,
    dateCreated: "2026-01-07",
    payMethod: "Check",
    unpaidInvoicesStatus: "No",
    autoApprove: "No",
    invoiceCycle: "Monthly",
    paymentTerms: "Immediate",
  },
  {
    id: "c4",
    company: "A Fractional CFO, LLC",
    cardOnFile: "None",
    unpaidInvoices: "",
    totalDue: 0.00,
    dateCreated: "2025-08-06",
    payMethod: "Client",
    unpaidInvoicesStatus: "No",
    autoApprove: "No",
    invoiceCycle: "Monthly",
    paymentTerms: "Immediate",
  },
  {
    id: "c5",
    company: "AA TECH GROUP LLC",
    cardOnFile: "**** **** **** 0851",
    unpaidInvoices: "",
    totalDue: 0.00,
    dateCreated: "2023-08-16",
    payMethod: "Auto",
    unpaidInvoicesStatus: "No",
    autoApprove: "Yes",
    invoiceCycle: "Monthly",
    paymentTerms: "Immediate",
  },
  {
    id: "c6",
    company: "AADYAM TECHNOLOGIES LLC",
    cardOnFile: "None",
    unpaidInvoices: "",
    totalDue: 0.00,
    dateCreated: "2025-06-05",
    payMethod: "Client",
    unpaidInvoicesStatus: "No",
    autoApprove: "No",
    invoiceCycle: "Monthly",
    paymentTerms: "Immediate",
  },
  {
    id: "c7",
    company: "Aasrita Consulting LLC",
    cardOnFile: "**** **** **** 7101",
    unpaidInvoices: "",
    totalDue: 0.00,
    dateCreated: "2025-06-16",
    payMethod: "Auto",
    unpaidInvoicesStatus: "No",
    autoApprove: "Yes",
    invoiceCycle: "Monthly",
    paymentTerms: "Immediate",
  },
  {
    id: "c8",
    company: "ABAL Technologies Inc",
    cardOnFile: "None",
    unpaidInvoices: "",
    totalDue: 0.00,
    dateCreated: "2023-07-20",
    payMethod: "Check",
    unpaidInvoicesStatus: "No",
    autoApprove: "No",
    invoiceCycle: "Monthly",
    paymentTerms: "Immediate",
  },
  {
    id: "c9",
    company: "ACS Consultancy Services, Inc",
    cardOnFile: "**** **** **** 1234",
    unpaidInvoices: "",
    totalDue: 0.00,
    dateCreated: "2025-09-12",
    payMethod: "Auto",
    unpaidInvoicesStatus: "No",
    autoApprove: "Yes",
    invoiceCycle: "Monthly",
    paymentTerms: "Immediate",
  },
  {
    id: "c10",
    company: "Amity Tech Corporation",
    cardOnFile: "None",
    unpaidInvoices: "",
    totalDue: 0.00,
    dateCreated: "2026-02-15",
    payMethod: "Check",
    unpaidInvoicesStatus: "No",
    autoApprove: "Yes",
    invoiceCycle: "Monthly",
    paymentTerms: "Immediate",
  }
];

interface ClientPaymentsProps {
  isDarkMode?: boolean;
  onViewClient?: (clientId: string) => void;
  onNavigate?: (page: any) => void;
}

function getClientIdByName(name: string): string {
  const match = CLIENT_LIST.find((c) => c.companyName.toLowerCase() === name.toLowerCase());
  return match?.id ?? DEMO_CLIENT.id;
}

export function ClientPayments({ isDarkMode = false, onViewClient, onNavigate }: ClientPaymentsProps) {
  // Dropdown filter states
  const [paymentType, setPaymentType] = useState("Any");
  const [payMethod, setPayMethod] = useState("Any");
  const [unpaidInvoices, setUnpaidInvoices] = useState("Any");
  const [autoApprove, setAutoApprove] = useState("Any");
  const [invoiceCycle, setInvoiceCycle] = useState("Any");
  const [paymentTerms, setPaymentTerms] = useState("Any");

  // Submitted filter states
  const [appliedFilters, setAppliedFilters] = useState({
    paymentType: "Any",
    payMethod: "Any",
    unpaidInvoices: "Any",
    autoApprove: "Any",
    invoiceCycle: "Any",
    paymentTerms: "Any",
  });

  // Table states
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  
  // Modal states
  const [selectedRowForModal, setSelectedRowForModal] = useState<PaymentTypeRow | null>(null);

  // Dropdown open states
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const dropdownRefs = {
    paymentType: useRef<HTMLDivElement>(null),
    payMethod: useRef<HTMLDivElement>(null),
    unpaidInvoices: useRef<HTMLDivElement>(null),
    autoApprove: useRef<HTMLDivElement>(null),
    invoiceCycle: useRef<HTMLDivElement>(null),
    paymentTerms: useRef<HTMLDivElement>(null),
  };

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (activeDropdown) {
        const ref = dropdownRefs[activeDropdown as keyof typeof dropdownRefs];
        if (ref.current && !ref.current.contains(event.target as Node)) {
          setActiveDropdown(null);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeDropdown]);

  const handleGenerateReport = () => {
    setAppliedFilters({
      paymentType,
      payMethod,
      unpaidInvoices,
      autoApprove,
      invoiceCycle,
      paymentTerms,
    });
  };

  const isImmediate = appliedFilters.paymentType === "Immediate";

  // Filtered rows
  const filteredRows = useMemo(() => {
    let result = [...INITIAL_ROWS];

    // Dropdown filters
    if (appliedFilters.paymentType !== "Any") {
      result = result.filter(r => r.paymentType === appliedFilters.paymentType);
    }
    if (appliedFilters.payMethod !== "Any") {
      result = result.filter(r => r.paymentMethod === appliedFilters.payMethod);
    }
    if (appliedFilters.autoApprove !== "Any") {
      const autoApproveVal = appliedFilters.autoApprove === "Yes" ? 1 : 0;
      result = result.filter(r => r.autoApprove === autoApproveVal);
    }
    if (appliedFilters.invoiceCycle !== "Any") {
      result = result.filter(r => r.invoiceCycle === appliedFilters.invoiceCycle);
    }
    if (appliedFilters.paymentTerms !== "Any") {
      result = result.filter(r => r.paymentTerms === appliedFilters.paymentTerms);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        r =>
          r.paymentType.toLowerCase().includes(q) ||
          r.invoiceCycle.toLowerCase().includes(q) ||
          r.paymentTerms.toLowerCase().includes(q) ||
          r.paymentMethod.toLowerCase().includes(q) ||
          String(r.numClients).includes(q)
      );
    }

    return result;
  }, [appliedFilters, searchQuery]);

  // Filtered rows for immediate (individual clients) view
  const filteredIndividualRows = useMemo(() => {
    if (!isImmediate) return [];

    let result = [...INDIVIDUAL_CLIENTS];

    // Dropdown filters
    if (appliedFilters.payMethod !== "Any") {
      result = result.filter(r => r.payMethod === appliedFilters.payMethod);
    }
    if (appliedFilters.unpaidInvoices !== "Any") {
      result = result.filter(r => r.unpaidInvoicesStatus === appliedFilters.unpaidInvoices);
    }
    if (appliedFilters.autoApprove !== "Any") {
      result = result.filter(r => r.autoApprove === appliedFilters.autoApprove);
    }
    if (appliedFilters.invoiceCycle !== "Any") {
      result = result.filter(r => r.invoiceCycle === appliedFilters.invoiceCycle);
    }
    if (appliedFilters.paymentTerms !== "Any") {
      result = result.filter(r => r.paymentTerms === appliedFilters.paymentTerms);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        r =>
          r.company.toLowerCase().includes(q) ||
          r.cardOnFile.toLowerCase().includes(q) ||
          r.dateCreated.toLowerCase().includes(q) ||
          r.payMethod.toLowerCase().includes(q) ||
          r.invoiceCycle.toLowerCase().includes(q) ||
          r.paymentTerms.toLowerCase().includes(q)
      );
    }

    return result;
  }, [isImmediate, appliedFilters, searchQuery]);

  const displaySummaryRows = useMemo(() => {
    return filteredRows.slice(0, entriesPerPage);
  }, [filteredRows, entriesPerPage]);

  const displayIndividualRows = useMemo(() => {
    return filteredIndividualRows.slice(0, entriesPerPage);
  }, [filteredIndividualRows, entriesPerPage]);

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

  // Render Card-Style Dropdown Field
  const renderFilterDropdown = (
    label: string,
    value: string,
    setValue: (val: string) => void,
    fieldKey: keyof typeof FILTER_OPTIONS
  ) => {
    const isOpen = activeDropdown === fieldKey;
    const ref = dropdownRefs[fieldKey as keyof typeof dropdownRefs];

    return (
      <div style={{ position: "relative" }} ref={ref}>
        <div
          onClick={() => {
            setActiveDropdown(isOpen ? null : fieldKey);
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
          <label style={{ fontSize: "11px", color: labelColor, fontWeight: 400, marginBottom: "3px", textAlign: "left" }}>
            {label}
          </label>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "13px", color: textPrimary }}>{value}</span>
            <ChevronDown size={14} style={{ color: textMuted }} />
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
            {FILTER_OPTIONS[fieldKey].map((opt) => {
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
                    padding: "8px 12px",
                    fontSize: "12.5px",
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
          Client Payment Type Report
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "12px" }}>
            {renderFilterDropdown("Payment Type", paymentType, setPaymentType, "paymentType")}
            {renderFilterDropdown("Pay Method", payMethod, setPayMethod, "payMethod")}
            {renderFilterDropdown("Unpaid Invoices", unpaidInvoices, setUnpaidInvoices, "unpaidInvoices")}
            {renderFilterDropdown("Auto Approve Invoice", autoApprove, setAutoApprove, "autoApprove")}
            {renderFilterDropdown("Invoice Cycle", invoiceCycle, setInvoiceCycle, "invoiceCycle")}
            {renderFilterDropdown("Payment Terms", paymentTerms, setPaymentTerms, "paymentTerms")}
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
                transition: "background 0.15s ease",
                fontFamily: "'Wix Madefor Display', sans-serif",
              }}
            >
              Generate Report
            </button>
          </div>
        </div>

        {/* ── Report Card Panel ── */}
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
          {/* Card Header (Entries Selector & Search Bar) */}
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
          {isImmediate ? (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: tableHeaderBg, borderBottom: tableHeaderBorder }}>
                    <th style={{ padding: "12px 20px", fontWeight: 600, color: textMuted }}>Company</th>
                    <th style={{ padding: "12px 20px", fontWeight: 600, color: textMuted }}>Billing Configuration</th>
                    <th style={{ padding: "12px 20px", fontWeight: 600, color: textMuted }}>Card On File</th>
                    <th style={{ padding: "12px 20px", fontWeight: 600, color: textMuted }}>Primary User</th>
                    <th style={{ padding: "12px 20px", fontWeight: 600, color: textMuted }}>Unpaid Invoices</th>
                    <th style={{ padding: "12px 20px", fontWeight: 600, color: textMuted }}>Total Due</th>
                    <th style={{ padding: "12px 20px", fontWeight: 600, color: textMuted }}>Date Created</th>
                  </tr>
                </thead>
                <tbody>
                  {displayIndividualRows.map((row) => (
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
                      {/* Company Cell (Clickable Red Link) */}
                      <td style={{ padding: "12px 20px" }}>
                        <button
                          type="button"
                          onClick={() => onViewClient?.(getClientIdByName(row.company))}
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
                          {row.company}
                        </button>
                      </td>

                      {/* Billing Configuration Cell */}
                      <td style={{ padding: "12px 20px" }}>
                        <button
                          type="button"
                          onClick={() => onNavigate?.("billing-setup")}
                          style={{
                            background: "transparent",
                            border: "none",
                            padding: 0,
                            color: primaryBrandColor,
                            fontSize: "13px",
                            fontWeight: 400,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.textDecoration = "underline";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.textDecoration = "none";
                          }}
                        >
                          <Settings size={14} style={{ color: primaryBrandColor }} />
                          <span>Billing Config</span>
                        </button>
                      </td>

                      {/* Card On File Cell */}
                      <td style={{ padding: "12px 20px", color: textPrimary }}>
                        {row.cardOnFile}
                      </td>

                      {/* Primary User Cell */}
                      <td style={{ padding: "12px 20px" }}>
                        <button
                          type="button"
                          style={{
                            background: "transparent",
                            border: "none",
                            padding: 0,
                            color: primaryBrandColor,
                            fontSize: "13px",
                            fontWeight: 400,
                            cursor: "pointer",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.textDecoration = "underline";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.textDecoration = "none";
                          }}
                        >
                          Update Primary
                        </button>
                      </td>

                      {/* Unpaid Invoices Cell */}
                      <td style={{ padding: "12px 20px", color: textPrimary }}>
                        {row.unpaidInvoices}
                      </td>

                      {/* Total Due Cell */}
                      <td style={{ padding: "12px 20px", color: textPrimary }}>
                        ₹{row.totalDue.toFixed(2)}
                      </td>

                      {/* Date Created Cell */}
                      <td style={{ padding: "12px 20px", color: textPrimary }}>
                        {row.dateCreated}
                      </td>
                    </tr>
                  ))}
                  {displayIndividualRows.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ padding: "24px", color: textMuted, textAlign: "center" }}>
                        No individual client records matched the selected criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: tableHeaderBg, borderBottom: tableHeaderBorder }}>
                    <th style={{ padding: "12px 20px", fontWeight: 600, color: textMuted, width: "100px" }}>View</th>
                    <th style={{ padding: "12px 20px", fontWeight: 600, color: textMuted, width: "140px" }}>Number Clients</th>
                    <th style={{ padding: "12px 20px", fontWeight: 600, color: textMuted }}>Payment Type</th>
                    <th style={{ padding: "12px 20px", fontWeight: 600, color: textMuted }}>Invoice Cycle</th>
                    <th style={{ padding: "12px 20px", fontWeight: 600, color: textMuted }}>Payment Terms</th>
                    <th style={{ padding: "12px 20px", fontWeight: 600, color: textMuted }}>Payment Method</th>
                    <th style={{ padding: "12px 20px", fontWeight: 600, color: textMuted, width: "160px" }}>Auto Approve Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {displaySummaryRows.map((row) => (
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
                      {/* View Button Cell */}
                      <td style={{ padding: "10px 20px" }}>
                        <button
                          type="button"
                          onClick={() => setSelectedRowForModal(row)}
                          style={{
                            background: primaryBrandColor,
                            color: "#FFFFFF",
                            border: "none",
                            borderRadius: "3px",
                            padding: "5px 10px",
                            fontSize: "11.5px",
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            transition: "background 0.12s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = primaryBrandHover)}
                          onMouseLeave={(e) => (e.currentTarget.style.background = primaryBrandColor)}
                        >
                          <Eye size={12} />
                          View
                        </button>
                      </td>
                      <td style={{ padding: "12px 20px", color: textPrimary, fontWeight: 500 }}>
                        {row.numClients}
                      </td>
                      <td style={{ padding: "12px 20px", color: textPrimary }}>
                        {row.paymentType}
                      </td>
                      <td style={{ padding: "12px 20px", color: textPrimary }}>
                        {row.invoiceCycle}
                      </td>
                      <td style={{ padding: "12px 20px", color: textPrimary }}>
                        {row.paymentTerms}
                      </td>
                      <td style={{ padding: "12px 20px", color: textPrimary }}>
                        {row.paymentMethod || "-"}
                      </td>
                      <td style={{ padding: "12px 20px", color: textPrimary }}>
                        {row.autoApprove}
                      </td>
                    </tr>
                  ))}
                  {displaySummaryRows.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ padding: "24px", color: textMuted, textAlign: "center" }}>
                        No payment type records matched the selected criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* ── Interactive Modal showing Client List ── */}
      {selectedRowForModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(2px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            padding: "20px",
          }}
          onClick={() => setSelectedRowForModal(null)}
        >
          {/* Modal Card */}
          <div
            style={{
              background: cardBg,
              border: cardBorder,
              borderRadius: "6px",
              width: "480px",
              maxWidth: "100%",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
              display: "flex",
              flexDirection: "column",
              maxHeight: "80vh",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "16px 20px",
                borderBottom: cardBorder,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: tableHeaderBg,
              }}
            >
              <h3 style={{ fontSize: "15px", fontWeight: 600, color: textTitle, margin: 0 }}>
                Clients List ({selectedRowForModal.clients.length} Clients)
              </h3>
              <button
                type="button"
                onClick={() => setSelectedRowForModal(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  color: textMuted,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = primaryBrandColor)}
                onMouseLeave={(e) => (e.currentTarget.style.color = textMuted)}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Sub-Header (Info details) */}
            <div style={{ padding: "12px 20px", borderBottom: cardBorder, fontSize: "12px", color: textMuted, background: isDarkMode ? "rgba(255,255,255,0.01)" : "#FAFBFB" }}>
              <strong>Type:</strong> {selectedRowForModal.paymentType} | <strong>Cycle:</strong> {selectedRowForModal.invoiceCycle} | <strong>Terms:</strong> {selectedRowForModal.paymentTerms} | <strong>Method:</strong> {selectedRowForModal.paymentMethod || "None"}
            </div>

            {/* Modal Content (Scrollable client list) */}
            <div style={{ padding: "16px 20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
              {selectedRowForModal.clients.map((client) => (
                <div
                  key={client}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 12px",
                    border: cardBorder,
                    borderRadius: "4px",
                    background: isDarkMode ? "#1C1D22" : "#FAFBFB",
                  }}
                >
                  <span style={{ fontSize: "13.5px", fontWeight: 500, color: textPrimary }}>
                    {client}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRowForModal(null);
                      onViewClient?.(getClientIdByName(client));
                    }}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: primaryBrandColor,
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: 0,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                    onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                  >
                    <span>View Profile</span>
                    <ExternalLink size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
