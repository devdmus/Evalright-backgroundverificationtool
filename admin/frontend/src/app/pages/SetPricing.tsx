import { useState } from "react";

import { Footer } from "../components/Footer";



export interface SearchPricingItem {

  name: string;

  hasOverride?: boolean;

  salePrice?: string;

  yourCost?: string;

  enabled?: boolean;

}



export const SEARCH_PRICING_LIST: SearchPricingItem[] = [

  { name: "(AF) LabCorp - 10 Panel", hasOverride: true, salePrice: "32.00", yourCost: "23.00", enabled: true },

  { name: "(AF) LabCorp - 10 Panel 6AM/ OXY", hasOverride: true, salePrice: "32.00", yourCost: "23.00", enabled: true },

  { name: "(AF) LabCorp - 10 Panel ALCOHOL", hasOverride: true, salePrice: "32.00", yourCost: "23.00", enabled: true },

  { name: "(AF) LabCorp - 10 Panel OXY", hasOverride: true },

  { name: "(AF) LabCorp - 12 Panel MDMA/ OXY", hasOverride: true },

  { name: "(AF) LabCorp - 5 Panel" },

  { name: "(AF) LabCorp - 5 Panel OXY" },

  { name: "(AF) LabCorp - 7 Panel" },

  { name: "(AF) LabCorp - 9 Panel" },

  { name: "(AF) LabCorp - 10 Panel Hair" },

  { name: "(AF) LabCorp - 12 Panel" },

  { name: "(AF) LabCorp - 12 Panel OXY" },

  { name: "(AF) LabCorp - 12 Panel ALCOHOL" },

  { name: "(AF) Quest - 10 Panel" },

  { name: "(AF) Quest - 5 Panel" },

  { name: "SSN Trace/Address History" },

  { name: "County Criminal" },

  { name: "Education Verification" },

  { name: "Employment Verification" },

  { name: "Driving History" },

];



interface SetPricingProps {

  isDarkMode?: boolean;

}



export function SetPricing({ isDarkMode = false }: SetPricingProps) {

  const [expandedItem, setExpandedItem] = useState<string | null>(SEARCH_PRICING_LIST[0].name);

  const [pricing, setPricing] = useState(SEARCH_PRICING_LIST);



  const cardBg = isDarkMode ? "#252830" : "#FFFFFF";

  const borderColor = isDarkMode ? "#333333" : "#E5E7EB";

  const textColor = isDarkMode ? "#E5E7EB" : "#555555";

  const mutedColor = isDarkMode ? "#9CA3AF" : "#9CA3AF";

  const tableHeaderBg = isDarkMode ? "#1E3A5F" : "#D6EAF8";

  const tableHeaderColor = isDarkMode ? "#93C5FD" : "#1A5276";

  const rowHeaderBg = isDarkMode ? "#2A2D34" : "#F5F5F5";



  function toggleExpand(name: string) {

    setExpandedItem((prev) => (prev === name ? null : name));

  }



  function updateItem(name: string, field: "salePrice" | "enabled", value: string | boolean) {

    setPricing((prev) =>

      prev.map((item) => (item.name === name ? { ...item, [field]: value } : item))

    );

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



          <div>

            {pricing.map((item, idx) => {

              const isExpanded = expandedItem === item.name;

              return (

                <div key={item.name}>

                  <div

                    style={{

                      display: "grid",

                      gridTemplateColumns: "1fr 200px 100px",

                      alignItems: "center",

                      padding: "14px 20px",

                      borderBottom: `1px solid ${borderColor}`,

                      background: isExpanded ? rowHeaderBg : idx % 2 === 0 ? "transparent" : isDarkMode ? "rgba(255,255,255,0.02)" : "#FAFAFA",

                    }}

                  >

                    <span style={{ fontSize: "13px", color: textColor, fontWeight: 400 }}>{item.name}</span>

                    <span style={{ fontSize: "13px", color: mutedColor }}>

                      {item.hasOverride ? "Override price(s) set." : ""}

                    </span>

                    <button

                      onClick={() => toggleExpand(item.name)}

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

                                  type="text"

                                  value={item.salePrice ?? "0.00"}

                                  onChange={(e) => updateItem(item.name, "salePrice", e.target.value)}

                                  style={{

                                    width: "80px",

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

                                      name={`status-${item.name}`}

                                      checked={item.enabled !== false}

                                      onChange={() => updateItem(item.name, "enabled", true)}

                                      style={{ accentColor: "#2563EB" }}

                                    />

                                    Enabled

                                  </label>

                                  <label style={{ display: "flex", alignItems: "center", gap: "4px", color: textColor, cursor: "pointer" }}>

                                    <input

                                      type="radio"

                                      name={`status-${item.name}`}

                                      checked={item.enabled === false}

                                      onChange={() => updateItem(item.name, "enabled", false)}

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

                          style={{

                            height: "34px",

                            padding: "0 24px",

                            background: "#B0B0B0",

                            color: "#FFFFFF",

                            border: "none",

                            borderRadius: "4px",

                            fontSize: "13px",

                            fontWeight: 500,

                            cursor: "pointer",

                          }}

                        >

                          Update Pricing

                        </button>

                      </div>

                    </div>

                  )}

                </div>

              );

            })}

          </div>

        </div>

      </div>

      <Footer isDarkMode={isDarkMode} />

    </div>

  );

}

