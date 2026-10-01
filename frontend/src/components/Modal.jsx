import { useEffect } from "react";
import { IoClose } from "react-icons/io5";

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
      <div
        className="absolute inset-0 bg-light-textPrimary/40 backdrop-blur-[2px] animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl sm:rounded-2xl ${SIZES[size] || SIZES.md} animate-slide-up`}
      >
        <div className="flex items-start gap-4 border-b border-light-border px-5 py-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold text-light-textPrimary">
              {title}
            </h2>
            {description && (
              <p className="mt-0.5 text-sm text-light-textSecondary">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="-mr-1 rounded-lg p-1.5 text-light-textMuted transition hover:bg-light-surfaceSecondary hover:text-light-textPrimary focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
          >
            <IoClose className="text-xl" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {footer && (
          <div className="border-t border-light-border bg-light-surface px-5 py-3.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
