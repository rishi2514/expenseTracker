// Design system — shared Tailwind utility strings.
// All bg/border/text tokens are CSS-var-backed → they flip automatically in dark mode.

// ── Cards ──────────────────────────────────────────────────────────────────
export const cardClasses =
  "rounded-2xl border border-light-border bg-light-surface";

// ── Labels ─────────────────────────────────────────────────────────────────
export const labelClasses =
  "mb-1.5 block text-[12px] font-medium uppercase tracking-wide text-light-textMuted";

// ── Inputs ─────────────────────────────────────────────────────────────────
export const inputClasses =
  "w-full rounded-xl border border-light-border bg-light-surface px-3.5 py-2.5 text-[14px] text-light-textPrimary placeholder:text-light-textMuted outline-none transition focus:border-brand-primary focus:ring-3 focus:ring-brand-primary/12 disabled:cursor-not-allowed disabled:opacity-50";

export const selectClasses =
  inputClasses + " cursor-pointer appearance-none bg-no-repeat pr-10";

export const textareaClasses = inputClasses + " min-h-[80px] resize-y";

// ── Buttons ────────────────────────────────────────────────────────────────
export const buttonPrimary =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white outline-none transition hover:bg-brand-primaryDark focus:ring-3 focus:ring-brand-primary/25 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]";

export const buttonSecondary =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-light-border bg-light-surface px-4 py-2.5 text-sm font-semibold text-light-textPrimary outline-none transition hover:bg-light-surfaceSecondary focus:ring-3 focus:ring-brand-primary/12 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]";

export const buttonDanger =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-semantic-danger px-4 py-2.5 text-sm font-semibold text-white outline-none transition hover:opacity-90 focus:ring-3 focus:ring-semantic-danger/25 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]";

export const iconButtonClasses =
  "inline-flex h-8 w-8 items-center justify-center rounded-lg text-light-textMuted outline-none transition hover:bg-light-surfaceSecondary hover:text-light-textPrimary focus:ring-2 focus:ring-brand-primary/20";

export const sectionTitleClasses = "text-[15px] font-semibold text-light-textPrimary";
export const mutedTextClasses    = "text-sm text-light-textSecondary";
