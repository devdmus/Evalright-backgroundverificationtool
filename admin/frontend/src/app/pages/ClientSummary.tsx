import { useState, useEffect } from "react";

import { Trash2 } from "lucide-react";

import { Footer } from "../components/Footer";

import { CLIENT_LIST, DEMO_CLIENT, LAST_EMAILS, SEARCH_PACKAGES, ClientRecord } from "../data/mockData";

import { ClientTransactionsTab } from "./ClientTransactionsTab";

import { ClientBillingTab } from "./ClientBillingTab";
import { ClientProfileTab } from "./ClientProfileTab";
import { ClientBranchesTab } from "./ClientBranchesTab";
import { ClientUsersTab } from "./ClientUsersTab";
import { ClientInvoicesTab } from "./ClientInvoicesTab";
import { ClientEmailsTab } from "./ClientEmailsTab";
import { ClientOrdersTab } from "./ClientOrdersTab";
import { ClientSalesTab } from "./ClientSalesTab";



const TABS = ["Summary", "Billing", "Profile", "Branches", "Users", "Invoices", "Transactions", "Emails", "Orders", "Sales"];



const TAB_TITLES: Record<string, string> = {

  Summary: "Client Summary",
  Billing: "Client Billing",
  Profile: "Client Profile",
  Branches: "Branch Management",
  Users: "Client Users",
  Invoices: "Client Invoices",
  Transactions: "Client Transactions",
  Emails: "Client Emails",
  Orders: "Manage Orders",
  Sales: "Clients Sales Graph",

};



const QUICK_ACTIONS = [

  { label: "Login as Client", color: "#C70039" },

  { label: "Add New Order", color: "#4CAF50" },

  { label: "Set Pricing (2)", color: "#FF9800" },

  { label: "Reset Pricing", color: "#FFC107", textColor: "#333" },

  { label: "View Orders", color: "#03A9F4" },

  { label: "View Transactions", color: "#3F51B5" },

  { label: "Close Client Account", color: "#F44336" },

];



interface ClientSummaryProps {

  isDarkMode?: boolean;

  clientId?: string;

  initialTab?: string;

  onNavigate?: (page: string) => void;

}



export function ClientSummary({ isDarkMode = false, clientId, initialTab = "Summary", onNavigate }: ClientSummaryProps) {

  const [activeTab, setActiveTab] = useState(initialTab);

  const [selectedClientId, setSelectedClientId] = useState(clientId ?? DEMO_CLIENT.id);

  const [selectedPackage, setSelectedPackage] = useState(SEARCH_PACKAGES[0]);

  const [packages, setPackages] = useState(SEARCH_PACKAGES);



  const client: ClientRecord =

    CLIENT_LIST.find((c) => c.id === selectedClientId) ?? DEMO_CLIENT;



  const cardBg = isDarkMode ? "#252830" : "#FFFFFF";

  const borderColor = isDarkMode ? "#333333" : "#E5E7EB";

  const textColor = isDarkMode ? "#E5E7EB" : "#333333";

  const mutedColor = isDarkMode ? "#9CA3AF" : "#6B7280";

  const contentBg = isDarkMode ? "#1A1C21" : "#F4F5F7";



  const allClients = [DEMO_CLIENT, ...CLIENT_LIST];

  const pageTitle = TAB_TITLES[activeTab] ?? `Client ${activeTab}`;

  useEffect(() => {
    if (clientId) {
      setSelectedClientId(clientId);
      setActiveTab("Summary");
    }
  }, [clientId]);

  function handleQuickAction(label: string) {

    if (label.startsWith("Set Pricing") && onNavigate) {

      onNavigate("set-pricing");

      return;

    }

    if (label === "View Transactions") {

      setActiveTab("Transactions");

    }

  }



  return (

    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: contentBg }}>

      <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>

          <h1 style={{ fontSize: "20px", fontWeight: 600, color: isDarkMode ? "#DF2A57" : "#C70039", margin: 0 }}>

            {pageTitle}

          </h1>



          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>

            <label style={{ fontSize: "12px", color: mutedColor, fontWeight: 500 }}>Client</label>

            <select

              value={selectedClientId}

              onChange={(e) => setSelectedClientId(e.target.value)}

              style={{

                minWidth: "240px",

                height: "36px",

                padding: "0 12px",

                fontSize: "13px",

                border: `1px solid ${borderColor}`,

                borderRadius: "4px",

                background: cardBg,

                color: textColor,

                cursor: "pointer",

              }}

            >

              {allClients.map((c) => (

                <option key={c.id} value={c.id}>{c.companyName}</option>

              ))}

            </select>

          </div>

        </div>



        <div style={{ display: "flex", marginBottom: "20px", borderRadius: "4px", overflow: "hidden" }}>

          {TABS.map((tab, i) => {

            const isActive = activeTab === tab;

            return (

              <button

                key={tab}

                onClick={() => setActiveTab(tab)}

                style={{

                  padding: "10px 18px",

                  fontSize: "13px",

                  fontWeight: isActive ? 600 : 500,

                  background: isActive ? "#2E1B85" : cardBg,

                  color: isActive ? "#FFFFFF" : textColor,

                  border: `1px solid ${isActive ? "#2E1B85" : borderColor}`,

                  borderLeft: i > 0 ? "none" : `1px solid ${isActive ? "#2E1B85" : borderColor}`,

                  cursor: "pointer",

                  whiteSpace: "nowrap",

                }}

              >

                {tab}

              </button>

            );

          })}

        </div>



        {activeTab === "Summary" && (

          <>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 220px", gap: "20px", marginBottom: "20px" }}>

              <div

                style={{

                  background: cardBg,

                  border: `1px solid ${borderColor}`,

                  borderRadius: "6px",

                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",

                  overflow: "hidden",

                }}

              >

                <div style={{ padding: "14px 20px", borderBottom: `1px solid ${borderColor}`, background: isDarkMode ? "#2A2D34" : "#F9FAFB" }}>

                  <h3 style={{ fontSize: "14px", fontWeight: 600, color: textColor, margin: 0 }}>Basic Information</h3>

                </div>

                <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "10px" }}>

                  <InfoRow label="Company Name" value={client.companyName} mutedColor={mutedColor} textColor={textColor} />

                  <InfoRow label="Address" value={client.address ?? "—"} mutedColor={mutedColor} textColor={textColor} />

                  <InfoRow label="City/State/ZIP" value={client.cityStateZip ?? "—"} mutedColor={mutedColor} textColor={textColor} />

                  <InfoRow label="Country" value={client.country ?? "—"} mutedColor={mutedColor} textColor={textColor} />

                  <InfoRow label="Primary User" value={client.primaryUser ?? "—"} mutedColor={mutedColor} textColor={textColor} />

                  <InfoRow label="Email" value={client.email ?? "—"} mutedColor={mutedColor} textColor={textColor} />

                  <InfoRow label="Phone" value={client.phone ?? "—"} mutedColor={mutedColor} textColor={textColor} />

                </div>

              </div>



              <div

                style={{

                  background: cardBg,

                  border: `1px solid ${borderColor}`,

                  borderRadius: "6px",

                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",

                  overflow: "hidden",

                }}

              >

                <div style={{ padding: "14px 20px", borderBottom: `1px solid ${borderColor}`, background: isDarkMode ? "#2A2D34" : "#F9FAFB" }}>

                  <h3 style={{ fontSize: "14px", fontWeight: 600, color: textColor, margin: 0 }}>Other Information</h3>

                </div>

                <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "10px" }}>

                  <InfoRow label="Client ID" value={client.id} mutedColor={mutedColor} textColor={textColor} />

                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>

                    <span style={{ fontSize: "13px", color: mutedColor, minWidth: "110px" }}>Status</span>

                    <span

                      style={{

                        display: "inline-block",

                        padding: "3px 10px",

                        borderRadius: "12px",

                        fontSize: "11px",

                        fontWeight: 600,

                        background: "#D1FAE5",

                        color: "#065F46",

                      }}

                    >

                      {client.status}

                    </span>

                  </div>

                  <InfoRow label="Client Group" value={client.clientGroup ?? "—"} mutedColor={mutedColor} textColor={textColor} />

                  <InfoRow label="Tax Exempt" value={client.taxExempt ?? "—"} mutedColor={mutedColor} textColor={textColor} />

                  <InfoRow label="Signup Date" value={client.signupDate ?? "—"} mutedColor={mutedColor} textColor={textColor} />

                  <InfoRow label="Last Login" value={client.lastLogin ?? "—"} mutedColor={mutedColor} textColor={textColor} />

                </div>

              </div>



              <div

                style={{

                  background: cardBg,

                  border: `1px solid ${borderColor}`,

                  borderRadius: "6px",

                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",

                  overflow: "hidden",

                }}

              >

                <div style={{ padding: "14px 20px", borderBottom: `1px solid ${borderColor}`, background: isDarkMode ? "#2A2D34" : "#F9FAFB" }}>

                  <h3 style={{ fontSize: "14px", fontWeight: 600, color: textColor, margin: 0 }}>Quick Actions</h3>

                </div>

                <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>

                  {QUICK_ACTIONS.map((action) => (

                    <button

                      key={action.label}

                      onClick={() => handleQuickAction(action.label)}

                      style={{

                        width: "100%",

                        height: "36px",

                        background: action.color,

                        color: action.textColor ?? "#FFFFFF",

                        border: "none",

                        borderRadius: "4px",

                        fontSize: "12px",

                        fontWeight: 600,

                        cursor: "pointer",

                        whiteSpace: "nowrap",

                      }}

                    >

                      {action.label}

                    </button>

                  ))}

                </div>

              </div>

            </div>



            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>

              <div

                style={{

                  background: cardBg,

                  border: `1px solid ${borderColor}`,

                  borderRadius: "6px",

                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",

                  overflow: "hidden",

                }}

              >

                <div style={{ padding: "14px 20px", borderBottom: `1px solid ${borderColor}` }}>

                  <h3 style={{ fontSize: "14px", fontWeight: 600, color: mutedColor, margin: 0 }}>Invoice Statistics</h3>

                </div>

                <div style={{ padding: 0 }}>

                  {[

                    { label: "Paid:", value: "2 ($0.00)" },

                    { label: "Due:", value: "0 ()" },

                    { label: "Cancelled:", value: "0 ()" },

                    { label: "Refunded:", value: "0 ()" },

                    { label: "Income:", value: "$0.00" },

                    { label: "Credit Balance:", value: "$0.00" },

                  ].map((item, i, arr) => (

                    <div

                      key={item.label}

                      style={{

                        padding: "12px 20px",

                        fontSize: "13px",

                        borderBottom: i < arr.length - 1 ? `1px solid ${borderColor}` : "none",

                        display: "flex",

                        gap: "6px",

                      }}

                    >

                      <span style={{ fontWeight: 600, color: textColor }}>{item.label}</span>

                      <span style={{ color: textColor }}>{item.value}</span>

                    </div>

                  ))}

                </div>

              </div>



              <div

                style={{

                  background: cardBg,

                  border: `1px solid ${borderColor}`,

                  borderRadius: "6px",

                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",

                  overflow: "hidden",

                  display: "flex",

                  flexDirection: "column",

                }}

              >

                <div style={{ padding: "14px 20px", borderBottom: `1px solid ${borderColor}` }}>

                  <h3 style={{ fontSize: "14px", fontWeight: 600, color: mutedColor, margin: 0 }}>Search Packages</h3>

                </div>

                <div style={{ flex: 1, overflowY: "auto", maxHeight: "280px" }}>

                  {packages.map((pkg) => (

                    <div

                      key={pkg}

                      style={{

                        display: "flex",

                        alignItems: "center",

                        padding: "10px 16px",

                        borderBottom: `1px solid ${borderColor}`,

                        gap: "10px",

                      }}

                    >

                      <input

                        type="radio"

                        name="search-package"

                        checked={selectedPackage === pkg}

                        onChange={() => setSelectedPackage(pkg)}

                        style={{ accentColor: "#C70039", cursor: "pointer", flexShrink: 0 }}

                      />

                      <span style={{ flex: 1, fontSize: "13px", color: "#C70039", fontWeight: 500 }}>{pkg}</span>

                      <button

                        onClick={() => {

                          setPackages((prev) => prev.filter((p) => p !== pkg));

                          if (selectedPackage === pkg && packages.length > 1) {

                            setSelectedPackage(packages.find((p) => p !== pkg) ?? "");

                          }

                        }}

                        style={{

                          background: "none",

                          border: "none",

                          cursor: "pointer",

                          color: "#C70039",

                          display: "flex",

                          alignItems: "center",

                          padding: "2px",

                        }}

                      >

                        <Trash2 size={15} />

                      </button>

                    </div>

                  ))}

                </div>

                <div style={{ padding: "14px 16px", display: "flex", gap: "10px", borderTop: `1px solid ${borderColor}` }}>

                  <button

                    style={{

                      flex: 1,

                      height: "34px",

                      background: "#C70039",

                      color: "#FFFFFF",

                      border: "none",

                      borderRadius: "4px",

                      fontSize: "13px",

                      fontWeight: 500,

                      cursor: "pointer",

                    }}

                  >

                    Add Package

                  </button>

                  <button

                    style={{

                      flex: 1,

                      height: "34px",

                      background: "#2E1B85",

                      color: "#FFFFFF",

                      border: "none",

                      borderRadius: "4px",

                      fontSize: "13px",

                      fontWeight: 500,

                      cursor: "pointer",

                    }}

                  >

                    Clone Package

                  </button>

                </div>

              </div>



              <div

                style={{

                  background: cardBg,

                  border: `1px solid ${borderColor}`,

                  borderRadius: "6px",

                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",

                  overflow: "hidden",

                }}

              >

                <div style={{ padding: "14px 20px", borderBottom: `1px solid ${borderColor}` }}>

                  <h3 style={{ fontSize: "14px", fontWeight: 600, color: mutedColor, margin: 0 }}>Last 5 Emails</h3>

                </div>

                <div>

                  {LAST_EMAILS.map((email, i) => (

                    <div

                      key={i}

                      style={{

                        padding: "12px 20px",

                        fontSize: "13px",

                        borderBottom: i < LAST_EMAILS.length - 1 ? `1px solid ${borderColor}` : "none",

                        lineHeight: 1.5,

                      }}

                    >

                      <span style={{ color: textColor }}>{email.date} - </span>

                      <span style={{ color: "#C70039", fontWeight: 500 }}>{email.subject}</span>

                    </div>

                  ))}

                </div>

              </div>

            </div>

          </>

        )}



        {activeTab === "Billing" && <ClientBillingTab isDarkMode={isDarkMode} />}

        {activeTab === "Profile" && <ClientProfileTab isDarkMode={isDarkMode} />}

        {activeTab === "Branches" && <ClientBranchesTab isDarkMode={isDarkMode} />}

        {activeTab === "Users" && <ClientUsersTab isDarkMode={isDarkMode} />}

        {activeTab === "Invoices" && <ClientInvoicesTab isDarkMode={isDarkMode} />}

        {activeTab === "Transactions" && <ClientTransactionsTab isDarkMode={isDarkMode} />}

        {activeTab === "Emails" && <ClientEmailsTab isDarkMode={isDarkMode} />}

        {activeTab === "Orders" && <ClientOrdersTab isDarkMode={isDarkMode} />}

        {activeTab === "Sales" && <ClientSalesTab isDarkMode={isDarkMode} />}

        {activeTab !== "Summary" &&
          activeTab !== "Billing" &&
          activeTab !== "Profile" &&
          activeTab !== "Branches" &&
          activeTab !== "Users" &&
          activeTab !== "Invoices" &&
          activeTab !== "Transactions" &&
          activeTab !== "Emails" &&
          activeTab !== "Orders" &&
          activeTab !== "Sales" && (

          <div

            style={{

              background: cardBg,

              border: `1px solid ${borderColor}`,

              borderRadius: "6px",

              padding: "40px",

              textAlign: "center",

              color: mutedColor,

              fontSize: "14px",

            }}

          >

            {activeTab} content coming soon.

          </div>

        )}

      </div>

      <Footer isDarkMode={isDarkMode} />

    </div>

  );

}



function InfoRow({

  label,

  value,

  mutedColor,

  textColor,

}: {

  label: string;

  value: string;

  mutedColor: string;

  textColor: string;

}) {

  return (

    <div style={{ display: "flex", gap: "8px", fontSize: "13px" }}>

      <span style={{ color: mutedColor, minWidth: "110px", flexShrink: 0 }}>{label}</span>

      <span style={{ color: textColor, fontWeight: 500 }}>{value}</span>

    </div>

  );

}

