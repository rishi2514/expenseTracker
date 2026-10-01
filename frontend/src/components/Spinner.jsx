// Shared loading indicators.

export const Spinner = ({ className = "h-5 w-5" }) => (
  <span
    className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
    aria-hidden="true"
  />
);

export const Skeleton = ({ className = "" }) => (
  <div
    className={`animate-shimmer rounded-lg bg-light-surfaceSecondary ${className}`}
    aria-hidden="true"
  />
);

export const PageLoader = () => (
  <div className="flex min-h-screen w-full items-center justify-center bg-light-background">
    <div className="flex flex-col items-center gap-3">
      <Spinner className="h-8 w-8 text-brand-primary" />
      <p className="text-sm text-light-textSecondary">Loading…</p>
    </div>
  </div>
);

export const InlineLoader = ({ label = "Loading…" }) => (
  <div className="flex min-h-[240px] w-full items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <Spinner className="h-7 w-7 text-brand-primary" />
      <p className="text-sm text-light-textSecondary">{label}</p>
    </div>
  </div>
);
