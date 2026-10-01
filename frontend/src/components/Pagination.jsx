import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { iconButtonClasses } from "../utils/styles";

// Builds a compact page list: 1 … 4 5 6 … 20
const buildPageItems = (page, totalPages) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }
  const pages = new Set([1, totalPages, page, page - 1, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);

  const items = [];
  let previous = 0;
  sorted.forEach((p) => {
    if (p - previous > 1) items.push("…");
    items.push(p);
    previous = p;
  });
  return items;
};

const Pagination = ({ page, totalPages, totalDocs, limit = 10, onPageChange }) => {
  if (!totalPages || totalPages <= 1) return null;

  const current = Math.min(page || 1, totalPages);
  const from = (current - 1) * limit + 1;
  const to = Math.min(current * limit, totalDocs || current * limit);

  const goTo = (target) => {
    if (target < 1 || target > totalPages || target === current) return;
    onPageChange(target);
  };

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-light-border px-4 py-3.5 sm:flex-row">
      <p className="text-sm text-light-textSecondary">
        Showing <span className="font-medium text-light-textPrimary">{from}</span>–
        <span className="font-medium text-light-textPrimary">{to}</span> of{" "}
        <span className="font-medium text-light-textPrimary">{totalDocs ?? to}</span>
      </p>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => goTo(current - 1)}
          disabled={current === 1}
          aria-label="Previous page"
          className={iconButtonClasses}
        >
          <IoChevronBack aria-hidden="true" />
        </button>

        <div className="flex items-center gap-1.5">
          {buildPageItems(current, totalPages).map((item, index) =>
            item === "…" ? (
              <span
                key={`gap-${index}`}
                className="px-1.5 text-sm text-light-textMuted"
              >
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => goTo(item)}
                aria-current={item === current ? "page" : undefined}
                className={
                  item === current
                    ? "inline-flex h-9 min-w-9 items-center justify-center rounded-lg bg-brand-primary px-2.5 text-sm font-semibold text-white"
                    : "inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2.5 text-sm font-medium text-light-textSecondary transition hover:bg-light-surfaceSecondary hover:text-light-textPrimary"
                }
              >
                {item}
              </button>
            )
          )}
        </div>

        <button
          type="button"
          onClick={() => goTo(current + 1)}
          disabled={current === totalPages}
          aria-label="Next page"
          className={iconButtonClasses}
        >
          <IoChevronForward aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
