import { useState } from "react";
import { Save, ChevronRight, ChevronLeft, ArrowLeft } from "lucide-react";
import { Footer } from "../components/Footer";
import { AVAILABLE_SEARCHES } from "../data/mockData";

interface AddClientConfigGroupPageProps {
  isDarkMode?: boolean;
  onBack?: () => void;
}

function SectionHeader({ title, primaryColor }: { title: string; primaryColor: string }) {
  return (
    <div style={{ marginTop: "8px" }}>
      <div style={{ height: "2px", background: primaryColor, marginBottom: "12px" }} />
      <h2 style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#555" }}>{title}</h2>
    </div>
  );
}

export function AddClientConfigGroupPage({ isDarkMode = false, onBack }: AddClientConfigGroupPageProps) {
  const [form, setForm] = useState({
    groupName: "",
    groupDescription: "",
    groupDiscount: "0",
    ccReportsTo: "",
    clientPaysFees: "All Searches",
    groupColor: "#000000",
    packageBuilderEnabled: "no" as "yes" | "no",
    exemptSuspendTerminate: false,
    limitCrimeHistory: "Unlimited",
    displayCompanyLogo: false,
    includeContactInfo: false,
    includeClientInfo: false,
    subjectName: false,
    dateOfBirth: false,
    ssnTaxId: false,
    streetAddress: false,
    companyName: false,
    autoPopulateTimeFrame: "7 Years",
    extraYearCost: "",
    viewExactMatch: false,
    viewPartialMatch: false,
    viewNonMatches: false,
  });

  const [availableSearches, setAvailableSearches] = useState<string[]>([...AVAILABLE_SEARCHES]);
  const [assignedSearches, setAssignedSearches] = useState<string[]>([]);
  const [selectedAvailable, setSelectedAvailable] = useState<string[]>([]);
  const [selectedAssigned, setSelectedAssigned] = useState<string[]>([]);

  const primaryColor = isDarkMode ? "#DF2A57" : "#C70039";
  const cardBg = isDarkMode ? "#252830" : "#FFFFFF";
  const borderColor = isDarkMode ? "#333333" : "#E5E7EB";
  const textColor = isDarkMode ? "#E5E7EB" : "#333333";
  const mutedColor = isDarkMode ? "#9CA3AF" : "#666666";
  const inputBg = isDarkMode ? "#1A1C21" : "#FFFFFF";
  const contentBg = isDarkMode ? "#1A1C21" : "#F4F5F7";

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: "36px",
    padding: "0 10px",
    fontSize: "13px",
    border: `1px solid ${borderColor}`,
    borderRadius: "4px",
    background: inputBg,
    color: textColor,
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "12px",
    color: mutedColor,
    marginBottom: "6px",
  };

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function moveToAssigned() {
    if (!selectedAvailable.length) return;
    setAssignedSearches((prev) => [...prev, ...selectedAvailable]);
    setAvailableSearches((prev) => prev.filter((s) => !selectedAvailable.includes(s)));
    setSelectedAvailable([]);
  }

  function moveToAvailable() {
    if (!selectedAssigned.length) return;
    setAvailableSearches((prev) => [...prev, ...selectedAssigned].sort());
    setAssignedSearches((prev) => prev.filter((s) => !selectedAssigned.includes(s)));
    setSelectedAssigned([]);
  }

  const listBoxStyle: React.CSSProperties = {
    width: "100%",
    height: "220px",
    border: `1px solid ${borderColor}`,
    borderRadius: "4px",
    background: inputBg,
    fontSize: "12px",
    color: textColor,
    padding: "4px",
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: contentBg }}>
      <div style={{ flex: 1, padding: "24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                background: cardBg,
                border: `1px solid ${borderColor}`,
                borderRadius: "4px",
                fontSize: "13px",
                color: textColor,
                cursor: "pointer",
              }}
            >
              <ArrowLeft size={14} />
              Back
            </button>
          )}
          <h1 style={{ fontSize: "20px", fontWeight: 600, color: primaryColor, margin: 0 }}>
            Add Client Configuration Group
          </h1>
        </div>

        <div
          style={{
            background: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: "6px",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 20px" }}>
            <div>
              <label style={labelStyle}>Group Name</label>
              <input style={inputStyle} value={form.groupName} onChange={(e) => update("groupName", e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Group Description</label>
              <input style={inputStyle} value={form.groupDescription} onChange={(e) => update("groupDescription", e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Group Discount %</label>
              <input style={inputStyle} value={form.groupDiscount} onChange={(e) => update("groupDiscount", e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>CC Reports To</label>
              <input style={inputStyle} value={form.ccReportsTo} onChange={(e) => update("ccReportsTo", e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Client Pays Fees</label>
              <select style={inputStyle} value={form.clientPaysFees} onChange={(e) => update("clientPaysFees", e.target.value)}>
                <option value="All Searches">All Searches</option>
                <option value="None">None</option>
                <option value="Selected Searches">Selected Searches</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>GROUP COLOR</label>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input
                  type="color"
                  value={form.groupColor}
                  onChange={(e) => update("groupColor", e.target.value)}
                  style={{ width: "36px", height: "36px", padding: 0, border: `1px solid ${borderColor}`, cursor: "pointer" }}
                />
                <input style={{ ...inputStyle, flex: 1 }} value={form.groupColor} onChange={(e) => update("groupColor", e.target.value)} />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <label style={{ ...labelStyle, marginBottom: "10px" }}>Package Builder Enabled</label>
              <div style={{ display: "flex", gap: "16px" }}>
                {(["yes", "no"] as const).map((val) => (
                  <label key={val} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: textColor, cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="packageBuilder"
                      checked={form.packageBuilderEnabled === val}
                      onChange={() => update("packageBuilderEnabled", val)}
                      style={{ accentColor: primaryColor }}
                    />
                    {val === "yes" ? "Yes" : "No"}
                  </label>
                ))}
              </div>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: textColor, cursor: "pointer", marginTop: "24px" }}>
              <input
                type="checkbox"
                checked={form.exemptSuspendTerminate}
                onChange={(e) => update("exemptSuspendTerminate", e.target.checked)}
                style={{ accentColor: primaryColor }}
              />
              Exempt from Suspend &amp; Terminate
            </label>
          </div>

          <SectionHeader title="Result Display Configuration" primaryColor={primaryColor} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
            <div>
              <label style={labelStyle}>Limit Crime History</label>
              <select style={inputStyle} value={form.limitCrimeHistory} onChange={(e) => update("limitCrimeHistory", e.target.value)}>
                <option value="Unlimited">Unlimited</option>
                <option value="7 Years">7 Years</option>
                <option value="10 Years">10 Years</option>
              </select>
            </div>
            <div style={{ gridColumn: "span 2", display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "flex-end", paddingBottom: "4px" }}>
              {(
                [
                  { key: "displayCompanyLogo" as const, label: "Display company logo on report" },
                  { key: "includeContactInfo" as const, label: "Include contact info on report" },
                  { key: "includeClientInfo" as const, label: "Include client info on report" },
                ] as const
              ).map(({ key, label }) => (
                <label key={key} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: textColor, cursor: "pointer" }}>
                  <input type="checkbox" checked={form[key]} onChange={(e) => update(key, e.target.checked)} style={{ accentColor: primaryColor }} />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <SectionHeader title="Subject Info on Result Report" primaryColor={primaryColor} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            {(
              [
                { key: "subjectName" as const, label: "Subject Name" },
                { key: "dateOfBirth" as const, label: "Date of Birth" },
                { key: "ssnTaxId" as const, label: "SSN / Tax ID" },
                { key: "streetAddress" as const, label: "Street Address" },
                { key: "companyName" as const, label: "Company Name" },
              ] as const
            ).map(({ key, label }) => (
              <label key={key} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: textColor, cursor: "pointer" }}>
                <input type="checkbox" checked={form[key]} onChange={(e) => update(key, e.target.checked)} style={{ accentColor: primaryColor }} />
                {label}
              </label>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", maxWidth: "520px" }}>
            <div>
              <label style={labelStyle}>Auto Populate Time Frame</label>
              <select style={inputStyle} value={form.autoPopulateTimeFrame} onChange={(e) => update("autoPopulateTimeFrame", e.target.value)}>
                <option value="7 Years">7 Years</option>
                <option value="10 Years">10 Years</option>
                <option value="Unlimited">Unlimited</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Extra Year Cost</label>
              <input style={inputStyle} value={form.extraYearCost} onChange={(e) => update("extraYearCost", e.target.value)} />
            </div>
          </div>

          <SectionHeader title="SSN Trace Result Configuration" primaryColor={primaryColor} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            {(
              [
                { key: "viewExactMatch" as const, label: "View Exact Match" },
                { key: "viewPartialMatch" as const, label: "View Partial Match" },
                { key: "viewNonMatches" as const, label: "View Non Matches" },
              ] as const
            ).map(({ key, label }) => (
              <label key={key} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: textColor, cursor: "pointer" }}>
                <input type="checkbox" checked={form[key]} onChange={(e) => update(key, e.target.checked)} style={{ accentColor: primaryColor }} />
                {label}
              </label>
            ))}
          </div>

          <SectionHeader title="Assigned Searches" primaryColor={primaryColor} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "16px", alignItems: "center" }}>
            <div>
              <label style={labelStyle}>Available Searches</label>
              <select
                multiple
                value={selectedAvailable}
                onChange={(e) => setSelectedAvailable(Array.from(e.target.selectedOptions, (o) => o.value))}
                style={listBoxStyle}
              >
                {availableSearches.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingTop: "20px" }}>
              <button
                type="button"
                onClick={moveToAssigned}
                style={{
                  padding: "8px 12px",
                  border: `1px solid ${borderColor}`,
                  borderRadius: "4px",
                  background: cardBg,
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                <ChevronRight size={16} />
                <ChevronRight size={16} style={{ marginLeft: "-10px" }} />
              </button>
              <button
                type="button"
                onClick={moveToAvailable}
                style={{
                  padding: "8px 12px",
                  border: `1px solid ${borderColor}`,
                  borderRadius: "4px",
                  background: cardBg,
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                <ChevronLeft size={16} />
                <ChevronLeft size={16} style={{ marginLeft: "-10px" }} />
              </button>
            </div>
            <div>
              <label style={labelStyle}>Assigned Searches</label>
              <select
                multiple
                value={selectedAssigned}
                onChange={(e) => setSelectedAssigned(Array.from(e.target.selectedOptions, (o) => o.value))}
                style={listBoxStyle}
              >
                {assignedSearches.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", paddingTop: "8px" }}>
            <button
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 28px",
                background: primaryColor,
                color: "#FFFFFF",
                border: "none",
                borderRadius: "4px",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              <Save size={16} />
              Save Changes
            </button>
          </div>

          <SectionHeader title="Group Search Packages" primaryColor={primaryColor} />
          <p style={{ margin: 0, fontSize: "13px", color: mutedColor }}>Configure package groups for this client configuration.</p>
        </div>
      </div>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
