interface PaginationProps {
  page: number;
  totalPages: number;
  totalEntries: number;
  perPage: number;
  onPageChange: (page: number) => void;
  isDarkMode?: boolean;
}

export function getPaginationPages(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (current <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis", total];
  }

  if (current >= total - 3) {
    return [1, "ellipsis", total - 4, total - 3, total - 2, total - 1, total];
  }

  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", total];
}

export function Pagination({
  page,
  totalPages,
  totalEntries,
  perPage,
  onPageChange,
  isDarkMode = false,
}: PaginationProps) {
  const startIndex = totalEntries === 0 ? 0 : (page - 1) * perPage + 1;
  const endIndex = Math.min(page * perPage, totalEntries);
  const pages = getPaginationPages(page, totalPages);
  const mutedColor = isDarkMode ? "#9CA3AF" : "#777777";

  return (
    <div
      style={{
        padding: "12px 16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "12px",
        borderTop: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
        background: isDarkMode ? "#252830" : "#FFFFFF",
      }}
    >
      <span style={{ fontSize: "12px", color: mutedColor }}>
        Showing {startIndex} to {endIndex} of {totalEntries} entries
      </span>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <NavArrow disabled={page === 1} onClick={() => onPageChange(1)}>
          «
        </NavArrow>
        <NavArrow disabled={page === 1} onClick={() => onPageChange(page - 1)}>
          ‹
        </NavArrow>

        {totalEntries > 0 &&
          pages.map((p, i) =>
            p === "ellipsis" ? (
              <span
                key={`ellipsis-${i}`}
                style={{
                  fontSize: "12px",
                  color: mutedColor,
                  padding: "0 4px",
                  userSelect: "none",
                }}
              >
                ...
              </span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                style={{
                  background: page === p ? "rgb(199, 0, 57)" : "none",
                  border: "none",
                  color: page === p ? "#FFFFFF" : mutedColor,
                  fontSize: "12px",
                  fontWeight: page === p ? 600 : 400,
                  cursor: "pointer",
                  width: "28px",
                  height: "28px",
                  minWidth: "28px",
                  borderRadius: page === p ? "50%" : "0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                  boxSizing: "border-box",
                  transition: "background 0.15s, color 0.15s",
                }}
              >
                {p}
              </button>
            )
          )}

        <NavArrow disabled={page === totalPages || totalEntries === 0} onClick={() => onPageChange(page + 1)}>
          ›
        </NavArrow>
        <NavArrow disabled={page === totalPages || totalEntries === 0} onClick={() => onPageChange(totalPages)}>
          »
        </NavArrow>
      </div>
    </div>
  );
}

function NavArrow({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: "none",
        border: "none",
        color: "#777777",
        fontSize: "14px",
        lineHeight: 1,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.35 : 1,
        padding: "4px 2px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "20px",
      }}
    >
      {children}
    </button>
  );
}
