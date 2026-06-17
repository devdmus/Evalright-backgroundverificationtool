import { Footer } from "../components/Footer";
import { getPageTheme } from "../theme/pageTheme";

export function AnalyticsDashboard({ isDarkMode = false }: { isDarkMode?: boolean }) {
  const t = getPageTheme(isDarkMode);

  const cardStyle: React.CSSProperties = {
    background: t.cardBg,
    border: t.cardBorder,
    borderRadius: "4px",
    padding: "20px 24px",
    boxShadow: t.cardShadow,
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    boxSizing: "border-box",
  };

  const cardTitleStyle: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: 500,
    color: t.label,
    margin: 0,
  };

  const cardValueStyle: React.CSSProperties = {
    fontSize: "14px",
    color: t.textMuted,
    margin: 0,
  };

  const percentageValueStyle: React.CSSProperties = {
    fontSize: "16px",
    fontWeight: 600,
    color: t.text,
    margin: 0,
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, fontFamily: "'Wix Madefor Display', sans-serif" }}>
      <div style={{ flex: 1, padding: "16px 20px", background: t.contentBg, overflowY: "auto", display: "flex", flexDirection: "column", gap: "20px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 500, color: t.title, marginBottom: "0px" }}>
          Analytics Dashboard
        </h1>

        <div>
          <div
            style={{
              display: "inline-block",
              background: t.badgeBg,
              color: t.text,
              padding: "6px 12px",
              borderRadius: "3px",
              fontSize: "13px",
              fontWeight: 500,
            }}
          >
            Analytics Dashboard
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={cardStyle}>
              <h2 style={cardTitleStyle}>Average Unique Counties per Applicant</h2>
              <p style={cardValueStyle}>
                Over the last year: <strong style={{ color: t.text }}>2.24</strong>
              </p>
            </div>
            <div style={cardStyle}>
              <h2 style={cardTitleStyle}>Average Unique Alias Names per Applicant</h2>
              <p style={cardValueStyle}>
                Over the last year: <strong style={{ color: t.text }}>3.52</strong>
              </p>
            </div>
          </div>

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

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
            <div style={cardStyle}>
              <h2 style={cardTitleStyle}>Percentage of Completed Reports Leading to Adverse Action</h2>
              <p style={percentageValueStyle}>0.75%</p>
            </div>
          </div>
        </div>
      </div>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
