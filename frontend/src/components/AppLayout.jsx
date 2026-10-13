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
import Avatar from "./Avatar";
import { IconBase } from "react-icons/lib";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";

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

// Application shell: fixed sidebar (drawer on mobile), sticky header, content outlet.
const AppLayout = ({ children }) => {
  const { user, contextLogout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [logoFailed, setLogoFailed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [logoutOptionsOpen, setLogoutOptionsOpen] = useState(false);

  const meta = PAGE_META[location.pathname] || {
    title: "ExpenseTracker",
    subtitle: "Track smarter, spend better",
  };

  const handleLogout = async () => {
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
    <div className="flex h-full flex-col relative">
      {/* Expand/Collapse button */}
      <div
        className="hidden md:flex absolute -right-4 top-12 w-8 h-8 bg-brand-primary rounded-full items-center justify-center text-white cursor-pointer z-50 hover:bg-brand-primaryDark transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? <MdOutlineKeyboardDoubleArrowLeft /> : <MdOutlineKeyboardDoubleArrowRight />}
      </div>

      {/* Brand */}
      <div className="flex h-16 items-center justify-between px-5">
        <Link to="/dashboard" className="flex items-center gap-2.5">
          {logoFailed ? (
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-primary text-lg font-bold text-white">
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
          {expanded && (
            <span className="text-[17px] font-bold tracking-tight text-light-textPrimary">
              ExpenseTracker
            </span>
          )}
        </Link>
      </div>

      {/* Main navigation */}
      <nav
        className="flex-1 space-y-1 px-3 py-4"
        aria-label="Main navigation relative"
      >
        {NAV_ITEMS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-brand-primary/10 font-semibold text-brand-primary"
                  : "text-light-textSecondary hover:bg-light-surfaceSecondary hover:text-light-textPrimary"
              }`
            }
          >
            <Icon className="text-lg" aria-hidden="true" />
            {expanded ? label : null}
          </NavLink>
        ))}
      </nav>

      {/* User profile */}
      <div
        className="border-t border-light-border px-3 py-4 cursor-pointer text-light-textSecondary hover:text-semantic-danger"
        onClick={handleLogout}
      >
        <div className="flex items-center gap-3 px-3.5">
          <IoLogOutOutline className="text-lg" />
          {expanded && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">Logout</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-light-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden ${expanded ? "w-60" : "w-20"} flex-col border-r border-light-border bg-white lg:flex`}
      >
        {sidebarContent}
      </aside>

      {/* Main column */}
      <div
        className={`flex min-h-screen flex-col ${expanded ? "pl-60" : "pl-20"}`}
      >
        <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
