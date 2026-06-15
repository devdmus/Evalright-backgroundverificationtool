import { useState } from "react";
import { RotateCcw, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { PACKAGES, ALA_CARTE_SEARCHES } from "../data/mockData";
import { Footer } from "../components/Footer";

interface OrderCreationProps {
  isInvitation?: boolean;
  showInvitationBanner?: boolean;
  isDarkMode?: boolean;
}

export function OrderCreation({ isInvitation = false, showInvitationBanner = false, isDarkMode = false }: OrderCreationProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [alaCarteSelected, setAlaCarteSelected] = useState<Set<string>>(new Set());
  const [bannerVisible, setBannerVisible] = useState(true);
  const [aLaCarteOpen, setALaCarteOpen] = useState(false);

  function toggle(id: string) {
    setSelected(id);
  }

  function toggleAlaCarte(id: string) {
    setAlaCarteSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function startOver() {
    setSelected(null);
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
          background: "transparent",
        }}
      >
        <h1
          style={{
            fontSize: "22px",
            fontWeight: 500,
            color: isDarkMode ? "#DF2A57" : "#C70039",
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
          </div>
        )}

        {/* Packages section */}
        <div
          style={{
            background: isDarkMode ? "#252830" : "#FFFFFF",
            border: isDarkMode ? "1px solid #333333" : "none",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          {/* PACKAGES header bar */}
          <div
            style={{
              height: "40px",
              background: isDarkMode ? "#1A1C21" : "#E5E7EB",
              display: "flex",
              alignItems: "center",
              paddingLeft: "20px",
              fontSize: "14px",
              fontWeight: 500,
              color: isDarkMode ? "#9CA3AF" : "#6B7280",
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
              background: isDarkMode ? "#252830" : "#FFFFFF",
              alignItems: "start",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {col1.map((pkg) => (
                <PackageRow
                  key={pkg.id}
                  pkg={pkg}
                  checked={selected === pkg.id}
                  onToggle={() => toggle(pkg.id)}
                  isDarkMode={isDarkMode}
                />
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {col2.map((pkg) => (
                <PackageRow
                  key={pkg.id}
                  pkg={pkg}
                  checked={selected === pkg.id}
                  onToggle={() => toggle(pkg.id)}
                  isDarkMode={isDarkMode}
                />
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {col3.map((pkg) => (
                <PackageRow
                  key={pkg.id}
                  pkg={pkg}
                  checked={selected === pkg.id}
                  onToggle={() => toggle(pkg.id)}
                  isDarkMode={isDarkMode}
                />
              ))}
            </div>
          </div>

          {/* A LA CARTE bar */}
          <div
            onClick={() => setALaCarteOpen((p) => !p)}
            style={{
              height: "40px",
              background: isDarkMode ? "#1A1C21" : "#E5E7EB",
              display: "flex",
              alignItems: "center",
              paddingLeft: "20px",
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            <span
              style={{
                color: isDarkMode ? "#DF2A57" : "#C70039",
                fontSize: "14px",
                fontWeight: 500,
                marginRight: "6px",
              }}
            >
              CLICK HERE TO VIEW
            </span>
            <span
              style={{
                color: isDarkMode ? "#9CA3AF" : "#6B7280",
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
                padding: "24px 20px",
                gap: "16px",
                background: isDarkMode ? "#252830" : "#FFFFFF",
                borderTop: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
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
                    color: isDarkMode ? "#E5E7EB" : "#555555",
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
            background: isDarkMode ? "#252830" : "#F3F4F6",
            border: isDarkMode ? "1px solid #333333" : "none",
            borderRadius: "4px",
            fontSize: "14px",
            color: isDarkMode ? "#9CA3AF" : "#4B5563",
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
  isDarkMode,
}: {
  pkg: { id: string; name: string; whatsIncluded: string };
  checked: boolean;
  onToggle: () => void;
  isDarkMode?: boolean;
}) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        cursor: "pointer",
        userSelect: "none",
        color: isDarkMode ? "#E5E7EB" : "#4B5563",
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
