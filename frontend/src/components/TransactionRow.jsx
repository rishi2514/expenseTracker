import { IoPencil } from "react-icons/io5";
import CategoryIcon from "./CategoryIcon";
import { formatCurrency, formatDayLabel } from "../utils/format";
import { PAYMENT_METHOD_LABELS } from "../utils/constants";

const TransactionRow = ({ transaction, onEdit, showActions = true }) => {
  const isCredit = transaction?.transactionType === "credit";
  const category = transaction?.category;
  const title    = transaction?.message || category?.name || "Transaction";
  const payment  = PAYMENT_METHOD_LABELS[transaction?.paymentMethod];

  return (
    <div className="group flex items-center gap-4 px-5 py-3.5 transition hover:bg-light-surfaceSecondary/60">
      <CategoryIcon name={category?.name} size="md" />

      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium text-light-textPrimary">{title}</p>
        <p className="mt-0.5 truncate text-[11px] text-light-textMuted">
          {category?.name && <span>{category.name} · </span>}
          {formatDayLabel(transaction?.date)}
          {payment && <span> · {payment}</span>}
        </p>
      </div>

      {/* Type badge */}
      <span className={`hidden shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wide sm:inline-block ${
        isCredit ? "badge-income" : "badge-expense"
      }`}>
        {isCredit ? "Income" : "Expense"}
      </span>

      {/* Amount */}
      <p className={`w-24 shrink-0 text-right text-[13px] font-semibold tabular-nums ${
        isCredit ? "text-semantic-success" : "text-light-textPrimary"
      }`}>
        {isCredit ? "+" : "−"}{formatCurrency(transaction?.amount)}
      </p>

      {/* Edit */}
      {showActions && onEdit && (
        <button
          type="button"
          onClick={() => onEdit(transaction)}
          aria-label={`Edit "${title}"`}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-light-textMuted opacity-0 transition hover:bg-light-surfaceSecondary hover:text-brand-primary focus:outline-none group-hover:opacity-100"
        >
          <IoPencil className="text-[13px]" aria-hidden />
        </button>
      )}
    </div>
  );
};

export default TransactionRow;
