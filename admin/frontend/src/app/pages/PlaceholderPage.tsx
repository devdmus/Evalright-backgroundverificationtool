import { FileText } from "lucide-react";
import { Footer } from "../components/Footer";

interface PlaceholderPageProps {
  title: string;
  isDarkMode?: boolean;
}

export function PlaceholderPage({ title, isDarkMode = false }: PlaceholderPageProps) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: isDarkMode ? "#1A1C21" : "#F4F5F7" }}>
      <div style={{ flex: 1, padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 600, color: isDarkMode ? "#DF2A57" : "#C70039" }}>{title}</h1>
        
        <div
          style={{
            flex: 1,
            background: isDarkMode ? "#252830" : "#FFFFFF",
            border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
            borderRadius: "6px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
            color: isDarkMode ? "#9CA3AF" : "#666666",
            gap: "16px",
          }}
        >
          <FileText size={48} style={{ color: isDarkMode ? "#4B5563" : "#CCCCCC" }} />
          <div style={{ fontSize: "18px", fontWeight: 500 }}>{title}</div>
          <div style={{ fontSize: "14px", color: isDarkMode ? "#6B7280" : "#999999", textAlign: "center", maxWidth: "400px" }}>
            This section represents the admin portal module for {title}. The active user interfaces and controls will be developed here.
          </div>
        </div>
      </div>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
