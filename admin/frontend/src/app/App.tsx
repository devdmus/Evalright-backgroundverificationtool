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
import { OrderLossReportPage } from "./pages/OrderLossReportPage";
import { SalesReportBySalespersonPage } from "./pages/SalesReportBySalespersonPage";
import { ResearcherReportPage } from "./pages/ResearcherReportPage";
import { SalesReportPage } from "./pages/SalesReportPage";
import { GeographicCriminalReportPage } from "./pages/GeographicCriminalReportPage";
import { IncomeHistoryPage } from "./pages/IncomeHistoryPage";
import { PackageOrderTrendPage } from "./pages/PackageOrderTrendPage";
import { ALaCarteOrderFrequencyPage } from "./pages/ALaCarteOrderFrequencyPage";
import { MonthlyRevenueReportPage } from "./pages/MonthlyRevenueReportPage";
import { MyInvoicesPage } from "./pages/MyInvoicesPage";
import { AccountSettingsPage } from "./pages/AccountSettingsPage";
import { ClientGroupsPage } from "./pages/ClientGroupsPage";
import { SignupPagesPage } from "./pages/SignupPagesPage";
import { BillingSetupPage } from "./pages/BillingSetupPage";
import { ManageSalesOperatorsPage } from "./pages/ManageSalesOperatorsPage";
import { ManageEmailTemplatesPage } from "./pages/ManageEmailTemplatesPage";
import { SetupWelcomeEmailPage } from "./pages/SetupWelcomeEmailPage";

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
  "accounts-receivable": "Accounts Receivable",
  "reports-activity": "Activity Report",
  "reports-client-group-activity": "Client Group Activity",
  "reports-client-payments": "Client Payments",
  "reports-commission-manager": "Commission Manager",
  "reports-daily-usage": "Daily Usage",
  "reports-inactive-client": "Inactive Client",
  "reports-jurisdiction": "Jurisdiction",
  "reports-order-loss": "Order Loss Report",
  "reports-sales-by-salesperson": "Sales Report by Salesperson",
  "reports-researchers": "Researchers",
  "reports-sales": "Sales Report",
  "reports-geographic-criminal": "Geographic Criminal Report",
  "reports-income-history": "Income History",
  "reports-package-order-trend": "Package Order Trend",
  "reports-a-la-carte-frequency": "A La Carte Order Frequency",
  "reports-monthly-revenue": "Monthly Revenue Report",
  invoices: "My Invoices",
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
        return <OrderLossReportPage isDarkMode={isDarkMode} onViewClient={handleViewClient} />;
      case "reports-sales-by-salesperson":
        return <SalesReportBySalespersonPage isDarkMode={isDarkMode} />;
      case "reports-researchers":
        return <ResearcherReportPage isDarkMode={isDarkMode} />;
      case "reports-sales":
        return <SalesReportPage isDarkMode={isDarkMode} onViewClient={handleViewClient} />;
      case "reports-geographic-criminal":
        return <GeographicCriminalReportPage isDarkMode={isDarkMode} />;
      case "reports-income-history":
        return <IncomeHistoryPage isDarkMode={isDarkMode} />;
      case "reports-package-order-trend":
        return <PackageOrderTrendPage isDarkMode={isDarkMode} />;
      case "reports-a-la-carte-frequency":
        return <ALaCarteOrderFrequencyPage isDarkMode={isDarkMode} />;
      case "reports-monthly-revenue":
        return <MonthlyRevenueReportPage isDarkMode={isDarkMode} />;
      case "invoices":
        return <MyInvoicesPage isDarkMode={isDarkMode} />;
      case "account-settings":
        return <AccountSettingsPage isDarkMode={isDarkMode} />;
      case "client-groups":
        return <ClientGroupsPage isDarkMode={isDarkMode} onNavigate={setCurrentPage} />;
      case "signup-pages":
        return <SignupPagesPage isDarkMode={isDarkMode} />;
      case "billing-setup":
        return <BillingSetupPage isDarkMode={isDarkMode} />;
      case "manage-sales-operators":
        return <ManageSalesOperatorsPage isDarkMode={isDarkMode} />;
      case "manage-email-templates":
        return <ManageEmailTemplatesPage isDarkMode={isDarkMode} />;
      case "setup-welcome-email":
        return <SetupWelcomeEmailPage isDarkMode={isDarkMode} />;
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
