import React from "react";
import Input from "../components/Input.jsx";

const Login = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.16),_transparent_35%),linear-gradient(180deg,_#F7F8FC_0%,_#EEF2FF_100%)] px-4">
      <div className="w-full max-w-md rounded-3xl border border-light-border bg-light-surface/95 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.24em] text-brand-primary">
            Welcome back
          </p>
          <h2 className="text-3xl font-bold text-light-textPrimary">Login</h2>
          <p className="mt-2 text-sm text-light-textSecondary">
            Sign in to manage your expenses.
          </p>
        </div>
        <form>
          <div className="mb-4">
            <Input
              label="Email"
              type="email"
              id="email"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6">
            <Input
              label="Password"
              type="password"
              id="password"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-3xl bg-brand-primary px-4 py-3 font-semibold text-white transition hover:bg-brand-primaryDark focus:outline-none focus:ring-2 focus:ring-brand-accent/40"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
