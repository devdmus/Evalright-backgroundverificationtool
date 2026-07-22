import { useState } from "react";
import { Save } from "lucide-react";
import { Footer } from "../components/Footer";
import { WELCOME_EMAIL_DEFAULT } from "../data/mockData";

interface SetupWelcomeEmailPageProps {
  isDarkMode?: boolean;
}

export function SetupWelcomeEmailPage({ isDarkMode = false }: SetupWelcomeEmailPageProps) {
  const [subject, setSubject] = useState(WELCOME_EMAIL_DEFAULT.subject);
  const [body, setBody] = useState(WELCOME_EMAIL_DEFAULT.body);
  const [enabled, setEnabled] = useState(WELCOME_EMAIL_DEFAULT.enabled);

  const primaryColor = isDarkMode ? "#DF2A57" : "#C70039";
  const cardBg = isDarkMode ? "#252830" : "#FFFFFF";
  const borderColor = isDarkMode ? "#333333" : "#E5E7EB";
  const textColor = isDarkMode ? "#E5E7EB" : "#333333";
  const mutedColor = isDarkMode ? "#9CA3AF" : "#666666";
  const inputBg = isDarkMode ? "#1A1C21" : "#FFFFFF";

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: isDarkMode ? "#1A1C21" : "#F4F5F7" }}>
      <div style={{ flex: 1, padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 600, color: primaryColor, margin: 0 }}>Setup Welcome Email</h1>

        <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: "6px", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: textColor, cursor: "pointer" }}>
            <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} style={{ accentColor: primaryColor }} />
            Send Welcome Email to new clients upon registration
          </label>

          <div>
            <label style={{ display: "block", fontSize: "12px", color: mutedColor, marginBottom: "6px" }}>Email Subject</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={{
                width: "100%",
                height: "36px",
                padding: "0 10px",
                fontSize: "13px",
                border: `1px solid ${borderColor}`,
                borderRadius: "4px",
                background: inputBg,
                color: textColor,
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", color: mutedColor, marginBottom: "6px" }}>Email Body</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={12}
              style={{
                width: "100%",
                padding: "12px",
                fontSize: "13px",
                border: `1px solid ${borderColor}`,
                borderRadius: "4px",
                background: inputBg,
                color: textColor,
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
            <p style={{ margin: "8px 0 0 0", fontSize: "12px", color: mutedColor }}>
              Available placeholders: {"{company_name}"}, {"{primary_user}"}, {"{login_url}"}
            </p>
          </div>

          <div>
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
              Save Welcome Email
            </button>
          </div>
        </div>
      </div>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
