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
import { ClientInvoicesPage } from "./pages/ClientInvoicesPage";
import { MassMailPage } from "./pages/MassMailPage";
import { AccountsReceivableReport } from "./pages/AccountsReceivableReport";
import { ActivityReport } from "./pages/ActivityReport";
import { ClientGroupActivity } from "./pages/ClientGroupActivity";
import { ClientPayments } from "./pages/ClientPayments";
import { CommissionManager } from "./pages/CommissionManager";
import { DailyUsageReport } from "./pages/DailyUsageReport";
import { InactiveClientReport } from "./pages/InactiveClientReport";
import { JurisdictionReport } from "./pages/JurisdictionReport";
import { OrderLossReport } from "./pages/OrderLossReport";

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
  "accounts-receivable": "Accounts Receivable Report",
  "reports-activity": "Activity",
  "reports-client-group-activity": "Client Group Activity",
  "reports-client-payments": "Client Payments",
  "reports-commission-manager": "Commission Manager",
  "reports-daily-usage": "Daily Usage",
  "reports-inactive-client": "Inactive Client",
  "reports-jurisdiction": "Jurisdiction",
  "reports-order-loss": "Order Loss",
  "reports-sales-by-salesperson": "Sales Report by Salesperson",
  "reports-researchers": "Researchers",
  "reports-sales": "Sales",
  "reports-geographic-criminal": "Geographic Criminal Report",
  "reports-income-history": "Income History",
  "reports-package-order-trend": "Package Order Trend",
  "reports-alacarte-frequency": "A La Carte Order Frequency",
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
      case "client-invoices":
        return <ClientInvoicesPage isDarkMode={isDarkMode} />;
      case "mass-mail":
        return <MassMailPage isDarkMode={isDarkMode} />;
      case "accounts-receivable":
        return <AccountsReceivableReport isDarkMode={isDarkMode} onViewClient={handleViewClient} />;
      case "reports-activity":
      case "activity-report":
        return <ActivityReport isDarkMode={isDarkMode} onViewClient={handleViewClient} />;
      case "reports-client-group-activity":
        return <ClientGroupActivity isDarkMode={isDarkMode} onViewClient={handleViewClient} />;
      case "reports-client-payments":
        return (
          <ClientPayments
            isDarkMode={isDarkMode}
            onViewClient={handleViewClient}
            onNavigate={setCurrentPage}
          />
        );
      case "reports-commission-manager":
        return <CommissionManager isDarkMode={isDarkMode} onViewClient={handleViewClient} />;
      case "reports-daily-usage":
        return <DailyUsageReport isDarkMode={isDarkMode} onViewClient={handleViewClient} />;
      case "reports-inactive-client":
        return <InactiveClientReport isDarkMode={isDarkMode} onViewClient={handleViewClient} />;
      case "reports-jurisdiction":
        return <JurisdictionReport isDarkMode={isDarkMode} onViewClient={handleViewClient} />;
      case "reports-order-loss":
        return <OrderLossReport isDarkMode={isDarkMode} onViewClient={handleViewClient} />;
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
