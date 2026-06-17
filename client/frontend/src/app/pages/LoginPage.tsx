import { useState } from "react";
import { Eye, LogIn } from "lucide-react";

const LOGO_SRC = "/evalright-logo.jpg";
const CARD_WIDTH = "430px";

interface LoginPageProps {
  showLogoutBanner?: boolean;
  onLogin: () => void;
}

function LoginField({
  label,
  value,
  onChange,
  type = "text",
  eyeToggle,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  eyeToggle?: { show: boolean; onToggle: () => void };
}) {
  const hasValue = value.length > 0;

  const fieldContent = (
    <div
      style={{
        flex: 1,
        background: "#F0F4F8",
        padding: "10px 14px",
        minHeight: "56px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        boxSizing: "border-box",
      }}
    >
      {hasValue && (
        <label
          style={{
            fontSize: "11px",
            color: "#9CA3AF",
            marginBottom: "2px",
            lineHeight: 1.2,
          }}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={hasValue ? "" : label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          border: "none",
          outline: "none",
          background: "transparent",
          fontSize: "14px",
          color: "#1F2937",
          padding: 0,
          width: "100%",
          fontFamily: "inherit",
        }}
      />
    </div>
  );

  if (eyeToggle) {
    return (
      <div
        style={{
          display: "flex",
          border: "1px solid #E5E7EB",
          borderRadius: "4px",
          overflow: "hidden",
          width: "100%",
        }}
      >
        {fieldContent}
        <button
          type="button"
          onClick={eyeToggle.onToggle}
          aria-label={eyeToggle.show ? "Hide password" : "Show password"}
          style={{
            width: "48px",
            background: "#FFFFFF",
            border: "none",
            borderLeft: "1px solid #E5E7EB",
            cursor: "pointer",
            color: "#9CA3AF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Eye size={18} />
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        border: "1px solid #E5E7EB",
        borderRadius: "4px",
        overflow: "hidden",
        width: "100%",
      }}
    >
      {fieldContent}
    </div>
  );
}

export function LoginPage({ showLogoutBanner = false, onLogin }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onLogin();
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 20px",
        background: "#ECECEC",
        fontFamily: "'Wix Madefor Display', sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: CARD_WIDTH,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: "36px", textAlign: "center" }}>
          <img
            src={LOGO_SRC}
            alt="EvalRight — Screen before Hire"
            style={{ height: "88px", width: "auto", maxWidth: "100%", objectFit: "contain" }}
          />
        </div>

        {/* Login Card */}
        <div
          style={{
            width: "100%",
            background: "#FFFFFF",
            borderRadius: "6px",
            borderTop: "4px solid #C70039",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            overflow: "hidden",
          }}
        >
          {showLogoutBanner && (
            <div
              style={{
                background: "#D4EDDA",
                color: "#155724",
                padding: "12px 16px",
                fontSize: "14px",
                fontWeight: 500,
                textAlign: "center",
              }}
            >
              You have been logged out.
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ padding: "28px 32px 32px" }}>
            <h1
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: "#6B7280",
                margin: "0 0 6px 0",
              }}
            >
              Welcome Back !
            </h1>
            <p
              style={{
                fontSize: "13px",
                color: "#9CA3AF",
                margin: "0 0 24px 0",
                lineHeight: 1.5,
              }}
            >
              Enter your username and password to access account.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <LoginField label="Username" value={username} onChange={setUsername} />
              <LoginField
                label="Password"
                value={password}
                onChange={setPassword}
                type={showPassword ? "text" : "password"}
                eyeToggle={{
                  show: showPassword,
                  onToggle: () => setShowPassword(!showPassword),
                }}
              />
            </div>

            <div style={{ textAlign: "right", marginTop: "10px", marginBottom: "22px" }}>
              <button
                type="button"
                style={{
                  background: "none",
                  border: "none",
                  color: "#9CA3AF",
                  fontSize: "12px",
                  cursor: "pointer",
                  padding: 0,
                  fontFamily: "inherit",
                }}
              >
                Forgot your password?
              </button>
            </div>

            <button type="submit" style={loginButtonStyle}>
              Log In
              <LogIn size={17} strokeWidth={2.25} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const loginButtonStyle: React.CSSProperties = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  background: "#C70039",
  color: "#FFFFFF",
  border: "none",
  borderRadius: "4px",
  padding: "13px 20px",
  fontSize: "14px",
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "inherit",
};
