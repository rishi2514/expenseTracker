import { formatCurrency } from "../utils/format";
import { CHART_COLORS } from "../utils/palette";

// SVG donut chart: data = [{ label, value }]
const DonutChart = ({ data = [], height = 176 }) => {
  const total = data.reduce((sum, item) => sum + (item.value || 0), 0);
  const size = height;
  const stroke = 22;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  if (!total) {
    return (
      <div className="flex h-[176px] items-center justify-center rounded-xl border border-dashed border-light-border text-sm text-light-textMuted">
        No expenses to show yet
      </div>
    );
  }

  const segments = data.map((item, index) => {
    const fraction = item.value / total;
    const length = Math.max(fraction * circumference - 3, 0); // 3px gap between slices
    const start = data
      .slice(0, index)
      .reduce((sum, entry) => sum + entry.value / total, 0);
    return {
      key: `${item.label}-${index}`,
      color: item.color || CHART_COLORS[index % CHART_COLORS.length],
      dash: `${length} ${circumference - length}`,
      offset: -start * circumference,
      percent: fraction,
      ...item,
    };
  });

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Expense split by category">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#EEF1F7"
            strokeWidth={stroke}
          />
          {segments.map((segment) => (
            <circle
              key={segment.key}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={stroke}
              strokeDasharray={segment.dash}
              strokeDashoffset={segment.offset}
              strokeLinecap="butt"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            >
              <title>{`${segment.label}: ${formatCurrency(segment.value)}`}</title>
            </circle>
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[11px] uppercase tracking-wide text-light-textMuted">
            Total
          </span>
          <span className="text-lg font-bold text-light-textPrimary tabular-nums">
            {formatCurrency(total, { compact: true })}
          </span>
        </div>
      </div>

      <ul className="w-full min-w-0 flex-1 space-y-2">
        {segments.map((segment) => (
          <li key={segment.key} className="flex items-center gap-2.5">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: segment.color }}
              aria-hidden="true"
            />
            <span className="min-w-0 flex-1 truncate text-sm text-light-textSecondary">
              {segment.label}
            </span>
            <span className="text-sm font-semibold text-light-textPrimary tabular-nums">
              {formatCurrency(segment.value, { compact: true })}
            </span>
            <span className="w-10 text-right text-xs text-light-textMuted tabular-nums">
              {Math.round(segment.percent * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DonutChart;
