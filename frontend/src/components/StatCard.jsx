import { Skeleton } from "./Spinner";

// Tone → icon color only. No tinted background box — just a clean coloured icon.
const TONE_COLORS = {
  indigo:  { icon: "text-brand-primary",    bar: "bg-brand-primary"    },
  emerald: { icon: "text-semantic-success",  bar: "bg-semantic-success" },
  rose:    { icon: "text-semantic-danger",   bar: "bg-semantic-danger"  },
  amber:   { icon: "text-semantic-warning",  bar: "bg-semantic-warning" },
};

const StatCard = ({ label, value, icon, tone = "indigo", hint, loading }) => {
  const { icon: iconColor, bar } = TONE_COLORS[tone] ?? TONE_COLORS.indigo;
  return (
    <div className="relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-light-border bg-light-surface p-5">
      {/* Coloured top accent line */}
      <span className={`absolute inset-x-0 top-0 h-0.5 ${bar} opacity-60`} />

      <div className="flex items-start justify-between gap-2">
        {/* Label */}
        <p className="text-[12px] font-medium uppercase tracking-wide text-light-textMuted leading-none">
          {label}
        </p>
        {/* Icon — clean, no tinted box */}
        <span className={`text-xl ${iconColor} opacity-80`} aria-hidden>
          {icon}
        </span>
      </div>

      {/* Value */}
      {loading ? (
        <Skeleton className="h-8 w-32" />
      ) : (
        <p className="text-[28px] font-bold leading-none tracking-tight text-light-textPrimary tabular-nums">
          {value}
        </p>
      )}

      {/* Hint */}
      {hint && !loading && (
        <p className="text-[11px] text-light-textMuted">{hint}</p>
      )}
    </div>
  );
};

export default StatCard;
