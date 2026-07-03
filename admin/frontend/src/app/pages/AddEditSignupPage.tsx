import { useState } from "react";
import { Save, ArrowLeft } from "lucide-react";
import { Footer } from "../components/Footer";
import { CONFIG_GROUP_OPTIONS, SALES_PERSONS } from "../data/mockData";

export interface SignupPageFormData {
  pageName: string;
  shortName: string;
  configGroup: string;
  salesPerson: string;
  returnLink: string;
  setAsDefault: boolean;
  enableAutomatedSearches: boolean;
  paymentOption: "credit-card" | "escrow" | "invoice";
  amex: boolean;
  discover: boolean;
  mastercard: boolean;
  visa: boolean;
  confirmationPayAsYouGo: string;
  confirmationEscrow: string;
  confirmationInvoice: string;
  hideTermsOnRegistration: boolean;
  termsAndConditions: string;
}

const EMPTY_FORM: SignupPageFormData = {
  pageName: "",
  shortName: "",
  configGroup: "",
  salesPerson: "",
  returnLink: "",
  setAsDefault: false,
  enableAutomatedSearches: false,
  paymentOption: "credit-card",
  amex: false,
  discover: false,
  mastercard: false,
  visa: false,
  confirmationPayAsYouGo: "",
  confirmationEscrow: "",
  confirmationInvoice: "",
  hideTermsOnRegistration: false,
  termsAndConditions: "",
};

interface AddEditSignupPageProps {
  isDarkMode?: boolean;
  mode: "add" | "edit";
  initialData?: Partial<SignupPageFormData>;
  onBack: () => void;
}

export function AddEditSignupPage({ isDarkMode = false, mode, initialData, onBack }: AddEditSignupPageProps) {
  const [form, setForm] = useState<SignupPageFormData>({ ...EMPTY_FORM, ...initialData });

  const primaryColor = isDarkMode ? "#DF2A57" : "#C70039";
  const cardBg = isDarkMode ? "#252830" : "#FFFFFF";
  const borderColor = isDarkMode ? "#333333" : "#E5E7EB";
  const textColor = isDarkMode ? "#E5E7EB" : "#333333";
  const mutedColor = isDarkMode ? "#9CA3AF" : "#666666";
  const inputBg = isDarkMode ? "#1A1C21" : "#FFFFFF";
  const contentBg = isDarkMode ? "#1A1C21" : "#F4F5F7";
  const sectionBarBg = isDarkMode ? "#2A2D34" : "#F0F0F0";

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

  function update<K extends keyof SignupPageFormData>(key: K, value: SignupPageFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const urlPreview = `https://clients.evalright.com/register/${form.shortName || ""}`;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: contentBg }}>
      <div style={{ flex: 1, padding: "24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "20px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 600, color: primaryColor, margin: 0 }}>Sign-Up Pages</h1>

        <div
          style={{
            background: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: "6px",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: textColor }}>
            {mode === "add" ? "Add Sign-Up Page" : "Edit Sign-Up Page"}
          </h2>

          <div>
            <label style={labelStyle}>Signup Page Name</label>
            <input style={inputStyle} value={form.pageName} onChange={(e) => update("pageName", e.target.value)} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", alignItems: "start" }}>
            <div>
              <label style={labelStyle}>Short Name (for URL)</label>
              <input style={inputStyle} value={form.shortName} onChange={(e) => update("shortName", e.target.value)} />
            </div>
            <div style={{ fontSize: "13px", paddingTop: "22px" }}>
              <div style={{ color: "#2563EB" }}>URL Preview: {urlPreview}</div>
              <div style={{ color: primaryColor, fontSize: "12px", marginTop: "4px" }}>
                *Doesn&apos;t apply if page is set as default!
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <label style={labelStyle}>Default Configuration Group</label>
              <select style={inputStyle} value={form.configGroup} onChange={(e) => update("configGroup", e.target.value)}>
                <option value="">Select Configuration Group</option>
                {CONFIG_GROUP_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Default Sales Person</label>
              <select style={inputStyle} value={form.salesPerson} onChange={(e) => update("salesPerson", e.target.value)}>
                <option value="">None</option>
                {SALES_PERSONS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Return Link (https://yourdomain.com/page)</label>
            <input style={inputStyle} value={form.returnLink} onChange={(e) => update("returnLink", e.target.value)} />
            <p style={{ margin: "6px 0 0 0", fontSize: "12px", color: mutedColor }}>
              *User will be redirected to this URL upon successful registration.
            </p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: textColor, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={form.setAsDefault}
                onChange={(e) => update("setAsDefault", e.target.checked)}
                style={{ accentColor: primaryColor }}
              />
              Set as Default Signup Page
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: textColor, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={form.enableAutomatedSearches}
                onChange={(e) => update("enableAutomatedSearches", e.target.checked)}
                style={{ accentColor: primaryColor }}
              />
              Enable Automated Searches (active from account creation)
            </label>
          </div>

          <div style={{ background: sectionBarBg, padding: "10px 14px", borderRadius: "4px" }}>
            <span style={{ fontSize: "13px", fontWeight: 500, color: textColor }}>
              Select payment options to be displayed on the sign-up page
            </span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
            {(
              [
                { value: "credit-card" as const, label: "Pay as you go on Credit Card" },
                { value: "escrow" as const, label: "Prepay on Escrow" },
                { value: "invoice" as const, label: "Invoice the Customer" },
              ] as const
            ).map((opt) => (
              <label key={opt.value} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: textColor, cursor: "pointer" }}>
                <input
                  type="radio"
                  name="paymentOption"
                  checked={form.paymentOption === opt.value}
                  onChange={() => update("paymentOption", opt.value)}
                  style={{ accentColor: primaryColor }}
                />
                {opt.label}
              </label>
            ))}
          </div>

          <div>
            <label style={{ ...labelStyle, fontWeight: 600, color: textColor, marginBottom: "10px" }}>Acceptable Credit Cards</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
              {(
                [
                  { key: "amex" as const, label: "American Express" },
                  { key: "discover" as const, label: "Discover" },
                  { key: "mastercard" as const, label: "Mastercard" },
                  { key: "visa" as const, label: "Visa" },
                ] as const
              ).map(({ key, label }) => (
                <label key={key} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: textColor, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={form[key]}
                    onChange={(e) => update(key, e.target.checked)}
                    style={{ accentColor: primaryColor }}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label style={labelStyle}>Confirmation Text (Pay as You Go)</label>
            <textarea
              value={form.confirmationPayAsYouGo}
              onChange={(e) => update("confirmationPayAsYouGo", e.target.value)}
              rows={4}
              style={{ ...inputStyle, height: "auto", padding: "10px", resize: "vertical" }}
            />
          </div>

          <div>
            <label style={labelStyle}>Confirmation Text (Escrow)</label>
            <textarea
              value={form.confirmationEscrow}
              onChange={(e) => update("confirmationEscrow", e.target.value)}
              rows={4}
              style={{ ...inputStyle, height: "auto", padding: "10px", resize: "vertical" }}
            />
          </div>

          <div>
            <label style={labelStyle}>Confirmation Text (Invoice)</label>
            <textarea
              value={form.confirmationInvoice}
              onChange={(e) => update("confirmationInvoice", e.target.value)}
              rows={4}
              style={{ ...inputStyle, height: "auto", padding: "10px", resize: "vertical" }}
            />
          </div>

          <div style={{ background: sectionBarBg, padding: "10px 14px", borderRadius: "4px" }}>
            <span style={{ fontSize: "13px", fontWeight: 500, color: textColor }}>Terms of Service</span>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: textColor, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={form.hideTermsOnRegistration}
              onChange={(e) => update("hideTermsOnRegistration", e.target.checked)}
              style={{ accentColor: primaryColor }}
            />
            Hide Terms of Service on Registration Page
          </label>
          <div>
            <label style={labelStyle}>Terms and Conditions</label>
            <div
              style={{
                border: `1px solid ${borderColor}`,
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "4px",
                  padding: "6px 8px",
                  borderBottom: `1px solid ${borderColor}`,
                  background: sectionBarBg,
                  fontSize: "12px",
                  color: mutedColor,
                }}
              >
                {["B", "I", "U", "Source"].map((btn) => (
                  <button
                    key={btn}
                    type="button"
                    style={{
                      padding: "2px 8px",
                      border: `1px solid ${borderColor}`,
                      borderRadius: "2px",
                      background: cardBg,
                      fontSize: "11px",
                      cursor: "default",
                      color: textColor,
                    }}
                  >
                    {btn}
                  </button>
                ))}
              </div>
              <textarea
                value={form.termsAndConditions}
                onChange={(e) => update("termsAndConditions", e.target.value)}
                rows={8}
                style={{
                  width: "100%",
                  border: "none",
                  padding: "12px",
                  fontSize: "13px",
                  background: inputBg,
                  color: textColor,
                  resize: "vertical",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "12px", paddingTop: "8px" }}>
            <button
              type="button"
              onClick={onBack}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "10px 24px",
                background: isDarkMode ? "#3A3D44" : "#E5E7EB",
                color: textColor,
                border: "none",
                borderRadius: "4px",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              <ArrowLeft size={16} />
              Go Back
            </button>
            <button
              type="button"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 24px",
                background: primaryColor,
                color: "#FFFFFF",
                border: "none",
                borderRadius: "4px",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              <Save size={16} />
              Save Sign Up Page
            </button>
          </div>
        </div>
      </div>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
