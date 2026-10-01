import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  IoCloseOutline,
  IoGridOutline,
  IoListOutline,
  IoLogOutOutline,
  IoMenuOutline,
  IoPersonOutline,
  IoPricetagsOutline,
} from "react-icons/io5";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import useToast from "../hooks/useToast";
import { logout as logoutApi } from "../api/users";
import { getInitials } from "../utils/format";
import { colorForName } from "../utils/palette";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", Icon: IoGridOutline },
  { to: "/transactions", label: "Transactions", Icon: IoListOutline },
  { to: "/categories", label: "Categories", Icon: IoPricetagsOutline },
  { to: "/profile", label: "Profile", Icon: IoPersonOutline },
];

const PAGE_META = {
  "/dashboard": {
    title: "Dashboard",
    subtitle: "Your money at a glance",
  },
  "/transactions": {
    title: "Transactions",
    subtitle: "Every income and expense in one place",
  },
  "/categories": {
    title: "Categories",
    subtitle: "Organise the way you track spending",
  },
  "/profile": {
    title: "Profile & settings",
    subtitle: "Manage your account",
  },
};

const Avatar = ({ user, className = "h-9 w-9 text-xs" }) => {
  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.name || user.userName || "Avatar"}
        className={`${className} shrink-0 rounded-full object-cover`}
      />
    );
  }
  const name = user?.name || user?.userName || "";
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${className}`}
      style={{ backgroundColor: colorForName(name) }}
      aria-hidden="true"
    >
      {getInitials(name)}
    </span>
  );
};

const Brand = () => {
  const [logoFailed, setLogoFailed] = useState(false);
  return (
    <Link to="/dashboard" className="flex items-center gap-2.5">
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

// Application shell: fixed sidebar (drawer on mobile), sticky header, content outlet.
const AppLayout = ({ children }) => {
  const { user, contextLogout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const meta =
    PAGE_META[location.pathname] || {
      title: "ExpenseTracker",
      subtitle: "Track smarter, spend better",
    };

  // Close the avatar dropdown on outside click / Escape.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const close = () => setMenuOpen(false);
    const onKey = (event) => event.key === "Escape" && setMenuOpen(false);
    document.addEventListener("click", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const handleLogout = async () => {
    setMenuOpen(false);
    try {
      await logoutApi();
    } catch {
      // Session may already be invalid — local logout still runs.
    }
    contextLogout();
    navigate("/login", { replace: true });
    toast.info("Signed out. See you soon!");
  };

  const sidebarContent = (
    <>
      <div className="flex h-16 items-center justify-between px-5">
        <Brand />
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
          className="rounded-lg p-1.5 text-light-textMuted transition hover:bg-light-surfaceSecondary lg:hidden"
        >
          <IoCloseOutline className="text-2xl" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Main navigation">
        {NAV_ITEMS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-brand-primary/10 font-semibold text-brand-primary"
                  : "text-light-textSecondary hover:bg-light-surfaceSecondary hover:text-light-textPrimary"
              }`
            }
          >
            <Icon className="text-lg" aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-light-border p-4">
        <div className="flex items-center gap-3">
          <Avatar user={user} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-light-textPrimary">
              {user?.name || user?.userName || "Account"}
            </p>
            <p className="truncate text-xs text-light-textMuted">
              {user?.email}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Sign out"
            title="Sign out"
            className="rounded-lg p-2 text-light-textMuted transition hover:bg-semantic-danger/10 hover:text-semantic-danger focus:outline-none focus:ring-2 focus:ring-semantic-danger/30"
          >
            <IoLogOutOutline className="text-lg" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-light-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-light-border bg-white lg:flex">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-light-textPrimary/40 backdrop-blur-[1px] lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-light-border bg-white transition-transform duration-200 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!mobileOpen}
      >
        {sidebarContent}
      </aside>

      {/* Main column */}
      <div className="flex min-h-screen flex-col lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-light-border bg-light-background/85 backdrop-blur">
          <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center gap-3 px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="rounded-lg p-2 text-light-textSecondary transition hover:bg-light-surfaceSecondary lg:hidden"
            >
              <IoMenuOutline className="text-2xl" />
            </button>

            <div className="min-w-0 flex-1">
              <h1 className="truncate text-lg font-bold tracking-tight text-light-textPrimary">
                {meta.title}
              </h1>
              <p className="hidden truncate text-xs text-light-textMuted sm:block">
                {meta.subtitle}
              </p>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setMenuOpen((open) => !open);
                }}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                className="flex items-center gap-2 rounded-full border border-light-border bg-white py-1 pl-1 pr-2.5 transition hover:border-brand-primary/40 focus:outline-none focus:ring-4 focus:ring-brand-primary/10"
              >
                <Avatar user={user} className="h-8 w-8 text-[11px]" />
                <span className="hidden max-w-[140px] truncate text-sm font-medium text-light-textPrimary sm:block">
                  {user?.name || user?.userName}
                </span>
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-2 w-60 overflow-hidden rounded-xl border border-light-border bg-white py-1.5 shadow-lg animate-fade-in"
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="border-b border-light-border px-4 py-2.5">
                    <p className="truncate text-sm font-semibold text-light-textPrimary">
                      {user?.name || user?.userName}
                    </p>
                    <p className="truncate text-xs text-light-textMuted">
                      {user?.email}
                    </p>
                  </div>
                  <Link
                    to="/profile"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-light-textSecondary transition hover:bg-light-surfaceSecondary hover:text-light-textPrimary"
                  >
                    <IoPersonOutline aria-hidden="true" />
                    Profile & settings
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-semantic-danger transition hover:bg-semantic-danger/10"
                  >
                    <IoLogOutOutline aria-hidden="true" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
