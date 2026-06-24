import { useState } from "react";
import { Plus, Pencil, Trash2, Search, Copy } from "lucide-react";
import { Footer } from "../components/Footer";
import { SIGNUP_PAGES_LIST } from "../data/mockData";
import { AddEditSignupPage } from "./AddEditSignupPage";

interface SignupPagesPageProps {
  isDarkMode?: boolean;
}

type ViewMode = "list" | "add" | "edit";

export function SignupPagesPage({ isDarkMode = false }: SignupPagesPageProps) {
  const [pages] = useState(SIGNUP_PAGES_LIST);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [selectedCopyId, setSelectedCopyId] = useState("");
  const [newTemplateName, setNewTemplateName] = useState("");

  const primaryColor = isDarkMode ? "#DF2A57" : "#C70039";
  const cardBg = isDarkMode ? "#252830" : "#FFFFFF";
  const borderColor = isDarkMode ? "#333333" : "#E5E7EB";
  const textColor = isDarkMode ? "#E5E7EB" : "#555555";
  const mutedColor = isDarkMode ? "#9CA3AF" : "#666666";
  const tableHeaderBg = isDarkMode ? "#2A2D34" : "#F9FAFB";
  const inputBg = isDarkMode ? "#1A1C21" : "#FFFFFF";

  const filtered = pages.filter((p) => {
    if (!searchText.trim()) return true;
    return p.pageName.toLowerCase().includes(searchText.toLowerCase());
  });

  const editingPage = editingPageId ? pages.find((p) => p.id === editingPageId) : null;

  if (viewMode === "add") {
    return <AddEditSignupPage isDarkMode={isDarkMode} mode="add" onBack={() => setViewMode("list")} />;
  }

  if (viewMode === "edit" && editingPage) {
    return (
      <AddEditSignupPage
        isDarkMode={isDarkMode}
        mode="edit"
        initialData={{ pageName: editingPage.pageName, setAsDefault: editingPage.isDefault }}
        onBack={() => {
          setViewMode("list");
          setEditingPageId(null);
        }}
      />
    );
  }

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        background: isDarkMode ? "#1A1C21" : "#F4F5F7",
      }}
    >
      <div style={{ flex: 1, padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 600, color: primaryColor, margin: 0 }}>Sign-Up Pages</h1>

        <div
          style={{
            background: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: "6px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <h2 style={{ margin: 0, fontSize: "14px", fontWeight: 500, color: mutedColor }}>Signup Page List</h2>
            <button
              type="button"
              onClick={() => setViewMode("add")}
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
              Add New Signup Page
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: textColor }}>
              <select
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                style={{
                  height: "32px",
                  padding: "0 8px",
                  border: `1px solid ${borderColor}`,
                  borderRadius: "4px",
                  background: inputBg,
                  color: textColor,
                  fontSize: "13px",
                }}
              >
                {[10, 25, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span>entries per page</span>
            </div>
            <div style={{ position: "relative" }}>
              <Search
                size={14}
                style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: mutedColor }}
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{
                  height: "32px",
                  paddingLeft: "32px",
                  paddingRight: "12px",
                  border: `1px solid ${borderColor}`,
                  borderRadius: "4px",
                  background: inputBg,
                  color: textColor,
                  fontSize: "13px",
                  width: "200px",
                }}
              />
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: tableHeaderBg, borderBottom: `1px solid ${borderColor}` }}>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: mutedColor, width: "60px" }}>
                    Copy
                  </th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: mutedColor }}>Page Name</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: mutedColor }}>
                    If Page is Default
                  </th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: mutedColor }}>
                    Check Page in Action (preview)
                  </th>
                  <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600, color: mutedColor, width: "100px" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, entriesPerPage).map((page) => (
                  <tr key={page.id} style={{ borderBottom: `1px solid ${borderColor}` }}>
                    <td style={{ padding: "12px 16px" }}>
                      <input
                        type="radio"
                        name="copyPage"
                        checked={selectedCopyId === page.id}
                        onChange={() => setSelectedCopyId(page.id)}
                        style={{ accentColor: primaryColor }}
                      />
                    </td>
                    <td style={{ padding: "12px 16px", color: textColor }}>{page.pageName}</td>
                    <td style={{ padding: "12px 16px", color: textColor }}>{page.isDefault ? "Default" : ""}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <a href={page.previewUrl} style={{ color: primaryColor, fontSize: "13px" }}>
                        Preview
                      </a>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingPageId(page.id);
                            setViewMode("edit");
                          }}
                          style={{ background: "none", border: "none", padding: 0, color: primaryColor, cursor: "pointer" }}
                        >
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

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "13px", color: mutedColor }}>
            <span>
              Showing 1 to {Math.min(filtered.length, entriesPerPage)} of {filtered.length} entries
            </span>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: primaryColor,
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              1
            </div>
          </div>
        </div>

        <div
          style={{
            background: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: "6px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "15px", fontWeight: 600, color: textColor, display: "flex", alignItems: "center", gap: "8px" }}>
            <Copy size={16} />
            Copy Existing Signup Page
          </h2>
          <p style={{ margin: 0, fontSize: "13px", color: mutedColor }}>
            Select a signup page above using the radio button, then enter a name for your new template below.
          </p>
          <div style={{ maxWidth: "400px" }}>
            <label style={{ display: "block", fontSize: "12px", color: mutedColor, marginBottom: "6px" }}>
              New Template Name
            </label>
            <input
              type="text"
              value={newTemplateName}
              onChange={(e) => setNewTemplateName(e.target.value)}
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
            <button
              type="button"
              disabled={!selectedCopyId || !newTemplateName.trim()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                background: selectedCopyId && newTemplateName.trim() ? primaryColor : "#CCCCCC",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "4px",
                fontSize: "13px",
                fontWeight: 500,
                cursor: selectedCopyId && newTemplateName.trim() ? "pointer" : "not-allowed",
              }}
            >
              <Copy size={14} />
              Copy Selected Template
            </button>
          </div>
        </div>
      </div>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
