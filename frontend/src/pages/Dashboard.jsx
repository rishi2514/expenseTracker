import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  IoAddOutline,
  IoArrowDownCircleOutline,
  IoArrowUpCircleOutline,
  IoListOutline,
  IoRefreshOutline,
  IoTrendingUpOutline,
  IoWalletOutline,
} from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import useFetch from "../hooks/useFetch";
import { getCategories } from "../api/categories";
import { getTransactions } from "../api/transactions";
import StatCard from "../components/StatCard";
import BarChart from "../components/BarChart";
import DonutChart from "../components/DonutChart";
import TransactionRow from "../components/TransactionRow";
import TransactionFormModal from "../components/TransactionFormModal";
import EmptyState from "../components/EmptyState";
import { Skeleton } from "../components/Spinner";
import {
  CATEGORIES_FETCH_LIMIT,
  CHART_MONTH_COUNT,
  LIST_FETCH_LIMIT,
} from "../utils/constants";
import {
  formatCurrency,
  formatLongDate,
  formatMonthLabel,
  getGreeting,
} from "../utils/format";
import { colorForName } from "../utils/palette";
import {
  buttonPrimary,
  buttonSecondary,
  cardClasses,
} from "../utils/styles";

// Aggregates a transaction list into KPIs, a 6-month series and a category split.
const computeDashboardData = (transactions) => {
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  let totalCredit = 0;
  let totalDebit = 0;
  let monthCredit = 0;
  let monthDebit = 0;
  let monthCount = 0;

  const monthly = new Map();
  const byCategory = new Map();

  transactions.forEach((transaction) => {
    const amount = Number(transaction.amount) || 0;
    const date = new Date(transaction.date);
    if (Number.isNaN(date.getTime())) return;

    const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const isCredit = transaction.transactionType === "credit";

    const bucket = monthly.get(yearMonth) || { income: 0, expense: 0 };
    if (isCredit) {
      totalCredit += amount;
      bucket.income += amount;
    } else {
      totalDebit += amount;
      bucket.expense += amount;
    }
    monthly.set(yearMonth, bucket);

    if (yearMonth === monthKey) {
      monthCount += 1;
      if (isCredit) monthCredit += amount;
      else monthDebit += amount;
    }

    if (!isCredit && transaction.category?.name) {
      byCategory.set(
        transaction.category.name,
        (byCategory.get(transaction.category.name) || 0) + amount
      );
    }
  });

  const series = [];
  const cursor = new Date(
    now.getFullYear(),
    now.getMonth() - (CHART_MONTH_COUNT - 1),
    1
  );
  for (let i = 0; i < CHART_MONTH_COUNT; i += 1) {
    const yearMonth = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`;
    const bucket = monthly.get(yearMonth) || { income: 0, expense: 0 };
    series.push({ label: formatMonthLabel(yearMonth), ...bucket });
    cursor.setMonth(cursor.getMonth() + 1);
  }

  const categorySlice = [...byCategory.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, value]) => ({ label: name, value, color: colorForName(name) }));

  return {
    balance: totalCredit - totalDebit,
    monthCredit,
    monthDebit,
    monthNet: monthCredit - monthDebit,
    monthCount,
    series,
    categorySlice,
    hasExpenses: byCategory.size > 0,
  };
};

const Dashboard = () => {
  const { user } = useAuth();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const txParams = useMemo(
    () => ({ page: 1, limit: LIST_FETCH_LIMIT, sortBy: "date", sortOrder: "desc" }),
    []
  );
  const catParams = useMemo(
    () => ({ page: 1, limit: CATEGORIES_FETCH_LIMIT }),
    []
  );

  const transactions = useFetch(() => getTransactions(txParams), txParams);
  const categories = useFetch(() => getCategories(catParams), catParams);

  const list = useMemo(() => transactions.data || [], [transactions.data]);
  const stats = useMemo(() => computeDashboardData(list), [list]);
  const recent = list.slice(0, 6);
  const loading = transactions.loading;

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
      {/* Greeting + primary action */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-light-textPrimary">
            {getGreeting()}, {user?.name || user?.userName || "there"} 👋
          </h2>
          <p className="mt-1 text-sm text-light-textSecondary">
            {formatLongDate()}
          </p>
        </div>
        <button type="button" onClick={openAdd} className={buttonPrimary}>
          <IoAddOutline className="text-lg" aria-hidden="true" />
          Add transaction
        </button>
      </div>

      {/* Error banner */}
      {transactions.error && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-semantic-danger/30 bg-semantic-danger/5 px-4 py-3 text-sm text-semantic-danger">
          <span>Could not load your transactions: {transactions.error}</span>
          <button
            type="button"
            onClick={transactions.refetch}
            className="inline-flex items-center gap-1.5 font-semibold hover:underline"
          >
            <IoRefreshOutline aria-hidden="true" />
            Retry
          </button>
        </div>
      )}

      {/* KPI cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Overview">
        <StatCard
          label="Total balance"
          value={formatCurrency(stats.balance)}
          icon={<IoWalletOutline />}
          tone="indigo"
          hint="All time income − expenses"
          loading={loading}
        />
        <StatCard
          label="Income this month"
          value={formatCurrency(stats.monthCredit)}
          icon={<IoArrowDownCircleOutline />}
          tone="emerald"
          hint="Received this month"
          loading={loading}
        />
        <StatCard
          label="Expenses this month"
          value={formatCurrency(stats.monthDebit)}
          icon={<IoArrowUpCircleOutline />}
          tone="rose"
          hint="Money out this month"
          loading={loading}
        />
        <StatCard
          label="Net this month"
          value={formatCurrency(stats.monthNet)}
          icon={<IoTrendingUpOutline />}
          tone="amber"
          hint="Income − expenses"
          loading={loading}
        />
      </section>

      {/* Charts */}
      <section className="grid gap-5 lg:grid-cols-3" aria-label="Insights">
        <div className={`${cardClasses} p-5 lg:col-span-2`}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-[15px] font-semibold text-light-textPrimary">
                Cash flow
              </h3>
              <p className="text-xs text-light-textMuted">
                Income vs expenses, last {CHART_MONTH_COUNT} months
              </p>
            </div>
          </div>
          {loading ? (
            <Skeleton className="h-[236px] w-full" />
          ) : (
            <BarChart data={stats.series} />
          )}
        </div>

        <div className={`${cardClasses} p-5`}>
          <div className="mb-4">
            <h3 className="text-[15px] font-semibold text-light-textPrimary">
              Spending by category
            </h3>
            <p className="text-xs text-light-textMuted">
              Where your money goes
            </p>
          </div>
          {loading ? (
            <Skeleton className="h-[176px] w-full" />
          ) : (
            <DonutChart data={stats.categorySlice} />
          )}
        </div>
      </section>

      {/* Recent transactions */}
      <section className={`${cardClasses} overflow-hidden`} aria-label="Recent transactions">
        <div className="flex items-center justify-between gap-3 border-b border-light-border px-5 py-4">
          <h3 className="text-[15px] font-semibold text-light-textPrimary">
            Recent transactions
          </h3>
          <Link
            to="/transactions"
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-primary hover:underline"
          >
            View all
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {loading ? (
          <div className="divide-y divide-light-border">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3 px-5 py-3.5">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        ) : recent.length === 0 ? (
          <EmptyState
            icon={<IoListOutline className="text-2xl" />}
            title="No transactions yet"
            description="Add your first income or expense and your dashboard will come to life."
            action={
              <button type="button" onClick={openAdd} className={buttonPrimary}>
                <IoAddOutline className="text-lg" aria-hidden="true" />
                Add transaction
              </button>
            }
          />
        ) : (
          <div className="divide-y divide-light-border">
            {recent.map((transaction) => (
              <TransactionRow
                key={transaction._id}
                transaction={transaction}
                onEdit={openEdit}
              />
            ))}
          </div>
        )}
      </section>

      {/* Quick links when the account is still empty */}
      {!loading && list.length === 0 && categories.data?.length === 0 && (
        <div className={`${cardClasses} flex flex-col items-center gap-3 p-5 sm:flex-row`}>
          <p className="flex-1 text-sm text-light-textSecondary">
            Tip: create a few categories (Food, Rent, Salary…) before adding
            transactions — it keeps your reports tidy.
          </p>
          <Link to="/categories" className={`${buttonSecondary} shrink-0`}>
            Manage categories
          </Link>
        </div>
      )}

      <TransactionFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSuccess={() => {
          transactions.refetch();
          if (!categories.data?.length) categories.refetch();
        }}
        transaction={editing}
        categories={categories.data || []}
        categoriesLoading={categories.loading}
      />
    </div>
  );
};

export default Dashboard;
