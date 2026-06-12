import { useState } from "react";
import { ChevronDown, CheckCircle2, Eye, Circle } from "lucide-react";
import { Footer } from "../components/Footer";

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida",
  "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine",
  "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska",
  "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota",
  "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

export function ManageAccount() {
  const [activeTab, setActiveTab] = useState<"Details" | "Billing" | "Security">("Details");

  // Form State
  const [companyName, setCompanyName] = useState("Evalright Demo Account");
  const [address1, setAddress1] = useState("3831 McCoy Dr, Suite 101");
  const [address2, setAddress2] = useState("");
  const [state, setState] = useState("Illinois");
  const [country, setCountry] = useState("United States of America");
  const [zipCode, setZipCode] = useState("60504");

  // Password State
  const [existingPassword, setExistingPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showExisting, setShowExisting] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Submission State
  const [showSuccess, setShowSuccess] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 4000);
  };

  return (
    <div
      className="flex-1 flex flex-col min-h-0"
      style={{

        background: "#F6F6F6",
      }}
    >
      <div
        className="flex-1 p-6"
        style={{
          overflowY: "auto",
        }}
      >
        {/* Page Title */}
        <h1
          style={{
            fontSize: "20px",
            fontWeight: 500,
            color: "rgb(199, 0, 57)",
            marginBottom: "20px",
          }}
        >
          Manage Your Account
        </h1>

        {/* Tab Navigation */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #E0E0E0",
            marginBottom: "24px",
          }}
        >
          {[
            { label: "Account Details", id: "Details" },
            { label: "Account Billing", id: "Billing" },
            { label: "Account Security", id: "Security" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  background: "none",
                  border: "none",
                  borderBottom: isActive ? "2px solid rgb(199, 0, 57)" : "2px solid transparent",
                  padding: "8px 16px",
                  fontSize: "13px",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#333333" : "#777777",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  marginBottom: "-1px",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = "rgb(199, 0, 57)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = "#777777";
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Page Content based on Active Tab */}
        {activeTab === "Details" && (
          <div style={{ maxWidth: "1000px" }}>
            {/* Success Alert */}
            {showSuccess && (
              <div
                style={{
                  background: "#E6F4EA",
                  border: "1px solid #CEEAD6",
                  color: "#137333",
                  padding: "10px 16px",
                  borderRadius: "4px",
                  marginBottom: "16px",
                  fontSize: "13px",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  animation: "fadeIn 0.2s ease-out",
                }}
              >
                <CheckCircle2 size={16} />
                Account information updated successfully!
              </div>
            )}

            {/* Account Details Form Card */}
            <form
              onSubmit={handleUpdate}
              style={{
                background: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "4px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              {/* Card Header Section */}
              <h2
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#555555",
                  margin: "0 0 4px 0",
                }}
              >
                Your Account Information
              </h2>

              {/* Form Grid Layout */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "16px",
                }}
              >
                {/* Company Name Field */}
                <div style={inputContainerStyle}>
                  <label style={labelStyle}>Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                {/* Address 1 Field */}
                <div style={inputContainerStyle}>
                  <label style={labelStyle}>Address 1</label>
                  <input
                    type="text"
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                {/* Address 2 Field */}
                <div style={inputContainerStyle}>
                  <label style={labelStyle}>Address 2</label>
                  <input
                    type="text"
                    value={address2}
                    onChange={(e) => setAddress2(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                {/* State Select Field */}
                <div style={inputContainerStyle}>
                  <label style={labelStyle}>State</label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      style={{
                        ...inputStyle,
                        appearance: "none",
                        paddingRight: "24px",
                        cursor: "pointer",
                      }}
                    >
                      {US_STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      style={{
                        position: "absolute",
                        right: "0px",
                        color: "#777777",
                        pointerEvents: "none",
                      }}
                    />
                  </div>
                </div>

                {/* Country Select Field */}
                <div style={inputContainerStyle}>
                  <label style={labelStyle}>Country</label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      style={{
                        ...inputStyle,
                        appearance: "none",
                        paddingRight: "24px",
                        cursor: "pointer",
                      }}
                    >
                      <option value="United States of America">United States of America</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                    </select>
                    <ChevronDown
                      size={14}
                      style={{
                        position: "absolute",
                        right: "0px",
                        color: "#777777",
                        pointerEvents: "none",
                      }}
                    />
                  </div>
                </div>

                {/* Zip Code Field */}
                <div style={inputContainerStyle}>
                  <label style={labelStyle}>Zip Code</label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                style={{
                  background: "rgb(199, 0, 57)",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "3px",
                  padding: "8px 20px",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  marginTop: "8px",
                  width: "max-content",
                  transition: "background 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#A0002C")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgb(199, 0, 57)")}
              >
                Update Account Information
              </button>
            </form>
          </div>
        )}

        {/* Account Billing Placeholder Tab */}
        {activeTab === "Billing" && (
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "4px",
              padding: "24px",
              color: "#555555",
              fontSize: "13px",
            }}
          >
            Billing information is currently not configured for this account.
          </div>
        )}

        {/* Account Security Tab */}
        {activeTab === "Security" && (
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "4px",
              padding: "24px",
            }}
          >
            <h3 style={{ fontSize: "14px", fontWeight: 500, color: "#555555", margin: "0 0 4px 0" }}>
              Change Login Password
            </h3>
            <p style={{ fontSize: "12px", color: "#777777", margin: "0 0 24px 0" }}>
              Login password is used to log in to your account.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "480px" }}>
              {/* Existing Password */}
              <div style={inputContainerStyle}>
                <label style={{ ...labelStyle, display: existingPassword ? "block" : "none" }}>Existing Password</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center", width: "100%" }}>
                  <input
                    type={showExisting ? "text" : "password"}
                    placeholder={existingPassword ? "" : "Existing Password"}
                    value={existingPassword}
                    onChange={(e) => setExistingPassword(e.target.value)}
                    style={{ ...inputStyle, width: "100%", paddingRight: "30px" }}
                  />
                  <button
                    onClick={() => setShowExisting(!showExisting)}
                    style={{ position: "absolute", right: 0, background: "none", border: "none", cursor: "pointer", color: "#777777", padding: 0, display: "flex" }}
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div style={inputContainerStyle}>
                <label style={{ ...labelStyle, display: newPassword ? "block" : "none" }}>New Password</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center", width: "100%" }}>
                  <input
                    type={showNew ? "text" : "password"}
                    placeholder={newPassword ? "" : "New Password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{ ...inputStyle, width: "100%", paddingRight: "30px" }}
                  />
                  <button
                    onClick={() => setShowNew(!showNew)}
                    style={{ position: "absolute", right: 0, background: "none", border: "none", cursor: "pointer", color: "#777777", padding: 0, display: "flex" }}
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </div>

              {/* Password Rules */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#777777", fontSize: "12px" }}>
                  <Circle size={12} strokeWidth={2} /> <span>At least 8 characters</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#777777", fontSize: "12px" }}>
                  <Circle size={12} strokeWidth={2} /> <span>At least 1 number</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#777777", fontSize: "12px" }}>
                  <Circle size={12} strokeWidth={2} /> <span>At least 1 upper case letter</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#777777", fontSize: "12px" }}>
                  <Circle size={12} strokeWidth={2} /> <span>At least 1 special character</span>
                </div>
              </div>

              {/* Confirm New Password */}
              <div style={inputContainerStyle}>
                <label style={{ ...labelStyle, display: confirmPassword ? "block" : "none" }}>Confirm New Password</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center", width: "100%" }}>
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder={confirmPassword ? "" : "Confirm New Password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{ ...inputStyle, width: "100%", paddingRight: "30px" }}
                  />
                  <button
                    onClick={() => setShowConfirm(!showConfirm)}
                    style={{ position: "absolute", right: 0, background: "none", border: "none", cursor: "pointer", color: "#777777", padding: 0, display: "flex" }}
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </div>

              {/* Update Password Button */}
              <button
                style={{
                  background: "rgb(199, 0, 57)",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "3px",
                  padding: "10px 24px",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  width: "max-content",
                  marginTop: "4px",
                  transition: "background 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#A0002C")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgb(199, 0, 57)")}
              >
                Update Password
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />

      {/* CSS Fade-in Animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// Custom Outlined Stacked Label Input Styles
const inputContainerStyle: React.CSSProperties = {
  border: "1px solid rgb(229, 231, 235)",
  borderRadius: "3px",
  padding: "6px 12px",
  background: "#FFFFFF",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  minHeight: "46px",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  fontSize: "9px",
  color: "#777777",
  marginBottom: "1px",

  textTransform: "capitalize",
  userSelect: "none",
};

const inputStyle: React.CSSProperties = {
  border: "none",
  outline: "none",
  fontSize: "12px",
  color: "#555555",
  background: "transparent",
  width: "100%",
  padding: "0",
  margin: "0",
  height: "18px",

};
