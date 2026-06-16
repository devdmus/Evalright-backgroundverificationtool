import { Download } from "lucide-react";
import { Footer } from "../components/Footer";

interface DocumentItem {
  name: string;
  file: string;
  type: "PDF" | "DOCX";
}

const DOCUMENTS: DocumentItem[] = [
  {
    name: "A summary of Your Rights Under the FCRA - 2023.pdf",
    file: "A summary of Your Rights Under the FCRA - 2023.pdf",
    type: "PDF",
  },
  {
    name: "ER_Investigative Consumer Report Disclosure Form.docx",
    file: "ER_Investigative Consumer Report Disclosure Form.docx",
    type: "DOCX",
  },
  {
    name: "ER_Consumer Report Disclosure Form.docx",
    file: "ER_Consumer Report Disclosure Form.docx",
    type: "DOCX",
  },
  {
    name: "ER_California Disclosure.docx",
    file: "ER_California Disclosure.docx",
    type: "DOCX",
  },
  {
    name: "ER_Authorization.docx",
    file: "ER_Authorization.docx",
    type: "DOCX",
  },
  {
    name: "ER_Additional State Disclosures.docx",
    file: "ER_ Additional State Disclosures.docx",
    type: "DOCX",
  },
];

export function FormsDocuments({ isDarkMode = false }: { isDarkMode?: boolean }) {
  return (
    <div className="flex-1 flex flex-col min-h-0" style={{ background: isDarkMode ? "#252830" : "#F6F6F6" }}>
      <div className="flex-1 p-6" style={{ overflowY: "auto" }}>
        <h1
          style={{
            fontSize: "20px",
            fontWeight: 500,
            color: isDarkMode ? "#DF2A57" : "rgb(199, 0, 57)",
            marginBottom: "24px",
          }}
        >
          Forms &amp; Documents
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
            marginBottom: "20px",
          }}
        >
          {DOCUMENTS.map((doc) => (
            <div
              key={doc.file}
              style={{
                background: isDarkMode ? "#1A1C21" : "#FFFFFF",
                border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
                borderRadius: "4px",
                padding: "16px 18px",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                boxShadow: "0 1px 4px rgba(0, 0, 0, 0.04)",
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: "36px",
                  height: "42px",
                  border: "1px solid rgb(199, 0, 57)",
                  borderRadius: "2px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "9px",
                  fontWeight: 700,
                  color: "rgb(199, 0, 57)",
                  letterSpacing: "0.3px",
                }}
              >
                {doc.type}
              </div>

              <span
                style={{
                  flex: 1,
                  fontSize: "13px",
                  color: isDarkMode ? "#D1D5DB" : "#555555",
                  lineHeight: 1.4,
                }}
              >
                {doc.name}
              </span>

              <a
                href={`/docs/${encodeURIComponent(doc.file)}`}
                download={doc.name}
                title={`Download ${doc.name}`}
                style={{
                  flexShrink: 0,
                  color: "rgb(199, 0, 57)",
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <Download size={20} />
              </a>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
