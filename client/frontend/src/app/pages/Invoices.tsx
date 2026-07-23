import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  ArrowUpDown,
  ArrowLeft,
  Download,
  Eye,
} from "lucide-react";
import { jsPDF } from "jspdf";
import { Footer } from "../components/Footer";
import darkLogo from "../../imports/logo_2_logo_evalright_small_final.png";

const LOGO_SRC = "/evalright-logo.jpg";

interface InvoiceListItem {
  id: string;
  number: number;
  invoiceNumber: string;
  branch: string;
  invoiceDate: string;
  dueDate: string;
  total: number;
  status: string;
  orderNumber?: string;
}

interface InvoiceDetail {
  id: string;
  invoiceNumber: string;
  status: string;
  invoiceDate: string;
  dueDate: string;
  datePaid: string;
  currency: string;
  subTotal: number;
  credit: number;
  tax: number;
  total: number;
  balance: number;
  order: { id: string; orderNumber: string; createdAt: string };
  company: { name: string };
  branch: { id?: string; name: string; address?: string | null };
  applicant: {
    name: string;
    email: string;
    phone: string;
    addressLines: string[];
    address: any;
  };
  billingCompany: {
    name: string;
    addressLines: string[];
    phone: string;
    tollFree: string;
    email: string;
    website: string;
  };
  services: Array<{
    id: string;
    name: string;
    serviceCode?: string;
    unitPrice: number;
    discount: number;
    tax: number;
    finalPrice: number;
    status?: string;
  }>;
  transactions: Array<{
    transactionDate: string;
    gateway: string;
    transactionId: string;
    amount: number;
    method?: string | null;
    status?: string;
    paidAt?: string;
  }>;
  payment: {
    gateway: string;
    method: string;
    transactionId: string;
    razorpayOrderId?: string | null;
    grossAmount: number;
    deductions: number;
    netAmount: number;
    paidAt: string;
    status?: string;
  } | null;
}

type SortField = "number" | "branch" | "invoiceDate" | "dueDate" | "total" | "status" | "invoiceNumber";

const COLUMNS: { label: string; field: SortField | null; sortable: boolean }[] = [
  { label: "#", field: "number", sortable: true },
  { label: "Branch", field: "branch", sortable: true },
  { label: "Invoice Date", field: "invoiceDate", sortable: true },
  { label: "Due Date", field: "dueDate", sortable: true },
  { label: "Total", field: "total", sortable: true },
  { label: "Status", field: "status", sortable: true },
  { label: "Actions", field: null, sortable: false },
];

function formatMoney(amount: number, currency = "INR") {
  const symbol = currency === "INR" ? "₹" : "$";
  return `${symbol}${Number(amount || 0).toFixed(2)}`;
}

function PaidBadge({ status }: { status: string }) {
  const isPaid = status.toUpperCase() === "PAID";
  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 12px",
        borderRadius: "4px",
        fontSize: "11px",
        fontWeight: 700,
        background: isPaid ? "#28A745" : "#F59E0B",
        color: "#FFFFFF",
        letterSpacing: "0.04em",
      }}
    >
      {status.toUpperCase()}
    </span>
  );
}

function downloadTextFile(filename: string, content: string, mime = "text/plain") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function loadImageAsDataUrl(src: string): Promise<string | null> {
  try {
    const response = await fetch(src);
    if (!response.ok) return null;
    const blob = await response.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(typeof reader.result === "string" ? reader.result : null);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function buildInvoiceCsv(detail: InvoiceDetail) {
  const rows = [
    ["Field", "Value"],
    ["Invoice Number", detail.invoiceNumber],
    ["Status", detail.status],
    ["Invoice Date", detail.invoiceDate],
    ["Due Date", detail.dueDate],
    ["Date Paid", detail.datePaid],
    ["Order Number", detail.order.orderNumber],
    ["Company", detail.company.name],
    ["Branch", detail.branch.name],
    ["Applicant", detail.applicant.name],
    ["Applicant Email", detail.applicant.email],
    ["Applicant Phone", detail.applicant.phone],
    ["Address", detail.applicant.addressLines.join(" | ")],
    ["Sub Total", String(detail.subTotal)],
    ["Tax", String(detail.tax)],
    ["Total", String(detail.total)],
    [],
    ["Service", "Unit Price", "Tax", "Final Price"],
    ...detail.services.map((s) => [s.name, s.unitPrice, s.tax, s.finalPrice]),
    [],
    ["Transaction Date", "Gateway", "Transaction ID", "Amount"],
    ...detail.transactions.map((t) => [t.transactionDate, t.gateway, t.transactionId, t.amount]),
  ];
  return rows.map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
}

function formatPdfMoney(amount: number) {
  // jsPDF helvetica cannot render ₹ reliably — use Rs.
  return `Rs. ${Number(amount || 0).toFixed(2)}`;
}

function normalizeCountry(value?: string | null) {
  if (!value) return "India";
  const v = String(value).trim();
  if (!v || v.toUpperCase() === "USA" || v.toUpperCase() === "US" || v.toUpperCase() === "UNITED STATES") {
    return "India";
  }
  if (v.toUpperCase() === "IN") return "India";
  return v;
}

function getInvoiceAddressLines(detail: InvoiceDetail): string[] {
  const lines = (detail.applicant.addressLines || [])
    .map((line) =>
      String(line)
        .replace(/\bUSA\b/gi, "India")
        .replace(/\bUnited States\b/gi, "India")
        .trim()
    )
    .filter(Boolean);

  if (detail.applicant.address?.country) {
    const country = normalizeCountry(detail.applicant.address.country);
    const hasCountry = lines.some((l) => l.toLowerCase().includes(country.toLowerCase()));
    if (!hasCountry) lines.push(country);
  } else if (lines.length > 0 && !lines.some((l) => /india/i.test(l))) {
    lines.push("India");
  }

  return lines.length ? lines : ["India"];
}

async function downloadInvoicePdf(detail: InvoiceDetail, isDarkMode = false) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 48;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const drawHLine = (yy: number, color: [number, number, number] = [210, 214, 220]) => {
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.setLineWidth(0.8);
    doc.line(margin, yy, pageWidth - margin, yy);
  };

  // Header box
  doc.setDrawColor(229, 231, 235);
  doc.setFillColor(252, 252, 253);
  doc.rect(margin, y, contentWidth, 72, "FD");

  const logoSrc = isDarkMode
    ? (typeof darkLogo === "string" ? darkLogo : String(darkLogo))
    : LOGO_SRC;
  const logoData = await loadImageAsDataUrl(logoSrc);
  if (logoData) {
    try {
      const format = logoData.startsWith("data:image/png") ? "PNG" : "JPEG";
      doc.addImage(logoData, format, margin + 12, y + 12, 140, 48);
    } catch {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(199, 0, 57);
      doc.text("EvalRight", margin + 14, y + 42);
    }
  } else {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(199, 0, 57);
    doc.text("EvalRight", margin + 14, y + 42);
  }

  doc.setTextColor(55, 65, 81);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(`Invoice #${detail.invoiceNumber}`, pageWidth - margin - 12, y + 28, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Status: ${detail.status}`, pageWidth - margin - 12, y + 46, { align: "right" });

  y += 88;

  // Two-column info section
  const leftX = margin;
  const rightX = pageWidth - margin;
  const colTop = y;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(31, 41, 55);
  doc.text("Invoice Details", leftX, y);
  y += 16;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(75, 85, 99);
  doc.text(`Invoice Date: ${detail.invoiceDate}`, leftX, y);
  y += 14;
  doc.text(`Due Date: ${detail.dueDate}`, leftX, y);
  y += 14;
  doc.text(`Date Paid: ${detail.datePaid}`, leftX, y);
  y += 14;
  doc.text(`Order #: ${detail.order.orderNumber}`, leftX, y);
  const leftBottom = y;

  let ry = colTop;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(31, 41, 55);
  doc.text(detail.company.name || "Client", rightX, ry, { align: "right" });
  ry += 16;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(75, 85, 99);
  doc.text(`Branch: ${detail.branch.name}`, rightX, ry, { align: "right" });
  ry += 14;
  doc.text(`Applicant: ${detail.applicant.name}`, rightX, ry, { align: "right" });
  ry += 14;
  doc.text(detail.applicant.email || "-", rightX, ry, { align: "right" });
  ry += 14;
  getInvoiceAddressLines(detail).forEach((line) => {
    doc.text(line, rightX, ry, { align: "right" });
    ry += 14;
  });

  y = Math.max(leftBottom, ry) + 18;
  drawHLine(y);
  y += 22;

  // Services table
  ensureSpace(80);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(31, 41, 55);
  doc.text("Services Chosen", margin, y);
  y += 12;

  const colService = margin + 8;
  const colUnit = margin + contentWidth * 0.58;
  const colTax = margin + contentWidth * 0.76;
  const colAmount = pageWidth - margin - 8;

  // Table header bar
  doc.setFillColor(243, 244, 246);
  doc.setDrawColor(209, 213, 219);
  doc.rect(margin, y, contentWidth, 22, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(75, 85, 99);
  doc.text("Service", colService, y + 14);
  doc.text("Unit Price", colUnit, y + 14, { align: "right" });
  doc.text("Tax", colTax, y + 14, { align: "right" });
  doc.text("Amount", colAmount, y + 14, { align: "right" });
  y += 22;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(55, 65, 81);

  if (detail.services.length === 0) {
    doc.setDrawColor(229, 231, 235);
    doc.rect(margin, y, contentWidth, 24, "S");
    doc.text("No services found for this order.", colService, y + 15);
    y += 24;
  } else {
    detail.services.forEach((service) => {
      ensureSpace(28);
      doc.setDrawColor(229, 231, 235);
      doc.rect(margin, y, contentWidth, 24, "S");
      doc.text(String(service.name || "Service").slice(0, 48), colService, y + 15);
      doc.text(formatPdfMoney(service.unitPrice), colUnit, y + 15, { align: "right" });
      doc.text(formatPdfMoney(service.tax), colTax, y + 15, { align: "right" });
      doc.text(formatPdfMoney(service.finalPrice), colAmount, y + 15, { align: "right" });
      y += 24;
    });
  }

  // Totals box
  y += 16;
  ensureSpace(70);
  const totalsWidth = 200;
  const totalsX = pageWidth - margin - totalsWidth;
  doc.setDrawColor(209, 213, 219);
  doc.setFillColor(252, 252, 253);
  doc.rect(totalsX, y, totalsWidth, 58, "FD");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(75, 85, 99);
  doc.text("Sub Total", totalsX + 12, y + 16);
  doc.text(formatPdfMoney(detail.subTotal), totalsX + totalsWidth - 12, y + 16, { align: "right" });
  doc.text("Tax (8%)", totalsX + 12, y + 32);
  doc.text(formatPdfMoney(detail.tax), totalsX + totalsWidth - 12, y + 32, { align: "right" });
  doc.setDrawColor(229, 231, 235);
  doc.line(totalsX + 10, y + 38, totalsX + totalsWidth - 10, y + 38);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(199, 0, 57);
  doc.setFontSize(11);
  doc.text("Total", totalsX + 12, y + 52);
  doc.text(formatPdfMoney(detail.total), totalsX + totalsWidth - 12, y + 52, { align: "right" });
  y += 78;

  // Payment history
  ensureSpace(80);
  drawHLine(y);
  y += 20;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(31, 41, 55);
  doc.text("Payment / Transaction History", margin, y);
  y += 12;

  const pDate = margin + 8;
  const pGateway = margin + 110;
  const pTxn = margin + 210;
  const pAmt = pageWidth - margin - 8;

  doc.setFillColor(243, 244, 246);
  doc.setDrawColor(209, 213, 219);
  doc.rect(margin, y, contentWidth, 22, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(75, 85, 99);
  doc.text("Date", pDate, y + 14);
  doc.text("Gateway", pGateway, y + 14);
  doc.text("Transaction ID", pTxn, y + 14);
  doc.text("Amount", pAmt, y + 14, { align: "right" });
  y += 22;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(55, 65, 81);

  if (detail.transactions.length === 0) {
    doc.setDrawColor(229, 231, 235);
    doc.rect(margin, y, contentWidth, 24, "S");
    doc.text("No transactions found.", pDate, y + 15);
    y += 24;
  } else {
    detail.transactions.forEach((txn) => {
      ensureSpace(28);
      doc.setDrawColor(229, 231, 235);
      doc.rect(margin, y, contentWidth, 24, "S");
      doc.text(txn.transactionDate || "-", pDate, y + 15);
      doc.text(String(txn.gateway || "-").slice(0, 16), pGateway, y + 15);
      doc.text(String(txn.transactionId || "-").slice(0, 34), pTxn, y + 15);
      doc.text(formatPdfMoney(txn.amount), pAmt, y + 15, { align: "right" });
      y += 24;
    });
  }

  // Footer
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);
  doc.text("EvalRight — Screen before Hire", margin, pageHeight - 28);
  doc.text(`Generated on ${new Date().toLocaleString()}`, pageWidth - margin, pageHeight - 28, { align: "right" });

  doc.save(`${detail.invoiceNumber}.pdf`);
}

interface InvoicesProps {
  isDarkMode?: boolean;
  currentUser?: any;
}

export function Invoices({ isDarkMode = false, currentUser }: InvoicesProps) {
  const [invoices, setInvoices] = useState<InvoiceListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [viewingInvoiceId, setViewingInvoiceId] = useState<string | null>(null);
  const [detail, setDetail] = useState<InvoiceDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const primaryColor = isDarkMode ? "#DF2A57" : "#C70039";
  const purpleColor = "#2E1B85";
  const cardBg = isDarkMode ? "#1A1C21" : "#FFFFFF";
  const borderColor = isDarkMode ? "#333333" : "#E5E7EB";
  const textColor = isDarkMode ? "#E5E7EB" : "#555555";
  const mutedColor = isDarkMode ? "#9CA3AF" : "#666666";
  const tableHeaderBg = isDarkMode ? "#2A2D34" : "#F9FAFB";

  async function loadInvoices() {
    if (!currentUser?.id) {
      setInvoices([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/api/invoices", {
        headers: { "x-user-id": currentUser.id },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error || "Failed to load invoices");
      setInvoices(data.invoices || []);
    } catch (err: any) {
      setError(err.message || "Failed to load invoices");
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInvoices();
  }, [currentUser?.id]);

  async function openInvoice(id: string) {
    if (!currentUser?.id) return;
    setViewingInvoiceId(id);
    setDetailLoading(true);
    setDetail(null);
    try {
      const response = await fetch(`http://localhost:5000/api/invoices/${encodeURIComponent(id)}`, {
        headers: { "x-user-id": currentUser.id },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error || "Failed to load invoice");
      setDetail(data.invoice);
    } catch (err: any) {
      setError(err.message || "Failed to load invoice details");
      setViewingInvoiceId(null);
    } finally {
      setDetailLoading(false);
    }
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const processedInvoices = useMemo(() => {
    let result = [...invoices];
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((inv) =>
        Object.values(inv).some((val) => String(val).toLowerCase().includes(query))
      );
    }
    if (sortField) {
      result = [...result].sort((a, b) => {
        const valA = a[sortField] as any;
        const valB = b[sortField] as any;
        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [invoices, searchQuery, sortField, sortAsc]);

  const totalEntries = processedInvoices.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / pageSize));
  const startIndex = totalEntries === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, totalEntries);
  const paginatedInvoices = processedInvoices.slice((page - 1) * pageSize, page * pageSize);

  if (viewingInvoiceId) {
    return (
      <div className="flex-1 flex flex-col min-h-0" style={{ background: isDarkMode ? "#252830" : "#F6F6F6" }}>
        <div className="flex-1 p-6" style={{ overflowY: "auto" }}>
          <h1 style={{ fontSize: "20px", fontWeight: 500, color: primaryColor, marginBottom: "20px" }}>
            Invoice Details
          </h1>

          <div
            style={{
              background: cardBg,
              border: `1px solid ${borderColor}`,
              borderRadius: "6px",
              padding: "24px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
              <button
                onClick={() => {
                  setViewingInvoiceId(null);
                  setDetail(null);
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 14px",
                  background: cardBg,
                  color: textColor,
                  border: `1px solid ${borderColor}`,
                  borderRadius: "4px",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                <ArrowLeft size={14} />
                Go Back
              </button>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button
                  disabled={!detail}
                  onClick={() => detail && downloadInvoicePdf(detail, isDarkMode)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 16px",
                    background: purpleColor,
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "13px",
                    fontWeight: 500,
                    cursor: detail ? "pointer" : "not-allowed",
                    opacity: detail ? 1 : 0.6,
                  }}
                >
                  <Download size={14} />
                  Download PDF
                </button>
                <button
                  disabled={!detail}
                  onClick={() =>
                    detail &&
                    downloadTextFile(`${detail.invoiceNumber}.csv`, buildInvoiceCsv(detail), "text/csv")
                  }
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 16px",
                    background: purpleColor,
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "13px",
                    fontWeight: 500,
                    cursor: detail ? "pointer" : "not-allowed",
                    opacity: detail ? 1 : 0.6,
                  }}
                >
                  <Download size={14} />
                  Download CSV
                </button>
                <button
                  disabled={!detail}
                  onClick={() => detail && downloadInvoicePdf(detail, isDarkMode)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 16px",
                    background: purpleColor,
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "13px",
                    fontWeight: 500,
                    cursor: detail ? "pointer" : "not-allowed",
                    opacity: detail ? 1 : 0.6,
                  }}
                >
                  <Download size={14} />
                  Download Detail
                </button>
              </div>
            </div>

            {detailLoading || !detail ? (
              <div style={{ padding: "24px", color: mutedColor, fontSize: 13 }}>Loading invoice…</div>
            ) : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                  <div>
                    <img
                      src={isDarkMode ? darkLogo : LOGO_SRC}
                      alt="EvalRight"
                      style={{
                        height: 56,
                        width: "auto",
                        maxWidth: 220,
                        objectFit: "contain",
                        objectPosition: "left center",
                        display: "block",
                        marginBottom: 12,
                      }}
                    />
                    <div style={{ fontSize: "16px", fontWeight: 600, color: textColor, marginBottom: "12px" }}>
                      Invoice #{detail.invoiceNumber}
                    </div>
                    <PaidBadge status={detail.status} />
                    <div style={{ marginTop: "20px", fontSize: "13px", color: textColor, display: "flex", flexDirection: "column", gap: "6px" }}>
                      <div>Invoice Date: {detail.invoiceDate}</div>
                      <div>Due Date: {detail.dueDate}</div>
                      <div>Date Paid: {detail.datePaid}</div>
                      <div>Order #: {detail.order.orderNumber}</div>
                      <div>Order Created: {detail.order.createdAt}</div>
                    </div>
                  </div>

                  <div style={{ fontSize: "13px", color: textColor, lineHeight: 1.6 }}>
                    <div style={{ fontWeight: 600, marginBottom: "8px" }}>{detail.company.name}</div>
                    <div>Branch: {detail.branch.name}</div>
                    {detail.branch.address && <div>{detail.branch.address}</div>}
                    <div style={{ marginTop: "12px", fontWeight: 600 }}>Applicant</div>
                    <div>{detail.applicant.name}</div>
                    <div>{detail.applicant.email}</div>
                    <div>{detail.applicant.phone}</div>
                    <div style={{ marginTop: "8px", fontWeight: 600 }}>Order Address</div>
                    {(detail.applicant.addressLines.length
                      ? detail.applicant.addressLines.map((line) =>
                          String(line).replace(/\bUSA\b/gi, "India").replace(/\bUnited States\b/gi, "India")
                        )
                      : ["India"]
                    ).map((line) => (
                      <div key={line}>{line}</div>
                    ))}
                    <div style={{ marginTop: "12px" }}>Toll Free: {detail.billingCompany.tollFree}</div>
                    <div>Website: {detail.billingCompany.website}</div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", borderTop: `1px solid ${borderColor}`, paddingTop: "20px" }}>
                  <div style={{ fontSize: "13px", color: textColor }}>
                    <div>Date Paid: {detail.datePaid}</div>
                    {detail.payment && (
                      <>
                        <div style={{ marginTop: 8 }}>Payment Gateway: {detail.payment.gateway}</div>
                        <div>Payment Method: {detail.payment.method}</div>
                        <div>Transaction ID: {detail.payment.transactionId}</div>
                        {detail.payment.razorpayOrderId && <div>Razorpay Order: {detail.payment.razorpayOrderId}</div>}
                      </>
                    )}
                  </div>
                  <div style={{ fontSize: "13px", color: textColor, textAlign: "right" }}>
                    <div>Phone: {detail.billingCompany.phone}</div>
                    <div>Email: {detail.billingCompany.email}</div>
                  </div>
                </div>

                <div style={{ borderTop: `1px solid ${borderColor}`, paddingTop: "16px" }}>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: textColor, marginBottom: "10px" }}>
                    Services Chosen
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                      <thead>
                        <tr style={{ background: tableHeaderBg }}>
                          {["Service", "Unit Price", "Tax", "Amount"].map((col) => (
                            <th
                              key={col}
                              style={{
                                padding: "10px 12px",
                                textAlign: col === "Service" ? "left" : "right",
                                fontWeight: 600,
                                color: mutedColor,
                                borderBottom: `1px solid ${borderColor}`,
                              }}
                            >
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {detail.services.length === 0 ? (
                          <tr>
                            <td colSpan={4} style={{ padding: "12px", color: mutedColor }}>
                              No services found for this order.
                            </td>
                          </tr>
                        ) : (
                          detail.services.map((service) => (
                            <tr key={service.id} style={{ borderBottom: `1px solid ${borderColor}` }}>
                              <td style={{ padding: "10px 12px", color: textColor }}>{service.name}</td>
                              <td style={{ padding: "10px 12px", textAlign: "right", color: textColor }}>
                                {formatMoney(service.unitPrice, detail.currency)}
                              </td>
                              <td style={{ padding: "10px 12px", textAlign: "right", color: textColor }}>
                                {formatMoney(service.tax, detail.currency)}
                              </td>
                              <td style={{ padding: "10px 12px", textAlign: "right", color: textColor }}>
                                {formatMoney(service.finalPrice, detail.currency)}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    borderTop: `1px solid ${borderColor}`,
                    paddingTop: "20px",
                  }}
                >
                  <div style={{ fontSize: "13px", color: textColor, textAlign: "right" }}>
                    <div>Sub Total: {formatMoney(detail.subTotal, detail.currency)}</div>
                    <div>Tax: {formatMoney(detail.tax, detail.currency)}</div>
                    <div style={{ fontSize: "16px", fontWeight: 700, color: primaryColor, marginTop: "8px" }}>
                      Total: {formatMoney(detail.total, detail.currency)}
                    </div>
                  </div>
                </div>

                <div style={{ overflowX: "auto", borderTop: `1px solid ${borderColor}`, paddingTop: "16px" }}>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: textColor, marginBottom: "10px" }}>
                    Payment / Transaction History
                  </div>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                    <thead>
                      <tr style={{ background: tableHeaderBg }}>
                        {["Transaction Date", "Gateway", "Transaction ID", "Amount"].map((col) => (
                          <th
                            key={col}
                            style={{
                              padding: "10px 12px",
                              textAlign: col === "Amount" ? "right" : "left",
                              fontWeight: 600,
                              color: mutedColor,
                              borderBottom: `1px solid ${borderColor}`,
                            }}
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {detail.transactions.length === 0 ? (
                        <tr>
                          <td colSpan={4} style={{ padding: "12px", color: mutedColor }}>
                            No transactions found.
                          </td>
                        </tr>
                      ) : (
                        detail.transactions.map((txn, idx) => (
                          <tr key={`${txn.transactionId}-${idx}`} style={{ borderBottom: `1px solid ${borderColor}` }}>
                            <td style={{ padding: "10px 12px", color: textColor }}>{txn.transactionDate}</td>
                            <td style={{ padding: "10px 12px", color: textColor }}>{txn.gateway || "-"}</td>
                            <td style={{ padding: "10px 12px", color: textColor }}>{txn.transactionId}</td>
                            <td style={{ padding: "10px 12px", textAlign: "right", color: textColor }}>
                              {formatMoney(txn.amount, detail.currency)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
        <Footer isDarkMode={isDarkMode} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0" style={{ background: isDarkMode ? "#252830" : "#F6F6F6" }}>
      <div className="flex-1 p-6" style={{ overflowY: "auto" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 500, color: primaryColor, marginBottom: "20px" }}>
          My Invoices
        </h1>

        <div
          style={{
            background: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: "4px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
            overflow: "hidden",
            marginBottom: "20px",
          }}
        >
          <div style={{ padding: "16px", borderBottom: `1px solid ${borderColor}` }}>
            <h2 style={{ fontSize: "13px", fontWeight: 600, color: textColor, margin: 0 }}>Invoice List</h2>
          </div>

          {error && (
            <div style={{ margin: "12px 16px 0", padding: "10px 12px", borderRadius: 4, background: "#FEF2F2", color: "#991B1B", fontSize: 13 }}>
              {error}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: textColor }}>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                style={{
                  border: `1px solid ${borderColor}`,
                  borderRadius: "3px",
                  padding: "3px 6px",
                  fontSize: "12px",
                  outline: "none",
                  background: isDarkMode ? "#252830" : "#FFFFFF",
                  color: textColor,
                  cursor: "pointer",
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>entries per page</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: isDarkMode ? "#252830" : "#F9FAFB",
                border: `1px solid ${borderColor}`,
                borderRadius: "3px",
                padding: "0 8px",
                height: "28px",
                width: "180px",
              }}
            >
              <Search size={13} style={{ color: "#9CA3AF", marginRight: "6px" }} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                style={{
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  fontSize: "12px",
                  color: textColor,
                  width: "100%",
                }}
              />
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ background: tableHeaderBg, borderTop: `1px solid ${borderColor}`, borderBottom: `1px solid ${borderColor}` }}>
                  {COLUMNS.map((col, idx) => (
                    <th
                      key={col.label}
                      onClick={() => col.sortable && col.field && handleSort(col.field)}
                      style={{
                        padding: "10px 14px",
                        fontSize: "11px",
                        fontWeight: 600,
                        color: mutedColor,
                        cursor: col.sortable ? "pointer" : "default",
                        borderRight: idx < COLUMNS.length - 1 ? `1px solid ${borderColor}` : "none",
                        userSelect: "none",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px" }}>
                        <span>{col.label}</span>
                        {col.sortable && (
                          <ArrowUpDown size={11} style={{ color: sortField === col.field ? primaryColor : "#A0A0A0" }} />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} style={{ padding: "24px 16px", textAlign: "center", fontSize: "12px", color: "#8A8A8A" }}>
                      Loading invoices…
                    </td>
                  </tr>
                ) : paginatedInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: "24px 16px", textAlign: "center", fontSize: "12px", color: "#8A8A8A" }}>
                      No invoices found
                    </td>
                  </tr>
                ) : (
                  paginatedInvoices.map((inv, idx) => (
                    <tr
                      key={inv.id}
                      style={{
                        background: idx % 2 === 0 ? cardBg : isDarkMode ? "#252830" : "#FAFAFA",
                        borderBottom: `1px solid ${isDarkMode ? "#333333" : "#F3F4F6"}`,
                      }}
                    >
                      <td style={{ padding: "12px 14px", fontSize: "12px", color: textColor }}>{inv.number}</td>
                      <td style={{ padding: "12px 14px", fontSize: "12px", color: textColor }}>{inv.branch}</td>
                      <td style={{ padding: "12px 14px", fontSize: "12px", color: textColor }}>{inv.invoiceDate}</td>
                      <td style={{ padding: "12px 14px", fontSize: "12px", color: textColor }}>{inv.dueDate}</td>
                      <td style={{ padding: "12px 14px", fontSize: "12px", color: textColor }}>
                        {formatMoney(inv.total)}
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: "12px", color: textColor }}>
                        <PaidBadge status={inv.status} />
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <button
                            onClick={() => openInvoice(inv.id)}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                              border: "none",
                              background: "none",
                              color: primaryColor,
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: "pointer",
                              padding: 0,
                            }}
                          >
                            <Eye size={14} />
                            View
                          </button>
                          <button
                            onClick={async () => {
                              if (!currentUser?.id) return;
                              const response = await fetch(
                                `http://localhost:5000/api/invoices/${encodeURIComponent(inv.id)}`,
                                { headers: { "x-user-id": currentUser.id } }
                              );
                              const data = await response.json();
                              if (response.ok && data.invoice) {
                                await downloadInvoicePdf(data.invoice, isDarkMode);
                              }
                            }}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                              border: "none",
                              background: "none",
                              color: purpleColor,
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: "pointer",
                              padding: 0,
                            }}
                          >
                            <Download size={14} />
                            Download
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 16px",
              borderTop: `1px solid ${borderColor}`,
              background: cardBg,
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <span style={{ fontSize: "12px", color: mutedColor }}>
              Showing {startIndex} to {endIndex} of {totalEntries} entries
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
              {[
                { icon: ChevronsLeft, action: () => setPage(1), disabled: page === 1, radius: "3px 0 0 3px" },
                { icon: ChevronLeft, action: () => setPage((p) => Math.max(1, p - 1)), disabled: page === 1 },
                {
                  icon: ChevronRight,
                  action: () => setPage((p) => Math.min(totalPages, p + 1)),
                  disabled: page === totalPages || totalEntries === 0,
                },
                {
                  icon: ChevronsRight,
                  action: () => setPage(totalPages),
                  disabled: page === totalPages || totalEntries === 0,
                  radius: "0 3px 3px 0",
                },
              ].map(({ icon: Icon, action, disabled, radius }, i) => (
                <button
                  key={i}
                  onClick={action}
                  disabled={disabled}
                  style={{
                    background: "none",
                    border: `1px solid ${borderColor}`,
                    borderLeft: i > 0 ? "none" : undefined,
                    padding: "4px 6px",
                    cursor: disabled ? "not-allowed" : "pointer",
                    opacity: disabled ? 0.35 : 1,
                    display: "flex",
                    alignItems: "center",
                    borderRadius: radius,
                  }}
                >
                  <Icon size={12} style={{ color: "#777777" }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
