import { useMemo, useState } from "react";
import {
  IoAdd,
  IoFilterOutline,
  IoListOutline,
  IoRefreshOutline,
  IoSearchOutline,
  IoCloseOutline,
} from "react-icons/io5";
import useFetch from "../hooks/useFetch";
import useDebounce from "../hooks/useDebounce";
import { getTransactions } from "../api/transactions";
import { getCategories } from "../api/categories";
import TransactionRow from "../components/TransactionRow";
import TransactionFormModal from "../components/TransactionFormModal";
import Pagination from "../components/Pagination";
import Select from "../components/Select";
import EmptyState from "../components/EmptyState";
import { Skeleton } from "../components/Spinner";
import {
  CATEGORIES_FETCH_LIMIT,
  TRANSACTION_PAGE_SIZE,
} from "../utils/constants";
import {
  buttonPrimary,
  buttonSecondary,
  cardClasses,
  inputClasses,
} from "../utils/styles";

const EMPTY_FILTERS = {
  search: "",
  type: "",
  categoryId: "",
  minAmount: "",
  maxAmount: "",
  startDate: "",
  endDate: "",
};

const Transactions = () => {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // Debounced search avoids request spamming
  const search = useDebounce(filters.search, 300);

  const endDateExclusive = useMemo(() => {
    if (!filters.endDate) return undefined;
    const date = new Date(`${filters.endDate}T00:00:00`);
    date.setDate(date.getDate() + 1);
    return date.toISOString();
  }, [filters.endDate]);

  const params = useMemo(
    () => ({
      page,
      limit: TRANSACTION_PAGE_SIZE,
      sortBy: "date",
      sortOrder: "desc",
      search: search.trim() || undefined,
      transactionType: filters.type || undefined,
      categoryId: filters.categoryId || undefined,
      minAmount: filters.minAmount ? Number(filters.minAmount) : undefined,
      maxAmount: filters.maxAmount ? Number(filters.maxAmount) : undefined,
      startDate: filters.startDate
        ? new Date(`${filters.startDate}T00:00:00`).toISOString()
        : undefined,
      endDate: endDateExclusive,
    }),
    [page, search, filters, endDateExclusive]
  );

  const catParams = useMemo(
    () => ({ page: 1, limit: CATEGORIES_FETCH_LIMIT }),
    []
  );

  const transactions = useFetch(() => getTransactions(params), params);
  const categories = useFetch(() => getCategories(catParams), catParams);

  const list = transactions.data || [];
  const meta = transactions.meta;
  const loading = transactions.loading;
  const categoryList = categories.data || [];

  const hasAdvancedFilters = Boolean(
    filters.minAmount || filters.maxAmount || filters.startDate || filters.endDate
  );
  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  const setFilter = (key) => (event) => {
    setFilters((prev) => ({ ...prev, [key]: event.target.value }));
    setPage(1);
  };

  const setTypeFilter = (type) => {
    setFilters((prev) => ({ ...prev, type }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters(EMPTY_FILTERS);
    setPage(1);
  };

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (transaction) => {
    setEditing(transaction);
    setFormOpen(true);
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold tracking-tight text-light-textPrimary sm:text-2xl">
              Transactions
            </h2>
            <span className="rounded-full bg-light-surfaceSecondary px-2.5 py-0.5 text-xs font-semibold text-light-textSecondary">
              {meta?.totalDocs ?? list.length}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-light-textMuted">
            Review, search and filter your transaction history
          </p>
        </div>

        <button type="button" onClick={openAdd} className={buttonPrimary}>
          <IoAdd className="text-lg" aria-hidden="true" />
          <span>New transaction</span>
        </button>
      </div>

      {/* Filter Toolbar Card */}
      <div className={`${cardClasses} p-3.5 space-y-3`}>
        <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <IoSearchOutline
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-light-textMuted text-base"
              aria-hidden="true"
            />
            <input
              type="search"
              value={filters.search}
              onChange={setFilter("search")}
              placeholder="Search by description or note…"
              aria-label="Search transactions"
              className={`${inputClasses} pl-9 py-2 text-xs`}
            />
            {filters.search && (
              <button
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, search: "" }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-light-textMuted hover:text-light-textPrimary text-sm"
              >
                <IoCloseOutline />
              </button>
            )}
          </div>

          {/* Quick Type Segmented Pills */}
          <div className="flex items-center rounded-xl bg-light-surfaceSecondary p-1 shrink-0 text-xs font-medium">
            {[
              { label: "All", value: "" },
              { label: "Income", value: "credit" },
              { label: "Expense", value: "debit" },
            ].map(({ label, value }) => {
              const active = filters.type === value;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setTypeFilter(value)}
                  className={`rounded-lg px-3 py-1.5 transition-all ${
                    active
                      ? "bg-light-surface text-brand-primary font-semibold shadow-xs"
                      : "text-light-textSecondary hover:text-light-textPrimary"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Category Dropdown */}
          <div className="w-full lg:w-48 shrink-0">
            <Select
              value={filters.categoryId}
              onChange={setFilter("categoryId")}
              placeholder="All categories"
              options={categoryList.map((c) => ({ value: c._id, label: c.name }))}
              ariaLabel="Filter by category"
              disabled={categories.loading}
              className="text-xs"
            />
          </div>

          {/* Advanced Filters Toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced((prev) => !prev)}
            className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition shrink-0 ${
              hasAdvancedFilters || showAdvanced
                ? "border-brand-primary/40 bg-brand-primary/10 text-brand-primary"
                : "border-light-border bg-light-surface text-light-textSecondary hover:bg-light-surfaceSecondary"
            }`}
          >
            <IoFilterOutline />
            <span>More Filters</span>
            {hasAdvancedFilters && (
              <span className="flex h-1.5 w-1.5 rounded-full bg-brand-primary" />
            )}
          </button>
        </div>

        {/* Collapsible Advanced Filters Drawer */}
        {showAdvanced && (
          <div className="pt-3 border-t border-light-border/60 animate-fade-in">
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="block text-[11px] font-medium text-light-textMuted uppercase mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={setFilter("startDate")}
                  className={`${inputClasses} py-1.5 text-xs`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-light-textMuted uppercase mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={setFilter("endDate")}
                  className={`${inputClasses} py-1.5 text-xs`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-light-textMuted uppercase mb-1">
                  Min Amount (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={filters.minAmount}
                  onChange={setFilter("minAmount")}
                  placeholder="0"
                  className={`${inputClasses} py-1.5 text-xs`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-light-textMuted uppercase mb-1">
                  Max Amount (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={filters.maxAmount}
                  onChange={setFilter("maxAmount")}
                  placeholder="No limit"
                  className={`${inputClasses} py-1.5 text-xs`}
                />
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between border-t border-light-border/60 pt-2 text-xs">
            <span className="text-[11px] text-light-textMuted">
              Filtering results
            </span>
            <button
              type="button"
              onClick={resetFilters}
              className="text-[11px] font-semibold text-brand-primary hover:underline"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Error Banner */}
      {transactions.error && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-semantic-danger/30 bg-semantic-danger/10 px-4 py-3 text-xs text-semantic-danger">
          <span>Failed to load transactions: {transactions.error}</span>
          <button
            type="button"
            onClick={transactions.refetch}
            className="inline-flex items-center gap-1 font-semibold hover:underline"
          >
            <IoRefreshOutline aria-hidden="true" />
            Retry
          </button>
        </div>
      )}

      {/* Transactions List */}
      <div className={`${cardClasses} overflow-hidden`}>
        {loading ? (
          <div className="divide-y divide-light-border/60">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3 px-5 py-3.5">
                <Skeleton className="h-9 w-9 rounded-xl" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-40" />
                  <Skeleton className="h-2.5 w-28" />
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        ) : list.length === 0 ? (
          hasActiveFilters ? (
            <EmptyState
              icon={<IoSearchOutline className="text-xl" />}
              title="No transactions match your criteria"
              description="Try adjusting your search terms or clearing specific filters to see more results."
              action={
                <button type="button" onClick={resetFilters} className={buttonSecondary}>
                  Clear filters
                </button>
              }
            />
          ) : (
            <EmptyState
              icon={<IoListOutline className="text-xl" />}
              title="No transactions recorded yet"
              description="Record your first income or expense transaction to see it listed here."
              action={
                <button type="button" onClick={openAdd} className={buttonPrimary}>
                  <IoAdd className="text-base" aria-hidden="true" />
                  Add transaction
                </button>
              }
            />
          )
        ) : (
          <>
            <div className="divide-y divide-light-border/60">
              {list.map((transaction) => (
                <TransactionRow
                  key={transaction._id}
                  transaction={transaction}
                  onEdit={openEdit}
                />
              ))}
            </div>
            <Pagination
              page={meta?.page || page}
              totalPages={meta?.totalPages || 1}
              totalDocs={meta?.totalDocs}
              limit={meta?.limit || TRANSACTION_PAGE_SIZE}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      <TransactionFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSuccess={() => {
          transactions.refetch();
          if (!categoryList.length) categories.refetch();
        }}
        transaction={editing}
        categories={categoryList}
        categoriesLoading={categories.loading}
      />
    </div>
  );
};

export default Transactions;
