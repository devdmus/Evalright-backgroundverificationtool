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

      }}
    >
      <div
        style={{
          flex: 1,
          padding: "20px",
          background: "#F5F5F5",
        }}
      >
        <h1
          style={{
            fontSize: "22px",
            fontWeight: 500,
            color: "#C70039",
            marginBottom: "24px",
          }}
        >
          {isInvitation ? "Order /w Invitation" : "Order"}
        </h1>

        {/* Invitation banner */}
        {showInvitationBanner && bannerVisible && (
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#EFF6FF",
              border: "1px solid #BFDBFE",
              borderRadius: "4px",
              padding: "10px 40px",
              marginBottom: "25px",
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
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
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
          }}
        >
          {/* PACKAGES header bar */}
          <div
            style={{
              height: "40px",
              background: "#E5E7EB",
              display: "flex",
              alignItems: "center",
              paddingLeft: "20px",
              fontSize: "14px",
              fontWeight: 500,
              color: "#6B7280",
            }}
          >
            PACKAGES
          </div>

          {/* Package rows – 3 columns */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              padding: "24px 20px",
              background: "#FFFFFF",
              alignItems: "start",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {col1.map((pkg) => (
                <PackageRow
                  key={pkg.id}
                  pkg={pkg}
                  checked={selected.has(pkg.id)}
                  onToggle={() => toggle(pkg.id)}
                />
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {col2.map((pkg) => (
                <PackageRow
                  key={pkg.id}
                  pkg={pkg}
                  checked={selected.has(pkg.id)}
                  onToggle={() => toggle(pkg.id)}
                />
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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
              height: "40px",
              background: "#E5E7EB",
              display: "flex",
              alignItems: "center",
              paddingLeft: "20px",
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            <span
              style={{
                color: "#C70039",
                fontSize: "14px",
                fontWeight: 500,
                marginRight: "6px",
              }}
            >
              CLICK HERE TO VIEW
            </span>
            <span
              style={{
                color: "#6B7280",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              A LA CARTE SEARCHES
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
          padding: "60px 0",
        }}
      >
        {/* Start Over */}
        <button
          onClick={startOver}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            height: "40px",
            padding: "0 20px",
            background: "#F3F4F6",
            border: "none",
            borderRadius: "4px",
            fontSize: "14px",
            color: "#4B5563",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          <RotateCcw size={16} />
          Start Over
        </button>

        {/* Next */}
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            height: "40px",
            padding: "0 24px",
            background: "#C70039",
            border: "none",
            borderRadius: "4px",
            fontSize: "14px",
            color: "#FFFFFF",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          Next
          <ArrowRight size={16} />
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
        gap: "8px",
        cursor: "pointer",
        userSelect: "none",
        color: "#4B5563",
      }}
    >
      <input
        type="radio"
        name="package-selection"
        checked={checked}
        onChange={onToggle}
        style={{ accentColor: "#C70039", width: "16px", height: "16px", cursor: "pointer", flexShrink: 0 }}
      />
      <span style={{ fontSize: "14px" }}>{pkg.name}</span>
      <span
        onClick={(e) => e.preventDefault()}
        style={{
          fontSize: "12px",
          color: "#3B82F6",
          background: "#DBEAFE",
          borderRadius: "4px",
          padding: "2px 6px",
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        What's Included?
      </span>
    </label>
  );
}
