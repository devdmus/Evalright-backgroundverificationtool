import { useState } from "react";
import { CheckCheck, Clock3, FilePen, UserCheck2, Mail, Plus, ArrowRight } from "lucide-react";
import { Footer } from "../components/Footer";

// ── Static data ──────────────────────────────────────────────────────────────

const STAT_CARDS = [
  {
    id: "completed",
    title: "COMPLETED ORDERS",
    count: 0,
    bg: "#388E3C",
    icon: <CheckCheck size={26} color="rgba(255,255,255,0.65)" />,
    badge: "0.00%",
    badgeText: "Since last month",
  },
  {
    id: "pending",
    title: "PENDING ORDERS",
    count: 0,
    bg: "#E53935",
    icon: <Clock3 size={26} color="rgba(255,255,255,0.65)" />,
    link: "View Pending Orders",
  },
  {
    id: "draft",
    title: "DRAFT ORDERS",
    count: 5,
    bg: "#1E88E5",
    icon: <FilePen size={26} color="rgba(255,255,255,0.65)" />,
    link: "View Draft Orders",
  },
  {
    id: "invitation",
    title: "ACTIVE INVITATION ORDERS",
    count: 0,
    bg: "#7B1FA2",
    icon: <UserCheck2 size={26} color="rgba(255,255,255,0.65)" />,
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
  fontSize: "11px",
  color: "#555555",
  marginBottom: "3px",

};

const fieldInput: React.CSSProperties = {
  width: "100%",
  height: "30px",
  border: "1px solid #D1D5DB",
  borderRadius: "3px",
  padding: "0 8px",
  fontSize: "12px",
  color: "#333333",
  outline: "none",

  boxSizing: "border-box",
  background: "#fff",
};

const fieldSelect: React.CSSProperties = {
  width: "100%",
  height: "30px",
  border: "1px solid #D1D5DB",
  borderRadius: "3px",
  padding: "0 6px",
  fontSize: "12px",
  color: "#555555",
  outline: "none",

  background: "#fff",
  cursor: "pointer",
  boxSizing: "border-box",
};

// ── Component ─────────────────────────────────────────────────────────────────

export function HomePage() {
  const [pkg, setPkg] = useState("");
  const [template, setTemplate] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [emailAddr, setEmailAddr] = useState("");
  const [reference, setReference] = useState("");

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
          background: "#F5F5F5",
          overflowY: "auto",
        }}
      >
        {/* Page title */}
        <h1
          style={{
            fontSize: "20px",
            fontWeight: 500,
            color: "rgb(199, 0, 57)",
            marginBottom: "14px",

          }}
        >
          Client Home
        </h1>

        {/* ── Stat cards ─────────────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "10px",
            marginBottom: "16px",
          }}
        >
          {STAT_CARDS.map((card) => (
            <div
              key={card.id}
              style={{
                background: card.bg,
                borderRadius: "6px",
                padding: "14px 16px",
                color: "#fff",
                minHeight: "110px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {/* Title + icon row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "8px",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.03em",
                    opacity: 0.92,
                    lineHeight: 1.3,
                  }}
                >
                  {card.title}
                </span>
                {card.icon}
              </div>

              {/* Count */}
              <div
                style={{
                  fontSize: "30px",
                  fontWeight: 700,
                  lineHeight: 1,
                  marginTop: "6px",
                }}
              >
                {card.count}
              </div>

              {/* Footer row */}
              <div style={{ marginTop: "8px", fontSize: "11px" }}>
                {"badge" in card ? (
                  <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <span
                      style={{
                        background: "rgba(255,255,255,0.28)",
                        borderRadius: "3px",
                        padding: "1px 5px",
                        fontSize: "10px",
                        fontWeight: 600,
                      }}
                    >
                      {card.badge}
                    </span>
                    <span style={{ opacity: 0.88 }}>{card.badgeText}</span>
                  </span>
                ) : (
                  <a
                    href="#"
                    style={{
                      color: "#fff",
                      opacity: 0.9,
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "3px",
                    }}
                    onClick={(e) => e.preventDefault()}
                  >
                    {card.link} <ArrowRight size={11} />
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
              background: "#fff",
              border: "1px solid #E5E7EB",
              borderRadius: "4px",
              padding: "16px",
            }}
          >
            <h2
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#333333",
                marginBottom: "14px",

              }}
            >
              Rapid Invitation
            </h2>

            {/* Package + Template */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginBottom: "10px",
              }}
            >
              <div>
                <label style={fieldLabel}>Package *</label>
                <select
                  value={pkg}
                  onChange={(e) => setPkg(e.target.value)}
                  style={fieldSelect}
                >
                  <option value="">Please Select a package</option>
                  {PACKAGES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={fieldLabel}>Invitation Template *</label>
                <select
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  style={fieldSelect}
                >
                  <option value="">Select Template</option>
                </select>
              </div>
            </div>

            {/* First + Last name */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginBottom: "10px",
              }}
            >
              <div>
                <label style={fieldLabel}>First Name *</label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={fieldInput}
                />
              </div>
              <div>
                <label style={fieldLabel}>Last Name *</label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={fieldInput}
                />
              </div>
            </div>

            {/* Middle + Email */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginBottom: "10px",
              }}
            >
              <div>
                <label style={fieldLabel}>Middle Name</label>
                <input
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  style={fieldInput}
                />
              </div>
              <div>
                <label style={fieldLabel}>Email Address *</label>
                <input
                  type="email"
                  value={emailAddr}
                  onChange={(e) => setEmailAddr(e.target.value)}
                  style={fieldInput}
                />
              </div>
            </div>

            {/* Reference */}
            <div style={{ marginBottom: "20px" }}>
              <label style={fieldLabel}>Reference</label>
              <input
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                style={fieldInput}
              />
            </div>

            {/* Send Invitation button */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button
                style={{
                  background: "#C70039",
                  color: "#fff",
                  border: "none",
                  borderRadius: "3px",
                  padding: "7px 20px",
                  fontSize: "12px",
                  fontWeight: 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",

                }}
              >
                Send Invitation <Mail size={13} />
              </button>
            </div>
          </div>

          {/* ─ Due Invoices ──────────────────────────────────────────── */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #E5E7EB",
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
                  color: "#333333",

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
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    borderBottom: "2px solid #E5E7EB",
                  }}
                >
                  {["Invoice #", "Invoice Date", "Due Date", "Total", "Status"].map(
                    (col) => (
                      <th
                        key={col}
                        style={{
                          textAlign: "left",
                          padding: "6px 8px",
                          fontSize: "11px",
                          color: "#555555",
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
                    style={{ borderBottom: "1px solid #F3F4F6" }}
                  >
                    <td
                      style={{
                        padding: "8px",
                        fontSize: "12px",
                        color: "#C70039",
                        fontWeight: 500,
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <span
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: "#C70039",
                            flexShrink: 0,
                            display: "inline-block",
                          }}
                        />
                        {inv.id}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "8px",
                        fontSize: "12px",
                        color: "#333333",
                      }}
                    >
                      {inv.invoiceDate}
                    </td>
                    <td
                      style={{
                        padding: "8px",
                        fontSize: "12px",
                        color: "#333333",
                      }}
                    >
                      {inv.dueDate}
                    </td>
                    <td
                      style={{
                        padding: "8px",
                        fontSize: "12px",
                        color: "#333333",
                      }}
                    >
                      {inv.total}
                    </td>
                    <td style={{ padding: "8px" }}>
                      <span
                        style={{
                          background: "#FEE2E2",
                          color: "#C70039",
                          fontSize: "10px",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: "3px",
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

      <Footer />
    </div>
  );
}
