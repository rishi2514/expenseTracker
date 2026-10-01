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

// Grouped income vs expense bar chart. data = [{ label, income, expense }]
const BarChart = ({ data = [] }) => {
  const maxValue = Math.max(
    1,
    ...data.flatMap((item) => [item.income || 0, item.expense || 0])
  );
  const ceiling = niceCeiling(maxValue);

  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div>
      <div className="mb-3 flex items-center justify-end gap-4 text-xs text-light-textSecondary">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-brand-primary" aria-hidden="true" />
          Income
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-semantic-danger" aria-hidden="true" />
          Expense
        </span>
      </div>

      <div className="relative flex h-[200px] items-end gap-4 border-b border-light-border">
        {/* Grid lines + top scale label */}
        {gridLines.map((ratio) => (
          <div
            key={ratio}
            className="pointer-events-none absolute inset-x-0 border-t border-dashed border-light-border/80"
            style={{ bottom: `${ratio * 100}%` }}
            aria-hidden="true"
          >
            {ratio === 1 && (
              <span className="absolute -top-2.5 right-0 bg-white px-1 text-[10px] text-light-textMuted tabular-nums">
                {formatCurrency(ceiling, { compact: true })}
              </span>
            )}
          </div>
        ))}

        {data.length === 0 && (
          <p className="absolute inset-0 flex items-center justify-center text-sm text-light-textMuted">
            No data yet
          </p>
        )}

        {data.map((item) => (
          <div
            key={item.label}
            className="relative z-10 flex h-full flex-1 items-end justify-center gap-1.5"
          >
            <div
              className="w-full max-w-[22px] rounded-t-md bg-brand-primary transition-all duration-500 hover:opacity-80"
              style={{ height: `${Math.max(((item.income || 0) / ceiling) * 100, 0)}%` }}
              title={`Income ${formatCurrency(item.income || 0)}`}
            />
            <div
              className="w-full max-w-[22px] rounded-t-md bg-semantic-danger transition-all duration-500 hover:opacity-80"
              style={{ height: `${Math.max(((item.expense || 0) / ceiling) * 100, 0)}%` }}
              title={`Expense ${formatCurrency(item.expense || 0)}`}
            />
          </div>
        ))}
      </div>

      <div className="mt-2 flex gap-4">
        {data.map((item) => (
          <p
            key={item.label}
            className="flex-1 text-center text-[11px] font-medium text-light-textMuted"
          >
            {item.label}
          </p>
        ))}
      </div>
    </div>
  );
};

export default BarChart;
