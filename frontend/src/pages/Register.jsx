import React from 'react'

const Register = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-light-background px-4">
      <div className="rounded-3xl border border-light-border bg-light-surface p-8 text-center shadow-[0_18px_60px_rgba(15,23,42,0.1)]">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-accent">
          Join now
        </p>
        <h1 className="mt-3 text-3xl font-bold text-light-textPrimary">
          Register Page
        </h1>
        <p className="mt-2 text-sm text-light-textSecondary">
          This page is now using the shared Tailwind theme tokens.
        </p>
      </div>
    </div>
  )
}

export default Register
