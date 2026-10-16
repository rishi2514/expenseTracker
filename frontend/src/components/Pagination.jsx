import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

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
    <div className="flex flex-col items-center justify-between gap-3 border-t border-light-border px-5 py-3 sm:flex-row text-xs">
      <p className="text-light-textMuted font-medium">
        Showing <span className="text-light-textPrimary font-semibold">{from}</span>–
        <span className="text-light-textPrimary font-semibold">{to}</span> of{" "}
        <span className="text-light-textPrimary font-semibold">{totalDocs ?? to}</span>
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => goTo(current - 1)}
          disabled={current === 1}
          aria-label="Previous page"
          className="flex h-7 w-7 items-center justify-center rounded-lg text-light-textMuted transition hover:bg-light-surfaceSecondary hover:text-light-textPrimary disabled:opacity-30 disabled:pointer-events-none"
        >
          <IoChevronBackOutline className="text-xs" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-1">
          {buildPageItems(current, totalPages).map((item, index) =>
            item === "…" ? (
              <span
                key={`gap-${index}`}
                className="px-1 text-xs text-light-textMuted"
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
                    ? "flex h-7 min-w-7 items-center justify-center rounded-lg bg-brand-primary px-2 text-xs font-semibold text-white shadow-xs"
                    : "flex h-7 min-w-7 items-center justify-center rounded-lg px-2 text-xs font-medium text-light-textSecondary transition hover:bg-light-surfaceSecondary hover:text-light-textPrimary"
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
          className="flex h-7 w-7 items-center justify-center rounded-lg text-light-textMuted transition hover:bg-light-surfaceSecondary hover:text-light-textPrimary disabled:opacity-30 disabled:pointer-events-none"
        >
          <IoChevronForwardOutline className="text-xs" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
