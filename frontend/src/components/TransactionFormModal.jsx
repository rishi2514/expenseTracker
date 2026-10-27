import { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "./Modal";
import Field from "./Field";
import CustomCategorySelect from "./CustomCategorySelect";
import CustomDatePicker from "./CustomDatePicker";
import { Spinner } from "./Spinner";
import useToast from "../hooks/useToast";
import { createTransaction, updateTransaction } from "../api/transactions";
import { getErrorMessage } from "../utils/error";
import { buttonPrimary, buttonSecondary, inputClasses, textareaClasses } from "../utils/styles";
import { PAYMENT_METHODS, TRANSACTION_TYPES } from "../utils/constants";
import { toDateInputValue } from "../utils/format";

const buildState = (transaction) => ({
  transactionType: transaction?.transactionType || "debit",
  amount: transaction?.amount != null ? String(transaction.amount) : "",
  categoryId: transaction?.category?._id || "",
  date: toDateInputValue(transaction?.date || new Date()),
  paymentMethod: transaction?.paymentMethod || "UPI",
  message: transaction?.message || "",
});

const TransactionFormModal = ({ open, ...props }) => {
  if (!open) return null;
  return <TransactionFormContent {...props} />;
};

const TransactionFormContent = ({
  onClose,
  onSuccess,
  transaction = null,
  categories = [],
  categoriesLoading = false,
}) => {
  const toast = useToast();
  const [form, setForm] = useState(() => buildState(transaction));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const isEditing = Boolean(transaction?._id);

  const updateField = (key) => (event) => {
    const { value } = event.target;
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const nextErrors = {};
    const amount = Number(form.amount);
    if (!form.amount || !Number.isFinite(amount) || amount <= 0) {
      nextErrors.amount = "Please enter an amount greater than 0";
    }
    if (!form.categoryId) {
      nextErrors.categoryId = "Please select a category";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const payload = {
      transactionType: form.transactionType,
      amount: Number(form.amount),
      date: form.date
        ? new Date(`${form.date}T00:00:00`).toISOString()
        : undefined,
      paymentMethod: form.paymentMethod,
      message: form.message.trim(),
    };

    try {
      if (isEditing) {
        await updateTransaction(transaction._id, {
          ...payload,
          category: form.categoryId,
        });
        toast.success("Transaction updated successfully");
      } else {
        await createTransaction({ ...payload, categoryId: form.categoryId });
        toast.success(
          form.transactionType === "credit"
            ? "Income logged successfully"
            : "Expense recorded successfully"
        );
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const isCredit = form.transactionType === "credit";

  return (
    <Modal
      open
      onClose={submitting ? undefined : onClose}
      title={isEditing ? "Edit Transaction" : "New Transaction"}
      description={
        isEditing
          ? "Update details of this entry"
          : "Add an expense or income record to your balance"
      }
      size="md"
      footer={
        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className={buttonSecondary}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="transaction-form"
            disabled={submitting}
            className={buttonPrimary}
          >
            {submitting && <Spinner className="h-4 w-4" />}
            <span>
              {submitting
                ? "Saving…"
                : isEditing
                  ? "Update transaction"
                  : "Save transaction"}
            </span>
          </button>
        </div>
      }
    >
      <form id="transaction-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Type Segmented Switcher */}
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-light-surfaceSecondary p-1">
          {TRANSACTION_TYPES.map(({ value, label }) => {
            const active = form.transactionType === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() =>
                  setForm((prev) => ({ ...prev, transactionType: value }))
                }
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
                  active
                    ? value === "credit"
                      ? "bg-light-surface text-semantic-success shadow-xs font-bold"
                      : "bg-light-surface text-semantic-danger shadow-xs font-bold"
                    : "text-light-textMuted hover:text-light-textPrimary"
                }`}
              >
                <span>{value === "credit" ? "+" : "−"}</span>
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Hero Amount Input */}
        <div>
          <label className="block text-[11px] font-medium text-light-textMuted uppercase mb-1">
            Amount
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-semibold text-light-textMuted">
              ₹
            </span>
            <input
              id="tx-amount"
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              placeholder="0.00"
              value={form.amount}
              onChange={updateField("amount")}
              autoFocus={!isEditing}
              className={`${inputClasses} pl-8 text-xl font-bold tabular-nums tracking-tight py-2.5`}
            />
          </div>
          {errors.amount && (
            <p className="mt-1 text-xs text-semantic-danger">{errors.amount}</p>
          )}
        </div>

        {/* Category & Date Grid */}
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Category"
            htmlFor="tx-category"
            required
            error={errors.categoryId}
          >
            {categories.length === 0 && !categoriesLoading ? (
              <div className="rounded-xl border border-dashed border-light-border bg-light-surfaceSecondary/50 p-2.5 text-xs text-light-textSecondary">
                No categories found.{" "}
                <Link
                  to="/categories"
                  onClick={onClose}
                  className="font-semibold text-brand-primary hover:underline"
                >
                  Create one first
                </Link>
              </div>
            ) : (
              <CustomCategorySelect
                id="tx-category"
                value={form.categoryId}
                onChange={updateField("categoryId")}
                categories={categories}
                placeholder={
                  categoriesLoading ? "Loading categories…" : "Select category"
                }
                disabled={categoriesLoading}
              />
            )}
          </Field>

          <Field label="Date" htmlFor="tx-date" required>
            <CustomDatePicker
              id="tx-date"
              value={form.date}
              onChange={updateField("date")}
            />
          </Field>
        </div>

        {/* Payment Method Pills */}
        <div>
          <label className="block text-[11px] font-medium text-light-textMuted uppercase mb-1.5">
            Payment Method
          </label>
          <div className="flex flex-wrap gap-1.5">
            {PAYMENT_METHODS.map(({ value, label }) => {
              const active = form.paymentMethod === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({ ...prev, paymentMethod: value }))
                  }
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                    active
                      ? "border-brand-primary/50 bg-brand-primary/10 text-brand-primary font-semibold"
                      : "border-light-border bg-light-surface text-light-textSecondary hover:bg-light-surfaceSecondary hover:text-light-textPrimary"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Note / Message */}
        <Field
          label="Note (Optional)"
          htmlFor="tx-message"
        >
          <textarea
            id="tx-message"
            rows={2}
            placeholder="What was this transaction for?"
            value={form.message}
            onChange={updateField("message")}
            className={`${textareaClasses} text-xs min-h-16`}
          />
        </Field>
      </form>
    </Modal>
  );
};

export default TransactionFormModal;
