import { useState } from "react";
import { RotateCcw, ArrowRight, ChevronRight } from "lucide-react";

interface Package {
  id: string;
  name: string;
  whatsIncluded: string;
}

interface OrderPageProps {
  title: string;
  showInvitationBanner?: boolean;
  packages: Package[];
  aLaCarteLabel?: string;
}

export function OrderPage({
  title,
  showInvitationBanner = false,
  packages,
  aLaCarteLabel = "CLICK HERE TO VIEW  A LA CARTE SEARCHES",
}: OrderPageProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bannerVisible, setBannerVisible] = useState(true);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function startOver() {
    setSelected(new Set());
  }

  // Split packages into columns of roughly equal thirds
  const col1 = packages.filter((_, i) => i % 3 === 0);
  const col2 = packages.filter((_, i) => i % 3 === 1);
  const col3 = packages.filter((_, i) => i % 3 === 2);

  return (
    <main className="flex-1 flex flex-col min-h-0">
      <div className="flex-1" style={{ padding: "24px 28px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 500, color: "rgb(199, 0, 57)", marginBottom: "16px", marginTop: "0px", }}>{title}</h1>

        {/* Invitation banner */}
        {showInvitationBanner && bannerVisible && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#EFF6FF",
              border: "1px solid #BFDBFE",
              borderRadius: "4px",
              padding: "10px 16px",
              marginBottom: "16px",
              fontSize: "12px",
              color: "#1D4ED8",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#3B82F6" }}>ⓘ</span>
              <span>This is an applicant invitation order.</span>
            </div>
            <button
              onClick={() => setBannerVisible(false)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#93C5FD", fontSize: "16px", lineHeight: 1, padding: "0 2px" }}
            >
              ×
            </button>
          </div>
        )}

        {/* Packages section */}
        <div style={{ border: "1px solid #E5E7EB", borderRadius: "4px" }}>
          {/* Header */}
          <div
            style={{
              background: "#F3F4F6",
              padding: "8px 16px",
              fontSize: "11px",
              fontWeight: 600,
              color: "#6B7280",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              borderBottom: "1px solid #E5E7EB",
            }}
          >
            Packages
          </div>

          {/* Package grid */}
          <div style={{ padding: "16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px 32px" }}>
              {/* Column 1 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {col1.map((pkg) => (
                  <PackageRow
                    key={pkg.id}
                    pkg={pkg}
                    checked={selected.has(pkg.id)}
                    onToggle={() => toggle(pkg.id)}
                  />
                ))}
              </div>
              {/* Column 2 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {col2.map((pkg) => (
                  <PackageRow
                    key={pkg.id}
                    pkg={pkg}
                    checked={selected.has(pkg.id)}
                    onToggle={() => toggle(pkg.id)}
                  />
                ))}
              </div>
              {/* Column 3 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {col3.map((pkg) => (
                  <PackageRow
                    key={pkg.id}
                    pkg={pkg}
                    checked={selected.has(pkg.id)}
                    onToggle={() => toggle(pkg.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* A la carte */}
          <div style={{ borderTop: "1px solid #E5E7EB", padding: "8px 16px" }}>
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "11px",
                fontWeight: 700,
                color: "#C70039",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: 0,

              }}
            >
              {aLaCarteLabel}
            </button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          padding: "32px 0",
        }}
      >
        <button
          onClick={startOver}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "12px",
            color: "#555555",

          }}
        >
          <RotateCcw size={13} />
          Start Over
        </button>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "#C70039",
            border: "none",
            cursor: "pointer",
            color: "#ffffff",
            padding: "8px 18px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: 500,

          }}
        >
          Next
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid #E5E7EB",
          padding: "10px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "10px",
          color: "#9CA3AF",

        }}
      >
        <span>© 2026 EvalRight</span>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <span>📞 1-800-935-9025</span>
          <span>✉ support@evalright.com</span>
        </div>
      </footer>
    </main>
  );
}

function PackageRow({
  pkg,
  checked,
  onToggle,
}: {
  pkg: Package;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700 select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="w-3.5 h-3.5 accent-red-600 cursor-pointer"
      />
      <span>{pkg.name}</span>
      <button
        onClick={(e) => e.preventDefault()}
        className="text-blue-500 hover:text-blue-700 text-[10px] underline ml-1"
      >
        {pkg.whatsIncluded}
      </button>
    </label>
  );
}
