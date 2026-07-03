import { useState } from "react";
import { Save } from "lucide-react";
import { Footer } from "../components/Footer";
import { US_STATES } from "../data/mockData";

interface AccountSettingsPageProps {
  isDarkMode?: boolean;
}

export function AccountSettingsPage({ isDarkMode = false }: AccountSettingsPageProps) {
  const [form, setForm] = useState({
    companyName: "EvalRight",
    address1: "3831 McCoy Dr, Suite 101",
    address2: "",
    city: "Aurora",
    state: "Illinois",
    zipCode: "60504",
    phoneNumber: "1-800-935-9025",
    emailSignature:
      "EvalRight\n3831 McCoy Dr, Suite 101\nAurora, IL 60504\nPhone: 1-800-935-9025\nwww.evalright.com",
    invoiceFooter: "",
    ownerEmail: "raghu@evalright.us",
    systemUrl: "https://clients.evalright.com",
    logoType: "regular" as "regular" | "mini",
    mainColor: "#B7042C",
    secondaryColor: "#3B1D7D",
    buttonColor: "#000000",
    headerColor: "#3B1D7D",
  });

  const primaryColor = isDarkMode ? "#DF2A57" : "#C70039";
  const cardBg = isDarkMode ? "#252830" : "#FFFFFF";
  const borderColor = isDarkMode ? "#333333" : "#E5E7EB";
  const textColor = isDarkMode ? "#E5E7EB" : "#333333";
  const mutedColor = isDarkMode ? "#9CA3AF" : "#666666";
  const inputBg = isDarkMode ? "#1A1C21" : "#FFFFFF";
  const contentBg = isDarkMode ? "#1A1C21" : "#F4F5F7";

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

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

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: contentBg }}>
      <div style={{ flex: 1, padding: "24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "20px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 600, color: primaryColor, margin: 0 }}>Account Settings</h1>

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
          <div>
            <h2 style={{ margin: "0 0 16px 0", fontSize: "15px", fontWeight: 600, color: textColor }}>
              Company Information
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px 20px" }}>
              <div>
                <label style={labelStyle}>Company Name</label>
                <input style={inputStyle} value={form.companyName} onChange={(e) => update("companyName", e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Address 1</label>
                <input style={inputStyle} value={form.address1} onChange={(e) => update("address1", e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Address 2</label>
                <input style={inputStyle} value={form.address2} onChange={(e) => update("address2", e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>City</label>
                <input style={inputStyle} value={form.city} onChange={(e) => update("city", e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>State</label>
                <select style={inputStyle} value={form.state} onChange={(e) => update("state", e.target.value)}>
                  {US_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Zip Code</label>
                <input style={inputStyle} value={form.zipCode} onChange={(e) => update("zipCode", e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Phone Number</label>
                <input style={inputStyle} value={form.phoneNumber} onChange={(e) => update("phoneNumber", e.target.value)} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "16px" }}>
              <div>
                <label style={labelStyle}>Email Signature</label>
                <textarea
                  value={form.emailSignature}
                  onChange={(e) => update("emailSignature", e.target.value)}
                  rows={5}
                  style={{ ...inputStyle, height: "auto", padding: "10px", resize: "vertical" }}
                />
              </div>
              <div>
                <label style={labelStyle}>Invoice Footer</label>
                <textarea
                  value={form.invoiceFooter}
                  onChange={(e) => update("invoiceFooter", e.target.value)}
                  rows={5}
                  style={{ ...inputStyle, height: "auto", padding: "10px", resize: "vertical" }}
                />
              </div>
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${borderColor}`, paddingTop: "20px" }}>
            <h2 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: 600, color: textColor }}>
              Owner Email - for invoices, support ticket notifications, etc.
            </h2>
            <div style={{ maxWidth: "480px", marginTop: "12px" }}>
              <label style={labelStyle}>Owner Email</label>
              <input style={inputStyle} value={form.ownerEmail} onChange={(e) => update("ownerEmail", e.target.value)} />
              <p style={{ margin: "6px 0 0 0", fontSize: "12px", color: mutedColor }}>
                Separate multiple emails with a comma
              </p>
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${borderColor}`, paddingTop: "20px" }}>
            <p style={{ margin: "0 0 12px 0", fontSize: "13px", color: primaryColor, fontWeight: 500 }}>
              Please consult Brango before making any changes below!
            </p>
            <div style={{ maxWidth: "520px" }}>
              <label style={labelStyle}>System URL (e.g., https://clients.yourdomain.com)</label>
              <input style={inputStyle} value={form.systemUrl} onChange={(e) => update("systemUrl", e.target.value)} />
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${borderColor}`, paddingTop: "20px" }}>
            <h2 style={{ margin: "0 0 16px 0", fontSize: "15px", fontWeight: 600, color: textColor }}>Company Logo</h2>
            <div style={{ display: "flex", gap: "20px", marginBottom: "12px" }}>
              {(
                [
                  { value: "regular" as const, label: "Regular Logo" },
                  { value: "mini" as const, label: "Mini Logo" },
                ] as const
              ).map((opt) => (
                <label key={opt.value} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: textColor, cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="logoType"
                    checked={form.logoType === opt.value}
                    onChange={() => update("logoType", opt.value)}
                    style={{ accentColor: primaryColor }}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", maxWidth: "400px", marginBottom: "8px" }}>
              <input type="text" readOnly style={{ ...inputStyle, flex: 1 }} placeholder="" />
              <button
                style={{
                  padding: "8px 16px",
                  background: primaryColor,
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "13px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Browse...
              </button>
            </div>
            <p style={{ margin: "0 0 16px 0", fontSize: "12px", color: mutedColor }}>Allowed: .jpg, .jpeg, .png</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", maxWidth: "600px" }}>
              <div>
                <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: mutedColor }}>Regular Logo Preview:</p>
                <div
                  style={{
                    border: `1px solid ${borderColor}`,
                    borderRadius: "4px",
                    padding: "16px",
                    minHeight: "60px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: "22px", fontWeight: 700, color: primaryColor }}>ER EvalRight</span>
                </div>
              </div>
              <div>
                <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: mutedColor }}>Mini Logo Preview:</p>
                <div
                  style={{
                    border: `1px solid ${borderColor}`,
                    borderRadius: "4px",
                    padding: "16px",
                    minHeight: "60px",
                    display: "flex",
                    alignItems: "center",
                    background: isDarkMode ? "#1A1C21" : "#F9F9F9",
                  }}
                >
                  <span style={{ fontSize: "18px", fontWeight: 700, color: isDarkMode ? "#555" : "#CCCCCC" }}>ER</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${borderColor}`, paddingTop: "20px" }}>
            <h2 style={{ margin: "0 0 16px 0", fontSize: "15px", fontWeight: 600, color: textColor }}>
              Customize &quot;Look &amp; Feel&quot; of the portal
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
              {(
                [
                  { key: "mainColor" as const, label: "Main Color" },
                  { key: "secondaryColor" as const, label: "Secondary Color" },
                  { key: "buttonColor" as const, label: "Button Color" },
                  { key: "headerColor" as const, label: "Header Color" },
                ] as const
              ).map(({ key, label }) => (
                <div key={key}>
                  <label style={labelStyle}>{label}</label>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <input
                      style={{ ...inputStyle, flex: 1 }}
                      value={form[key]}
                      onChange={(e) => update(key, e.target.value)}
                    />
                    <input
                      type="color"
                      value={form[key]}
                      onChange={(e) => update(key, e.target.value)}
                      style={{ width: "36px", height: "36px", padding: 0, border: `1px solid ${borderColor}`, cursor: "pointer" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "12px", paddingTop: "8px" }}>
            <button
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
              Save Changes
            </button>
            <button
              style={{
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
              Cancel Changes
            </button>
          </div>
        </div>
      </div>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
