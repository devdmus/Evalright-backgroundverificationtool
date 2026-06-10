import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Sidebar, PageKey } from "./components/Sidebar";
import { OrderCreation } from "./pages/OrderCreation";
import { ReportsOrders } from "./pages/ReportsOrders";
import { AllOrderDetails } from "./pages/AllOrderDetails";
import { OrderList } from "./pages/OrderList";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import { HomePage } from "./pages/HomePage";
import { ApplicantManager } from "./pages/ApplicantManager";
import { ManageAccount } from "./pages/ManageAccount";
import { ManageUsers } from "./pages/ManageUsers";
import { BulkOrderRequests } from "./pages/BulkOrderRequests";
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
  "drug-screening": "Drug Screening",
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
        return <HomePage />;
      case "order":
        return <OrderCreation />;
      case "order-invitation":
        return <OrderCreation isInvitation showInvitationBanner />;
      case "order-list":
        return <OrderList />;
      case "reports-all-order-details":
        return <AllOrderDetails />;
      case "reports-orders-list":
        return <ReportsOrders />;
      case "applicants":
        return <ApplicantManager />;
      case "account-settings":
        return <ManageAccount />;
      case "manage-users":
        return <ManageUsers />;
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
