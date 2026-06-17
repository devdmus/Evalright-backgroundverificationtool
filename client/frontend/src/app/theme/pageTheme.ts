export function getPageTheme(isDarkMode: boolean) {
  return {
    pageBg: isDarkMode ? "#252830" : "#F6F6F6",
    contentBg: isDarkMode ? "#252830" : "#F5F5F5",
    cardBg: isDarkMode ? "#1A1C21" : "#FFFFFF",
    cardBorder: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
    cardShadow: isDarkMode ? "none" : "0 1px 3px rgba(0,0,0,0.05)",
    title: isDarkMode ? "#DF2A57" : "rgb(199, 0, 57)",
    titleAlt: isDarkMode ? "#DF2A57" : "#C70039",
    heading: isDarkMode ? "#E5E7EB" : "#555555",
    text: isDarkMode ? "#E5E7EB" : "#111827",
    textSecondary: isDarkMode ? "#D1D5DB" : "#4B5563",
    textMuted: isDarkMode ? "#9CA3AF" : "#6B7280",
    label: isDarkMode ? "#9CA3AF" : "#4B5563",
    tableHeadBg: isDarkMode ? "#2A2D34" : "#F3F4F6",
    tableHeadBorder: isDarkMode ? "2px solid #333333" : "2px solid #E5E7EB",
    tableRowEven: isDarkMode ? "#1A1C21" : "#FFFFFF",
    tableRowOdd: isDarkMode ? "#252830" : "#F9FAFB",
    tableRowBorder: isDarkMode ? "1px solid #333333" : "1px solid #F3F4F6",
    inputBg: isDarkMode ? "#252830" : "#FFFFFF",
    inputBgMuted: isDarkMode ? "#1A1C21" : "#F2F4F6",
    inputBorder: isDarkMode ? "1px solid #333333" : "1px solid #cbd5e1",
    panelBg: isDarkMode ? "#1A1C21" : "#FFFFFF",
    panelBorder: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
    tabInactiveBg: isDarkMode ? "#2A2D34" : "#f4f4f4",
    tabInactiveBorder: isDarkMode ? "#333333" : "#d4d4d4",
    tabActiveBg: isDarkMode ? "#1A1C21" : "#ebebeb",
    footerBg: isDarkMode ? "#1A1C21" : "#FFFFFF",
    footerBorder: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
    footerText: isDarkMode ? "#9CA3AF" : "#777777",
    sortActive: isDarkMode ? "#E5E7EB" : "#111827",
    sortInactive: isDarkMode ? "#6B7280" : "#A0AEC0",
    link: isDarkMode ? "#DF2A57" : "#C70039",
    badgeBg: isDarkMode ? "#2A2D34" : "#E5E7EB",
    infoBannerBg: isDarkMode ? "rgba(59, 130, 246, 0.15)" : "#EBF4FB",
    infoBannerBorder: isDarkMode ? "1px solid #1E3A5F" : "1px solid #BEE3F8",
    infoBannerText: isDarkMode ? "#93C5FD" : "#4A7C94",
  };
}

export type PageTheme = ReturnType<typeof getPageTheme>;

export function sortIconColors(isDarkMode: boolean, active: boolean, direction: "asc" | "desc") {
  const t = getPageTheme(isDarkMode);
  return {
    asc: active && direction === "asc" ? t.sortActive : t.sortInactive,
    desc: active && direction === "desc" ? t.sortActive : t.sortInactive,
  };
}
