import { Footer } from "../components/Footer";

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex-1 flex flex-col min-h-0" style={{ fontFamily: "'Wix Madefor Display', sans-serif" }}>
      <div className="flex-1 p-6" style={{ background: "#F6F6F6" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 500, color: "rgb(199, 0, 57)", marginBottom: "0px", }}>{title}</h1>
        <div
          className="rounded p-10 flex items-center justify-center"
          style={{ background: "#FFFFFF", border: "1px solid #E0E0E0", color: "#6C7589", fontSize: "13px" }}
        >
          This module is under construction.
        </div>
      </div>
      <Footer />
    </div>
  );
}
