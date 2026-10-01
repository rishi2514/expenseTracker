import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import Input from "../components/Input.jsx";
import PrimaryButton from "../components/PrimaryButton.jsx";
import asset1 from "../assets/asset1.png";
import { login } from "../api/auth.js";
import { useAuth } from "../context/AuthContext.jsx";
import { getErrorMessage } from "../utils/error.js";
import { inputClasses, labelClasses } from "../utils/styles.js";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRememberMe, setIsRememberMe] = useState(false);

  const { contextLogin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event?.preventDefault();
    if (!identifier.trim() || !password) {
      setErrorMessage("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    login(identifier.trim(), password, isRememberMe)
      .then((response) => {
        const accessToken =
          response.data?.data?.accessToken || response.data?.accessToken;
        const user = response.data?.data?.user || response.data?.user;

        contextLogin(accessToken, user);
        navigate("/dashboard", { replace: true });
      })
      .catch((err) => {
        setErrorMessage(getErrorMessage(err, "Login failed. Please check your credentials."));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="grid min-h-screen bg-light-background lg:grid-cols-2">
      {/* Form side */}
      <div className="flex items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="mb-8 inline-block text-sm font-semibold text-light-textSecondary transition hover:text-brand-primary"
          >
            ← Back to home
          </Link>

          <h1 className="text-3xl font-bold tracking-tight text-light-textPrimary sm:text-4xl">
            Welcome back!
          </h1>
          <p className="mt-2 text-light-textSecondary">
            Sign in to manage your expenses.
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-5" noValidate>
            <Input
              label="Username / Email"
              type="text"
              value={identifier}
              onChange={(e) => {
                setErrorMessage("");
                setIdentifier(e.target.value);
              }}
              labelStyle={labelClasses}
              placeholder="john123 / john@email.com"
              inputStyle={inputClasses}
              id="login-identifier"
              autoComplete="username"
              isRequired
            />

            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              labelStyle={labelClasses}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setErrorMessage("");
                setPassword(e.target.value);
              }}
              divStyle="relative"
              inputStyle={`${inputClasses} pr-11`}
              id="login-password"
              autoComplete="current-password"
              isIcon
              isRequired
              iconLabel={showPassword ? "Hide password" : "Show password"}
              icon={
                showPassword ? (
                  <IoEyeOffOutline className="text-lg" />
                ) : (
                  <IoEyeOutline className="text-lg" />
                )
              }
              iconPosition="right"
              onClick={() => setShowPassword((show) => !show)}
            />

            <div className="flex items-center justify-between gap-3">
              <Input
                type="checkbox"
                label="Remember me"
                value={isRememberMe}
                onChange={() => setIsRememberMe((prev) => !prev)}
                checked={isRememberMe}
                divStyle="flex flex-row-reverse items-center gap-2"
                labelStyle="text-[13px] font-medium text-light-textSecondary mb-0!"
                id="remember-me"
              />
            </div>

            {errorMessage && (
              <p
                role="alert"
                className="rounded-xl border border-semantic-danger/30 bg-semantic-danger/5 px-4 py-2.5 text-sm font-medium text-semantic-danger"
              >
                {errorMessage}
              </p>
            )}

            <PrimaryButton
              type="submit"
              disabled={isLoading}
              loading={isLoading}
              text={isLoading ? "Logging in…" : "Login"}
              className="py-3"
            />
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-light-border" />
            <p className="text-[13px] text-light-textMuted">or</p>
            <div className="h-px flex-1 bg-light-border" />
          </div>

          <p className="text-center text-sm text-light-textSecondary">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-brand-primary hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>

      {/* Visual side */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-brand-primary via-brand-primaryDark to-violet-600 px-10 py-16 lg:flex lg:flex-col lg:items-center lg:justify-center lg:gap-10">
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-white/10"
          aria-hidden="true"
        />

        <p className="relative max-w-md text-center text-4xl font-bold leading-tight text-white xl:text-5xl">
          Effortlessly manage your expenses.
        </p>
        <p className="relative max-w-md text-center text-lg leading-relaxed text-white/85">
          Track your income and expenses all in one place. Get an overview,
          insights, and control over your finances.
        </p>
        <img
          src={asset1}
          alt="Expense tracker preview"
          className="relative w-[68%] max-w-md rounded-2xl shadow-2xl"
        />
      </div>
    </div>
  );
};

export default Login;
