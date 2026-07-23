import { useEffect, useState } from "react";
import { Footer } from "../components/Footer";

const ADMIN_API = "http://localhost:5001";

export interface SearchPricingItem {
  id: string;
  name: string;
  serviceCode: string;
  hasOverride?: boolean;
  salePrice?: string;
  yourCost?: string;
  enabled?: boolean;
}

interface SetPricingProps {
  isDarkMode?: boolean;
}

export function SetPricing({ isDarkMode = false }: SetPricingProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [pricing, setPricing] = useState<SearchPricingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingCode, setSavingCode] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const cardBg = isDarkMode ? "#252830" : "#FFFFFF";
  const borderColor = isDarkMode ? "#333333" : "#E5E7EB";
  const textColor = isDarkMode ? "#E5E7EB" : "#555555";
  const mutedColor = isDarkMode ? "#9CA3AF" : "#9CA3AF";
  const tableHeaderBg = isDarkMode ? "#1E3A5F" : "#D6EAF8";
  const tableHeaderColor = isDarkMode ? "#93C5FD" : "#1A5276";
  const rowHeaderBg = isDarkMode ? "#2A2D34" : "#F5F5F5";

  async function loadPricing() {
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch(`${ADMIN_API}/api/services/pricing`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to load pricing");
      }
      setPricing(data);
      if (data.length > 0) {
        setExpandedItem((prev) => prev ?? data[0].serviceCode);
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to load pricing" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPricing();
  }, []);

  function toggleExpand(serviceCode: string) {
    setExpandedItem((prev) => (prev === serviceCode ? null : serviceCode));
  }

  function updateItem(serviceCode: string, field: "salePrice" | "enabled", value: string | boolean) {
    setPricing((prev) =>
      prev.map((item) => (item.serviceCode === serviceCode ? { ...item, [field]: value } : item))
    );
  }

  async function handleUpdatePricing(item: SearchPricingItem) {
    setSavingCode(item.serviceCode);
    setMessage(null);
    try {
      const response = await fetch(`${ADMIN_API}/api/services/pricing/${encodeURIComponent(item.serviceCode)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salePrice: item.salePrice,
          enabled: item.enabled !== false,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to update pricing");
      }

      setPricing((prev) =>
        prev.map((row) => (row.serviceCode === item.serviceCode ? { ...row, ...data.service } : row))
      );
      setMessage({ type: "success", text: `Updated sale price for ${item.name}` });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to update pricing" });
    } finally {
      setSavingCode(null);
    }
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: isDarkMode ? "#1A1C21" : "#F4F5F7" }}>
      <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto" }}>
        <h1
          style={{
            fontSize: "22px",
            fontWeight: 600,
            color: isDarkMode ? "#DF2A57" : "#C70039",
            margin: "0 0 20px 0",
            fontFamily: "Georgia, 'Times New Roman', serif",
          }}
        >
          Set Pricing
        </h1>

        {message && (
          <div
            style={{
              marginBottom: 16,
              padding: "10px 14px",
              borderRadius: 4,
              background: message.type === "success" ? "#ECFDF5" : "#FEF2F2",
              color: message.type === "success" ? "#065F46" : "#991B1B",
              fontSize: 13,
            }}
          >
            {message.text}
          </div>
        )}

        <div
          style={{
            background: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: "6px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${borderColor}` }}>
            <h2 style={{ fontSize: "15px", fontWeight: 500, color: mutedColor, margin: 0 }}>Searches List</h2>
          </div>

          {loading ? (
            <div style={{ padding: 24, color: mutedColor, fontSize: 13 }}>Loading services…</div>
          ) : pricing.length === 0 ? (
            <div style={{ padding: 24, color: mutedColor, fontSize: 13 }}>No services found.</div>
          ) : (
            <div>
              {pricing.map((item, idx) => {
                const isExpanded = expandedItem === item.serviceCode;
                return (
                  <div key={item.serviceCode}>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 200px 100px",
                        alignItems: "center",
                        padding: "14px 20px",
                        borderBottom: `1px solid ${borderColor}`,
                        background: isExpanded
                          ? rowHeaderBg
                          : idx % 2 === 0
                            ? "transparent"
                            : isDarkMode
                              ? "rgba(255,255,255,0.02)"
                              : "#FAFAFA",
                      }}
                    >
                      <span style={{ fontSize: "13px", color: textColor, fontWeight: 400 }}>{item.name}</span>
                      <span style={{ fontSize: "13px", color: mutedColor }}>
                        {item.hasOverride ? "Override price(s) set." : ""}
                      </span>
                      <button
                        onClick={() => toggleExpand(item.serviceCode)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#C70039",
                          fontSize: "13px",
                          fontWeight: 500,
                          cursor: "pointer",
                          textAlign: "right",
                          padding: 0,
                        }}
                      >
                        Set Prices
                      </button>
                    </div>

                    {isExpanded && (
                      <div style={{ borderBottom: `1px solid ${borderColor}`, background: cardBg }}>
                        <div style={{ overflowX: "auto" }}>
                          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                            <thead>
                              <tr style={{ background: tableHeaderBg }}>
                                {["Rush fee", "Court copy fee", "Per page fee", "Additional", "Sale Price", "Status", "Your Cost"].map(
                                  (col) => (
                                    <th
                                      key={col}
                                      style={{
                                        padding: "10px 14px",
                                        textAlign: "left",
                                        fontWeight: 600,
                                        color: tableHeaderColor,
                                        borderBottom: `1px solid ${borderColor}`,
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {col}
                                    </th>
                                  )
                                )}
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td style={{ padding: "12px 14px", color: textColor }}>0.00</td>
                                <td style={{ padding: "12px 14px", color: textColor }}>0.00</td>
                                <td style={{ padding: "12px 14px", color: textColor }}>0.00</td>
                                <td style={{ padding: "12px 14px", color: textColor }}>0.00</td>
                                <td style={{ padding: "12px 14px" }}>
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={item.salePrice ?? "0.00"}
                                    onChange={(e) => updateItem(item.serviceCode, "salePrice", e.target.value)}
                                    style={{
                                      width: "90px",
                                      height: "30px",
                                      padding: "0 8px",
                                      fontSize: "12px",
                                      border: `1px solid ${borderColor}`,
                                      borderRadius: "3px",
                                      background: isDarkMode ? "#1A1C21" : "#FFFFFF",
                                      color: textColor,
                                    }}
                                  />
                                </td>
                                <td style={{ padding: "12px 14px" }}>
                                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                                    <label style={{ display: "flex", alignItems: "center", gap: "4px", color: textColor, cursor: "pointer" }}>
                                      <input
                                        type="radio"
                                        name={`status-${item.serviceCode}`}
                                        checked={item.enabled !== false}
                                        onChange={() => updateItem(item.serviceCode, "enabled", true)}
                                        style={{ accentColor: "#2563EB" }}
                                      />
                                      Enabled
                                    </label>
                                    <label style={{ display: "flex", alignItems: "center", gap: "4px", color: textColor, cursor: "pointer" }}>
                                      <input
                                        type="radio"
                                        name={`status-${item.serviceCode}`}
                                        checked={item.enabled === false}
                                        onChange={() => updateItem(item.serviceCode, "enabled", false)}
                                        style={{ accentColor: "#2563EB" }}
                                      />
                                      Disabled
                                    </label>
                                  </div>
                                </td>
                                <td style={{ padding: "12px 14px", color: textColor }}>{item.yourCost ?? "0.00"}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div style={{ padding: "16px 20px 20px", display: "flex", justifyContent: "center" }}>
                          <button
                            onClick={() => handleUpdatePricing(item)}
                            disabled={savingCode === item.serviceCode}
                            style={{
                              height: "34px",
                              padding: "0 24px",
                              background: savingCode === item.serviceCode ? "#9CA3AF" : "#C70039",
                              color: "#FFFFFF",
                              border: "none",
                              borderRadius: "4px",
                              fontSize: "13px",
                              fontWeight: 500,
                              cursor: savingCode === item.serviceCode ? "not-allowed" : "pointer",
                            }}
                          >
                            {savingCode === item.serviceCode ? "Updating…" : "Update Pricing"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
