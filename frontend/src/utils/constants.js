export const TRANSACTION_TYPES = [
  { value: "debit", label: "Expense" },
  { value: "credit", label: "Income" },
];

export const PAYMENT_METHODS = [
  { value: "UPI", label: "UPI" },
  { value: "CASH", label: "Cash" },
  { value: "BANK", label: "Bank" },
];

export const PAYMENT_METHOD_LABELS = PAYMENT_METHODS.reduce(
  (acc, { value, label }) => ({ ...acc, [value]: label }),
  {}
);

// The backend paginates lists; the dashboard loads a large window once and
// computes stats client-side to keep the number of requests low.
export const LIST_FETCH_LIMIT = 1000;
export const CATEGORIES_FETCH_LIMIT = 100;

export const TRANSACTION_PAGE_SIZE = 10;
export const CATEGORY_PAGE_SIZE = 12;

export const CHART_MONTH_COUNT = 6;
