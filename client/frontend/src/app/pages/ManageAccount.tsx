import { useState } from "react";
import { ChevronDown, CheckCircle2, Eye, Circle, Check, X, CircleAlert } from "lucide-react";
import { Footer } from "../components/Footer";

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida",
  "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine",
  "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska",
  "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota",
  "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

type ValidationState = "error" | "success" | "neutral";
type PasswordFieldKey = "existing" | "new" | "confirm";

const ERROR_COLOR = "rgb(199, 0, 57)";
const SUCCESS_COLOR = "#79B249";

const PASSWORD_RULES = [
  { id: "length", label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { id: "number", label: "At least 1 number", test: (p: string) => /\d/.test(p) },
  { id: "upper", label: "At least 1 upper case letter", test: (p: string) => /[A-Z]/.test(p) },
  { id: "special", label: "At least 1 special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
] as const;

const isStrongPassword = (password: string) => PASSWORD_RULES.every((rule) => rule.test(password));

const getPasswordFieldValidation = (
  field: PasswordFieldKey,
  existingPassword: string,
  newPassword: string,
  confirmPassword: string,
  hasSubmitted: boolean
): ValidationState => {
  if (!hasSubmitted) return "neutral";

  const hasExisting = existingPassword.trim() !== "";
  const hasNew = newPassword.trim() !== "";
  const isNewStrong = isStrongPassword(newPassword);
  const hasConfirm = confirmPassword.trim() !== "";
  const passwordsMatch = newPassword === confirmPassword;

  if (field === "existing") {
    return hasExisting ? "success" : "error";
  }

  if (!hasExisting) return "neutral";

  if (field === "new") {
    if (!hasNew || !isNewStrong) return "error";
    return "success";
  }

  if (!hasNew || !isNewStrong) return "neutral";

  if (!hasConfirm || !passwordsMatch) return "error";
  return "success";
};

export function ManageAccount({ isDarkMode = false }: { isDarkMode?: boolean }) {
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

  const [city, setCity] = useState("Aurora");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Submission State
  const [showSuccess, setShowSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [errorToast, setErrorToast] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [passwordSubmitted, setPasswordSubmitted] = useState(false);

  const showErrorToast = (message: string) => {
    setErrorToast(message);
    setTimeout(() => setErrorToast(""), 5000);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    
    if (!phoneNumber) {
      showErrorToast("You did not enter your Phone Number");
      return;
    }
    
    setErrorToast("");
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 4000);
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSubmitted(true);
    setPasswordSuccess(false);

    if (!existingPassword.trim()) {
      showErrorToast("Please enter your existing password.");
      return;
    }

    if (!newPassword.trim()) {
      showErrorToast("Please enter a new password.");
      return;
    }

    if (!isStrongPassword(newPassword)) {
      showErrorToast("Please enter a stronger password.");
      return;
    }

    if (!confirmPassword.trim()) {
      showErrorToast("Please confirm your new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      showErrorToast("Passwords do not match.");
      return;
    }

    setErrorToast("");
    setPasswordSuccess(true);
    setPasswordSubmitted(false);
    setExistingPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordSuccess(false), 4000);
  };

  return (
    <div
      className="flex-1 flex flex-col min-h-0"
      style={{

        background: isDarkMode ? "#252830" : "#F6F6F6",
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
            color: isDarkMode ? "#DF2A57" : "rgb(199, 0, 57)",
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
                  color: isActive ? (isDarkMode ? "#E5E7EB" : "#333333") : (isDarkMode ? "#9CA3AF" : "#777777"),
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  marginBottom: "-1px",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = "rgb(199, 0, 57)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = isDarkMode ? "#9CA3AF" : "#777777";
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Page Content based on Active Tab */}
        
        {/* Error Toast */}
        {errorToast && (
          <div
            style={{
              position: "fixed",
              top: "24px",
              right: "24px",
              background: "#EF4444",
              color: "#FFFFFF",
              padding: "16px 24px",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontSize: "14px",
              fontWeight: 500,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              zIndex: 9999,
              animation: "fadeIn 0.3s ease-out",
            }}
          >
            {errorToast}
            <button
              onClick={() => setErrorToast("")}
              style={{
                background: "transparent",
                border: "none",
                color: "#FFFFFF",
                cursor: "pointer",
                display: "flex",
                padding: 0,
                opacity: 0.8,
              }}
            >
              <X size={16} />
            </button>
          </div>
        )}

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
                background: isDarkMode ? "#1A1C21" : "#FFFFFF",
                border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
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
                  color: isDarkMode ? "#E5E7EB" : "#555555",
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
                <div style={getInputContainerStyle(isDarkMode, hasSubmitted && !!companyName)}>
                  <div style={{ flex: 1 }}>
                    <label style={{...getLabelStyle(isDarkMode), display: companyName ? "block" : "none"}}>Company Name</label>
                    <input
                      type="text"
                      placeholder={companyName ? "" : "Company Name"}
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      style={getInputStyle(isDarkMode)}
                    />
                  </div>
                  {hasSubmitted && companyName && <Check style={{ color: "#79B249" }} size={20} strokeWidth={3} />}
                </div>

                {/* Address 1 Field */}
                <div style={getInputContainerStyle(isDarkMode, hasSubmitted && !!address1)}>
                  <div style={{ flex: 1 }}>
                    <label style={{...getLabelStyle(isDarkMode), display: address1 ? "block" : "none"}}>Address 1</label>
                    <input
                      type="text"
                      placeholder={address1 ? "" : "Address 1"}
                      value={address1}
                      onChange={(e) => setAddress1(e.target.value)}
                      style={getInputStyle(isDarkMode)}
                    />
                  </div>
                  {hasSubmitted && address1 && <Check style={{ color: "#79B249" }} size={20} strokeWidth={3} />}
                </div>

                {/* Address 2 Field */}
                <div style={getInputContainerStyle(isDarkMode, hasSubmitted && !!address2)}>
                  <div style={{ flex: 1 }}>
                    <label style={{...getLabelStyle(isDarkMode), display: address2 ? "block" : "none"}}>Address 2</label>
                    <input
                      type="text"
                      placeholder={address2 ? "" : "Address 2"}
                      value={address2}
                      onChange={(e) => setAddress2(e.target.value)}
                      style={getInputStyle(isDarkMode)}
                    />
                  </div>
                  {hasSubmitted && address2 && <Check style={{ color: "#79B249" }} size={20} strokeWidth={3} />}
                </div>

                {/* City Field */}
                <div style={getInputContainerStyle(isDarkMode, hasSubmitted && !!city)}>
                  <div style={{ flex: 1 }}>
                    <label style={{...getLabelStyle(isDarkMode), display: city ? "block" : "none"}}>City</label>
                    <input
                      type="text"
                      placeholder={city ? "" : "City"}
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      style={getInputStyle(isDarkMode)}
                    />
                  </div>
                  {hasSubmitted && city && <Check style={{ color: "#79B249" }} size={20} strokeWidth={3} />}
                </div>

                {/* State Select Field */}
                <div style={getInputContainerStyle(isDarkMode, hasSubmitted && !!state)}>
                  <div style={{ flex: 1, position: "relative" }}>
                    <label style={{...getLabelStyle(isDarkMode), display: state ? "block" : "none"}}>State</label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      style={{
                        ...getInputStyle(isDarkMode),
                        appearance: "none",
                        cursor: "pointer",
                        width: "100%",
                      }}
                    >
                      <option value="" disabled>Select State</option>
                      {US_STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {hasSubmitted && state && <Check style={{ color: "#79B249" }} size={20} strokeWidth={3} />}
                    <ChevronDown size={14} style={{ color: "#D1D5DB", pointerEvents: "none" }} />
                  </div>
                </div>

                {/* Country Select Field */}
                <div style={getInputContainerStyle(isDarkMode, hasSubmitted && !!country)}>
                  <div style={{ flex: 1, position: "relative" }}>
                    <label style={{...getLabelStyle(isDarkMode), display: country ? "block" : "none"}}>Country</label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      style={{
                        ...getInputStyle(isDarkMode),
                        appearance: "none",
                        cursor: "pointer",
                        width: "100%",
                      }}
                    >
                      <option value="" disabled>Select Country</option>
                      <option value="United States of America">United States of America</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {hasSubmitted && country && <Check style={{ color: "#79B249" }} size={20} strokeWidth={3} />}
                    <ChevronDown size={14} style={{ color: "#D1D5DB", pointerEvents: "none" }} />
                  </div>
                </div>

                {/* Zip Code Field */}
                <div style={getInputContainerStyle(isDarkMode, hasSubmitted && !!zipCode)}>
                  <div style={{ flex: 1 }}>
                    <label style={{...getLabelStyle(isDarkMode), display: zipCode ? "block" : "none"}}>Zip Code</label>
                    <input
                      type="text"
                      placeholder={zipCode ? "" : "Zip Code"}
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      style={getInputStyle(isDarkMode)}
                    />
                  </div>
                  {hasSubmitted && zipCode && <Check style={{ color: "#79B249" }} size={20} strokeWidth={3} />}
                </div>

                {/* Phone Number Field */}
                <div style={getInputContainerStyle(isDarkMode, hasSubmitted && !!phoneNumber)}>
                  <div style={{ flex: 1 }}>
                    <label style={{...getLabelStyle(isDarkMode), display: phoneNumber ? "block" : "none"}}>Phone Number</label>
                    <input
                      type="text"
                      placeholder={phoneNumber ? "" : "Phone Number"}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      style={getInputStyle(isDarkMode)}
                    />
                  </div>
                  {hasSubmitted && phoneNumber && <Check style={{ color: "#79B249" }} size={20} strokeWidth={3} />}
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
              background: isDarkMode ? "#1A1C21" : "#FFFFFF",
              border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
              borderRadius: "4px",
              padding: "24px",
            }}
          >
            <h3 style={{ fontSize: "15px", fontWeight: 500, margin: "0 0 12px 0", color: isDarkMode ? "#E5E7EB" : "#333333" }}>
              Your Billing Information
            </h3>
            <p style={{ fontSize: "14px", color: isDarkMode ? "#9CA3AF" : "#9CA3AF", margin: "0 0 24px 0" }}>
              No Credit Card on Account!
            </p>
            <button
              style={{
                background: "rgb(199, 0, 57)",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "3px",
                padding: "8px 24px",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#A0002C")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgb(199, 0, 57)")}
            >
              Update Card
            </button>
          </div>
        )}

        {/* Account Security Tab */}
        {activeTab === "Security" && (
          <div
            style={{
              background: isDarkMode ? "#1A1C21" : "#FFFFFF",
              border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
              borderRadius: "4px",
              padding: "24px",
            }}
          >
            {passwordSuccess && (
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
                Password updated successfully!
              </div>
            )}

            <h3 style={{ fontSize: "14px", fontWeight: 500, color: isDarkMode ? "#E5E7EB" : "#555555", margin: "0 0 4px 0" }}>
              Change Login Password
            </h3>
            <p style={{ fontSize: "12px", color: isDarkMode ? "#9CA3AF" : "#777777", margin: "0 0 24px 0" }}>
              Login password is used to log in to your account.
            </p>

            <form onSubmit={handlePasswordUpdate} style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "480px" }}>
              <PasswordField
                label="Existing Password"
                value={existingPassword}
                onChange={setExistingPassword}
                showPassword={showExisting}
                onToggleShow={() => setShowExisting(!showExisting)}
                isDarkMode={isDarkMode}
                validationState={getPasswordFieldValidation("existing", existingPassword, newPassword, confirmPassword, passwordSubmitted)}
              />

              <PasswordField
                label="New Password"
                value={newPassword}
                onChange={setNewPassword}
                showPassword={showNew}
                onToggleShow={() => setShowNew(!showNew)}
                isDarkMode={isDarkMode}
                validationState={getPasswordFieldValidation("new", existingPassword, newPassword, confirmPassword, passwordSubmitted)}
              />

              {/* Password Rules */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginLeft: "2px" }}>
                {PASSWORD_RULES.map((rule) => {
                  const met = rule.test(newPassword);
                  const showUnmet = passwordSubmitted && newPassword.trim() && !met;
                  return (
                    <div
                      key={rule.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        color: showUnmet ? ERROR_COLOR : met ? SUCCESS_COLOR : isDarkMode ? "#9CA3AF" : "#777777",
                        fontSize: "14px",
                      }}
                    >
                      {met ? <Check size={14} strokeWidth={3} /> : <Circle size={14} strokeWidth={2} />}
                      <span>{rule.label}</span>
                    </div>
                  );
                })}
              </div>

              <PasswordField
                label="Confirm New Password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                showPassword={showConfirm}
                onToggleShow={() => setShowConfirm(!showConfirm)}
                isDarkMode={isDarkMode}
                validationState={getPasswordFieldValidation("confirm", existingPassword, newPassword, confirmPassword, passwordSubmitted)}
              />

              <button
                type="submit"
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
            </form>
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
const getInputContainerStyle = (isDarkMode: boolean, hasValue: boolean = false, isSecurityTab: boolean = false): React.CSSProperties => ({
  border: hasValue ? "1px solid #79B249" : (isDarkMode ? "1px solid #333333" : "1px solid rgb(229, 231, 235)"),
  borderRadius: "3px",
  padding: "6px 12px",
  background: isSecurityTab ? (isDarkMode ? "#2A2D34" : "#FAFAFA") : (isDarkMode ? "#252830" : "#FFFFFF"),
  display: "flex",
  alignItems: "center",
  minHeight: "56px",
  boxSizing: "border-box",
});

const getLabelStyle = (isDarkMode: boolean): React.CSSProperties => ({
  fontSize: "9px",
  color: isDarkMode ? "#9CA3AF" : "#777777",
  marginBottom: "1px",

  textTransform: "capitalize",
  userSelect: "none",
});

const getInputStyle = (isDarkMode: boolean): React.CSSProperties => ({
  border: "none",
  outline: "none",
  fontSize: "12px",
  color: isDarkMode ? "#E5E7EB" : "#555555",
  background: "transparent",
  width: "100%",
  padding: "0",
  margin: "0",
  height: "18px",

});

function PasswordField({
  label,
  value,
  onChange,
  showPassword,
  onToggleShow,
  isDarkMode,
  validationState = "neutral",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  showPassword: boolean;
  onToggleShow: () => void;
  isDarkMode: boolean;
  validationState?: ValidationState;
}) {
  const borderColor =
    validationState === "error"
      ? ERROR_COLOR
      : validationState === "success"
        ? SUCCESS_COLOR
        : isDarkMode
          ? "#333333"
          : "rgb(229, 231, 235)";

  return (
    <div
      style={{
        border: `1px solid ${borderColor}`,
        borderRadius: "3px",
        padding: "6px 12px",
        background: isDarkMode ? "#2A2D34" : "#FAFAFA",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        minHeight: "56px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ flex: 1 }}>
        <label style={{ ...getLabelStyle(isDarkMode), display: value ? "block" : "none" }}>{label}</label>
        <input
          type={showPassword ? "text" : "password"}
          placeholder={value ? "" : label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...getInputStyle(isDarkMode), width: "100%" }}
        />
      </div>
      {validationState === "error" && (
        <CircleAlert size={18} color={ERROR_COLOR} fill={ERROR_COLOR} stroke="#FFFFFF" strokeWidth={2} />
      )}
      {validationState === "success" && <Check size={20} color={SUCCESS_COLOR} strokeWidth={3} />}
      <button
        type="button"
        onClick={onToggleShow}
        style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: "0 4px", display: "flex", alignItems: "center" }}
      >
        <Eye size={16} />
      </button>
    </div>
  );
}
