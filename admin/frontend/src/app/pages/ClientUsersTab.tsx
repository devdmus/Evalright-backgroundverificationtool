import { useMemo, useState } from "react";
import { ArrowLeft, ChevronDown, ChevronUp, HelpCircle, Pencil, Save, X } from "lucide-react";
import { Pagination } from "../components/Pagination";
import { CLIENT_USERS, ClientUser } from "../data/mockData";

const USER_FORM_TABS = ["Account Info", "Account Security", "Credit Card Info", "Integration Accounts", "Forenzics"];

const SECURITY_ROLES = [
  "Administrator",
  "Accounting",
  "Order Reports",
  "View Assigned Branch Reports",
  "View Reports In All Branches",
  "View Pricing",
  "View Reports",
];

interface ClientUsersTabProps {
  isDarkMode?: boolean;
}

export function ClientUsersTab({ isDarkMode = false }: ClientUsersTabProps) {
  const [users, setUsers] = useState<ClientUser[]>(CLIENT_USERS);
  const [view, setView] = useState<"list" | "add">("list");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState<"id" | "username" | "name" | "email">("id");
  const [sortAsc, setSortAsc] = useState(true);
  const [formTab, setFormTab] = useState("Account Info");
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(false);
  const [securityRoles, setSecurityRoles] = useState<Record<string, boolean>>({});

  const cardBg = isDarkMode ? "#252830" : "#FFFFFF";
  const borderColor = isDarkMode ? "#333333" : "#E5E7EB";
  const textColor = isDarkMode ? "#E5E7EB" : "#333333";
  const mutedColor = isDarkMode ? "#9CA3AF" : "#6B7280";
  const headerBg = isDarkMode ? "#2A2D34" : "#F9FAFB";
  const inputBg = isDarkMode ? "#1A1C21" : "#FFFFFF";
  const sectionColor = isDarkMode ? "#DF2A57" : "#C70039";

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = users;
    if (q) {
      rows = rows.filter(
        (u) =>
          u.id.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q) ||
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      );
    }
    return [...rows].sort((a, b) => {
      const cmp = String(a[sortCol]).localeCompare(String(b[sortCol]));
      return sortAsc ? cmp : -cmp;
    });
  }, [users, search, sortCol, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  function toggleSort(col: typeof sortCol) {
    if (sortCol === col) setSortAsc((v) => !v);
    else {
      setSortCol(col);
      setSortAsc(true);
    }
  }

  function toggleUserEnabled(id: string) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, enabled: !u.enabled } : u)));
  }

  if (view === "add") {
    return (
      <div>
        <p style={{ fontSize: "13px", color: mutedColor, margin: "0 0 16px 0" }}>Add New User</p>

        <div
          style={{
            background: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: "6px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", borderBottom: `1px solid ${borderColor}`, flexWrap: "wrap" }}>
            {USER_FORM_TABS.map((tab) => {
              const active = formTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setFormTab(tab)}
                  style={{
                    padding: "12px 20px",
                    fontSize: "13px",
                    fontWeight: active ? 600 : 500,
                    background: "transparent",
                    color: active ? sectionColor : textColor,
                    border: "none",
                    borderBottom: active ? `2px solid ${sectionColor}` : "2px solid transparent",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <div style={{ padding: "24px 20px", background: isDarkMode ? "#1E2026" : "#F9FAFB" }}>
            {formTab === "Account Info" && (
              <>
                <SectionTitle color={sectionColor}>Basic Information</SectionTitle>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
                  <FieldInput label="First Name" borderColor={borderColor} inputBg={inputBg} textColor={textColor} />
                  <FieldInput label="Last Name" borderColor={borderColor} inputBg={inputBg} textColor={textColor} />
                  <FieldInput label="Email Address" borderColor={borderColor} inputBg={inputBg} textColor={textColor} />
                  <FieldInput label="Phone Number" borderColor={borderColor} inputBg={inputBg} textColor={textColor} />
                </div>

                <SectionTitle color={sectionColor}>Login Credentials</SectionTitle>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
                  <FieldInput label="Username" borderColor={borderColor} inputBg={inputBg} textColor={textColor} />
                  <FieldInput label="Password" borderColor={borderColor} inputBg={inputBg} textColor={textColor} type="password" />
                </div>

                <SectionTitle color={sectionColor}>Report Delivery Options</SectionTitle>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "8px" }}>
                  <div style={{ gridColumn: "span 1" }}>
                    <FieldInput label="Carbon Copy Reports To" borderColor={borderColor} inputBg={inputBg} textColor={textColor} />
                    <span style={{ fontSize: "10px", color: mutedColor }}>Separate email addresses by semicolon &apos;;&apos;</span>
                  </div>
                  <FieldSelect label="Search Delivery" borderColor={borderColor} inputBg={inputBg} textColor={textColor} defaultValue="All as Completed">
                    <option>All as Completed</option>
                    <option>Individual</option>
                  </FieldSelect>
                  <FieldSelect label="Report Delivery Timing" borderColor={borderColor} inputBg={inputBg} textColor={textColor} defaultValue="Instant">
                    <option>Instant</option>
                    <option>Daily</option>
                    <option>Weekly</option>
                  </FieldSelect>
                  <FieldSelect label="Delivery Method" borderColor={borderColor} inputBg={inputBg} textColor={textColor} defaultValue="Email">
                    <option>Email</option>
                    <option>Fax</option>
                  </FieldSelect>
                </div>

                <SectionTitle color={sectionColor}>Extra Options</SectionTitle>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "20px 28px", marginBottom: "24px" }}>
                  {[
                    "Restrict Report View",
                    "Primary User",
                    "Pending Orders Notification",
                    "Disable Report Printing",
                    "Disable Email on Completed Invitations",
                  ].map((label) => (
                    <FormCheckbox key={label} label={label} textColor={textColor} />
                  ))}
                </div>

                <SectionTitle color={sectionColor}>Misc</SectionTitle>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
                  <FieldInput label="Client Manager Commission (%)" borderColor={borderColor} inputBg={inputBg} textColor={textColor} />
                  <FieldInput label="Sales Person Commission (%)" borderColor={borderColor} inputBg={inputBg} textColor={textColor} />
                </div>
              </>
            )}

            {formTab === "Account Security" && (
              <>
                <SectionTitle color={sectionColor}>User Access Level (Security Roles)</SectionTitle>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "20px 28px", marginBottom: "8px" }}>
                  {SECURITY_ROLES.map((role) => (
                    <label
                      key={role}
                      style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: textColor, cursor: "pointer" }}
                    >
                      <input
                        type="checkbox"
                        checked={securityRoles[role] ?? false}
                        onChange={(e) => setSecurityRoles((prev) => ({ ...prev, [role]: e.target.checked }))}
                        style={{ accentColor: sectionColor, width: "14px", height: "14px" }}
                      />
                      {role}
                      {role === "View Reports" && <HelpCircle size={14} color="#5B9BD5" />}
                    </label>
                  ))}
                </div>
              </>
            )}

            {formTab === "Credit Card Info" && (
              <>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "28px" }}>
                  <CreditCardVisual />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                  <FieldInput label="Card Number" borderColor={borderColor} inputBg={inputBg} textColor={textColor} />
                  <FieldInput label="Expiry Month" borderColor={borderColor} inputBg={inputBg} textColor={textColor} />
                  <FieldInput label="Expiry Year" borderColor={borderColor} inputBg={inputBg} textColor={textColor} />
                  <FieldInput label="Card Code" borderColor={borderColor} inputBg={inputBg} textColor={textColor} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "16px" }}>
                  <FieldInput label="First Name" borderColor={borderColor} inputBg={inputBg} textColor={textColor} />
                  <FieldInput label="Last Name" borderColor={borderColor} inputBg={inputBg} textColor={textColor} />
                  <FieldInput label="Billing Address 1" borderColor={borderColor} inputBg={inputBg} textColor={textColor} />
                  <FieldInput label="Billing Address 2" borderColor={borderColor} inputBg={inputBg} textColor={textColor} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
                  <FieldInput label="Billing City" borderColor={borderColor} inputBg={inputBg} textColor={textColor} />
                  <FieldInput label="Billing State" borderColor={borderColor} inputBg={inputBg} textColor={textColor} />
                  <FieldInput label="Billing Zip Code" borderColor={borderColor} inputBg={inputBg} textColor={textColor} />
                  <FieldInput label="Billing Country" borderColor={borderColor} inputBg={inputBg} textColor={textColor} />
                </div>
              </>
            )}

            {formTab === "Integration Accounts" && (
              <>
                <SectionTitle color={sectionColor}>Catsone Link Information</SectionTitle>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", maxWidth: "600px" }}>
                  <FieldInput label="Catsone Subdomain" borderColor={borderColor} inputBg={inputBg} textColor={textColor} />
                  <FieldInput label="Catsone Transaction Code" borderColor={borderColor} inputBg={inputBg} textColor={textColor} />
                </div>
              </>
            )}

            {formTab === "Forenzics" && (
              <div style={{ padding: "8px 0" }}>
                <p style={{ fontSize: "13px", color: textColor, margin: "0 0 12px 0" }}>
                  Forenzic or other debuging information
                </p>
                <p style={{ fontSize: "13px", color: textColor, margin: 0 }}>
                  <strong>User Agent:</strong>
                </p>
              </div>
            )}
          </div>

          <div style={{ padding: "16px 20px", borderTop: `1px solid ${borderColor}` }}>
            <FormCheckbox
              label="Check to send a Welcome Email to the user"
              textColor={textColor}
              checked={sendWelcomeEmail}
              onChange={setSendWelcomeEmail}
            />
          </div>

          <div style={{ padding: "0 20px 24px", display: "flex", gap: "10px" }}>
            <ActionBtn onClick={() => setView("list")} variant="secondary">
              <ArrowLeft size={14} /> Go Back
            </ActionBtn>
            <ActionBtn onClick={() => {}} variant="secondary">
              <X size={14} /> Reset Changes
            </ActionBtn>
            <ActionBtn onClick={() => setView("list")} variant="primary">
              <Save size={14} /> Save Changes
            </ActionBtn>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: cardBg,
        border: `1px solid ${borderColor}`,
        borderRadius: "6px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "14px 20px",
          borderBottom: `1px solid ${borderColor}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3 style={{ fontSize: "14px", fontWeight: 600, color: mutedColor, margin: 0 }}>Users List</h3>
        <button
          onClick={() => {
            setFormTab("Account Info");
            setView("add");
          }}
          style={{
            height: "32px",
            padding: "0 14px",
            background: "#C70039",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          + Add New User
        </button>
      </div>

      <div
        style={{
          padding: "12px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: mutedColor }}>
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
            style={{
              height: "30px",
              padding: "0 8px",
              fontSize: "12px",
              border: `1px solid ${borderColor}`,
              borderRadius: "4px",
              background: cardBg,
              color: textColor,
            }}
          >
            {[10, 25, 50, 100].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <span>entries per page</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "12px", color: mutedColor }}>Search:</span>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search..."
            style={{
              height: "30px",
              width: "180px",
              padding: "0 10px",
              fontSize: "12px",
              border: `1px solid ${borderColor}`,
              borderRadius: "4px",
              background: cardBg,
              color: textColor,
            }}
          />
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
          <thead>
            <tr style={{ background: headerBg, borderBottom: `1px solid ${borderColor}` }}>
              <SortTh col="id" label="ID" sortCol={sortCol} sortAsc={sortAsc} onSort={toggleSort} mutedColor={mutedColor} borderColor={borderColor} />
              <SortTh col="username" label="Username" sortCol={sortCol} sortAsc={sortAsc} onSort={toggleSort} mutedColor={mutedColor} borderColor={borderColor} />
              <SortTh col="name" label="Name" sortCol={sortCol} sortAsc={sortAsc} onSort={toggleSort} mutedColor={mutedColor} borderColor={borderColor} />
              <SortTh col="email" label="Email" sortCol={sortCol} sortAsc={sortAsc} onSort={toggleSort} mutedColor={mutedColor} borderColor={borderColor} />
              <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: mutedColor }}>Status</th>
              <th style={{ padding: "10px 16px", textAlign: "center", fontWeight: 600, color: mutedColor }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((user, i) => (
              <tr
                key={user.id}
                style={{
                  borderBottom: i < paged.length - 1 ? `1px solid ${borderColor}` : "none",
                  background: i % 2 === 0 ? "transparent" : isDarkMode ? "rgba(255,255,255,0.02)" : "#FAFAFA",
                }}
              >
                <td style={{ padding: "12px 16px", color: textColor }}>{user.id}</td>
                <td style={{ padding: "12px 16px", color: textColor }}>{user.username}</td>
                <td style={{ padding: "12px 16px", color: textColor }}>{user.name}</td>
                <td style={{ padding: "12px 16px", color: textColor }}>{user.email}</td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "4px" }}>
                    <button
                      onClick={() => toggleUserEnabled(user.id)}
                      style={{
                        width: "44px",
                        height: "22px",
                        borderRadius: "11px",
                        border: "none",
                        background: user.enabled ? "#4CAF50" : "#CCCCCC",
                        cursor: "pointer",
                        position: "relative",
                        padding: 0,
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          top: "2px",
                          left: user.enabled ? "24px" : "2px",
                          width: "18px",
                          height: "18px",
                          borderRadius: "50%",
                          background: "#FFFFFF",
                          transition: "left 0.15s",
                        }}
                      />
                    </button>
                    <span style={{ fontSize: "11px", color: user.enabled ? "#4CAF50" : mutedColor, fontWeight: 600 }}>
                      {user.enabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </td>
                <td style={{ padding: "12px 16px", textAlign: "center" }}>
                  <button
                    onClick={() => {
                      setFormTab("Account Info");
                      setView("add");
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#C70039",
                      padding: "2px",
                      display: "inline-flex",
                    }}
                  >
                    <Pencil size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        totalEntries={filtered.length}
        perPage={perPage}
        onPageChange={setPage}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}

function SectionTitle({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <h4 style={{ fontSize: "14px", fontWeight: 600, color, margin: "0 0 14px 0" }}>{children}</h4>
  );
}

function FieldInput({
  label,
  borderColor,
  inputBg,
  textColor,
  type = "text",
}: {
  label: string;
  borderColor: string;
  inputBg: string;
  textColor: string;
  type?: string;
}) {
  return (
    <div>
      <input
        type={type}
        placeholder={label}
        style={{
          width: "100%",
          height: "40px",
          padding: "0 12px",
          fontSize: "13px",
          border: `1px solid ${borderColor}`,
          borderRadius: "4px",
          background: inputBg,
          color: textColor,
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

function FieldSelect({
  label,
  children,
  borderColor,
  inputBg,
  textColor,
  defaultValue,
}: {
  label: string;
  children: React.ReactNode;
  borderColor: string;
  inputBg: string;
  textColor: string;
  defaultValue?: string;
}) {
  return (
    <div>
      <label style={{ fontSize: "11px", color: "#888", display: "block", marginBottom: "4px" }}>{label}</label>
      <select
        defaultValue={defaultValue}
        style={{
          width: "100%",
          height: "40px",
          padding: "0 12px",
          fontSize: "13px",
          border: `1px solid ${borderColor}`,
          borderRadius: "4px",
          background: inputBg,
          color: textColor,
          boxSizing: "border-box",
        }}
      >
        {children}
      </select>
    </div>
  );
}

function FormCheckbox({
  label,
  textColor,
  checked,
  onChange,
}: {
  label: string;
  textColor: string;
  checked?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: textColor, cursor: "pointer" }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange ? (e) => onChange(e.target.checked) : undefined}
        style={{ accentColor: "#C70039", width: "14px", height: "14px" }}
      />
      {label}
    </label>
  );
}

function ActionBtn({
  children,
  onClick,
  variant,
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant: "primary" | "secondary";
}) {
  const isPrimary = variant === "primary";
  return (
    <button
      onClick={onClick}
      style={{
        height: "36px",
        padding: "0 16px",
        background: isPrimary ? "#C70039" : "#FFFFFF",
        color: isPrimary ? "#FFFFFF" : "#333333",
        border: isPrimary ? "none" : "1px solid #CCCCCC",
        borderRadius: "4px",
        fontSize: "13px",
        fontWeight: 500,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "6px",
      }}
    >
      {children}
    </button>
  );
}

function CreditCardVisual() {
  return (
    <div
      style={{
        width: "320px",
        height: "190px",
        background: "linear-gradient(135deg, #C70039 0%, #8B0020 100%)",
        borderRadius: "12px",
        padding: "24px",
        color: "#FFFFFF",
        position: "relative",
        boxShadow: "0 4px 16px rgba(199,0,57,0.3)",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "30px",
          background: "linear-gradient(135deg, #D4AF37 0%, #C0C0C0 50%, #D4AF37 100%)",
          borderRadius: "4px",
          marginBottom: "24px",
        }}
      />
      <div style={{ fontSize: "18px", letterSpacing: "3px", marginBottom: "32px", fontFamily: "monospace" }}>
        •••• •••• •••• ••••
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <span style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "1px" }}>FULL NAME</span>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "8px", opacity: 0.8 }}>MONTH/YEAR</div>
          <div style={{ fontSize: "8px", opacity: 0.8, marginBottom: "2px" }}>valid thru</div>
          <div style={{ fontSize: "14px", fontFamily: "monospace" }}>•• / ••</div>
        </div>
      </div>
    </div>
  );
}

function SortTh({
  col,
  label,
  sortCol,
  sortAsc,
  onSort,
  mutedColor,
  borderColor,
}: {
  col: "id" | "username" | "name" | "email";
  label: string;
  sortCol: string;
  sortAsc: boolean;
  onSort: (col: "id" | "username" | "name" | "email") => void;
  mutedColor: string;
  borderColor: string;
}) {
  return (
    <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: mutedColor, borderBottom: `1px solid ${borderColor}` }}>
      <button
        onClick={() => onSort(col)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          color: mutedColor,
          fontSize: "12px",
          fontWeight: 600,
          padding: 0,
        }}
      >
        {label}
        <span style={{ display: "flex", flexDirection: "column", lineHeight: 0.6 }}>
          <ChevronUp size={10} style={{ opacity: sortCol === col && sortAsc ? 1 : 0.4 }} />
          <ChevronDown size={10} style={{ opacity: sortCol === col && !sortAsc ? 1 : 0.4 }} />
        </span>
      </button>
    </th>
  );
}
