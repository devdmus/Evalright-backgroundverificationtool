import { useState } from "react";
import { PROFILE_INFO, US_STATES } from "../data/mockData";

interface ClientProfileTabProps {
  isDarkMode?: boolean;
}

export function ClientProfileTab({ isDarkMode = false }: ClientProfileTabProps) {
  const [profile, setProfile] = useState(PROFILE_INFO);

  const cardBg = isDarkMode ? "#252830" : "#FFFFFF";
  const borderColor = isDarkMode ? "#333333" : "#E5E7EB";
  const textColor = isDarkMode ? "#E5E7EB" : "#333333";
  const mutedColor = isDarkMode ? "#9CA3AF" : "#888888";
  const sectionBg = isDarkMode ? "#6B7280" : "#9E9E9E";
  const inputBg = isDarkMode ? "#1A1C21" : "#FFFFFF";

  function update<K extends keyof typeof profile>(key: K, value: (typeof profile)[K]) {
    setProfile((prev) => ({ ...prev, [key]: value }));
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
      <SectionHeader bg={sectionBg}>COMPANY INFO</SectionHeader>
      <div style={{ padding: "20px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px 20px" }}>
        <Field label="Company Name" mutedColor={mutedColor}>
          <Input value={profile.companyName} borderColor={borderColor} inputBg={inputBg} textColor={textColor} onChange={(v) => update("companyName", v)} />
        </Field>
        <Field label="Phone Number" mutedColor={mutedColor}>
          <Input value={profile.phoneNumber} borderColor={borderColor} inputBg={inputBg} textColor={textColor} onChange={(v) => update("phoneNumber", v)} />
        </Field>
        <Field label="Address 1" mutedColor={mutedColor}>
          <Input value={profile.address1} borderColor={borderColor} inputBg={inputBg} textColor={textColor} onChange={(v) => update("address1", v)} />
        </Field>
        <Field label="Address 2" mutedColor={mutedColor}>
          <Input value={profile.address2} borderColor={borderColor} inputBg={inputBg} textColor={textColor} onChange={(v) => update("address2", v)} />
        </Field>
        <Field label="City" mutedColor={mutedColor}>
          <Input value={profile.city} borderColor={borderColor} inputBg={inputBg} textColor={textColor} onChange={(v) => update("city", v)} />
        </Field>
        <Field label="Zip Code" mutedColor={mutedColor}>
          <Input value={profile.zipCode} borderColor={borderColor} inputBg={inputBg} textColor={textColor} onChange={(v) => update("zipCode", v)} />
        </Field>
        <Field label="State" mutedColor={mutedColor}>
          <Select value={profile.state} borderColor={borderColor} inputBg={inputBg} textColor={textColor} onChange={(v) => update("state", v)}>
            {US_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
        </Field>
        <Field label="Country" mutedColor={mutedColor}>
          <Select value={profile.country} borderColor={borderColor} inputBg={inputBg} textColor={textColor} onChange={(v) => update("country", v)}>
            <option>United States of America</option>
            <option>Canada</option>
            <option>Mexico</option>
          </Select>
        </Field>
      </div>

      <SectionHeader bg={sectionBg}>BASIC SETTINGS</SectionHeader>
      <div style={{ padding: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px 20px", marginBottom: "16px" }}>
          <div>
            <span style={{ fontSize: "11px", color: mutedColor, display: "block", marginBottom: "8px" }}>Enable Package Builder</span>
            <div style={{ display: "flex", gap: "16px" }}>
              <Radio label="No" checked={!profile.enablePackageBuilder} onChange={() => update("enablePackageBuilder", false)} textColor={textColor} />
              <Radio label="Yes" checked={profile.enablePackageBuilder} onChange={() => update("enablePackageBuilder", true)} textColor={textColor} />
            </div>
          </div>
          <Checkbox label="Don't Apply Late Fees" checked={profile.dontApplyLateFees} onChange={(v) => update("dontApplyLateFees", v)} textColor={textColor} />
          <Checkbox label="Don't Send Overdue Emails" checked={profile.dontSendOverdueEmails} onChange={(v) => update("dontSendOverdueEmails", v)} textColor={textColor} />
          <Field label="Credit Balance" mutedColor={mutedColor}>
            <Input value={profile.creditBalance} borderColor={borderColor} inputBg={inputBg} textColor={textColor} onChange={(v) => update("creditBalance", v)} />
          </Field>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px 20px" }}>
          <Field label="Account Status" mutedColor={mutedColor}>
            <Select value={profile.accountStatus} borderColor={borderColor} inputBg={inputBg} textColor={textColor} onChange={(v) => update("accountStatus", v)}>
              <option>Active</option>
              <option>Inactive</option>
              <option>Closed</option>
            </Select>
          </Field>
          <Field label="Primary User" mutedColor={mutedColor}>
            <Select value={profile.primaryUser} borderColor={borderColor} inputBg={inputBg} textColor={textColor} onChange={(v) => update("primaryUser", v)}>
              <option>Suresh Ramakoti</option>
              <option>Test AdminUser</option>
              <option>Raghavendra Polimera</option>
            </Select>
          </Field>
          <Field label="CC Reports To" mutedColor={mutedColor}>
            <Input value={profile.ccReportsTo} borderColor={borderColor} inputBg={inputBg} textColor={textColor} onChange={(v) => update("ccReportsTo", v)} />
          </Field>
          <Field label="Drug Screen Notifications To" mutedColor={mutedColor}>
            <Input value={profile.drugScreenNotificationsTo} borderColor={borderColor} inputBg={inputBg} textColor={textColor} onChange={(v) => update("drugScreenNotificationsTo", v)} />
          </Field>
        </div>
      </div>

      <SectionHeader bg={sectionBg}>SSN TRACE RESULT CONFIGURATION</SectionHeader>
      <div style={{ padding: "20px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "16px", alignItems: "center" }}>
          <Radio label="View Exact Match" checked={profile.ssnMatchType === "exact"} onChange={() => update("ssnMatchType", "exact")} textColor={textColor} />
          <Radio label="View Partial Match" checked={profile.ssnMatchType === "partial"} onChange={() => update("ssnMatchType", "partial")} textColor={textColor} />
          <Radio label="View Non Matches" checked={profile.ssnMatchType === "non"} onChange={() => update("ssnMatchType", "non")} textColor={textColor} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px 20px", alignItems: "end" }}>
          <Field label="Auto Populate Time Frame" mutedColor={mutedColor}>
            <Select value={profile.autoPopulateTimeFrame} borderColor={borderColor} inputBg={inputBg} textColor={textColor} onChange={(v) => update("autoPopulateTimeFrame", v)}>
              <option>7 Years</option>
              <option>10 Years</option>
              <option>5 Years</option>
              <option>3 Years</option>
            </Select>
          </Field>
          <Field label="Crime History Limit" mutedColor={mutedColor}>
            <Select value={profile.crimeHistoryLimit} borderColor={borderColor} inputBg={inputBg} textColor={textColor} onChange={(v) => update("crimeHistoryLimit", v)}>
              <option>7 Years</option>
              <option>10 Years</option>
              <option>5 Years</option>
              <option>3 Years</option>
            </Select>
          </Field>
          <Checkbox label="Hide SSN Addresses" checked={profile.hideSsnAddresses} onChange={(v) => update("hideSsnAddresses", v)} textColor={textColor} />
        </div>
      </div>

      <SectionHeader bg={sectionBg}>OTHER</SectionHeader>
      <div style={{ padding: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px 20px", marginBottom: "16px" }}>
          <Field label="Client Group" mutedColor={mutedColor}>
            <Select value={profile.clientGroup} borderColor={borderColor} inputBg={inputBg} textColor={textColor} onChange={(v) => update("clientGroup", v)}>
              <option>New Sign-Ups EvalRight</option>
              <option>Evalright Group</option>
            </Select>
          </Field>
          <Field label="Sales Person" mutedColor={mutedColor}>
            <Select value={profile.salesPerson} borderColor={borderColor} inputBg={inputBg} textColor={textColor} onChange={(v) => update("salesPerson", v)}>
              <option>None</option>
              <option>Suresh Ramakoti</option>
              <option>Raghavendra Polimera</option>
            </Select>
          </Field>
          <Field label="Credit Report Subcode" mutedColor={mutedColor}>
            <Input value={profile.creditReportSubcode} borderColor={borderColor} inputBg={inputBg} textColor={textColor} onChange={(v) => update("creditReportSubcode", v)} />
          </Field>
          <Field label="Credit Report Password" mutedColor={mutedColor}>
            <Input value={profile.creditReportPassword} borderColor={borderColor} inputBg={inputBg} textColor={textColor} onChange={(v) => update("creditReportPassword", v)} type="password" />
          </Field>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px 20px", marginBottom: "16px", alignItems: "start" }}>
          <Field label="Client FCRA Agreement" mutedColor={mutedColor} hint="Upload agreement for Evalright Demo Account">
            <input
              type="file"
              style={{
                width: "100%",
                fontSize: "12px",
                color: textColor,
              }}
            />
          </Field>
          <Field label="Order Summary Report Email" mutedColor={mutedColor}>
            <Select value={profile.orderSummaryReportEmail} borderColor={borderColor} inputBg={inputBg} textColor={textColor} onChange={(v) => update("orderSummaryReportEmail", v)}>
              <option>None</option>
              <option>kpraveen@evalright.us</option>
              <option>farooq@evalright.com</option>
            </Select>
          </Field>
          <div style={{ gridColumn: "span 2" }}>
            <div style={{ fontSize: "12px", color: textColor, lineHeight: 1.6, marginBottom: "10px" }}>
              Signed Electronically on <strong>{profile.electronicSignatureDate}</strong> by <strong>{profile.electronicSignatureBy}</strong>
              <br />
              Electronic Trace: <strong>{profile.electronicTrace}</strong>
            </div>
            <button
              style={{
                height: "32px",
                padding: "0 16px",
                background: "#C70039",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "4px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Get Service Agreement
            </button>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px 32px", marginBottom: "16px" }}>
          <Checkbox label="Require Middle Name" checked={profile.requireMiddleName} onChange={(v) => update("requireMiddleName", v)} textColor={textColor} />
          <Checkbox label="Require Applicant Email" checked={profile.requireApplicantEmail} onChange={(v) => update("requireApplicantEmail", v)} textColor={textColor} />
          <Checkbox label="Unlimited Invitation Searches" checked={profile.unlimitedInvitationSearches} onChange={(v) => update("unlimitedInvitationSearches", v)} textColor={textColor} />
          <Checkbox label="Required Order Reference" checked={profile.requiredOrderReference} onChange={(v) => update("requiredOrderReference", v)} textColor={textColor} />
          <Checkbox label="Automated Searches Enabled" checked={profile.automatedSearchesEnabled} onChange={(v) => update("automatedSearchesEnabled", v)} textColor={textColor} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px 20px" }}>
          <Field label={'Applicant "Order /w Invite" Limit (USD)'} mutedColor={mutedColor}>
            <Input value={profile.applicantOrderInviteLimit} borderColor={borderColor} inputBg={inputBg} textColor={textColor} onChange={(v) => update("applicantOrderInviteLimit", v)} />
          </Field>
          <div style={{ gridColumn: "span 3" }}>
            <Field label="Admin Notes" mutedColor={mutedColor}>
              <textarea
                value={profile.adminNotes}
                onChange={(e) => update("adminNotes", e.target.value)}
                rows={3}
                style={{
                  width: "100%",
                  padding: "8px 10px",
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
            </Field>
          </div>
        </div>
      </div>

      <div style={{ padding: "24px 20px 28px", display: "flex", justifyContent: "center", gap: "12px" }}>
        <button
          style={{
            height: "40px",
            padding: "0 28px",
            background: "#C70039",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "4px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Save Changes
        </button>
        <button
          style={{
            height: "40px",
            padding: "0 28px",
            background: "#2E1B85",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "4px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function SectionHeader({ children, bg }: { children: React.ReactNode; bg: string }) {
  return (
    <div
      style={{
        background: bg,
        color: "#FFFFFF",
        padding: "8px 16px",
        fontSize: "12px",
        fontWeight: 600,
        letterSpacing: "0.3px",
      }}
    >
      {children}
    </div>
  );
}

function Field({
  label,
  children,
  mutedColor,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  mutedColor: string;
  hint?: string;
}) {
  return (
    <div>
      <label style={{ fontSize: "11px", color: mutedColor, display: "block", marginBottom: "4px" }}>{label}</label>
      {children}
      {hint && <span style={{ fontSize: "10px", color: mutedColor, display: "block", marginTop: "4px" }}>{hint}</span>}
    </div>
  );
}

function Input({
  value,
  borderColor,
  inputBg,
  textColor,
  onChange,
  type = "text",
}: {
  value: string;
  borderColor: string;
  inputBg: string;
  textColor: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        height: "34px",
        padding: "0 10px",
        fontSize: "13px",
        border: `1px solid ${borderColor}`,
        borderRadius: "4px",
        background: inputBg,
        color: textColor,
        boxSizing: "border-box",
      }}
    />
  );
}

function Select({
  value,
  children,
  borderColor,
  inputBg,
  textColor,
  onChange,
}: {
  value: string;
  children: React.ReactNode;
  borderColor: string;
  inputBg: string;
  textColor: string;
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        height: "34px",
        padding: "0 10px",
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
  );
}

function Checkbox({
  label,
  checked,
  onChange,
  textColor,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  textColor: string;
}) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: textColor, cursor: "pointer", paddingTop: "18px" }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ accentColor: "#C70039", width: "14px", height: "14px", cursor: "pointer" }}
      />
      {label}
    </label>
  );
}

function Radio({
  label,
  checked,
  onChange,
  textColor,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  textColor: string;
}) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: textColor, cursor: "pointer" }}>
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        style={{ accentColor: "#C70039", width: "14px", height: "14px", cursor: "pointer" }}
      />
      {label}
    </label>
  );
}
