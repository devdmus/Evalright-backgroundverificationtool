import { useState } from "react";
import { X } from "lucide-react";
import { Footer } from "../components/Footer";

interface AddNewClientProps {
  isDarkMode?: boolean;
}

export function AddNewClient({ isDarkMode = false }: AddNewClientProps) {
  const [showNote, setShowNote] = useState(true);
  const [sendAccountMessage, setSendAccountMessage] = useState(true);
  const [form, setForm] = useState({
    companyName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postcode: "",
    phoneNumber: "",
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    dontApplyLateFees: false,
    dontSendOverdueEmails: false,
    dontApplyTax: false,
    clientGroup: "New Sign-Ups EvalRight",
    status: "Active",
    creditBalance: "",
    adminNotes: "",
  });

  const cardBg = isDarkMode ? "#252830" : "#FFFFFF";
  const borderColor = isDarkMode ? "#333333" : "#E5E7EB";
  const textColor = isDarkMode ? "#E5E7EB" : "#333333";
  const mutedColor = isDarkMode ? "#9CA3AF" : "#888888";
  const inputBg = isDarkMode ? "#1A1C21" : "#FFFFFF";
  const accentColor = isDarkMode ? "#DF2A57" : "#C70039";
  const contentBg = isDarkMode ? "#1A1C21" : "#F4F5F7";

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: contentBg }}>
      <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 600, color: accentColor, margin: "0 0 16px 0" }}>
          Add New Client
        </h1>

        {showNote && (
          <div
            style={{
              background: isDarkMode ? "rgba(255,193,7,0.15)" : "#FFF8E1",
              border: `1px solid ${isDarkMode ? "#5C4A00" : "#FFE082"}`,
              borderRadius: "4px",
              padding: "12px 16px",
              marginBottom: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "12px",
            }}
          >
            <p style={{ margin: 0, fontSize: "13px", color: isDarkMode ? "#FCD34D" : "#5D4037", lineHeight: 1.5 }}>
              <strong>NOTE:</strong> Clients should always register themselves to accept ToS and such...
            </p>
            <button
              onClick={() => setShowNote(false)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: mutedColor,
                padding: "2px",
                flexShrink: 0,
                display: "flex",
              }}
            >
              <X size={16} />
            </button>
          </div>
        )}

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
              background: accentColor,
              color: "#FFFFFF",
              padding: "10px 16px",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            Add New Client
          </div>

          <div style={{ padding: "20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 20px", marginBottom: "24px" }}>
              <div style={{ gridColumn: "span 2" }}>
                <FieldInput label="Company Name" value={form.companyName} onChange={(v) => update("companyName", v)} borderColor={borderColor} inputBg={inputBg} textColor={textColor} mutedColor={mutedColor} />
              </div>
              <FieldInput label="Address 1" value={form.address1} onChange={(v) => update("address1", v)} borderColor={borderColor} inputBg={inputBg} textColor={textColor} mutedColor={mutedColor} />
              <FieldInput label="Address 2 (Optional)" value={form.address2} onChange={(v) => update("address2", v)} borderColor={borderColor} inputBg={inputBg} textColor={textColor} mutedColor={mutedColor} />
              <FieldInput label="City" value={form.city} onChange={(v) => update("city", v)} borderColor={borderColor} inputBg={inputBg} textColor={textColor} mutedColor={mutedColor} />
              <FieldInput label="State/Region" value={form.state} onChange={(v) => update("state", v)} borderColor={borderColor} inputBg={inputBg} textColor={textColor} mutedColor={mutedColor} />
              <FieldInput label="Postcode" value={form.postcode} onChange={(v) => update("postcode", v)} borderColor={borderColor} inputBg={inputBg} textColor={textColor} mutedColor={mutedColor} />
              <FieldInput label="Phone Number" value={form.phoneNumber} onChange={(v) => update("phoneNumber", v)} borderColor={borderColor} inputBg={inputBg} textColor={textColor} mutedColor={mutedColor} />
            </div>

            <SectionLabel color={accentColor}>Primary User Setup</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 20px", marginBottom: "24px" }}>
              <FieldInput label="First Name" value={form.firstName} onChange={(v) => update("firstName", v)} borderColor={borderColor} inputBg={inputBg} textColor={textColor} mutedColor={mutedColor} />
              <FieldInput label="Last Name" value={form.lastName} onChange={(v) => update("lastName", v)} borderColor={borderColor} inputBg={inputBg} textColor={textColor} mutedColor={mutedColor} />
              <div style={{ gridColumn: "span 2" }}>
                <FieldInput label="Email" value={form.email} onChange={(v) => update("email", v)} borderColor={borderColor} inputBg={inputBg} textColor={textColor} mutedColor={mutedColor} />
              </div>
              <FieldInput label="Username" value={form.username} onChange={(v) => update("username", v)} borderColor={borderColor} inputBg={inputBg} textColor={textColor} mutedColor={mutedColor} />
              <FieldInput label="Password" value={form.password} onChange={(v) => update("password", v)} type="password" borderColor={borderColor} inputBg={inputBg} textColor={textColor} mutedColor={mutedColor} />
            </div>

            <SectionLabel color={accentColor}>Other</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px 40px", marginBottom: "20px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <CheckboxRow label="Late Fees" checkboxLabel="Don't Apply Late Fees" checked={form.dontApplyLateFees} onChange={(v) => update("dontApplyLateFees", v)} textColor={textColor} mutedColor={mutedColor} />
                <CheckboxRow label="Overdue Notices" checkboxLabel="Don't Send Overdue Emails" checked={form.dontSendOverdueEmails} onChange={(v) => update("dontSendOverdueEmails", v)} textColor={textColor} mutedColor={mutedColor} />
                <CheckboxRow label="Tax Exempt" checkboxLabel="Don't Apply Tax to Invoices" checked={form.dontApplyTax} onChange={(v) => update("dontApplyTax", v)} textColor={textColor} mutedColor={mutedColor} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <FieldSelect label="Client group" value={form.clientGroup} onChange={(v) => update("clientGroup", v)} borderColor={borderColor} inputBg={inputBg} textColor={textColor} mutedColor={mutedColor}>
                  <option>New Sign-Ups EvalRight</option>
                  <option>Evalright Group</option>
                </FieldSelect>
                <FieldSelect label="Status" value={form.status} onChange={(v) => update("status", v)} borderColor={borderColor} inputBg={inputBg} textColor={textColor} mutedColor={mutedColor}>
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Closed</option>
                </FieldSelect>
                <FieldInput label="Credit Balance (eg. 0.00)" value={form.creditBalance} onChange={(v) => update("creditBalance", v)} borderColor={borderColor} inputBg={inputBg} textColor={textColor} mutedColor={mutedColor} />
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ fontSize: "12px", color: mutedColor, display: "block", marginBottom: "6px" }}>Admin Notes</label>
              <textarea
                value={form.adminNotes}
                onChange={(e) => update("adminNotes", e.target.value)}
                rows={4}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  fontSize: "13px",
                  border: `1px solid ${borderColor}`,
                  borderRadius: "4px",
                  background: inputBg,
                  color: textColor,
                  boxSizing: "border-box",
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
              />
            </div>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "13px",
                color: textColor,
                cursor: "pointer",
                marginBottom: "28px",
              }}
            >
              <input
                type="checkbox"
                checked={sendAccountMessage}
                onChange={(e) => setSendAccountMessage(e.target.checked)}
                style={{ accentColor: accentColor, width: "15px", height: "15px" }}
              />
              Tick this box to send a New Account Information Message to the client
            </label>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <button
                style={{
                  height: "40px",
                  padding: "0 36px",
                  background: accentColor,
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Add Client
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}

function SectionLabel({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <h3 style={{ fontSize: "14px", fontWeight: 600, color, margin: "0 0 14px 0", fontStyle: "italic" }}>
      {children}
    </h3>
  );
}

function FieldInput({
  label,
  value,
  onChange,
  borderColor,
  inputBg,
  textColor,
  mutedColor,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  borderColor: string;
  inputBg: string;
  textColor: string;
  mutedColor: string;
  type?: string;
}) {
  return (
    <div>
      <label style={{ fontSize: "12px", color: mutedColor, display: "block", marginBottom: "6px" }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
  value,
  onChange,
  children,
  borderColor,
  inputBg,
  textColor,
  mutedColor,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  borderColor: string;
  inputBg: string;
  textColor: string;
  mutedColor: string;
}) {
  return (
    <div>
      <label style={{ fontSize: "12px", color: mutedColor, display: "block", marginBottom: "6px" }}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
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

function CheckboxRow({
  label,
  checkboxLabel,
  checked,
  onChange,
  textColor,
  mutedColor,
}: {
  label: string;
  checkboxLabel: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  textColor: string;
  mutedColor: string;
}) {
  return (
    <div>
      <span style={{ fontSize: "12px", color: mutedColor, display: "block", marginBottom: "6px" }}>{label}</span>
      <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: textColor, cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          style={{ accentColor: "#C70039", width: "14px", height: "14px" }}
        />
        {checkboxLabel}
      </label>
    </div>
  );
}
