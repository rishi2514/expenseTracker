import { useState } from "react";
import { formatCurrency } from "../utils/format";

// Rounds a max value up to a friendly axis ceiling (1 / 2 / 5 × 10^n).
const niceCeiling = (value) => {
  if (value <= 0) return 1;
  const exponent = Math.floor(Math.log10(value));
  const magnitude = 10 ** exponent;
  const normalized = value / magnitude;
  const nice = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return nice * magnitude;
};

// High-end, interactive financial cash flow bar chart
const BarChart = ({ data = [] }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const maxValue = Math.max(
    1,
    ...data.flatMap((item) => [item.income || 0, item.expense || 0])
  );
  const ceiling = niceCeiling(maxValue);

  const gridRatios = [0.25, 0.5, 0.75, 1];

  const hoveredData = hoveredIdx !== null && data[hoveredIdx] ? data[hoveredIdx] : null;

  return (
    <div className="w-full select-none">
      {/* Top HUD: Hover Summary / Default Legend */}
      <div className="mb-4 flex items-center justify-between text-xs h-7">
        {hoveredData ? (
          <div className="flex items-center gap-3 animate-fade-in font-medium">
            <span className="text-light-textPrimary font-bold text-xs bg-light-surfaceSecondary px-2 py-0.5 rounded-md">
              {hoveredData.label}
            </span>
            <span className="text-emerald-500 font-semibold flex items-center gap-1">
              <span className="text-[10px] uppercase font-bold text-light-textMuted">In</span>
              +{formatCurrency(hoveredData.income || 0)}
            </span>
            <span className="text-rose-500 font-semibold flex items-center gap-1">
              <span className="text-[10px] uppercase font-bold text-light-textMuted">Out</span>
              −{formatCurrency(hoveredData.expense || 0)}
            </span>
            <span className="text-light-textMuted text-[11px] hidden sm:inline">
              (Net: {formatCurrency((hoveredData.income || 0) - (hoveredData.expense || 0))})
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-light-textMuted uppercase font-semibold tracking-wider">
              12-Month Annual Trend
            </span>
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] text-light-textSecondary font-medium ml-auto">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-gradient-to-tr from-brand-primary to-brand-primaryLight shadow-xs" />
            <span>Income</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-gradient-to-tr from-rose-500 to-rose-400 shadow-xs" />
            <span>Expense</span>
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="relative h-[215px] w-full pt-4 pb-2 border-b border-light-border/60">
        {/* Horizontal grid lines */}
        {gridRatios.map((ratio) => (
          <div
            key={ratio}
            className="pointer-events-none absolute inset-x-0 border-t border-dashed border-light-border/40"
            style={{ bottom: `${ratio * 100}%` }}
          >
            {ratio === 1 && (
              <span className="absolute -top-3 right-0 text-[10px] text-light-textMuted font-mono">
                {formatCurrency(ceiling, { compact: true })}
              </span>
            )}
          </div>
        ))}

        {data.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-light-textMuted">
            No transaction records available
          </div>
        ) : (
          <div className="relative z-10 flex h-full items-end justify-between gap-1 sm:gap-1.5 px-0.5">
            {data.map((item, idx) => {
              const isHovered = hoveredIdx === idx;
              const incomeHeight = Math.max(((item.income || 0) / ceiling) * 100, 0);
              const expenseHeight = Math.max(((item.expense || 0) / ceiling) * 100, 0);

              return (
                <div
                  key={item.label}
                  className={`group relative flex h-full flex-1 flex-col justify-end items-center rounded-xl py-1.5 px-0.5 sm:px-1 transition-all duration-200 cursor-pointer ${
                    isHovered
                      ? "bg-light-surfaceSecondary/90 shadow-xs"
                      : "hover:bg-light-surfaceSecondary/40"
                  }`}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {/* Subtle column background track */}
                  <div className="flex h-full w-full items-end justify-center gap-1 sm:gap-1.5 z-10">
                    {/* Income Bar (Gradient + Soft Glow) */}
                    <div className="relative flex h-full w-full max-w-[12px] sm:max-w-[16px] items-end">
                      <div
                        className="w-full rounded-t-md bg-gradient-to-t from-brand-primaryDark to-brand-primaryLight transition-all duration-500 ease-out group-hover:brightness-110"
                        style={{
                          height: `${incomeHeight}%`,
                          minHeight: item.income > 0 ? "4px" : "0px",
                          boxShadow: isHovered ? "0 0 10px rgba(91, 76, 245, 0.45)" : "none",
                        }}
                      />
                    </div>

                    {/* Expense Bar (Gradient + Soft Glow) */}
                    <div className="relative flex h-full w-full max-w-[12px] sm:max-w-[16px] items-end">
                      <div
                        className="w-full rounded-t-md bg-gradient-to-t from-rose-600 to-rose-400 transition-all duration-500 ease-out group-hover:brightness-110"
                        style={{
                          height: `${expenseHeight}%`,
                          minHeight: item.expense > 0 ? "4px" : "0px",
                          boxShadow: isHovered ? "0 0 10px rgba(244, 63, 94, 0.45)" : "none",
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* X-axis Month Labels */}
      <div className="mt-2.5 flex justify-between px-0.5">
        {data.map((item, idx) => (
          <button
            key={item.label}
            type="button"
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            className={`flex-1 text-center text-[10px] sm:text-[11px] font-medium transition-colors truncate px-0.5 ${
              hoveredIdx === idx
                ? "text-brand-primary font-bold scale-105"
                : "text-light-textMuted hover:text-light-textSecondary"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BarChart;
