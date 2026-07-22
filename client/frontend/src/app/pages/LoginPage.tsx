import { useState, useEffect, useRef } from "react";
import { Eye, LogIn, ArrowLeft, ShieldCheck, RefreshCw } from "lucide-react";

const LOGO_SRC = "/evalright-logo.jpg";
const CARD_WIDTH = "430px";

export interface UserDetails {
  id: string;
  company_id: string;
  branch_id: string | null;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

interface LoginPageProps {
  showLogoutBanner?: boolean;
  onLogin: (user: UserDetails) => void;
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // OTP Verification State
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const maskEmail = (emailStr: string | null) => {
    if (!emailStr) return "";
    const parts = emailStr.split("@");
    if (parts.length !== 2) return emailStr;
    const [local, domain] = parts;
    if (local.length <= 2) {
      return `${local[0]}***@${domain}`;
    }
    return `${local[0]}${"*".repeat(local.length - 2)}${local[local.length - 1]}@${domain}`;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Login failed.");
      }

      if (data.otpRequired) {
        setUserId(data.userId);
        setEmail(data.email);
        setShowOtpScreen(true);
        setError(null);
        setOtp(Array(6).fill(""));
        // Focus the first input box after state updates
        setTimeout(() => {
          inputRefs[0].current?.focus();
        }, 100);
      } else {
        onLogin(data.user);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during login.");
    } finally {
      setLoading(false);
    }
  }

  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    const otpCode = otp.join("").trim();
    if (otpCode.length !== 6) {
      setError("Please enter all 6 digits of the verification code.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, otp: otpCode }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "OTP verification failed.");
      }

      onLogin(data.user);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Invalid verification code.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOtp() {
    if (cooldown > 0) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/auth/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to resend OTP.");
      }

      setCooldown(60);
      setOtp(Array(6).fill(""));
      setError(null);
      setTimeout(() => {
        inputRefs[0].current?.focus();
      }, 100);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while resending OTP.");
    } finally {
      setLoading(false);
    }
  }

  const handleBackToLogin = () => {
    setShowOtpScreen(false);
    setError(null);
    setOtp(Array(6).fill(""));
  };

  const handleOtpChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    const digit = val.slice(-1);
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto-focus next input
    if (digit !== "" && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs[index - 1].current?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(text)) {
      const digits = text.split("");
      setOtp(digits);
      inputRefs[5].current?.focus();
    }
  };

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
          {showLogoutBanner && !showOtpScreen && (
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

          {error && (
            <div
              style={{
                background: "#FCE8E6",
                color: "#C5221F",
                borderBottom: "1px solid #FAD2CF",
                padding: "12px 16px",
                fontSize: "13px",
                fontWeight: 500,
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          {showOtpScreen ? (
            <form onSubmit={handleOtpSubmit} style={{ padding: "28px 32px 32px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <ShieldCheck size={26} color="#C70039" />
                <h1
                  style={{
                    fontSize: "20px",
                    fontWeight: 600,
                    color: "#374151",
                    margin: 0,
                  }}
                >
                  Two-Step Verification
                </h1>
              </div>
              <p
                style={{
                  fontSize: "13.5px",
                  color: "#6B7280",
                  margin: "0 0 20px 0",
                  lineHeight: 1.5,
                }}
              >
                We've sent a 6-digit verification code to your registered email:{" "}
                <strong style={{ color: "#111827" }}>{maskEmail(email)}</strong>.
                Please enter it below.
              </p>

              <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", margin: "24px 0" }}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={inputRefs[index]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={handleOtpPaste}
                    style={{
                      width: "48px",
                      height: "52px",
                      textAlign: "center",
                      fontSize: "20px",
                      fontWeight: "bold",
                      border: "1px solid #D1D5DB",
                      borderRadius: "6px",
                      backgroundColor: "#F9FAFB",
                      color: "#1F2937",
                      outline: "none",
                      transition: "all 0.2s ease",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#C70039";
                      e.target.style.boxShadow = "0 0 0 3px rgba(199, 0, 57, 0.15)";
                      e.target.style.backgroundColor = "#FFFFFF";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#D1D5DB";
                      e.target.style.boxShadow = "none";
                      e.target.style.backgroundColor = "#F9FAFB";
                    }}
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...loginButtonStyle,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                  marginBottom: "16px",
                }}
              >
                {loading ? "Verifying..." : "Verify & Log In"}
                {!loading && <LogIn size={17} strokeWidth={2.25} />}
              </button>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "14px" }}>
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#4B5563",
                    fontSize: "13px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: 0,
                    fontFamily: "inherit",
                    fontWeight: 500,
                  }}
                >
                  <ArrowLeft size={16} /> Back to Login
                </button>

                <button
                  type="button"
                  disabled={cooldown > 0 || loading}
                  onClick={handleResendOtp}
                  style={{
                    background: "none",
                    border: "none",
                    color: cooldown > 0 ? "#9CA3AF" : "#C70039",
                    fontSize: "13px",
                    cursor: cooldown > 0 ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: 0,
                    fontFamily: "inherit",
                    fontWeight: 600,
                  }}
                >
                  <RefreshCw size={15} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
                  {cooldown > 0 ? `Resend Code (${cooldown}s)` : "Resend Code"}
                </button>
              </div>
            </form>
          ) : (
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

              <button type="submit" disabled={loading} style={{ ...loginButtonStyle, opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
                {loading ? "Logging in..." : "Log In"}
                {!loading && <LogIn size={17} strokeWidth={2.25} />}
              </button>
            </form>
          )}
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
