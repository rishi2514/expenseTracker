import { useState } from "react";
import { formatCurrency } from "../utils/format";
import { CHART_COLORS } from "../utils/palette";

// Premium, interactive fintech donut chart without cluttered progress bars
const DonutChart = ({ data = [], size = 190 }) => {
  const [hoveredKey, setHoveredKey] = useState(null);

  const total = data.reduce((sum, item) => sum + (item.value || 0), 0);
  const stroke = 18;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  if (!total) {
    return (
      <div className="flex h-60 flex-col items-center justify-center rounded-xl border border-dashed border-light-border/60 text-center p-6">
        <div className="h-10 w-10 rounded-full border-2 border-dashed border-light-border/80 flex items-center justify-center text-light-textMuted text-xs mb-2">
          ₹
        </div>
        <p className="text-xs font-medium text-light-textMuted">No expense records found</p>
        <p className="text-[11px] text-light-textMuted/70 mt-0.5">Expenses you log will show here</p>
      </div>
    );
  }

  const segments = data.map((item, index) => {
    const fraction = item.value / total;
    const length = Math.max(fraction * circumference - 3, 0); // 3px subtle elegant gap
    const start = data
      .slice(0, index)
      .reduce((sum, entry) => sum + entry.value / total, 0);
    return {
      key: `${item.label}-${index}`,
      color: item.color || CHART_COLORS[index % CHART_COLORS.length],
      dash: `${length} ${circumference - length}`,
      offset: -start * circumference,
      percent: Math.round(fraction * 100),
      ...item,
    };
  });

  const activeSegment = segments.find((s) => s.key === hoveredKey) || null;

  return (
    <div className="flex flex-col items-center justify-center pt-1 pb-2">
      {/* Centered Donut Ring */}
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90 overflow-visible"
        >
          {/* Subtle Outer Ambient Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            className="donut-track opacity-40"
            strokeWidth={stroke}
          />

          {/* Interactive Segments */}
          {segments.map((segment) => {
            const isHovered = hoveredKey === segment.key;
            return (
              <circle
                key={segment.key}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth={isHovered ? stroke + 4 : stroke}
                strokeDasharray={segment.dash}
                strokeDashoffset={segment.offset}
                strokeLinecap="round"
                className="transition-all duration-200 cursor-pointer origin-center"
                style={{
                  filter: isHovered ? `drop-shadow(0 0 6px ${segment.color}88)` : "none",
                  opacity: hoveredKey && !isHovered ? 0.45 : 1,
                }}
                onMouseEnter={() => setHoveredKey(segment.key)}
                onMouseLeave={() => setHoveredKey(null)}
              />
            );
          })}
        </svg>

        {/* Center Dynamic Label */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center px-3">
          {activeSegment ? (
            <div className="animate-fade-in flex flex-col items-center">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-light-textMuted flex items-center gap-1.5 mb-0.5">
                <span
                  className="h-1.5 w-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: activeSegment.color }}
                />
                <span className="truncate max-w-21.25">{activeSegment.label}</span>
              </span>
              <span className="text-xl font-bold tracking-tight text-light-textPrimary tabular-nums leading-none">
                {formatCurrency(activeSegment.value, { compact: true })}
              </span>
              <span className="mt-1 text-[10px] font-semibold text-brand-primary rounded-full bg-brand-primary/10 px-2 py-0.5">
                {activeSegment.percent}% of total
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-medium uppercase tracking-widest text-light-textMuted mb-0.5">
                Total Outflow
              </span>
              <span className="text-xl font-bold tracking-tight text-light-textPrimary tabular-nums leading-none">
                {formatCurrency(total, { compact: true })}
              </span>
              <span className="mt-1 text-[10px] text-light-textMuted font-medium">
                {segments.length} {segments.length === 1 ? "category" : "categories"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Minimal Interactive Legend Pills (No Progress Bars) */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5 px-2 max-w-[320px]">
        {segments.map((segment) => {
          const isHovered = hoveredKey === segment.key;
          return (
            <button
              key={segment.key}
              type="button"
              onMouseEnter={() => setHoveredKey(segment.key)}
              onMouseLeave={() => setHoveredKey(null)}
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition-all ${
                isHovered
                  ? "bg-light-surfaceSecondary ring-1 ring-brand-primary/40 text-light-textPrimary scale-105"
                  : "bg-light-surfaceSecondary/50 text-light-textSecondary hover:bg-light-surfaceSecondary hover:text-light-textPrimary"
              }`}
            >
              <span
                className="h-1.5 w-1.5 rounded-full shrink-0"
                style={{ backgroundColor: segment.color }}
              />
              <span className="truncate max-w-22.5">{segment.label}</span>
              <span className="text-[10px] text-light-textMuted tabular-nums">
                {segment.percent}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DonutChart;
