// Minimalist, modern empty state placeholder
const EmptyState = ({
  icon = null,
  title,
  description,
  action = null,
  className = "",
}) => (
  <div
    className={`flex flex-col items-center justify-center gap-2 px-6 py-14 text-center ${className}`}
  >
    {icon && (
      <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-xl bg-light-surfaceSecondary text-brand-primary">
        {icon}
      </div>
    )}
    <h3 className="text-sm font-semibold text-light-textPrimary">{title}</h3>
    {description && (
      <p className="max-w-xs text-xs text-light-textMuted leading-relaxed">{description}</p>
    )}
    {action && <div className="mt-3.5">{action}</div>}
  </div>
);

export default EmptyState;
