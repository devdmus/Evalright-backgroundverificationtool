import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Footer } from "../components/Footer";

interface Template {
  id: string;
  name: string;
}

const MOCK_TEMPLATES: Template[] = [
  { id: "1", name: "Drug Test Email" },
  { id: "2", name: "EvalRight" },
];

export function ApplicantInviteTemplates() {
  const [activeTab, setActiveTab] = useState<"Templates List" | "Create New Template" | "Import Sample Template">("Templates List");

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
            fontFamily: "'Segoe UI', Arial, sans-serif",
          }}
        >
          Applicant Invite Templates
        </h1>

        {/* Tab Navigation */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #E0E0E0",
            marginBottom: "20px",
          }}
        >
          {(["Templates List", "Create New Template", "Import Sample Template"] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
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
                {tab}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === "Templates List" && (
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "4px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
              overflow: "hidden",
            }}
          >
            {/* Header Text */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #E5E7EB", fontSize: "13px", color: "#555555" }}>
              You can start an invitation order here:{" "}
              <a href="#" style={{ color: "#65A30D", textDecoration: "none", cursor: "pointer" }}>
                Start order!
              </a>
            </div>

            {/* Table */}
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#F9FAFB",
                    borderBottom: "1px solid #E5E7EB",
                  }}
                >
                  <th
                    style={{
                      padding: "12px 20px",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#555555",
                      width: "80%",
                    }}
                  >
                    Template Name
                  </th>
                  <th
                    style={{
                      padding: "12px 20px",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#555555",
                      textAlign: "right",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {MOCK_TEMPLATES.map((template, idx) => (
                  <tr
                    key={template.id}
                    style={{
                      background: idx % 2 === 0 ? "#FFFFFF" : "#FAFAFA",
                      borderBottom: "1px solid #E5E7EB",
                    }}
                  >
                    <td
                      style={{
                        padding: "12px 20px",
                        fontSize: "13px",
                        color: "#555555",
                      }}
                    >
                      {template.name}
                    </td>
                    <td
                      style={{
                        padding: "12px 20px",
                        textAlign: "right",
                      }}
                    >
                      <div style={{ display: "flex", gap: "16px", justifyContent: "flex-end" }}>
                        <button
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 0,
                            display: "flex",
                            color: "#EF4444",
                          }}
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 0,
                            display: "flex",
                            color: "#EF4444",
                          }}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Placeholders for other tabs */}
        {activeTab === "Create New Template" && (
          <div style={{ background: "#FFFFFF", padding: "24px", borderRadius: "4px", border: "1px solid #E5E7EB", color: "#555" }}>
            Create New Template functionality will be available here.
          </div>
        )}
        {activeTab === "Import Sample Template" && (
          <div style={{ background: "#FFFFFF", padding: "24px", borderRadius: "4px", border: "1px solid #E5E7EB", color: "#555" }}>
            Import Sample Template functionality will be available here.
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
