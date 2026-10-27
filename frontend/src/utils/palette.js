// Deterministic color palette used by charts and category avatars so the same
// category always gets the same color across the app.
export const CHART_COLORS = [
  "#6366F1",
  "#22D3EE",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#F97316",
  "#3B82F6",
];

export const colorForName = (name = "") => {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return CHART_COLORS[hash % CHART_COLORS.length];
};
