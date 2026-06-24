import { useState } from "react";
import { Save, ArrowLeft, X } from "lucide-react";
import { Footer } from "../components/Footer";
import { SALES_MANAGER_OPTIONS } from "../data/mockData";

interface AddSalesOperatorPageProps {
  isDarkMode?: boolean;
  onBack: () => void;
}

export function AddSalesOperatorPage({ isDarkMode = false, onBack }: AddSalesOperatorPageProps) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    salesCommission: "",
    managerCommission: "",
    salesManager: "None",
    username: "",
    password: "",
    confirmPassword: "",
    enableClientArea: false,
  });

  const primaryColor = isDarkMode ? "#DF2A57" : "#C70039";
  const cancelColor = isDarkMode ? "#4B5563" : "#2C3E6B";
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

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: contentBg }}>
      <div style={{ flex: 1, padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 600, color: primaryColor, margin: 0 }}>Manage Sales Operators</h1>

        <div
          style={{
            background: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: "6px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <h2 style={{ margin: 0, fontSize: "14px", fontWeight: 500, color: textColor }}>Add New Sales Operator</h2>
            <button
              type="button"
              onClick={onBack}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                background: primaryColor,
                color: "#FFFFFF",
                border: "none",
                borderRadius: "4px",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              <ArrowLeft size={16} />
              Back to List
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px 20px" }}>
            <div>
              <label style={labelStyle}>First Name</label>
              <input style={inputStyle} value={form.firstName} onChange={(e) => update("firstName", e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Last Name</label>
              <input style={inputStyle} value={form.lastName} onChange={(e) => update("lastName", e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input style={inputStyle} value={form.email} onChange={(e) => update("email", e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Sales Commission (%)</label>
              <input
                style={inputStyle}
                value={form.salesCommission}
                onChange={(e) => update("salesCommission", e.target.value)}
              />
            </div>
            <div>
              <label style={labelStyle}>Manager Commission (%)</label>
              <input
                type="number"
                style={inputStyle}
                value={form.managerCommission}
                onChange={(e) => update("managerCommission", e.target.value)}
              />
            </div>
            <div>
              <label style={labelStyle}>Sales Manager</label>
              <select
                style={inputStyle}
                value={form.salesManager}
                onChange={(e) => update("salesManager", e.target.value)}
              >
                {SALES_MANAGER_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Username</label>
              <input style={inputStyle} value={form.username} onChange={(e) => update("username", e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                style={inputStyle}
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
              />
            </div>
            <div>
              <label style={labelStyle}>Confirm Password</label>
              <input
                type="password"
                style={inputStyle}
                value={form.confirmPassword}
                onChange={(e) => update("confirmPassword", e.target.value)}
              />
            </div>
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: textColor, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={form.enableClientArea}
              onChange={(e) => update("enableClientArea", e.target.checked)}
              style={{ accentColor: primaryColor }}
            />
            Enable Client Area
          </label>

          <div style={{ display: "flex", justifyContent: "center", gap: "12px", paddingTop: "8px" }}>
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
              Add New User
            </button>
            <button
              type="button"
              onClick={onBack}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 24px",
                background: cancelColor,
                color: "#FFFFFF",
                border: "none",
                borderRadius: "4px",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        </div>
      </div>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
