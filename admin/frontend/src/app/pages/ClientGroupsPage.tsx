import { useState, useMemo } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Footer } from "../components/Footer";
import { CLIENT_CONFIG_GROUPS } from "../data/mockData";
import type { PageKey } from "../components/Sidebar";
import { AddClientConfigGroupPage } from "./AddClientConfigGroupPage";

interface ClientGroupsPageProps {
  isDarkMode?: boolean;
  onNavigate?: (page: PageKey) => void;
}

function SortIcon() {
  return (
    <span style={{ marginLeft: "6px", display: "inline-flex", flexDirection: "column", opacity: 0.35 }}>
      <span style={{ fontSize: "8px", lineHeight: "1" }}>▲</span>
      <span style={{ fontSize: "8px", lineHeight: "1", marginTop: "2px" }}>▼</span>
    </span>
  );
}

export function ClientGroupsPage({ isDarkMode = false, onNavigate }: ClientGroupsPageProps) {
  const [groups] = useState(CLIENT_CONFIG_GROUPS);
  const [searchText, setSearchText] = useState("");
  const [copyFromGroup, setCopyFromGroup] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const primaryColor = isDarkMode ? "#DF2A57" : "#C70039";
  const cardBg = isDarkMode ? "#252830" : "#FFFFFF";
  const borderColor = isDarkMode ? "#333333" : "#E5E7EB";
  const textColor = isDarkMode ? "#E5E7EB" : "#555555";
  const mutedColor = isDarkMode ? "#9CA3AF" : "#666666";
  const tableHeaderBg = isDarkMode ? "#2A2D34" : "#F9FAFB";
  const inputBg = isDarkMode ? "#1A1C21" : "#FFFFFF";

  const filtered = useMemo(() => {
    if (!searchText.trim()) return groups;
    const q = searchText.toLowerCase();
    return groups.filter((g) => g.groupName.toLowerCase().includes(q));
  }, [groups, searchText]);

  const namedGroups = groups.filter((g) => g.groupName);

  if (showAddForm) {
    return <AddClientConfigGroupPage isDarkMode={isDarkMode} onBack={() => setShowAddForm(false)} />;
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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <h1 style={{ fontSize: "20px", fontWeight: 600, color: primaryColor, margin: 0 }}>Configure Client Groups</h1>
          <button
            onClick={() => setShowAddForm(true)}
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
            Add New Config Group
          </button>
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
          <h2 style={{ margin: 0, fontSize: "15px", fontWeight: 600, color: textColor }}>Client Configuration Groups</h2>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <span style={{ fontSize: "13px", color: mutedColor }}>Showing {filtered.length} entries</span>
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
                  width: "180px",
                }}
              />
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: tableHeaderBg, borderBottom: `1px solid ${borderColor}` }}>
                  {["Group Name", "Group Color", "Discount %", "Suspend/Terminate Exempt", "Pricing", "Actions"].map((col) => (
                    <th
                      key={col}
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontWeight: 600,
                        color: mutedColor,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {col}
                      {col === "Group Name" && <SortIcon />}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((group) => (
                  <tr key={group.id} style={{ borderBottom: `1px solid ${borderColor}` }}>
                    <td style={{ padding: "12px 16px", color: textColor }}>{group.groupName || ""}</td>
                    <td style={{ padding: "12px 16px", color: textColor }}>{group.groupColor || ""}</td>
                    <td style={{ padding: "12px 16px", color: textColor }}>{group.discountPct.toFixed(2)}</td>
                    <td style={{ padding: "12px 16px", color: textColor }}>{group.suspendTerminateExempt ? "Yes" : "No"}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <button
                        type="button"
                        onClick={() => onNavigate?.("set-pricing")}
                        style={{
                          background: "none",
                          border: "none",
                          padding: 0,
                          color: primaryColor,
                          fontSize: "13px",
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                      >
                        Set Prices
                      </button>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <button
                          type="button"
                          title="Edit"
                          style={{ background: "none", border: "none", padding: 0, color: primaryColor, cursor: "pointer" }}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          title="Delete"
                          style={{ background: "none", border: "none", padding: 0, color: primaryColor, cursor: "pointer" }}
                        >
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
          <h2 style={{ margin: 0, fontSize: "15px", fontWeight: 600, color: textColor }}>
            Copy Existing Configuration Group
          </h2>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "16px", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "240px", maxWidth: "400px" }}>
              <label style={{ display: "block", fontSize: "12px", color: mutedColor, marginBottom: "6px" }}>
                Select Group To Copy
              </label>
              <select
                value={copyFromGroup}
                onChange={(e) => setCopyFromGroup(e.target.value)}
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
              >
                <option value="">Select a group</option>
                {namedGroups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.groupName}
                  </option>
                ))}
              </select>
            </div>
            <button
              disabled={!copyFromGroup}
              style={{
                padding: "8px 20px",
                background: copyFromGroup ? primaryColor : "#CCCCCC",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "4px",
                fontSize: "13px",
                fontWeight: 500,
                cursor: copyFromGroup ? "pointer" : "not-allowed",
                height: "36px",
              }}
            >
              Copy Group
            </button>
          </div>
        </div>
      </div>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
