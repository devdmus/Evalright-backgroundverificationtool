import { FileText } from "lucide-react";
import { Footer } from "../components/Footer";

interface PlaceholderPageProps {
  title: string;
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
      <div style={{ flex: 1, padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 600, color: "#C70039" }}>{title}</h1>
        
        <div
          style={{
            flex: 1,
            background: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: "6px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
            color: "#666666",
            gap: "16px",
          }}
        >
          <FileText size={48} style={{ color: "#CCCCCC" }} />
          <div style={{ fontSize: "18px", fontWeight: 500 }}>{title} Page Mockup</div>
          <div style={{ fontSize: "14px", color: "#999999", textAlign: "center", maxWidth: "400px" }}>
            This section represents the admin portal module for {title}. The active user interfaces and controls will be developed here.
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
