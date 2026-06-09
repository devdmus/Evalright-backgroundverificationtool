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
      <div className="flex-1 p-6">
        <h1 style={{ fontSize: "20px", fontWeight: 500, color: "rgb(199, 0, 57)", marginBottom: "0px", fontFamily: "\"Segoe UI\", Arial, sans-serif" }}>{title}</h1>

        {/* Invitation banner */}
        {showInvitationBanner && bannerVisible && (
          <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded px-4 py-2 mb-4 text-blue-700 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-blue-500">ⓘ</span>
              <span>This is an applicant invitation order.</span>
            </div>
            <button
              onClick={() => setBannerVisible(false)}
              className="text-blue-400 hover:text-blue-600 text-base leading-none"
            >
              ×
            </button>
          </div>
        )}

        {/* Packages section */}
        <div className="border border-gray-200 rounded">
          <div className="bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
            Packages
          </div>
          <div className="p-4">
            <div className="grid grid-cols-3 gap-x-8 gap-y-2">
              {/* Column 1 */}
              <div className="flex flex-col gap-2">
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
              <div className="flex flex-col gap-2">
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
              <div className="flex flex-col gap-2">
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
          <div className="border-t border-gray-200 px-4 py-2">
            <button className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1">
              {aLaCarteLabel}
            </button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-4 py-6">
        <button
          onClick={startOver}
          className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-800"
        >
          <RotateCcw size={13} />
          Start Over
        </button>
        <button className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-xs">
          Next
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 px-6 py-3 flex items-center justify-between text-[10px] text-gray-400">
        <span>© 2026 EvalRight</span>
        <div className="flex items-center gap-4">
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
