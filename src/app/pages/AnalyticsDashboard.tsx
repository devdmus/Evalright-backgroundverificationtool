import { Footer } from "../components/Footer";

export function AnalyticsDashboard() {
  const cardStyle: React.CSSProperties = {
    background: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: "4px",
    padding: "20px 24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    boxSizing: "border-box",
  };

  const cardTitleStyle: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: 500,
    color: "#4B5563",
    margin: 0,
  };

  const cardValueStyle: React.CSSProperties = {
    fontSize: "14px",
    color: "#6B7280",
    margin: 0,
  };

  const percentageValueStyle: React.CSSProperties = {
    fontSize: "16px",
    fontWeight: 600,
    color: "#374151",
    margin: 0,
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, fontFamily: "'Wix Madefor Display', sans-serif" }}>
      <div style={{ flex: 1, padding: "16px 20px", background: "#F5F5F5", overflowY: "auto", display: "flex", flexDirection: "column", gap: "20px" }}>
        
        {/* Page Title */}
        <h1 style={{ fontSize: "20px", fontWeight: 500, color: "rgb(199, 0, 57)", marginBottom: "0px" }}>
          Analytics Dashboard
        </h1>

        {/* Breadcrumb Tag */}
        <div>
          <div
            style={{
              display: "inline-block",
              background: "#E5E7EB",
              color: "#374151",
              padding: "6px 12px",
              borderRadius: "3px",
              fontSize: "13px",
              fontWeight: 500,
            }}
          >
            Analytics Dashboard
          </div>
        </div>

        {/* Main Dashboard Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* Section Banner Header */}
          <div
            style={{
              background: "#C70039",
              color: "#FFFFFF",
              padding: "10px 16px",
              fontWeight: 600,
              fontSize: "14px",
              borderTopLeftRadius: "4px",
              borderTopRightRadius: "4px",
            }}
          >
            Analytics Dashboard
          </div>

          {/* Row 1: Average Unique Counties / Alias Names */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={cardStyle}>
              <h2 style={cardTitleStyle}>Average Unique Counties per Applicant</h2>
              <p style={cardValueStyle}>
                Over the last year: <strong style={{ color: "#374151" }}>2.24</strong>
              </p>
            </div>
            <div style={cardStyle}>
              <h2 style={cardTitleStyle}>Average Unique Alias Names per Applicant</h2>
              <p style={cardValueStyle}>
                Over the last year: <strong style={{ color: "#374151" }}>3.52</strong>
              </p>
            </div>
          </div>

          {/* Row 2: Searches Completed in < 1, 8, 24 Hours */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
            <div style={cardStyle}>
              <h2 style={cardTitleStyle}>Searches Completed in &lt; 1 Hour</h2>
              <p style={percentageValueStyle}>48.48%</p>
            </div>
            <div style={cardStyle}>
              <h2 style={cardTitleStyle}>Searches Completed in &lt; 8 Hours</h2>
              <p style={percentageValueStyle}>56.83%</p>
            </div>
            <div style={cardStyle}>
              <h2 style={cardTitleStyle}>Searches Completed in &lt; 24 Hours</h2>
              <p style={percentageValueStyle}>66.67%</p>
            </div>
          </div>

          {/* Row 3: Percentage Leading to Adverse Action */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
            <div style={cardStyle}>
              <h2 style={cardTitleStyle}>Percentage of Completed Reports Leading to Adverse Action</h2>
              <p style={percentageValueStyle}>0.75%</p>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}
