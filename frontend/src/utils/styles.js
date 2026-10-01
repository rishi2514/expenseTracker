// Shared Tailwind class strings so every screen uses the same visual language.
export const cardClasses =
  "rounded-2xl border border-light-border bg-white shadow-card";

export const labelClasses =
  "mb-1.5 block text-[13px] font-medium text-light-textSecondary";

export const inputClasses =
  "w-full rounded-xl border border-light-border bg-white px-3.5 py-2.5 text-[15px] text-light-textPrimary placeholder:text-light-textMuted transition focus:border-brand-primary focus:outline-none focus:ring-4 focus:ring-brand-primary/10 disabled:cursor-not-allowed disabled:bg-light-surfaceSecondary";

export const selectClasses =
  inputClasses +
  " cursor-pointer appearance-none bg-no-repeat pr-10";

export const textareaClasses = inputClasses + " min-h-[88px] resize-y";

export const buttonPrimary =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-primaryDark focus:outline-none focus:ring-4 focus:ring-brand-primary/20 disabled:cursor-not-allowed disabled:opacity-60";

export const buttonSecondary =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-light-border bg-white px-4 py-2.5 text-sm font-semibold text-light-textPrimary transition hover:bg-light-surfaceSecondary focus:outline-none focus:ring-4 focus:ring-brand-primary/10 disabled:cursor-not-allowed disabled:opacity-60";

export const buttonDanger =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-semantic-danger px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-semantic-danger/20 disabled:cursor-not-allowed disabled:opacity-60";

export const iconButtonClasses =
  "inline-flex h-9 w-9 items-center justify-center rounded-lg text-light-textSecondary transition hover:bg-light-surfaceSecondary hover:text-light-textPrimary focus:outline-none focus:ring-2 focus:ring-brand-primary/30";

export const sectionTitleClasses = "text-[15px] font-semibold text-light-textPrimary";

export const mutedTextClasses = "text-sm text-light-textSecondary";
