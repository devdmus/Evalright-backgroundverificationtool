import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Footer } from "../components/Footer";
import { EMAIL_TEMPLATES } from "../data/mockData";

interface ManageEmailTemplatesPageProps {
  isDarkMode?: boolean;
}

export function ManageEmailTemplatesPage({ isDarkMode = false }: ManageEmailTemplatesPageProps) {
  const [templates] = useState(EMAIL_TEMPLATES);

  const primaryColor = isDarkMode ? "#DF2A57" : "#C70039";
  const cardBg = isDarkMode ? "#252830" : "#FFFFFF";
  const borderColor = isDarkMode ? "#333333" : "#E5E7EB";
  const textColor = isDarkMode ? "#E5E7EB" : "#555555";
  const mutedColor = isDarkMode ? "#9CA3AF" : "#666666";
  const tableHeaderBg = isDarkMode ? "#2A2D34" : "#F9FAFB";

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: isDarkMode ? "#1A1C21" : "#F4F5F7" }}>
      <div style={{ flex: 1, padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <h1 style={{ fontSize: "20px", fontWeight: 600, color: primaryColor, margin: 0 }}>Manage E-mail Templates</h1>
          <button
            type="button"
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
            <Plus size={16} />
            Add Template
          </button>
        </div>

        <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: "6px", padding: "20px", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: tableHeaderBg, borderBottom: `1px solid ${borderColor}` }}>
                {["Template Name", "Subject", "Last Modified", "Actions"].map((col) => (
                  <th key={col} style={{ padding: "12px 16px", textAlign: col === "Actions" ? "right" : "left", fontWeight: 600, color: mutedColor }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {templates.map((t) => (
                <tr key={t.id} style={{ borderBottom: `1px solid ${borderColor}` }}>
                  <td style={{ padding: "12px 16px", color: textColor }}>{t.name}</td>
                  <td style={{ padding: "12px 16px", color: textColor }}>{t.subject}</td>
                  <td style={{ padding: "12px 16px", color: textColor }}>{t.lastModified}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                      <button type="button" style={{ background: "none", border: "none", padding: 0, color: primaryColor, cursor: "pointer" }}>
                        <Pencil size={16} />
                      </button>
                      <button type="button" style={{ background: "none", border: "none", padding: 0, color: primaryColor, cursor: "pointer" }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
