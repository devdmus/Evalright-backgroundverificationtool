import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Sidebar, PageKey } from "./components/Sidebar";
import { HomePage } from "./pages/HomePage";
import { ClientManagement } from "./pages/ClientManagement";
import { ClientSummary } from "./pages/ClientSummary";
import { SetPricing } from "./pages/SetPricing";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import { ClientOrdersPage } from "./pages/ClientOrdersPage";
import { AddNewClient } from "./pages/AddNewClient";

const USER_NAME = "Raghu Adaveni";

const PAGE_TITLES: Record<PageKey, string> = {
  home: "Affiliate Home",
  "client-management": "Client Management",
  "add-new-client": "Add New Client",
  "client-invoices": "Client Invoices",
  "mass-mail": "Mass Mail",
  "client-summary": "Client Summary",
  "set-pricing": "Set Pricing",
  "client-orders": "Client Orders",
  "reports-orders": "Order Reports",
  "reports-clients": "Client Reports",
  invoices: "Invoices",
  "account-settings": "Account Settings",
  "client-groups": "Client Groups",
  "signup-pages": "Signup Pages",
  "billing-setup": "Billing Setup",
  "manage-sales-operators": "Manage Sales Operators",
  "manage-email-templates": "Manage E-mail Templates",
  "setup-welcome-email": "Setup Welcome Email",
  "support-bulk-orders": "Bulk Order Requests",
  "support-documents": "Forms & Documents",
  announcements: "Announcements",
  "activity-report": "Activity Report",
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageKey>("home");
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const pageLabel = PAGE_TITLES[currentPage] ?? currentPage;
    document.title = `EvalRight Admin - ${pageLabel}`;
  }, [currentPage]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  function handleViewClient(clientId: string) {
    setSelectedClientId(clientId);
    setCurrentPage("client-summary");
  }

  function renderPage() {
    switch (currentPage) {
      case "home":
        return <HomePage isDarkMode={isDarkMode} onNavigate={setCurrentPage} onViewClient={handleViewClient} />;
      case "client-management":
        return <ClientManagement isDarkMode={isDarkMode} onViewClient={handleViewClient} />;
      case "add-new-client":
        return <AddNewClient isDarkMode={isDarkMode} />;
      case "client-summary":
        return (
          <ClientSummary
            isDarkMode={isDarkMode}
            clientId={selectedClientId}
            onNavigate={(page) => setCurrentPage(page as PageKey)}
          />
        );
      case "set-pricing":
        return <SetPricing isDarkMode={isDarkMode} />;
      case "client-orders":
        return <ClientOrdersPage isDarkMode={isDarkMode} />;
      default:
        return <PlaceholderPage title={PAGE_TITLES[currentPage] ?? currentPage} isDarkMode={isDarkMode} />;
    }
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: isDarkMode ? "#1A1C21" : "#F4F4F4",
        overflow: "hidden",
        fontFamily: "'Wix Madefor Display', sans-serif",
      }}
    >
      <Header
        userName={USER_NAME}
        onMenuToggle={() => setSidebarOpen((o) => !o)}
        sidebarOpen={sidebarOpen}
        onBellClick={() => setCurrentPage("announcements")}
        isAnnouncementsActive={currentPage === "announcements"}
        onAnalyticsClick={() => setCurrentPage("activity-report")}
        isActivityReportActive={currentPage === "activity-report"}
        isDarkMode={isDarkMode}
        onThemeToggle={() => setIsDarkMode(!isDarkMode)}
        onNavigate={(page) => setCurrentPage(page as PageKey)}
      />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} isOpen={sidebarOpen} isDarkMode={isDarkMode} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
