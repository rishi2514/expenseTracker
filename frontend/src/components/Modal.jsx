import { useEffect } from "react";
import { IoCloseOutline } from "react-icons/io5";

const SIZES = {
  sm: "sm:max-w-md",
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
};

// Generic modal: closes on Escape / backdrop click and locks body scroll.
const Modal = ({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
  footer = null,
}) => {
  useEffect(() => {
    if (!open) return undefined;

    const handleKey = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 modal-backdrop backdrop-blur-xs animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl border border-light-border bg-light-surface shadow-2xl sm:rounded-2xl ${
          SIZES[size] || SIZES.md
        } animate-slide-up`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-light-border px-5 py-3.5">
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold text-light-textPrimary tracking-tight">
              {title}
            </h2>
            {description && (
              <p className="mt-0.5 text-[11px] text-light-textMuted">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1 text-light-textMuted transition hover:bg-light-surfaceSecondary hover:text-light-textPrimary"
          >
            <IoCloseOutline className="text-lg" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-light-border bg-light-surfaceSecondary/40 px-5 py-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
