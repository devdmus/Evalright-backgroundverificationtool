import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Sidebar, PageKey } from "./components/Sidebar";
import { HomePage } from "./pages/HomePage";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import { ClientOrdersPage } from "./pages/ClientOrdersPage";

const USER_NAME = "Raghu Adaveni";

const PAGE_TITLES: Record<PageKey, string> = {
  home: "Affiliate Home",
  clients: "Clients",
  "client-orders": "Client Orders",
  reports: "Reports",
  invoices: "Invoices",
  "account-settings": "Account Settings",
  "support-center": "Support Center",
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
    document.title = `EvalRight Admin - ${pageLabel}`;
  }, [currentPage]);

  // Apply dark mode class to HTML element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  function renderPage() {
    switch (currentPage) {
      case "home":
        return <HomePage isDarkMode={isDarkMode} onNavigate={setCurrentPage} />;
      case "client-orders":
        return <ClientOrdersPage isDarkMode={isDarkMode} />;
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
        fontFamily: "'Wix Madefor Display', sans-serif",
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
    </div>
  );
}
