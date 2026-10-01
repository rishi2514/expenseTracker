import { useState } from "react";
import { Link } from "react-router-dom";
import {
  IoBarChartOutline,
  IoCheckmarkCircle,
  IoListOutline,
  IoPricetagsOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";
import logo from "../assets/logo.png";
import asset1 from "../assets/asset1.png";
import { buttonPrimary, buttonSecondary } from "../utils/styles";

const FEATURES = [
  {
    Icon: IoBarChartOutline,
    title: "Dashboard at a glance",
    description:
      "Balance, income, expenses and a 6-month cash-flow chart the moment you sign in.",
  },
  {
    Icon: IoListOutline,
    title: "Every transaction, organised",
    description:
      "Search notes and filter by type, category, amount range or date in seconds.",
  },
  {
    Icon: IoPricetagsOutline,
    title: "Categories you define",
    description:
      "Create the categories that match your life — Food, Rent, Salary, anything.",
  },
  {
    Icon: IoShieldCheckmarkOutline,
    title: "Safe and private",
    description:
      "JWT access tokens with refresh rotation and httpOnly cookies keep your data yours.",
  },
];

const Brand = () => {
  const [logoFailed, setLogoFailed] = useState(false);
  return (
    <Link to="/" className="flex items-center gap-2.5">
      {logoFailed ? (
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-primary to-brand-primaryLight text-lg font-bold text-white">
          ₹
        </span>
      ) : (
        <img
          src={logo}
          alt=""
          className="h-9 w-9 rounded-xl object-contain"
          onError={() => setLogoFailed(true)}
        />
      )}
      <span className="text-[17px] font-bold tracking-tight text-light-textPrimary">
        ExpenseTracker
      </span>
    </Link>
  );
};

// Public marketing page shown to signed-out visitors.
const Home = () => (
  <div className="min-h-screen bg-light-background">
    {/* Header */}
    <header className="sticky top-0 z-30 border-b border-light-border bg-light-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Brand />
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/login"
            className="rounded-xl px-3 py-2 text-sm font-semibold text-light-textSecondary transition hover:text-light-textPrimary"
          >
            Sign in
          </Link>
          <Link to="/register" className={`${buttonPrimary} py-2`}>
            Get started
          </Link>
        </nav>
      </div>
    </header>

    {/* Hero */}
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute -top-32 right-[-10%] h-96 w-96 rounded-full bg-brand-primary/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-[-20%] left-[-10%] h-80 w-80 rounded-full bg-brand-accent/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-primary/25 bg-brand-primary/10 px-3 py-1 text-xs font-semibold text-brand-primary">
            <IoCheckmarkCircle aria-hidden="true" />
            100% free · No ads · Built for clarity
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-light-textPrimary sm:text-5xl">
            Take control of{" "}
            <span className="text-brand-primary">every rupee</span> you spend.
          </h1>

          <p className="mt-4 max-w-lg text-base leading-relaxed text-light-textSecondary sm:text-lg">
            Track income and expenses, split them into categories that make
            sense to you, and see exactly where your money goes — all in one
            clean dashboard.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link to="/register" className={buttonPrimary}>
              Create free account
            </Link>
            <Link to="/login" className={buttonSecondary}>
              I already have an account
            </Link>
          </div>

          <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-light-textSecondary">
            {["Secure JWT auth", "Instant search & filters", "Monthly insights"].map(
              (item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <IoCheckmarkCircle
                    className="text-semantic-success"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              )
            )}
          </ul>
        </div>

        <div className="relative">
          <div
            className="absolute inset-6 rounded-3xl bg-gradient-to-br from-brand-primary/25 to-brand-accent/25 blur-2xl"
            aria-hidden="true"
          />
          <img
            src={asset1}
            alt="Expense tracker preview"
            className="relative w-full rounded-2xl border border-light-border shadow-xl"
          />
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-bold tracking-tight text-light-textPrimary sm:text-3xl">
          Everything you need, nothing you don't
        </h2>
        <p className="mt-3 text-light-textSecondary">
          A focused feature set that keeps bookkeeping fast and satisfying.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {FEATURES.map(({ Icon, title, description }) => (
          <div
            key={title}
            className="group rounded-2xl border border-light-border bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:border-brand-primary/40"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-primary/10 text-xl text-brand-primary transition group-hover:bg-brand-primary group-hover:text-white">
              <Icon aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-base font-semibold text-light-textPrimary">
              {title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-light-textSecondary">
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-primary via-brand-primaryDark to-violet-600 px-6 py-12 text-center sm:px-12">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-white/10"
          aria-hidden="true"
        />
        <h2 className="relative text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Ready to stop guessing where your money went?
        </h2>
        <p className="relative mx-auto mt-3 max-w-xl text-white/80">
          Set up your account in under a minute and add your first transaction
          today.
        </p>
        <div className="relative mt-7">
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-brand-primaryDark shadow-lg transition hover:bg-white/90 focus:outline-none focus:ring-4 focus:ring-white/40"
          >
            Get started — it's free
          </Link>
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="border-t border-light-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6">
        <Brand />
        <p className="text-sm text-light-textMuted">
          © {new Date().getFullYear()} ExpenseTracker · Track smarter, spend
          better.
        </p>
      </div>
    </footer>
  </div>
);

export default Home;
