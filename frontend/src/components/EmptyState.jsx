// Friendly placeholder shown when a list has no items.
const EmptyState = ({
  icon = null,
  title,
  description,
  action = null,
  className = "",
}) => (
  <div
    className={`flex flex-col items-center justify-center gap-2 px-6 py-12 text-center ${className}`}
  >
    {icon && (
      <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
        {icon}
      </div>
    )}
    <h3 className="text-[15px] font-semibold text-light-textPrimary">{title}</h3>
    {description && (
      <p className="max-w-sm text-sm text-light-textSecondary">{description}</p>
    )}
    {action && <div className="mt-3">{action}</div>}
  </div>
);

export default EmptyState;
