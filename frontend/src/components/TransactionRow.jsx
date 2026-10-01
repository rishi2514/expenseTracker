import { IoPencil } from "react-icons/io5";
import CategoryIcon from "./CategoryIcon";
import { formatCurrency, formatDayLabel } from "../utils/format";
import { PAYMENT_METHOD_LABELS } from "../utils/constants";

// Single transaction line item — shared by the dashboard and the list page.
const TransactionRow = ({ transaction, onEdit, showActions = true }) => {
  const isCredit = transaction?.transactionType === "credit";
  const category = transaction?.category;
  const title = transaction?.message || category?.name || "Transaction";
  const payment = PAYMENT_METHOD_LABELS[transaction?.paymentMethod];

  return (
    <div className="group flex items-center gap-3 px-4 py-3 transition hover:bg-light-surfaceSecondary/70 sm:px-5">
      <CategoryIcon name={category?.name} size="md" />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-light-textPrimary">
          {title}
        </p>
        <p className="mt-0.5 truncate text-xs text-light-textMuted">
          {category?.name && `${category.name} · `}
          {formatDayLabel(transaction?.date)}
          {payment && ` · ${payment}`}
        </p>
      </div>

      <span
        className={`hidden shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold sm:inline-block ${
          isCredit
            ? "bg-semantic-success/10 text-semantic-success"
            : "bg-semantic-danger/10 text-semantic-danger"
        }`}
      >
        {isCredit ? "Income" : "Expense"}
      </span>

      <p
        className={`w-24 shrink-0 text-right text-sm font-semibold tabular-nums sm:w-28 sm:text-[15px] ${
          isCredit ? "text-semantic-success" : "text-semantic-danger"
        }`}
      >
        {isCredit ? "+" : "−"}
        {formatCurrency(transaction?.amount)}
      </p>

      {showActions && onEdit && (
        <button
          type="button"
          onClick={() => onEdit(transaction)}
          aria-label={`Edit transaction "${title}"`}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-light-textMuted transition hover:bg-light-surfaceSecondary hover:text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/30 sm:opacity-0 sm:group-hover:opacity-100"
        >
          <IoPencil aria-hidden="true" />
        </button>
      )}
    </div>
  );
};

export default TransactionRow;
