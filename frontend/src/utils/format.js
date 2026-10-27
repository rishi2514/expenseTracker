// Centralised formatting helpers (currency, dates, initials).

const compactCurrency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  notation: "compact",
  maximumFractionDigits: 1,
});

const wholeCurrency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const decimalCurrency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatCurrency = (value, { decimals = false, compact = false } = {}) => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return wholeCurrency.format(0);
  if (compact) return compactCurrency.format(amount);
  return decimals ? decimalCurrency.format(amount) : wholeCurrency.format(amount);
};

export const formatDate = (value, options = {}) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options,
  });
};

export const formatDayLabel = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round((startOfToday - startOfDate) / 86400000);

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

export const formatLongDate = (value = new Date()) =>
  new Date(value).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

// "2026-10" -> "Oct" (adds the year when the month is not from the current year)
export const formatMonthLabel = (yearMonth) => {
  const [year, month] = yearMonth.split("-").map(Number);
  const date = new Date(year, (month || 1) - 1, 1);
  const label = date.toLocaleDateString("en-IN", { month: "short" });
  return year === new Date().getFullYear() ? label : `${label} '${String(year).slice(2)}`;
};

// Date value -> "yyyy-mm-dd" in local time (safe for <input type="date">).
export const toDateInputValue = (value = new Date()) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

export const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "?";

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 5) return "Good night";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};
