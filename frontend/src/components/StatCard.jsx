import { Skeleton } from "./Spinner";

const TONES = {
  indigo: "bg-brand-primary/10 text-brand-primary",
  emerald: "bg-semantic-success/10 text-semantic-success",
  rose: "bg-semantic-danger/10 text-semantic-danger",
  amber: "bg-semantic-warning/10 text-semantic-warning",
  cyan: "bg-brand-accent/15 text-cyan-600",
};

// Dashboard KPI card: tinted icon + big number + supporting line.
const StatCard = ({ label, value, icon, tone = "indigo", hint, loading }) => (
  <div className="rounded-2xl border border-light-border bg-white p-4 shadow-card sm:p-5">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-light-textSecondary">{label}</p>
        {loading ? (
          <Skeleton className="mt-2 h-7 w-28" />
        ) : (
          <p className="mt-1.5 truncate text-[26px] font-bold leading-none tracking-tight text-light-textPrimary tabular-nums">
            {value}
          </p>
        )}
      </div>
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl ${
          TONES[tone] || TONES.indigo
        }`}
        aria-hidden="true"
      >
        {icon}
      </div>
    </div>
    {hint && !loading && (
      <p className="mt-2 truncate text-xs text-light-textMuted">{hint}</p>
    )}
  </div>
);

export default StatCard;
