import { useMemo, useState } from "react";
import {
  IoAddOutline,
  IoListOutline,
  IoRefreshOutline,
  IoSearchOutline,
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
  TRANSACTION_TYPES,
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
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // Debounced search avoids a request per keystroke.
  const search = useDebounce(filters.search, 350);

  // The backend treats endDate as a plain date, so we send the following day
  // (local midnight) to include transactions made on the selected day.
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

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  const setFilter = (key) => (event) => {
    setFilters((prev) => ({ ...prev, [key]: event.target.value }));
    // Any filter change returns to the first page.
    setPage(1);
  };

  const resetFilters = () => setFilters(EMPTY_FILTERS);

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
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-light-textPrimary">
            All transactions
          </h2>
          <p className="mt-0.5 text-sm text-light-textSecondary">
            {loading
              ? "Loading…"
              : `${meta?.totalDocs ?? list.length} transaction${(meta?.totalDocs ?? list.length) === 1 ? "" : "s"} found`}
          </p>
        </div>
        <button type="button" onClick={openAdd} className={buttonPrimary}>
          <IoAddOutline className="text-lg" aria-hidden="true" />
          Add transaction
        </button>
      </div>

      {/* Filters */}
      <div className={`${cardClasses} p-4`}>
        <div className="grid gap-3 lg:grid-cols-4">
          <div className="relative lg:col-span-2">
            <IoSearchOutline
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-light-textMuted"
              aria-hidden="true"
            />
            <input
              type="search"
              value={filters.search}
              onChange={setFilter("search")}
              placeholder="Search notes…"
              aria-label="Search transactions"
              className={`${inputClasses} pl-10`}
            />
          </div>

          <Select
            value={filters.type}
            onChange={setFilter("type")}
            placeholder="All types"
            options={TRANSACTION_TYPES}
            ariaLabel="Filter by type"
          />

          <Select
            value={filters.categoryId}
            onChange={setFilter("categoryId")}
            placeholder="All categories"
            options={categoryList.map((category) => ({
              value: category._id,
              label: category.name,
            }))}
            ariaLabel="Filter by category"
            disabled={categories.loading}
          />

          <input
            type="number"
            min="0"
            step="any"
            value={filters.minAmount}
            onChange={setFilter("minAmount")}
            placeholder="Min amount"
            aria-label="Minimum amount"
            className={inputClasses}
          />
          <input
            type="number"
            min="0"
            step="any"
            value={filters.maxAmount}
            onChange={setFilter("maxAmount")}
            placeholder="Max amount"
            aria-label="Maximum amount"
            className={inputClasses}
          />
          <input
            type="date"
            value={filters.startDate}
            onChange={setFilter("startDate")}
            aria-label="From date"
            className={`${inputClasses} text-light-textSecondary`}
          />
          <input
            type="date"
            value={filters.endDate}
            onChange={setFilter("endDate")}
            aria-label="To date"
            className={`${inputClasses} text-light-textSecondary`}
          />
        </div>

        {hasActiveFilters && (
          <div className="mt-3 flex items-center justify-between gap-3 border-t border-light-border pt-3">
            <p className="text-xs text-light-textMuted">
              Filters are applied automatically.
            </p>
            <button type="button" onClick={resetFilters} className={`${buttonSecondary} py-1.5 text-xs`}>
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Error banner */}
      {transactions.error && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-semantic-danger/30 bg-semantic-danger/5 px-4 py-3 text-sm text-semantic-danger">
          <span className="min-w-0 truncate">
            Could not load transactions: {transactions.error}
          </span>
          <button
            type="button"
            onClick={transactions.refetch}
            className="inline-flex shrink-0 items-center gap-1.5 font-semibold hover:underline"
          >
            <IoRefreshOutline aria-hidden="true" />
            Retry
          </button>
        </div>
      )}

      {/* List */}
      <div className={`${cardClasses} overflow-hidden`}>
        {loading ? (
          <div className="divide-y divide-light-border">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3 px-5 py-3.5">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-44" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        ) : list.length === 0 ? (
          hasActiveFilters ? (
            <EmptyState
              icon={<IoSearchOutline className="text-2xl" />}
              title="No transactions match your filters"
              description="Try a wider date range, a different category, or clear what you have set."
              action={
                <button type="button" onClick={resetFilters} className={buttonSecondary}>
                  Clear filters
                </button>
              }
            />
          ) : (
            <EmptyState
              icon={<IoListOutline className="text-2xl" />}
              title="No transactions yet"
              description="Record your first income or expense and it will show up here."
              action={
                <button type="button" onClick={openAdd} className={buttonPrimary}>
                  <IoAddOutline className="text-lg" aria-hidden="true" />
                  Add transaction
                </button>
              }
            />
          )
        ) : (
          <>
            <div className="divide-y divide-light-border">
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
