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
import { BulkOrderRequests } from "./pages/BulkOrderRequests";
import { DrugScreening } from "./pages/DrugScreening";
import { ApplicantInviteTemplates } from "./pages/ApplicantInviteTemplates";
import { AnalyticsDashboard } from "./pages/AnalyticsDashboard";
import { HRSoftwareIntegrations } from "./pages/HRSoftwareIntegrations";
import { DisputesList } from "./pages/DisputesList";
// import { ChatWidget } from "./components/ChatWidget";

const USER_NAME = "Suresh Ramakoti";

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
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageKey>("home");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Dynamically update browser tab title
  useEffect(() => {
    const pageLabel = PAGE_TITLES[currentPage] ?? currentPage;
    document.title = `EvalRight - ${pageLabel}`;
  }, [currentPage]);

  function renderPage() {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={setCurrentPage} />;
      case "order":
        return <OrderCreation />;
      case "order-invitation":
        return <OrderCreation isInvitation showInvitationBanner onNavigate={setCurrentPage} />;
      case "order-list":
        return <OrderList />;
      case "reports-all-order-details":
        return <AllOrderDetails />;
      case "reports-orders-list":
        return <OrderList />;
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
        return <ApplicantManager />;
      case "applicant-invite-templates":
        return <ApplicantInviteTemplates />;
      case "account-settings":
        return <ManageAccount />;
      case "manage-users":
        return <ManageUsers />;
      case "drug-screening":
        return <DrugScreening />;
      case "setup-random-drug-checks":
        return <PlaceholderPage title="Setup Random Drug Checks" />;
      case "support-center":
        return <BulkOrderRequests />;
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
        background: "#F4F4F4",
        overflow: "hidden",
      }}
    >
      {/* Fixed top header */}
      <Header userName={USER_NAME} onMenuToggle={() => setSidebarOpen((o) => !o)} />

      {/* Body: sidebar + content */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} isOpen={sidebarOpen} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>
          {renderPage()}
        </div>
      </div>

      {/* Floating Chat Widget */}
      {/* <ChatWidget /> */}
    </div>
  );
}
