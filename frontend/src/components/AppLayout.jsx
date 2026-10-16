import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  IoGridOutline,
  IoListOutline,
  IoLogOutOutline,
  IoPersonOutline,
  IoPricetagsOutline,
  IoSunnyOutline,
  IoMoonOutline,
  IoDesktopOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
} from "react-icons/io5";
import logo from "../assets/logo.png";
import { useAuth }  from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import useToast     from "../hooks/useToast";
import { logout as logoutApi } from "../api/users";
import { getInitials }  from "../utils/format";
import { colorForName } from "../utils/palette";

// ─────────────────────────────────────────────────────────────────────────────

const NAV = [
  { to: "/dashboard",    label: "Dashboard",    Icon: IoGridOutline },
  { to: "/transactions", label: "Transactions",  Icon: IoListOutline },
  { to: "/categories",   label: "Categories",    Icon: IoPricetagsOutline },
  { to: "/profile",      label: "Profile",       Icon: IoPersonOutline },
];

const THEMES = [
  { value: "light",  Icon: IoSunnyOutline,   label: "Light"  },
  { value: "dark",   Icon: IoMoonOutline,    label: "Dark"   },
  { value: "system", Icon: IoDesktopOutline, label: "Auto"   },
];


// ─── Sidebar inner ─────────────────────────────────────────────────────────

const SidebarContent = ({ expanded, onLogout }) => {
  const { user }           = useAuth();
  const { theme, setTheme } = useTheme();
  const [logoFailed, setLogoFailed] = useState(false);

  const name   = user?.name || user?.userName || "Account";
  const avatar = user?.avatar;
  const color  = colorForName(name);

  return (
    <div className="flex h-full flex-col overflow-hidden">

      {/* ── Logo ── */}
      <div className="flex h-[60px] shrink-0 items-center gap-3 px-4">
        <Link to="/dashboard" className="flex items-center gap-3 min-w-0">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-primary">
            {logoFailed ? (
              <span className="text-sm font-bold text-white">₹</span>
            ) : (
              <img src={logo} alt="" className="h-full w-full rounded-xl object-contain"
                onError={() => setLogoFailed(true)} />
            )}
          </span>
          {expanded && (
            <span className="truncate text-[14px] font-semibold tracking-tight text-light-textPrimary">
              ExpenseTracker
            </span>
          )}
        </Link>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 px-2 py-3 space-y-0.5" aria-label="Main">
        {NAV.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-150 ${
                isActive
                  ? "bg-brand-primary/10 text-brand-primary font-semibold"
                  : "text-light-textSecondary hover:bg-light-surfaceSecondary hover:text-light-textPrimary"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Active bar */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-brand-primary" />
                )}
                <Icon
                  className={`shrink-0 text-[17px] ${isActive ? "text-brand-primary" : ""}`}
                  aria-hidden
                />
                {expanded && <span className="truncate">{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Bottom ── */}
      <div className="shrink-0 border-t border-light-border px-2 py-3 space-y-1">

        {/* Theme switcher */}
        {expanded ? (
          <div className="flex items-center gap-0.5 rounded-xl bg-light-surfaceSecondary p-1">
            {THEMES.map(({ value, Icon, label }) => (
              <button
                key={value}
                onClick={() => setTheme(value)}
                title={label}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-[11px] font-medium transition-all ${
                  theme === value
                    ? "bg-light-surface text-brand-primary shadow-sm"
                    : "text-light-textMuted hover:text-light-textSecondary"
                }`}
              >
                <Icon className="text-[13px]" />
                {label}
              </button>
            ))}
          </div>
        ) : (
          <button
            onClick={() => {
              const i = THEMES.findIndex((t) => t.value === theme);
              setTheme(THEMES[(i + 1) % THEMES.length].value);
            }}
            title={`Theme: ${theme}`}
            className="flex w-full items-center justify-center rounded-xl py-2.5 text-light-textMuted transition hover:bg-light-surfaceSecondary hover:text-light-textPrimary"
          >
            {(() => { const T = THEMES.find((t) => t.value === theme); return T ? <T.Icon className="text-[17px]" /> : null; })()}
          </button>
        )}

        {/* User / logout */}
        <button
          onClick={onLogout}
          className="group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-light-textSecondary transition hover:bg-light-surfaceSecondary"
        >
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold text-white overflow-hidden"
            style={{ backgroundColor: color }}
          >
            {avatar
              ? <img src={avatar} alt="" className="h-full w-full object-cover" />
              : getInitials(name)
            }
          </span>
          {expanded && (
            <>
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-[12px] font-semibold text-light-textPrimary leading-tight">{name}</p>
                <p className="text-[10px] text-light-textMuted">Sign out</p>
              </div>
              <IoLogOutOutline className="shrink-0 text-[15px] opacity-60 group-hover:text-semantic-danger group-hover:opacity-100" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// ─── AppLayout ──────────────────────────────────────────────────────────────

const AppLayout = ({ children }) => {
  const { contextLogout } = useAuth();
  const toast    = useToast();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(true);

  const handleLogout = async () => {
    try { await logoutApi(); } catch { /* local logout still runs */ }
    contextLogout();
    navigate("/login", { replace: true });
    toast.info("Signed out. See you soon!");
  };

  const w = expanded ? "w-56" : "w-[56px]";

  return (
    <div className="flex min-h-screen bg-light-background">

      {/* ── Sidebar ── */}
      <aside
        className={`sidebar fixed inset-y-0 left-0 z-40 hidden flex-col border-r lg:flex ${w}`}
        style={{ transition: "width 0.2s cubic-bezier(0.4,0,0.2,1)" }}
      >
        {/* Single, consistent toggle button on the sidebar border between icon and first option */}
        <button
          onClick={() => setExpanded((prev) => !prev)}
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          title={expanded ? "Collapse sidebar" : "Expand sidebar"}
          className="absolute -right-3 top-[60px] -translate-y-1/2 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-light-border bg-light-surface text-light-textMuted shadow-xs transition-all hover:text-brand-primary hover:border-brand-primary/40 hover:scale-110 cursor-pointer"
        >
          <IoChevronBackOutline
            className={`text-xs transition-transform duration-200 ${
              expanded ? "" : "rotate-180"
            }`}
          />
        </button>

        <SidebarContent
          expanded={expanded}
          onLogout={handleLogout}
        />
      </aside>

      {/* ── Main ── */}
      <div
        className={`flex min-h-screen flex-1 flex-col ${expanded ? "lg:pl-56" : "lg:pl-[56px]"}`}
        style={{ transition: "padding-left 0.2s cubic-bezier(0.4,0,0.2,1)" }}
      >
        {/* Content */}
        <main className="flex-1 px-6 py-8 lg:px-8">
          <div className="mx-auto max-w-[1380px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
