import { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "./Modal";
import Field from "./Field";
import Select from "./Select";
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

// Create / edit form used from the dashboard and the transactions page.
// The inner form only mounts while the modal is open, so its state resets
// for every add/edit session without needing an effect.
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
      nextErrors.amount = "Enter an amount greater than 0";
    }
    if (!form.categoryId) {
      nextErrors.categoryId = "Pick a category";
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
        toast.success("Transaction updated");
      } else {
        await createTransaction({ ...payload, categoryId: form.categoryId });
        toast.success(
          form.transactionType === "credit"
            ? "Income added"
            : "Expense added"
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

  const categoryOptions = categories.map((category) => ({
    value: category._id,
    label: category.name,
  }));

  return (
    <Modal
      open
      onClose={submitting ? undefined : onClose}
      title={isEditing ? "Edit transaction" : "Add transaction"}
      description={
        isEditing
          ? "Update the details of this entry."
          : "Record a new income or expense in a few seconds."
      }
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
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
            {submitting
              ? "Saving…"
              : isEditing
                ? "Save changes"
                : "Add transaction"}
          </button>
        </div>
      }
    >
      <form id="transaction-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Type toggle */}
        <fieldset>
          <legend className="mb-1.5 block text-[13px] font-medium text-light-textSecondary">
            Type
          </legend>
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-light-surfaceSecondary p-1">
            {TRANSACTION_TYPES.map(({ value, label }) => {
              const active = form.transactionType === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({ ...prev, transactionType: value }))
                  }
                  aria-pressed={active}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    active
                      ? value === "credit"
                        ? "bg-white text-semantic-success shadow-sm"
                        : "bg-white text-semantic-danger shadow-sm"
                      : "text-light-textSecondary hover:text-light-textPrimary"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Amount" htmlFor="tx-amount" required error={errors.amount}>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-light-textMuted">
                ₹
              </span>
              <input
                id="tx-amount"
                type="number"
                min="0"
                step="any"
                inputMode="decimal"
                placeholder="0"
                value={form.amount}
                onChange={updateField("amount")}
                className={`${inputClasses} pl-8 font-semibold tabular-nums`}
              />
            </div>
          </Field>

          <Field label="Date" htmlFor="tx-date" required>
            <input
              id="tx-date"
              type="date"
              value={form.date}
              onChange={updateField("date")}
              className={inputClasses}
            />
          </Field>
        </div>

        <Field
          label="Category"
          htmlFor="tx-category"
          required
          error={errors.categoryId}
        >
          {categories.length === 0 && !categoriesLoading ? (
            <div className="rounded-xl border border-dashed border-light-border bg-light-surfaceSecondary/60 px-4 py-3 text-sm text-light-textSecondary">
              You need a category first.{" "}
              <Link
                to="/categories"
                onClick={onClose}
                className="font-semibold text-brand-primary hover:underline"
              >
                Create one
              </Link>
              .
            </div>
          ) : (
            <Select
              id="tx-category"
              value={form.categoryId}
              onChange={updateField("categoryId")}
              options={categoryOptions}
              placeholder={
                categoriesLoading ? "Loading categories…" : "Select category"
              }
              disabled={categoriesLoading}
            />
          )}
        </Field>

        <fieldset>
          <legend className="mb-1.5 block text-[13px] font-medium text-light-textSecondary">
            Payment method
          </legend>
          <div className="flex flex-wrap gap-2">
            {PAYMENT_METHODS.map(({ value, label }) => {
              const active = form.paymentMethod === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({ ...prev, paymentMethod: value }))
                  }
                  aria-pressed={active}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                    active
                      ? "border-brand-primary bg-brand-primary/10 text-brand-primary"
                      : "border-light-border bg-white text-light-textSecondary hover:border-brand-primary/40 hover:text-light-textPrimary"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <Field
          label="Note"
          htmlFor="tx-message"
          hint="Optional — what was this for?"
        >
          <textarea
            id="tx-message"
            rows={2}
            placeholder="e.g. Dinner with friends"
            value={form.message}
            onChange={updateField("message")}
            className={textareaClasses}
          />
        </Field>
      </form>
    </Modal>
  );
};

export default TransactionFormModal;
