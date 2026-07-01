import { useState, useEffect, useMemo } from "react";
import { Mail, Plus, ArrowRight, Eye } from "lucide-react";
import { Footer } from "../components/Footer";

// ── Static data ──────────────────────────────────────────────────────────────

const STAT_CARDS = [
  {
    id: "completed",
    title: "COMPLETED ORDERS",
    count: 0,
    bg: "#4CA815",
    badge: "0.00%",
    badgeText: "Since last month",
  },
  {
    id: "pending",
    title: "PENDING ORDERS",
    count: 0,
    bg: "#DF2A57",
    link: "View Pending Orders",
  },
  {
    id: "draft",
    title: "DRAFT ORDERS",
    count: 0,
    bg: "#5A9CEF",
    link: "View Draft Orders",
  },
  {
    id: "invitation",
    title: "ACTIVE INVITATION ORDERS",
    count: 0,
    bg: "#8758D1",
    link: "View Active Invitation Orders",
  },
] as const;

const DUE_INVOICES = [
  { id: "239245", invoiceDate: "2026-02-01", dueDate: "2026-02-01", total: "$0.00" },
  { id: "227982", invoiceDate: "2025-10-01", dueDate: "2025-10-01", total: "$0.00" },
  { id: "222388", invoiceDate: "2025-08-01", dueDate: "2025-08-01", total: "$0.00" },
  { id: "219582", invoiceDate: "2025-07-01", dueDate: "2025-07-01", total: "$0.00" },
];

const PACKAGES = ["Basic Screening", "Demo3", "New", "DEMO_3", "Evalright_BGV", "Standard", "DEMO-2", "nationwide + federal"];

// ── Styles ────────────────────────────────────────────────────────────────────

const fieldLabel: React.CSSProperties = {
  display: "block",
  fontSize: "14px",
  color: "#4B5563",
  marginBottom: "6px",
};

const fieldInput: React.CSSProperties = {
  width: "100%",
  height: "38px",
  border: "1px solid #D1D5DB",
  borderRadius: "4px",
  padding: "0 16px",
  fontSize: "14px",
  color: "#333333",
  outline: "none",
  boxSizing: "border-box",
  background: "#fff",
};

const fieldSelect: React.CSSProperties = {
  width: "100%",
  height: "38px",
  border: "1px solid #D1D5DB",
  borderRadius: "4px",
  padding: "0 16px",
  fontSize: "14px",
  color: "#4B5563",
  outline: "none",
  background: "#fff",
  cursor: "pointer",
  boxSizing: "border-box",
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%234B5563' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
};

// ── Floating Field Component ───────────────────────────────────────────────────

function FloatingField({ label, required, value, onChange, type = "text", isSelect, options, placeholder, isDarkMode }: any) {
  const [focused, setFocused] = useState(false);
  const isFloating = focused || value || isSelect;

  return (
    <div
      style={{
        position: "relative",
        border: isDarkMode ? "1px solid #333333" : "1px solid #F3F4F6",
        height: "54px",
        boxSizing: "border-box",
        background: isDarkMode ? "transparent" : "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 14px",
        borderRadius: "4px",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "14px",
          top: isFloating ? "10px" : "18px",
          fontSize: isFloating ? "11px" : "14px",
          color: "#9CA3AF",
          transition: "all 0.2s ease",
          pointerEvents: "none",
          display: "flex",
          gap: "4px",
        }}
      >
        {label} {required && <span style={{ color: "#EF4444" }}>*</span>}
      </div>

      {isSelect ? (
        <select
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            border: "none",
            outline: "none",
            background: isDarkMode ? "#1A1C21" : "transparent",
            fontSize: "14px",
            color: isDarkMode ? "#E5E7EB" : "#4B5563",
            padding: 0,
            marginTop: "16px",
            appearance: "none",
            width: "100%",
            cursor: "pointer",
          }}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options?.map((o: any) => (
            <option key={o.value || o} value={o.value || o}>
              {o.label || o}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            border: "none",
            outline: "none",
            background: "transparent",
            fontSize: "14px",
            color: isDarkMode ? "#E5E7EB" : "#333333",
            padding: 0,
            marginTop: isFloating ? "16px" : "0px",
            width: "100%",
            opacity: isFloating ? 1 : 0,
          }}
        />
      )}

      {isSelect && (
        <div style={{ position: "absolute", right: "14px", top: "18px", pointerEvents: "none" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4B5563"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      )}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

interface HomePageProps {
  isDarkMode?: boolean;
  onNavigate?: (page: any) => void;
}

export function HomePage({ isDarkMode = false, onNavigate }: HomePageProps) {
  const [pkg, setPkg] = useState("");
  const [template, setTemplate] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [emailAddr, setEmailAddr] = useState("");
  const [reference, setReference] = useState("");

  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [availableTemplates, setAvailableTemplates] = useState<string[]>([]);
  const [counts, setCounts] = useState({
    completed: 0,
    pending: 0,
    draft: 0,
    invitation: 0
  });

  useEffect(() => {
    const saved = localStorage.getItem("evalright_templates");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAvailableTemplates(parsed.map((p: any) => p.name));
          return;
        }
      } catch (e) {}
    }
    setAvailableTemplates(["Standard Invitation Template"]);
  }, []);

  useEffect(() => {
    const ordersStr = localStorage.getItem("evalright_orders");
    let completed = 0;
    let pending = 0;
    if (ordersStr) {
      try {
        const orders = JSON.parse(ordersStr);
        completed = orders.filter((o: any) => o.status === "CLOSED").length;
        pending = orders.filter((o: any) => o.status === "PENDING" || o.status === "IN PROGRESS").length;
      } catch (e) {}
    } else {
      completed = 15;
      pending = 8;
    }

    const invitesStr = localStorage.getItem("evalright_invitations");
    let invitationCount = 0;
    if (invitesStr) {
      try {
        const invites = JSON.parse(invitesStr);
        invitationCount = invites.filter((i: any) => i.status === "Active").length;
      } catch (e) {}
    } else {
      invitationCount = 1;
    }

    setCounts({
      completed,
      pending,
      draft: 3,
      invitation: invitationCount
    });
  }, [updateTrigger]);

  const dynamicStatCards = useMemo(() => [
    {
      id: "completed",
      title: "COMPLETED ORDERS",
      count: counts.completed,
      bg: "#4CA815",
      badge: "4.82%",
      badgeText: "Since last month",
    },
    {
      id: "pending",
      title: "PENDING ORDERS",
      count: counts.pending,
      bg: "#DF2A57",
      link: "View Pending Orders",
    },
    {
      id: "draft",
      title: "DRAFT ORDERS",
      count: counts.draft,
      bg: "#5A9CEF",
      link: "View Draft Orders",
    },
    {
      id: "invitation",
      title: "ACTIVE INVITATION ORDERS",
      count: counts.invitation,
      bg: "#8758D1",
      link: "View Active Invitation Orders",
    },
  ], [counts]);

  const handleSendInvitation = () => {
    if (!pkg || !template || !firstName.trim() || !lastName.trim() || !emailAddr.trim()) {
      alert("Please fill in all required fields (marked with *).");
      return;
    }

    let selectedProducts: string[] = [];
    if (pkg === "Basic Screening") {
      selectedProducts = ["ssn-trace", "county-criminal"];
    } else if (pkg === "Standard") {
      selectedProducts = ["ssn-trace", "county-criminal", "global-watchlist", "driving-history"];
    } else if (pkg.toLowerCase().includes("federal")) {
      selectedProducts = ["ssn-trace", "county-criminal", "federal-criminal"];
    } else {
      selectedProducts = ["ssn-trace", "county-criminal", "global-watchlist"];
    }

    let templateContent = "";
    const savedTemplates = localStorage.getItem("evalright_templates");
    if (savedTemplates) {
      try {
        const templates = JSON.parse(savedTemplates);
        const matched = templates.find((t: any) => t.name === template);
        if (matched) {
          templateContent = matched.content;
        }
      } catch (e) {}
    }

    if (!templateContent) {
      templateContent = `
        <p>Hello [applicant_first_name],</p>
        <p style="margin-top: 16px;">Below you will find a link to authorize and initiate a background check, which is required as a condition of employment.</p>
        <p style="margin-top: 16px;">Please save this email and keep it handy as it contains instructions for entering information to process the background check.</p>
        <p style="margin-top: 16px;">
          <b>First, please click this link to read and print the <span style="color: rgb(199, 0, 57);">Fair Credit Reporting Act Summary of Rights</span>.</b>
        </p>
        <p style="margin-top: 24px;">
          [INVITATION_URL]
        </p>
      `;
    }

    const fullName = `${firstName} ${middleName ? middleName + " " : ""}${lastName}`.trim();
    let formattedBody = templateContent
      .replaceAll("[applicant_first_name]", firstName)
      .replaceAll("[applicant_last_name]", lastName)
      .replaceAll("[applicant_name]", fullName)
      .replaceAll("[company_name]", "EvalRight Client Corp")
      .replaceAll("[FCRA_URL]", "https://www.evalright.com/fcra")
      .replaceAll("[company_info]", "EvalRight Client Corp, 100 Main St, Chicago, IL");

    const inviteId = "INV-" + Math.floor(100000 + Math.random() * 900000);
    const inviteUrl = `#invite-form?id=${inviteId}`;
    const linkHtml = `<div style="text-align: center; margin: 30px 0;">
      <a href="${inviteUrl}" style="background-color: rgb(199, 0, 57); color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Start Background Check Form</a>
    </div>`;

    if (formattedBody.includes("[INVITATION_URL]")) {
      formattedBody = formattedBody.replaceAll("[INVITATION_URL]", linkHtml);
    } else {
      formattedBody += `<p style="margin-top: 24px;"><b>Please click the button below to fill out your background check authorization form:</b></p>${linkHtml}`;
    }

    const newEmail = {
      id: Math.floor(4000000 + Math.random() * 1000000),
      subject: `Background Check Invitation - ${fullName}`,
      recipient: emailAddr,
      dateSent: new Date().toISOString().replace('T', ' ').substring(0, 19),
      displayDateSent: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      lastUpdate: "N/A",
      body: formattedBody
    };

    const existingEmailsStr = localStorage.getItem("evalright_emails");
    let existingEmails = [];
    if (existingEmailsStr) {
      try {
        existingEmails = JSON.parse(existingEmailsStr);
      } catch (e) {}
    }
    localStorage.setItem("evalright_emails", JSON.stringify([newEmail, ...existingEmails]));

    const newInvite = {
      inviteId: inviteId,
      name: fullName,
      email: emailAddr,
      dateCreated: new Date().toISOString().substring(0, 10),
      status: "Active",
      emailActivity: "Sent",
      selectedProducts,
    };

    const existingInvitesStr = localStorage.getItem("evalright_invitations");
    let existingInvites = [];
    if (existingInvitesStr) {
      try {
        existingInvites = JSON.parse(existingInvitesStr);
      } catch (e) {}
    }
    localStorage.setItem("evalright_invitations", JSON.stringify([newInvite, ...existingInvites]));

    alert(`Invitation sent successfully to ${fullName}!`);
    
    setPkg("");
    setTemplate("");
    setFirstName("");
    setLastName("");
    setMiddleName("");
    setEmailAddr("");
    setReference("");
    setUpdateTrigger(prev => prev + 1);
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,

      }}
    >
      <div
        style={{
          flex: 1,
          padding: "16px 20px",
          background: "transparent",
          overflowY: "auto",
        }}
      >
        {/* Page title */}
        <h1
          style={{
            fontSize: "20px",
            fontWeight: 500,
            color: isDarkMode ? "#DF2A57" : "rgb(199, 0, 57)",
            marginBottom: "14px",

          }}
        >
          Client Home
        </h1>

        {/* ── Stat cards – 2×2 grid ──────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          {dynamicStatCards.map((card) => (
            <div
              key={card.id}
              style={{
                background: card.bg,
                borderRadius: "8px",
                padding: "20px 24px",
                color: "#fff",
                minHeight: "130px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {/* Title row */}
              <div>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    opacity: 0.95,
                    lineHeight: 1.3,
                  }}
                >
                  {card.title}
                </span>
              </div>

              {/* Count */}
              <div
                style={{
                  fontSize: "38px",
                  fontWeight: 700,
                  lineHeight: 1,
                  marginTop: "10px",
                }}
              >
                {card.count}
              </div>

              {/* Footer row */}
              <div style={{ marginTop: "10px", fontSize: "12px" }}>
                {"badge" in card ? (
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span
                      style={{
                        background: "rgba(255,255,255,0.28)",
                        borderRadius: "3px",
                        padding: "2px 7px",
                        fontSize: "11px",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        gap: "2px",
                      }}
                    >
                      ↑ {card.badge}
                    </span>
                    <span style={{ opacity: 0.9, fontSize: "13px" }}>{card.badgeText}</span>
                  </span>
                ) : (
                  <a
                    href="#"
                    style={{
                      color: "#fff",
                      opacity: 0.92,
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "13px",
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      if (onNavigate) {
                        if (card.id === "pending") {
                          onNavigate("reports-all-order-details");
                        } else if (card.id === "draft") {
                          onNavigate("reports-draft-orders");
                        } else if (card.id === "invitation") {
                          onNavigate("applicants");
                        }
                      }
                    }}
                  >
                    {card.link} <ArrowRight size={13} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── Two-column body ────────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            alignItems: "start",
          }}
        >
          {/* ─ Rapid Invitation form ─────────────────────────────────── */}
          <div
            style={{
              background: isDarkMode ? "#252830" : "#fff",
              border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
              borderRadius: "4px",
              padding: "24px",
            }}
          >
            <h2
              style={{
                fontSize: "16px",
                fontWeight: 500,
                color: isDarkMode ? "#F9FAFB" : "#4B5563",
                marginBottom: "16px",
              }}
            >
              Rapid Invitation
            </h2>
            <div style={{ margin: "0 -24px 24px -24px", borderBottom: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB" }} />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                marginBottom: "32px",
              }}
            >
              <FloatingField
                label="Package"
                required
                isSelect
                value={pkg}
                onChange={(e: any) => setPkg(e.target.value)}
                placeholder="Please Select a package"
                options={PACKAGES}
                isDarkMode={isDarkMode}
              />
              <FloatingField
                label="Invitation Template"
                required
                isSelect
                value={template}
                onChange={(e: any) => setTemplate(e.target.value)}
                placeholder="Select Template"
                options={availableTemplates}
                isDarkMode={isDarkMode}
              />
              <FloatingField
                label="First Name"
                required
                value={firstName}
                onChange={(e: any) => setFirstName(e.target.value)}
                isDarkMode={isDarkMode}
              />
              <FloatingField
                label="Last Name"
                required
                value={lastName}
                onChange={(e: any) => setLastName(e.target.value)}
                isDarkMode={isDarkMode}
              />
              <FloatingField
                label="Middle Name"
                value={middleName}
                onChange={(e: any) => setMiddleName(e.target.value)}
                isDarkMode={isDarkMode}
              />
              <FloatingField
                label="Email Address"
                required
                type="email"
                value={emailAddr}
                onChange={(e: any) => setEmailAddr(e.target.value)}
                isDarkMode={isDarkMode}
              />
              <FloatingField
                label="Reference"
                value={reference}
                onChange={(e: any) => setReference(e.target.value)}
                isDarkMode={isDarkMode}
              />
            </div>

            {/* Send Invitation button */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
              <button
                onClick={handleSendInvitation}
                style={{
                  background: "#C70039",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "10px 24px",
                  fontSize: "14px",
                  fontWeight: 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                Send Invitation <Mail size={16} />
              </button>
            </div>
          </div>

          {/* ─ Due Invoices ──────────────────────────────────────────── */}
          <div
            style={{
              background: isDarkMode ? "#252830" : "#fff",
              border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
              borderRadius: "4px",
              padding: "16px",
            }}
          >
            {/* Header row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <h2
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: isDarkMode ? "#F9FAFB" : "#333333",

                }}
              >
                Due Invoices (4)
              </h2>
              <button
                style={{
                  background: "#C70039",
                  color: "#fff",
                  border: "none",
                  borderRadius: "3px",
                  padding: "5px 12px",
                  fontSize: "11px",
                  fontWeight: 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",

                }}
              >
                <Plus size={11} /> View All Invoices
              </button>
            </div>

            {/* Table */}
            <div style={{ margin: "0 -16px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr
                    style={{
                      background: isDarkMode ? "#1A1C21" : "#F9FAFB",
                      borderBottom: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
                      borderTop: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
                    }}
                  >
                    {["Invoice #", "Invoice Date", "Due Date", "Total", "Status"].map(
                      (col) => (
                        <th
                          key={col}
                          style={{
                            textAlign: "left",
                            padding: "12px 16px",
                            fontSize: "13px",
                            color: isDarkMode ? "#9CA3AF" : "#4B5563",
                            fontWeight: 600,
                          }}
                        >
                          {col}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {DUE_INVOICES.map((inv) => (
                    <tr
                      key={inv.id}
                      style={{ borderBottom: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB" }}
                    >
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: "13px",
                          color: "#C70039",
                          fontWeight: 500,
                        }}
                      >
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <Eye size={14} color="#C70039" />
                          {inv.id}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: "13px",
                          color: isDarkMode ? "#E5E7EB" : "#4B5563",
                        }}
                      >
                        {inv.invoiceDate}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: "13px",
                          color: isDarkMode ? "#E5E7EB" : "#4B5563",
                        }}
                      >
                        {inv.dueDate}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: "13px",
                          color: isDarkMode ? "#E5E7EB" : "#4B5563",
                        }}
                      >
                        {inv.total}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span
                          style={{
                            background: isDarkMode ? "rgba(199, 0, 57, 0.2)" : "#FEE2E2",
                            color: "#C70039",
                            fontSize: "11px",
                            fontWeight: 600,
                            padding: "3px 10px",
                            borderRadius: "4px",
                            letterSpacing: "0.02em",
                          }}
                        >
                          UNPAID
                        </span>
                      </td>
                    </tr>
                  ))}
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
