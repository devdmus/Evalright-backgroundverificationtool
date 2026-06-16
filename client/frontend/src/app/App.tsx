import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Sidebar, PageKey } from "./components/Sidebar";
import { OrderCreation } from "./pages/OrderCreation";
import { AllOrderDetails } from "./pages/AllOrderDetails";
import { OrderList } from "./pages/OrderList";
import { DraftOrderList } from "./pages/DraftOrderList";
import { OrderSummaryReport } from "./pages/OrderSummaryReport";
import { ElectronicConsents } from "./pages/ElectronicConsents";
import { AdverseWorksheets } from "./pages/AdverseWorksheets";
import { AdverseActionLog } from "./pages/AdverseActionLog";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import { HomePage } from "./pages/HomePage";
import { ApplicantManager } from "./pages/ApplicantManager";
import { ManageAccount } from "./pages/ManageAccount";
import { ManageUsers } from "./pages/ManageUsers";
import { ManageBranches } from "./pages/ManageBranches";
import { BulkOrderRequests } from "./pages/BulkOrderRequests";
import { DrugScreening } from "./pages/DrugScreening";
import { SetupRandomDrugChecks } from "./pages/SetupRandomDrugChecks";
import { Invoices } from "./pages/Invoices";
import { FormsDocuments } from "./pages/FormsDocuments";
import { EmailActivityLog } from "./pages/EmailActivityLog";
import { ApplicantInviteTemplates } from "./pages/ApplicantInviteTemplates";
import { ApplicantStatistics } from "./pages/ApplicantStatistics";
import { AnnouncementsPage } from "./pages/AnnouncementsPage";
import { ActivityReportPage } from "./pages/ActivityReportPage";
import { AnalyticsDashboard } from "./pages/AnalyticsDashboard";
import { HRSoftwareIntegrations } from "./pages/HRSoftwareIntegrations";
import { DisputesList } from "./pages/DisputesList";
// import { ChatWidget } from "./components/ChatWidget";

const USER_NAME = "Farooq Shaik";

const PAGE_TITLES: Record<PageKey, string> = {
  home: "Home",
  order: "Order",
  "order-invitation": "Order w/ Invitation",
  "order-list": "Order List",
  "reports-all-order-details": "All Order Details",
  "reports-orders-list": "Orders List",
  "reports-draft-orders": "Draft Order List",
  "reports-summary": "Order Summary Report",
  "reports-consents": "Electronic Consents",
  "reports-adverse-worksheets": "Adverse Worksheets",
  "reports-adverse-log": "Adverse Actions Log",
  "reports-analytics": "Analytics",
  "reports-hr": "HR Software Integrations",
  "reports-disputes": "Disputes List",
  applicants: "Applicant Manager",
  "applicant-invite-templates": "Applicant Invite Templates",
  "applicant-statistics": "Applicant Statistics",
  "account-settings": "Manage Account",
  "manage-users": "Manage Users",
  "manage-branches": "Manage Branches",
  "drug-screening": "Drug Screening Dashboard",
  "setup-random-drug-checks": "Setup Random Drug Checks",
  invoices: "Invoices",
  "support-center": "Bulk Order Requests",
  "forms-documents": "Forms & Documents",
  "email-activity": "Email Activity Log",
  announcements: "Announcements",
  "activity-report": "Activity Report",
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageKey>("home");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Dynamically update browser tab title
  useEffect(() => {
    const pageLabel = PAGE_TITLES[currentPage] ?? currentPage;
    document.title = `EvalRight - ${pageLabel}`;
  }, [currentPage]);

  function renderPage() {
    switch (currentPage) {
      case "home":
        return <HomePage isDarkMode={isDarkMode} onNavigate={setCurrentPage} />;
      case "order":
        return <OrderCreation isDarkMode={isDarkMode} onNavigate={setCurrentPage} />;
      case "order-invitation":
        return (
          <OrderCreation
            isInvitation
            showInvitationBanner
            isDarkMode={isDarkMode}
            onNavigate={setCurrentPage}
          />
        );
      case "order-list":
        return <OrderList isDarkMode={isDarkMode} />;
      case "reports-all-order-details":
        return <AllOrderDetails isDarkMode={isDarkMode} />;
      case "reports-orders-list":
        return <OrderList isDarkMode={isDarkMode} />;
      case "reports-draft-orders":
        return <DraftOrderList />;
      case "reports-summary":
        return <OrderSummaryReport />;
      case "reports-consents":
        return <ElectronicConsents />;
      case "reports-adverse-worksheets":
        return <AdverseWorksheets />;
      case "reports-adverse-log":
        return <AdverseActionLog />;
      case "reports-analytics":
        return <AnalyticsDashboard />;
      case "reports-hr":
        return <HRSoftwareIntegrations />;
      case "reports-disputes":
        return <DisputesList />;
      case "applicants":
        return <ApplicantManager isDarkMode={isDarkMode} />;
      case "applicant-invite-templates":
        return <ApplicantInviteTemplates isDarkMode={isDarkMode} onNavigate={setCurrentPage} />;
      case "applicant-statistics":
        return <ApplicantStatistics isDarkMode={isDarkMode} />;
      case "account-settings":
        return <ManageAccount isDarkMode={isDarkMode} />;
      case "manage-users":
        return <ManageUsers isDarkMode={isDarkMode} />;
      case "manage-branches":
        return <ManageBranches isDarkMode={isDarkMode} />;
      case "drug-screening":
        return <DrugScreening isDarkMode={isDarkMode} />;
      case "setup-random-drug-checks":
        return <SetupRandomDrugChecks isDarkMode={isDarkMode} />;
      case "invoices":
        return <Invoices isDarkMode={isDarkMode} />;
      case "support-center":
        return <BulkOrderRequests isDarkMode={isDarkMode} />;
      case "forms-documents":
        return <FormsDocuments isDarkMode={isDarkMode} />;
      case "email-activity":
        return <EmailActivityLog isDarkMode={isDarkMode} />;
      case "announcements":
        return <AnnouncementsPage />;
      case "activity-report":
        return <ActivityReportPage />;
      default:
        return <PlaceholderPage title={PAGE_TITLES[currentPage] ?? currentPage} />;
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
      }}
    >
      {/* Fixed top header */}
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

      {/* Body: sidebar + content */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} isOpen={sidebarOpen} isDarkMode={isDarkMode} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>
          {renderPage()}
        </div>
      </div>

      {/* Floating Chat Widget */}
      {/* <ChatWidget /> */}
    </div>
  );
}
