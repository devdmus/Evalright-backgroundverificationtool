import { useState } from "react";
import { Lock, ArrowRight, Save } from "lucide-react";
import { Footer } from "../components/Footer";
import { RECENT_CLIENTS, NO_SALES_CLIENTS, CLIENT_LIST, DEMO_CLIENT } from "../data/mockData";

const OVERVIEW_LEFT = [
  { label: "Today's Orders", value: "2", color: "#2196F3" },
  { label: "Today's Pending Orders", value: "0", color: "#FFB300" },
  { label: "Today's Closed Orders", value: "92", color: "#4CAF50" },
  { label: "Overdue Invoices", value: "11", color: "#F44336" },
  { label: "Percent A La Carte Orders", value: "33%", color: "#2196F3" },
];

const OVERVIEW_RIGHT = [
  { label: "Orders in Draft", value: "75", color: "#1A237E" },
  { label: "Orders This Week", value: "53", color: "#03A9F4" },
  { label: "New Clients This Week", value: "0", color: "#4CAF50" },
  { label: "Month to Date Total", value: "615", color: "#1E88E5" },
];

const AGING_ITEMS = [
  { label: "0 - 30 Days", value: "₹884.23", color: "#4CAF50" },
  { label: "31 - 60 Days", value: "₹746.47", color: "#FFB300" },
  { label: "61 - 90 Days", value: "₹592.88", color: "#F44336" },
  { label: "90+ Days", value: "₹1,572.98", color: "#9C27B0" },
];

interface HomePageProps {
  isDarkMode?: boolean;
  onNavigate?: (page: any) => void;
  onViewClient?: (clientId: string) => void;
}

function getClientIdByName(name: string): string {
  const match = CLIENT_LIST.find((c) => c.companyName === name);
  return match?.id ?? DEMO_CLIENT.id;
}

export function HomePage({ isDarkMode = false, onNavigate, onViewClient }: HomePageProps) {
  const [widgetsLocked, setWidgetsLocked] = useState(true);
  const [myNotes, setMyNotes] = useState("");

  const cardBg = isDarkMode ? "#252830" : "#ffffff";
  const borderColor = isDarkMode ? "#333333" : "#E5E7EB";
  const accentColor = isDarkMode ? "#DF2A57" : "#C70039";

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
      <div
        style={{
          flex: 1,
          padding: "20px 24px",
          overflowY: "auto",
        }}
      >
        {/* Header Title & Action Row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h1
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: isDarkMode ? "#DF2A57" : "#C70039",
              margin: 0,
            }}
          >
            Affiliate Home
          </h1>

          <button
            onClick={() => setWidgetsLocked(!widgetsLocked)}
            style={{
              background: "transparent",
              color: isDarkMode ? "#E5E7EB" : "#C70039",
              border: `1px solid ${isDarkMode ? "#4B5563" : "#C70039"}`,
              borderRadius: "4px",
              padding: "6px 14px",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(199,0,57,0.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <Lock size={14} style={{ color: isDarkMode ? "#9CA3AF" : "#C70039" }} />
            {widgetsLocked ? "Unlock Widgets" : "Lock Widgets"}
          </button>
        </div>

        {/* ── Top Grid (General Overview & Invoice Aging) ──────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          {/* General Overview Card */}
          <div
            style={{
              background: isDarkMode ? "#252830" : "#ffffff",
              border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
              borderRadius: "6px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: isDarkMode ? "1px solid #333333" : "1px solid #F3F4F6",
              }}
            >
              <h2
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: isDarkMode ? "#E5E7EB" : "#333333",
                  margin: 0,
                }}
              >
                General Overview
              </h2>
            </div>
            
            <div
              style={{
                padding: "20px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "24px 30px",
              }}
            >
              {/* Left Column Overview */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {OVERVIEW_LEFT.map((stat, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      transition: "transform 0.15s ease",
                    }}
                    className="hover:translate-x-1 duration-150 cursor-pointer"
                  >
                    <div
                      style={{
                        width: "50px",
                        height: "28px",
                        minWidth: "50px",
                        background: stat.color,
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#ffffff",
                        fontWeight: 600,
                        fontSize: "13px",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                      }}
                    >
                      {stat.value}
                    </div>
                    <span
                      style={{
                        fontSize: "13.5px",
                        color: isDarkMode ? "#B0B6C0" : "#555555",
                        fontWeight: 500,
                      }}
                    >
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Right Column Overview */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {OVERVIEW_RIGHT.map((stat, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      transition: "transform 0.15s ease",
                    }}
                    className="hover:translate-x-1 duration-150 cursor-pointer"
                  >
                    <div
                      style={{
                        width: "50px",
                        height: "28px",
                        minWidth: "50px",
                        background: stat.color,
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#ffffff",
                        fontWeight: 600,
                        fontSize: "13px",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                      }}
                    >
                      {stat.value}
                    </div>
                    <span
                      style={{
                        fontSize: "13.5px",
                        color: isDarkMode ? "#B0B6C0" : "#555555",
                        fontWeight: 500,
                      }}
                    >
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Invoice Aging Card */}
          <div
            style={{
              background: isDarkMode ? "#252830" : "#ffffff",
              border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
              borderRadius: "6px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: isDarkMode ? "1px solid #333333" : "1px solid #F3F4F6",
              }}
            >
              <h2
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: isDarkMode ? "#E5E7EB" : "#333333",
                  margin: 0,
                }}
              >
                Invoice Aging
              </h2>
            </div>

            <div
              style={{
                padding: "20px 24px",
                display: "flex",
                flexDirection: "column",
                gap: "18px",
              }}
            >
              {AGING_ITEMS.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingBottom: i !== AGING_ITEMS.length - 1 ? "12px" : "0",
                    borderBottom: i !== AGING_ITEMS.length - 1 ? (isDarkMode ? "1px dashed #333333" : "1px dashed #E5E7EB") : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    {/* Badge */}
                    <div
                      style={{
                        minWidth: "100px",
                        height: "28px",
                        background: item.color,
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#ffffff",
                        fontWeight: 600,
                        fontSize: "12px",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                      }}
                    >
                      {item.label}
                    </div>
                    {/* Value */}
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: isDarkMode ? "#E5E7EB" : "#333333",
                      }}
                    >
                      {item.value}
                    </span>
                  </div>

                  {/* Action Link */}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onNavigate) onNavigate("invoices");
                    }}
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: isDarkMode ? "#DF2A57" : "#C70039",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                    className="hover:underline"
                  >
                    Details <ArrowRight size={12} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom Grid (Clients Recent & Clients Without Sales) ─────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          {/* Clients Recent Card */}
          <div
            style={{
              background: isDarkMode ? "#252830" : "#ffffff",
              border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
              borderRadius: "6px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: isDarkMode ? "1px solid #333333" : "1px solid #F3F4F6",
              }}
            >
              <h2
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: isDarkMode ? "#E5E7EB" : "#333333",
                  margin: 0,
                }}
              >
                Clients Recent
              </h2>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr
                    style={{
                      background: isDarkMode ? "#2A2D34" : "#F9FAFB",
                      borderBottom: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
                    }}
                  >
                    {["Company", "Date Created", "Contact", "Phone", "Sales"].map((col) => (
                      <th
                        key={col}
                        style={{
                          padding: "10px 16px",
                          fontSize: "12px",
                          fontWeight: 600,
                          color: isDarkMode ? "#9CA3AF" : "#555555",
                        }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RECENT_CLIENTS.map((client, idx) => (
                    <tr
                      key={idx}
                      style={{
                        borderBottom: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
                      }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/35 duration-100"
                    >
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: "13px",
                          fontWeight: 600,
                          color: isDarkMode ? "#DF2A57" : "#C70039",
                          cursor: "pointer",
                        }}
                        onClick={() => onViewClient?.(getClientIdByName(client.name))}
                      >
                        {client.name}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: "13px",
                          color: isDarkMode ? "#B0B6C0" : "#555555",
                        }}
                      >
                        {client.date}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: "13px",
                          color: isDarkMode ? "#B0B6C0" : "#555555",
                        }}
                      >
                        {client.contact}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: "13px",
                          color: isDarkMode ? "#B0B6C0" : "#555555",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {client.phone}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: "13px",
                          fontWeight: 500,
                          color: isDarkMode ? "#E5E7EB" : "#333333",
                        }}
                      >
                        {client.sales}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Clients Without Sales Card */}
          <div
            style={{
              background: isDarkMode ? "#252830" : "#ffffff",
              border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
              borderRadius: "6px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: isDarkMode ? "1px solid #333333" : "1px solid #F3F4F6",
              }}
            >
              <h2
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: isDarkMode ? "#E5E7EB" : "#333333",
                  margin: 0,
                }}
              >
                Clients Without Sales
              </h2>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr
                    style={{
                      background: isDarkMode ? "#2A2D34" : "#F9FAFB",
                      borderBottom: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
                    }}
                  >
                    {["Company", "Date Created", "Contact", "Phone"].map((col) => (
                      <th
                        key={col}
                        style={{
                          padding: "10px 16px",
                          fontSize: "12px",
                          fontWeight: 600,
                          color: isDarkMode ? "#9CA3AF" : "#555555",
                        }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {NO_SALES_CLIENTS.map((client, idx) => (
                    <tr
                      key={idx}
                      style={{
                        borderBottom: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
                      }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/35 duration-100"
                    >
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: "13px",
                          fontWeight: 600,
                          color: isDarkMode ? "#DF2A57" : "#C70039",
                          cursor: "pointer",
                        }}
                        onClick={() => onViewClient?.(getClientIdByName(client.name))}
                      >
                        {client.name}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: "13px",
                          color: isDarkMode ? "#B0B6C0" : "#555555",
                        }}
                      >
                        {client.date}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: "13px",
                          color: isDarkMode ? "#B0B6C0" : "#555555",
                        }}
                      >
                        {client.contact}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: "13px",
                          color: isDarkMode ? "#B0B6C0" : "#555555",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {client.phone}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── My Notes ─────────────────────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <div
            style={{
              background: cardBg,
              border: `1px solid ${borderColor}`,
              borderRadius: "6px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: `1px solid ${isDarkMode ? "#333333" : "#F3F4F6"}`,
              }}
            >
              <h2
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: isDarkMode ? "#E5E7EB" : "#333333",
                  margin: 0,
                }}
              >
                My Notes
              </h2>
            </div>

            <div style={{ padding: "16px 20px 20px" }}>
              <textarea
                value={myNotes}
                onChange={(e) => setMyNotes(e.target.value)}
                placeholder="Notes"
                rows={6}
                style={{
                  width: "100%",
                  padding: "12px",
                  fontSize: "13px",
                  border: `1px solid ${borderColor}`,
                  borderRadius: "4px",
                  background: isDarkMode ? "#1A1C21" : "#FFFFFF",
                  color: isDarkMode ? "#E5E7EB" : "#333333",
                  boxSizing: "border-box",
                  resize: "vertical",
                  fontFamily: "inherit",
                  marginBottom: "16px",
                  minHeight: "120px",
                }}
              />
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  style={{
                    height: "34px",
                    padding: "0 16px",
                    background: accentColor,
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Save size={14} />
                  Save Note
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
