import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  ArrowUpDown,
  X,
} from "lucide-react";
import { Footer } from "../components/Footer";

interface EmailRecord {
  id: number;
  subject: string;
  recipient: string;
  dateSent: string;
  lastUpdate: string;
  displayDateSent: string;
}

const INITIAL_EMAILS: EmailRecord[] = [
  {
    id: 4844009,
    subject: "Welcome to EvalRight - Your #1 Source for Background Checks!",
    recipient: "farooq@digitmarketus.com",
    dateSent: "2026-06-11 10:36:00",
    lastUpdate: "N/A",
    displayDateSent: "06/11/2026 10:36",
  },
];

const COLUMNS: { label: string; field: keyof EmailRecord | null; sortable: boolean }[] = [
  { label: "ID", field: "id", sortable: true },
  { label: "Subject", field: "subject", sortable: true },
  { label: "Recipient", field: "recipient", sortable: true },
  { label: "Date Sent", field: "dateSent", sortable: true },
  { label: "Last Update", field: "lastUpdate", sortable: true },
];

export function EmailActivityLog({ isDarkMode = false }: { isDarkMode?: boolean }) {
  const [emails] = useState<EmailRecord[]>(INITIAL_EMAILS);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<keyof EmailRecord | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [dateRange] = useState("2026-03-15 to 2026-06-1");
  const [viewingEmail, setViewingEmail] = useState<EmailRecord | null>(null);

  const handleSort = (field: keyof EmailRecord) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const processedEmails = useMemo(() => {
    let result = [...emails];
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((e) =>
        Object.values(e).some((val) => String(val).toLowerCase().includes(query))
      );
    }
    if (sortField) {
      result = [...result].sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (typeof valA === "number" && typeof valB === "number") {
          return sortAsc ? valA - valB : valB - valA;
        }
        const strA = String(valA);
        const strB = String(valB);
        return sortAsc ? strA.localeCompare(strB) : strB.localeCompare(strA);
      });
    }
    return result;
  }, [emails, searchQuery, sortField, sortAsc]);

  const totalEntries = processedEmails.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / pageSize));
  const startIndex = totalEntries === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, totalEntries);
  const entryLabel = totalEntries === 1 ? "entry" : "entries";

  const paginatedEmails = useMemo(() => {
    return processedEmails.slice((page - 1) * pageSize, page * pageSize);
  }, [processedEmails, page, pageSize]);

  return (
    <div className="flex-1 flex flex-col min-h-0" style={{ background: isDarkMode ? "#252830" : "#F6F6F6" }}>
      <div className="flex-1 p-6" style={{ overflowY: "auto" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 500, color: isDarkMode ? "#DF2A57" : "rgb(199, 0, 57)", marginBottom: "20px" }}>
          Emails
        </h1>

        <div
          style={{
            background: isDarkMode ? "#1A1C21" : "#FFFFFF",
            border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
            borderRadius: "4px",
            padding: "16px 20px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
              borderRadius: "3px",
              padding: "10px 14px",
              minWidth: "220px",
              background: isDarkMode ? "#252830" : "#FFFFFF",
            }}
          >
            <div style={{ fontSize: "9px", color: isDarkMode ? "#9CA3AF" : "#777777", marginBottom: "2px" }}>
              Order Date Range
            </div>
            <div style={{ fontSize: "12px", color: isDarkMode ? "#E5E7EB" : "#555555" }}>{dateRange}</div>
          </div>
          <button
            type="button"
            style={{
              background: "rgb(199, 0, 57)",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "3px",
              padding: "8px 20px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Load By Range
          </button>
        </div>

        <div
          style={{
            background: isDarkMode ? "#1A1C21" : "#FFFFFF",
            border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
            borderRadius: "4px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
            overflow: "hidden",
            marginBottom: "20px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: isDarkMode ? "#9CA3AF" : "#555555" }}>
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                style={{
                  border: isDarkMode ? "1px solid #333333" : "1px solid #D1D5DB",
                  borderRadius: "3px", padding: "3px 6px", fontSize: "12px", outline: "none",
                  background: isDarkMode ? "#252830" : "#FFFFFF", color: isDarkMode ? "#E5E7EB" : "#333333", cursor: "pointer",
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>entries per page</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", background: isDarkMode ? "#252830" : "#F9FAFB", border: isDarkMode ? "1px solid #333333" : "1px solid #D1D5DB", borderRadius: "3px", padding: "0 8px", height: "28px", width: "180px" }}>
              <Search size={13} style={{ color: "#9CA3AF", marginRight: "6px" }} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                style={{ border: "none", background: "transparent", outline: "none", fontSize: "12px", color: isDarkMode ? "#E5E7EB" : "#333333", width: "100%" }}
              />
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ background: isDarkMode ? "#2A2D34" : "#F9FAFB", borderTop: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB", borderBottom: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB" }}>
                  {COLUMNS.map((col, idx) => (
                    <th
                      key={col.label}
                      onClick={() => col.sortable && col.field && handleSort(col.field)}
                      style={{
                        padding: "10px 14px", fontSize: "11px", fontWeight: 600, color: isDarkMode ? "#9CA3AF" : "#555555",
                        cursor: col.sortable ? "pointer" : "default",
                        borderRight: idx < COLUMNS.length - 1 ? (isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB") : "none",
                        userSelect: "none",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px" }}>
                        <span>{col.label}</span>
                        {col.sortable && <ArrowUpDown size={11} style={{ color: sortField === col.field ? "rgb(199, 0, 57)" : "#A0A0A0" }} />}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedEmails.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: "24px 16px", textAlign: "center", fontSize: "12px", color: "#8A8A8A", background: isDarkMode ? "#1A1C21" : "#FFFFFF" }}>
                      No records found
                    </td>
                  </tr>
                ) : (
                  paginatedEmails.map((email, idx) => (
                    <tr
                      key={email.id}
                      style={{
                        background: idx % 2 === 0 ? (isDarkMode ? "#1A1C21" : "#FFFFFF") : (isDarkMode ? "#252830" : "#FAFAFA"),
                        borderBottom: isDarkMode ? "1px solid #333333" : "1px solid #F3F4F6",
                        cursor: "pointer",
                      }}
                      onClick={() => setViewingEmail(email)}
                    >
                      <td style={{ padding: "12px 14px", fontSize: "12px", color: isDarkMode ? "#9CA3AF" : "#555555" }}>{email.id}</td>
                      <td style={{ padding: "12px 14px", fontSize: "12px", color: "rgb(199, 0, 57)", fontWeight: 500 }}>{email.subject}</td>
                      <td style={{ padding: "12px 14px", fontSize: "12px", color: isDarkMode ? "#D1D5DB" : "#555555" }}>{email.recipient}</td>
                      <td style={{ padding: "12px 14px", fontSize: "12px", color: isDarkMode ? "#9CA3AF" : "#555555" }}>{email.dateSent}</td>
                      <td style={{ padding: "12px 14px", fontSize: "12px", color: isDarkMode ? "#9CA3AF" : "#555555" }}>{email.lastUpdate}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderTop: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB", background: isDarkMode ? "#1A1C21" : "#FFFFFF", flexWrap: "wrap", gap: "12px" }}>
            <span style={{ fontSize: "12px", color: isDarkMode ? "#9CA3AF" : "#777777" }}>
              Showing {startIndex} to {endIndex} of {totalEntries} {entryLabel}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
              <button onClick={() => setPage(1)} disabled={page === 1} style={paginationBtn(isDarkMode, true, page === 1)}>
                <ChevronsLeft size={12} style={{ color: "#777777" }} />
              </button>
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} style={paginationBtn(isDarkMode, false, page === 1)}>
                <ChevronLeft size={12} style={{ color: "#777777" }} />
              </button>
              {totalEntries > 0 &&
                Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                  const isCurrent = page === p;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      style={{
                        background: isCurrent ? "rgb(199, 0, 57)" : "none",
                        border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
                        borderLeft: "none",
                        color: isCurrent ? "#FFFFFF" : "#777777",
                        padding: "4px 8px",
                        fontSize: "12px",
                        fontWeight: isCurrent ? 600 : 400,
                        cursor: "pointer",
                        minWidth: "26px",
                        borderRadius: isCurrent ? "50%" : "0",
                        boxSizing: "border-box",
                        height: "26px",
                        width: "26px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {p}
                    </button>
                  );
                })}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalEntries === 0} style={paginationBtn(isDarkMode, false, page === totalPages || totalEntries === 0)}>
                <ChevronRight size={12} style={{ color: "#777777" }} />
              </button>
              <button onClick={() => setPage(totalPages)} disabled={page === totalPages || totalEntries === 0} style={paginationBtn(isDarkMode, false, page === totalPages || totalEntries === 0, true)}>
                <ChevronsRight size={12} style={{ color: "#777777" }} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {viewingEmail && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "24px",
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "4px",
              boxShadow: "0 4px 24px rgba(0, 0, 0, 0.15)",
              width: "640px",
              maxWidth: "100%",
              maxHeight: "90vh",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: "rgb(199, 0, 57)" }}>
              <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#FFFFFF" }}>View Email</h3>
              <button
                type="button"
                onClick={() => setViewingEmail(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#FFFFFF", padding: "2px", display: "flex" }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1 }}>
              <div style={{ marginBottom: "16px" }}>
                <p style={{ margin: "0 0 6px 0", fontSize: "12px", color: "#555555" }}>
                  <strong>Email Subject:</strong> {viewingEmail.subject}
                </p>
                <p style={{ margin: "0 0 6px 0", fontSize: "12px", color: "#555555" }}>
                  <strong>Recipient:</strong> {viewingEmail.recipient}
                </p>
                <p style={{ margin: 0, fontSize: "12px", color: "#555555" }}>
                  <strong>Date sent:</strong> {viewingEmail.displayDateSent}
                </p>
              </div>

              <hr style={{ border: "none", borderTop: "1px solid #E5E7EB", margin: "0 0 20px 0" }} />

              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                <img src="/ER.png" alt="EvalRight" style={{ height: "48px", width: "auto" }} />
                <div>
                  <div style={{ fontSize: "22px", fontWeight: 700, color: "rgb(199, 0, 57)", letterSpacing: "1px", fontFamily: "Georgia, serif" }}>
                    EVALRIGHT
                  </div>
                  <div style={{ fontSize: "12px", color: "#4A4E69", fontStyle: "italic" }}>Screen before Hire</div>
                </div>
              </div>

              <p style={{ fontSize: "13px", color: "#555555", margin: "0 0 12px 0" }}>Dear Farooq,</p>
              <p style={{ fontSize: "13px", color: "#555555", margin: "0 0 12px 0", lineHeight: 1.6 }}>
                Thank you for choosing EvalRight, where every client enjoys the easiest, fastest and most compliant employment background checks to make the best hiring decisions.
              </p>
              <p style={{ fontSize: "13px", color: "#555555", margin: "0 0 16px 0", lineHeight: 1.6 }}>
                Please read and save this message as it contains important instructions and contact information regarding client support.
              </p>

              <p style={{ fontSize: "13px", fontWeight: 700, color: "#555555", margin: "0 0 8px 0" }}>Your Account Login Information!</p>
              <p style={{ fontSize: "13px", color: "#555555", margin: "0 0 6px 0" }}>Your User Name is: Farooq</p>
              <p style={{ fontSize: "13px", color: "#555555", margin: "0 0 6px 0" }}>Your Password is: Farooq@2026</p>
              <p style={{ fontSize: "13px", color: "#555555", margin: "0 0 16px 0" }}>
                Login here:{" "}
                <a href="https://clients.evalright.us/login.php" style={{ color: "#2563EB" }}>
                  https://clients.evalright.us/login.php
                </a>
              </p>

              <p style={{ fontSize: "13px", color: "rgb(199, 0, 57)", margin: "0 0 16px 0", lineHeight: 1.6 }}>
                To reach our Customer Fulfillment Team directly please use the chat feature located in the bottom right corner of the portal.
              </p>

              <p style={{ fontSize: "13px", fontWeight: 700, color: "#555555", margin: "0 0 8px 0" }}>Add EvalRight to Your Safe Senders List</p>
              <p style={{ fontSize: "13px", color: "#555555", margin: "0 0 16px 0", lineHeight: 1.6 }}>
                Please add our domain, @evalright.us to your Safe Senders list so that you receive our email messages.
              </p>

              <p style={{ fontSize: "13px", fontWeight: 700, color: "#555555", margin: "0 0 8px 0" }}>
                Obligations Under the Fair Credit Reporting Act (FCRA) and Verifying Criminal Database Records
              </p>
              <p style={{ fontSize: "13px", color: "#555555", margin: "0 0 16px 0", lineHeight: 1.6 }}>
                By using our system, you agree to abide by the Fair Credit Reporting Act (FCRA){" "}
                <span style={{ color: "rgb(199, 0, 57)" }}>compliance guidelines</span> that include obtaining written consent from the applicant/employee before the background check is ordered, following FCRA required steps pertaining to adverse action and not using the information obtained in violation of any state or federal employment laws or regulations. You also agree to provide the applicant/employee with a copy of the FCRA Summary of Rights before ordering the background check. You also authorize us to verify any criminal records obtained from a database search (aka unverified criminal records) by ordering the criminal record on file from the originating court, at full price, including court costs, because no controls exist to ensure the accuracy of criminal database records.
              </p>

              <p style={{ fontSize: "13px", color: "#555555", margin: "0 0 16px 0", lineHeight: 1.6 }}>
                Thank you, again, for your business.
              </p>

              <p style={{ fontSize: "13px", color: "#555555", margin: "0 0 12px 0", lineHeight: 1.6 }}>
                Please note: unless you pay by credit card at the beginning of the month, payment is due within 30 days after you receive your invoice. If your account goes beyond 30 days past due, we may temporarily suspend access to the account until payment is received in full. If we choose to exercise this option, you will be required to guarantee your account with a credit card before resuming access.
              </p>
              <p style={{ fontSize: "13px", color: "#555555", margin: "0 0 12px 0", lineHeight: 1.6 }}>
                Also, before submitting an order, you will see a confirmation message that shows your final price. If you have any questions at this stage, do not submit the order and call your customer service agent for assistance. By submitting the order, you acknowledge that all sales are final and no refunds will be issued.
              </p>
              <p style={{ fontSize: "13px", color: "#555555", margin: "0 0 12px 0", lineHeight: 1.6 }}>
                Finally, a quick note about accuracy. We follow every available Best Practice to maximize the delivery of accurate information, but unfortunately we cannot guarantee 100% accuracy. No screening company could ever make such a guarantee. Some elements of the screening process are handled by other people, like court clerks, court researchers, education institutions, former employers and drug testing laboratories, to name a few. Reliance on third-parties for information creates an element of risk, however slight, for all companies that rely on background checks. We will do everything possible to maximize accuracy and to rapidly resolve any questions or issues that may arise pertaining to accuracy.
              </p>
              <p style={{ fontSize: "13px", color: "#555555", margin: "0 0 12px 0", lineHeight: 1.6 }}>
                If you ever have any questions, please contact us.
              </p>
              <p style={{ fontSize: "13px", color: "#555555", margin: "0 0 20px 0", lineHeight: 1.6 }}>
                If you have any questions after 6 pm EST, please email us at info@evalright.us and we will respond ASAP.
              </p>

              <hr style={{ border: "none", borderTop: "1px solid #E5E7EB", margin: "0 0 12px 0" }} />
              <p style={{ fontSize: "13px", fontWeight: 600, color: "#555555", margin: "0 0 4px 0" }}>EvalRight</p>
              <p style={{ fontSize: "13px", margin: "0 0 4px 0" }}>
                <a href="https://www.evalright.com" style={{ color: "#2563EB" }}>https://www.evalright.com</a>
              </p>
              <p style={{ fontSize: "13px", margin: 0 }}>
                <a href="mailto:info@evalright.com" style={{ color: "#2563EB" }}>info@evalright.com</a>
              </p>
              <hr style={{ border: "none", borderTop: "1px solid #E5E7EB", margin: "12px 0 0 0" }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const paginationBtn = (isDarkMode: boolean, isFirst: boolean, disabled: boolean, isLast = false): React.CSSProperties => ({
  background: "none",
  border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
  borderLeft: isFirst ? undefined : "none",
  padding: "4px 6px",
  cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.35 : 1,
  display: "flex",
  alignItems: "center",
  borderRadius: isFirst ? "3px 0 0 3px" : isLast ? "0 3px 3px 0" : "0",
});
