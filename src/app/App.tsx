import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Sidebar, PageKey } from "./components/Sidebar";
import { OrderCreation } from "./pages/OrderCreation";
import { ReportsOrders } from "./pages/ReportsOrders";
import { AllOrderDetails } from "./pages/AllOrderDetails";
import { OrderList } from "./pages/OrderList";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import { HomePage } from "./pages/HomePage";

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
  applicants: "Applicants",
  "account-settings": "Account Settings",
  "drug-screening": "Drug Screening",
  invoices: "Invoices",
  "support-center": "Support Center",
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageKey>("order");

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
      default:
        return <PlaceholderPage title={PAGE_TITLES[currentPage] ?? currentPage} />;
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Segoe UI, Arial, sans-serif",
        background: "#F4F4F4",
      }}
    >
      {/* Fixed top header */}
      <Header userName={USER_NAME} />

      {/* Body: sidebar + content */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
