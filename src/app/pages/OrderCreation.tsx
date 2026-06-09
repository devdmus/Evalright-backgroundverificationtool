import { useState } from "react";
import { RotateCcw, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { PACKAGES, ALA_CARTE_SEARCHES } from "../data/mockData";
import { Footer } from "../components/Footer";

interface OrderCreationProps {
  isInvitation?: boolean;
  showInvitationBanner?: boolean;
}

export function OrderCreation({ isInvitation = false, showInvitationBanner = false }: OrderCreationProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [alaCarteSelected, setAlaCarteSelected] = useState<Set<string>>(new Set());
  const [bannerVisible, setBannerVisible] = useState(true);
  const [aLaCarteOpen, setALaCarteOpen] = useState(false);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAlaCarte(id: string) {
    setAlaCarteSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function startOver() {
    setSelected(new Set());
    setAlaCarteSelected(new Set());
    setBannerVisible(true);
  }

  // 3-column layout: distribute packages left to right
  const col1 = PACKAGES.filter((_, i) => i % 3 === 0);
  const col2 = PACKAGES.filter((_, i) => i % 3 === 1);
  const col3 = PACKAGES.filter((_, i) => i % 3 === 2);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        fontFamily: "Segoe UI, Arial, sans-serif",
      }}
    >
      <div
        style={{
          flex: 1,
          padding: "20px",
          background: "#F5F5F5",
        }}
      >
        {/* Page title */}
        <h1
          style={{
            fontSize: "20px",
            fontWeight: 500,
            color: "rgb(199, 0, 57)",
            marginBottom: "0px",
            fontFamily: "\"Segoe UI\", Arial, sans-serif",
          }}
        >
          {isInvitation ? "Order /w Invitation" : "Order"}
        </h1>

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
              padding: "8px 16px",
              marginBottom: "16px",
              fontSize: "13px",
              color: "#1D4ED8",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span>ⓘ</span>
              <span>This is an applicant invitation order.</span>
            </div>
            <button
              onClick={() => setBannerVisible(false)}
              style={{
                color: "#93C5FD",
                fontSize: "18px",
                lineHeight: 1,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* Packages section */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E5E7EB",
          }}
        >
          {/* PACKAGES header bar */}
          <div
            style={{
              height: "30px",
              background: "#D9D9D9",
              display: "flex",
              alignItems: "center",
              paddingLeft: "10px",
              fontSize: "11px",
              fontWeight: 500,
              color: "#666666",
              letterSpacing: "0.06em",
            }}
          >
            PACKAGES
          </div>

          {/* Package rows – 3 columns */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              padding: "8px 12px 10px 12px",
              gap: "4px 0",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {col1.map((pkg) => (
                <PackageRow
                  key={pkg.id}
                  pkg={pkg}
                  checked={selected.has(pkg.id)}
                  onToggle={() => toggle(pkg.id)}
                />
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {col2.map((pkg) => (
                <PackageRow
                  key={pkg.id}
                  pkg={pkg}
                  checked={selected.has(pkg.id)}
                  onToggle={() => toggle(pkg.id)}
                />
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
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

          {/* A LA CARTE bar */}
          <div
            onClick={() => setALaCarteOpen((p) => !p)}
            style={{
              height: "30px",
              background: "#D9D9D9",
              display: "flex",
              alignItems: "center",
              paddingLeft: "10px",
              cursor: "pointer",
              gap: "0",
              userSelect: "none",
            }}
          >
            <span
              style={{
                color: "#C70039",
                fontSize: "11px",
                fontWeight: 500,
                marginRight: "6px",
              }}
            >
              CLICK HERE TO VIEW
            </span>
            <span
              style={{
                color: "#666666",
                fontSize: "11px",
                fontWeight: 500,
              }}
            >
              A LA CARTE SEARCHES
            </span>
            <span style={{ marginLeft: "auto", marginRight: "12px", display: "flex", alignItems: "center" }}>
              {aLaCarteOpen
                ? <ChevronUp size={12} style={{ color: "#666" }} />
                : <ChevronDown size={12} style={{ color: "#666" }} />}
            </span>
          </div>

          {/* A La Carte expanded */}
          {aLaCarteOpen && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                padding: "12px 16px",
                gap: "8px 0",
                borderTop: "1px solid #E5E7EB",
              }}
            >
              {ALA_CARTE_SEARCHES.map((item) => (
                <label
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                    color: "#555555",
                    userSelect: "none",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={alaCarteSelected.has(item.id)}
                    onChange={() => toggleAlaCarte(item.id)}
                    style={{ accentColor: "#C70039", width: "14px", height: "14px", cursor: "pointer" }}
                  />
                  {item.name}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action buttons – centered in content area */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          padding: "20px 0",
          background: "#F5F5F5",
        }}
      >
        {/* Start Over */}
        <button
          onClick={startOver}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            height: "36px",
            width: "120px",
            padding: "0 16px",
            background: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: "2px",
            fontSize: "14px",
            color: "#555555",
            cursor: "pointer",
            fontFamily: "Segoe UI, Arial, sans-serif",
            justifyContent: "center",
          }}
        >
          <RotateCcw size={14} />
          Start Over
        </button>

        {/* Next */}
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            height: "36px",
            width: "80px",
            padding: "0 12px",
            background: "#C70039",
            border: "none",
            borderRadius: "2px",
            fontSize: "14px",
            color: "#FFFFFF",
            cursor: "pointer",
            fontFamily: "Segoe UI, Arial, sans-serif",
            fontWeight: 500,
            justifyContent: "center",
          }}
        >
          Next
          <ArrowRight size={14} />
        </button>
      </div>

      <Footer />
    </div>
  );
}

function PackageRow({
  pkg,
  checked,
  onToggle,
}: {
  pkg: { id: string; name: string; whatsIncluded: string };
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "5px",
        cursor: "pointer",
        userSelect: "none",
        fontSize: "11px",
        color: "#333333",
      }}
    >
      <input
        type="radio"
        name="package-selection"
        checked={checked}
        onChange={onToggle}
        style={{ accentColor: "#C70039", width: "11px", height: "11px", cursor: "pointer", flexShrink: 0 }}
      />
      <span style={{ fontSize: "11px", color: "#333" }}>{pkg.name}</span>
      <span
        onClick={(e) => e.preventDefault()}
        style={{
          fontSize: "10px",
          color: "#2563EB",
          background: "#DBEAFE",
          borderRadius: "3px",
          padding: "1px 5px",
          cursor: "pointer",
          whiteSpace: "nowrap",
          fontFamily: "\"Segoe UI\", Arial, sans-serif",
        }}
      >
        {pkg.whatsIncluded}
      </span>
    </label>
  );
}
