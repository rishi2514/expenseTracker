import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  IoAdd,
  IoArrowDownOutline,
  IoArrowUpOutline,
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
  const recent = list.slice(0, 8);
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
    <div className="space-y-6">
      {/* Top Banner / Welcome row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-1">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-light-textPrimary sm:text-2xl">
            {getGreeting()}, {user?.name ? user.name.split(" ")[0] : (user?.userName || "there")}
          </h2>
          <p className="mt-0.5 text-xs text-light-textMuted font-medium">
            {formatLongDate()} · Financial overview
          </p>
        </div>

        <button
          type="button"
          onClick={openAdd}
          className={`${buttonPrimary} shadow-sm shadow-brand-primary/20`}
        >
          <IoAdd className="text-lg" aria-hidden="true" />
          <span>New transaction</span>
        </button>
      </div>

      {/* Error notification */}
      {transactions.error && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-semantic-danger/30 bg-semantic-danger/10 px-4 py-3 text-xs text-semantic-danger">
          <span>Failed to load transaction data: {transactions.error}</span>
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

      {/* KPI Cards Grid */}
      <section className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4" aria-label="Key Performance Indicators">
        <StatCard
          label="Total Balance"
          value={formatCurrency(stats.balance)}
          icon={<IoWalletOutline />}
          tone="indigo"
          hint="Net cumulative standing"
          loading={loading}
        />
        <StatCard
          label="Income (This Month)"
          value={formatCurrency(stats.monthCredit)}
          icon={<IoArrowDownOutline />}
          tone="emerald"
          hint="Deposits & revenue"
          loading={loading}
        />
        <StatCard
          label="Expenses (This Month)"
          value={formatCurrency(stats.monthDebit)}
          icon={<IoArrowUpOutline />}
          tone="rose"
          hint="Total monthly outflow"
          loading={loading}
        />
        <StatCard
          label="Net Savings"
          value={formatCurrency(stats.monthNet)}
          icon={<IoTrendingUpOutline />}
          tone="amber"
          hint="Income minus expenses"
          loading={loading}
        />
      </section>

      {/* Analytics & Charts */}
      <section className="grid gap-4 lg:grid-cols-3" aria-label="Analytics Insights">
        {/* Cash Flow Bar Chart */}
        <div className={`${cardClasses} p-5 lg:col-span-2`}>
          <div className="mb-4">
            <h3 className="text-[14px] font-semibold text-light-textPrimary tracking-tight">
              Cash Flow Trend
            </h3>
            <p className="text-[11px] text-light-textMuted">
              Income vs expenses across the past 12 months (1 year)
            </p>
          </div>
          {loading ? (
            <Skeleton className="h-52.5 w-full" />
          ) : (
            <BarChart data={stats.series} />
          )}
        </div>

        {/* Category Breakdown Donut Chart */}
        <div className={`${cardClasses} p-5`}>
          <div className="mb-4">
            <h3 className="text-[14px] font-semibold text-light-textPrimary tracking-tight">
              Top Expenses
            </h3>
            <p className="text-[11px] text-light-textMuted">
              Spending distribution by category
            </p>
          </div>
          {loading ? (
            <Skeleton className="h-45 w-full" />
          ) : (
            <DonutChart data={stats.categorySlice} />
          )}
        </div>
      </section>

      {/* Recent Transactions Table */}
      <section className={`${cardClasses} overflow-hidden`} aria-label="Recent Transactions">
        <div className="flex items-center justify-between border-b border-light-border px-5 py-3.5">
          <div>
            <h3 className="text-[14px] font-semibold text-light-textPrimary tracking-tight">
              Recent Transactions
            </h3>
            <p className="text-[11px] text-light-textMuted">
              Latest activity across your accounts
            </p>
          </div>
          <Link
            to="/transactions"
            className="text-[12px] font-semibold text-brand-primary hover:underline flex items-center gap-1"
          >
            <span>View all</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {loading ? (
          <div className="divide-y divide-light-border/60">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3 px-5 py-3.5">
                <Skeleton className="h-9 w-9 rounded-xl" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-36" />
                  <Skeleton className="h-2.5 w-24" />
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        ) : recent.length === 0 ? (
          <EmptyState
            icon={<IoListOutline className="text-xl" />}
            title="No transactions recorded"
            description="Add your first transaction to initiate real-time analytics and reporting."
            action={
              <button type="button" onClick={openAdd} className={buttonPrimary}>
                <IoAdd className="text-base" aria-hidden="true" />
                Add transaction
              </button>
            }
          />
        ) : (
          <div className="divide-y divide-light-border/60">
            {recent.map((transaction) => (
              <TransactionRow
                key={transaction._id}
                transaction={transaction}
                showActions={false}
              />
            ))}
          </div>
        )}
      </section>

      {/* Getting Started Tip for new users */}
      {!loading && list.length === 0 && categories.data?.length === 0 && (
        <div className={`${cardClasses} flex flex-col items-center justify-between gap-4 p-5 sm:flex-row bg-light-surfaceSecondary/40`}>
          <div>
            <p className="text-xs font-medium text-light-textPrimary">
              Set up your categories first
            </p>
            <p className="text-[11px] text-light-textSecondary mt-0.5">
              Organising spending into categories (like Groceries, Dining, Rent) enables accurate reports and charts.
            </p>
          </div>
          <Link to="/categories" className={`${buttonSecondary} text-xs py-2 shrink-0`}>
            Manage categories
          </Link>
        </div>
      )}

      {/* Transaction Modal */}
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
