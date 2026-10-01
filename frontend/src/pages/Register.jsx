import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  IoEyeOffOutline,
  IoEyeOutline,
  IoCameraOutline,
  IoTrashOutline,
  IoPersonOutline,
} from "react-icons/io5";
import Input from "../components/Input.jsx";
import PrimaryButton from "../components/PrimaryButton.jsx";
import asset1 from "../assets/asset1.png";
import { register } from "../api/auth.js";
import { useAuth } from "../context/AuthContext.jsx";
import useToast from "../hooks/useToast.js";
import { getErrorMessage } from "../utils/error.js";
import { inputClasses, labelClasses } from "../utils/styles.js";

const Register = () => {
  const navigate = useNavigate();
  const { contextLogin } = useAuth();
  const toast = useToast();

  const [userName, setUserName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }
    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
    setError("");
  };

  const handleRemoveAvatar = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setAvatar(null);
    setAvatarPreview(null);
    const fileInput = document.getElementById("register-avatar");
    if (fileInput) fileInput.value = "";
  };

  const handleRegister = (e) => {
    e?.preventDefault();
    if (!userName.trim() || !email.trim() || !password) {
      setError("Please fill in all required fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    setError("");
    register(userName.trim(), name.trim(), email.trim(), password, avatar)
      .then((response) => {
        // The backend returns tokens on register — sign the user in right away.
        const accessToken =
          response.data?.data?.accessToken || response.data?.accessToken;
        const user = response.data?.data?.user || response.data?.user;

        if (accessToken && user) {
          contextLogin(accessToken, user);
          toast.success("Welcome to ExpenseTracker! 🎉");
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/login", { replace: true });
        }
      })
      .catch((err) => {
        setError(getErrorMessage(err, "Registration failed. Please try again."));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="grid min-h-screen bg-light-background lg:grid-cols-2">
      {/* Visual side (first column on large screens) */}
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
            Welcome!
          </h1>
          <p className="mt-2 text-light-textSecondary">
            Fill in your details to create your account and start managing your
            expenses.
          </p>

          {/* Avatar picker */}
          <div className="mt-7 flex flex-col items-center gap-1.5">
            <div className="group relative">
              <label
                htmlFor="register-avatar"
                className={`block h-20 w-20 cursor-pointer overflow-hidden rounded-full transition-all duration-200 shadow-sm hover:shadow-md ${
                  avatarPreview
                    ? "border-2 border-brand-primary"
                    : "border-2 border-dashed border-light-border bg-light-surfaceSecondary hover:border-brand-primary"
                }`}
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-0.5 text-light-textSecondary transition-colors group-hover:text-brand-primary">
                    <IoPersonOutline className="text-3xl" />
                  </div>
                )}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 bg-black/40 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <IoCameraOutline className="text-base" />
                  <span>{avatarPreview ? "Change" : "Upload"}</span>
                </div>
              </label>

              <label
                htmlFor="register-avatar"
                className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-brand-primary p-1.5 text-white shadow-md transition hover:bg-brand-primaryDark"
                title={avatarPreview ? "Change photo" : "Upload photo"}
              >
                <IoCameraOutline className="text-xs" />
              </label>

              {avatarPreview && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="absolute -right-1 -top-1 cursor-pointer rounded-full bg-semantic-danger p-1 text-white shadow-md transition hover:brightness-90"
                  title="Remove photo"
                >
                  <IoTrashOutline className="text-xs" />
                </button>
              )}

              <input
                type="file"
                id="register-avatar"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <p className="text-xs text-light-textSecondary">
              Profile photo{" "}
              <span className="text-light-textMuted">(optional)</span>
            </p>
          </div>

          <form onSubmit={handleRegister} className="mt-6 space-y-5" noValidate>
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Username"
                type="text"
                value={userName}
                onChange={(e) => {
                  setError("");
                  setUserName(e.target.value);
                }}
                labelStyle={labelClasses}
                placeholder="john_doe"
                inputStyle={inputClasses}
                id="register-username"
                autoComplete="username"
                isRequired
              />
              <Input
                label="Full Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                labelStyle={labelClasses}
                placeholder="John Doe"
                inputStyle={inputClasses}
                id="register-name"
                autoComplete="name"
              />
            </div>

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => {
                setError("");
                setEmail(e.target.value);
              }}
              labelStyle={labelClasses}
              placeholder="john@email.com"
              inputStyle={inputClasses}
              id="register-email"
              autoComplete="email"
              isRequired
            />

            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              labelStyle={labelClasses}
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => {
                setError("");
                setPassword(e.target.value);
              }}
              divStyle="relative"
              inputStyle={`${inputClasses} pr-11`}
              id="register-password"
              autoComplete="new-password"
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

            {error && (
              <p
                role="alert"
                className="rounded-xl border border-semantic-danger/30 bg-semantic-danger/5 px-4 py-2.5 text-sm font-medium text-semantic-danger"
              >
                {error}
              </p>
            )}

            <PrimaryButton
              type="submit"
              disabled={isLoading}
              loading={isLoading}
              text={isLoading ? "Creating account…" : "Register"}
              className="py-3"
            />
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-light-border" />
            <p className="text-[13px] text-light-textMuted">or</p>
            <div className="h-px flex-1 bg-light-border" />
          </div>

          <p className="text-center text-sm text-light-textSecondary">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-brand-primary hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
