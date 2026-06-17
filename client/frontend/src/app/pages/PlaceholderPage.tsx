import { Footer } from "../components/Footer";
import { getPageTheme } from "../theme/pageTheme";

export function PlaceholderPage({ title, isDarkMode = false }: { title: string; isDarkMode?: boolean }) {
  const t = getPageTheme(isDarkMode);

  return (
    <div className="flex-1 flex flex-col min-h-0" style={{ fontFamily: "'Wix Madefor Display', sans-serif" }}>
      <div className="flex-1 p-6" style={{ background: t.pageBg }}>
        <h1 style={{ fontSize: "20px", fontWeight: 500, color: t.title, marginBottom: "0px" }}>{title}</h1>
        <div
          className="rounded p-10 flex items-center justify-center"
          style={{ background: t.cardBg, border: t.cardBorder, color: t.textMuted, fontSize: "13px" }}
        >
          This module is under construction.
        </div>
      </div>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
