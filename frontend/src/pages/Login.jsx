import React, { useState } from "react";
import Input from "../components/Input.jsx";
import asset1 from "../assets/asset1.png";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/auth.js";
import PrimaryButton from "../components/PrimaryButton.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRememberMe, setIsRememberMe] = useState(false);

  const { contextLogin } = useAuth();
  const navigate = useNavigate();

  const handleTogglePassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleRememberMeChange = (prev) => {
    setIsRememberMe(!prev);
  };

  const handleLogin = () => {
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
        console.error("Login failed:", err);
        setErrorMessage(
          err?.message || "Login failed. Please check your credentials."
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="flex h-screen w-full">
      <div className="w-[50%] flex justify-center items-center">
        <div className=" flex flex-col gap-5">
          <h1 className="text-light-textPrimary text-[44px] font-bold leading-none">
            Welcome Back!
          </h1>
          <p className="text-light-textSecondary font-normal leading-none">
            Sign in to manage your expenses.
          </p>
          <Input
            label={"Username / Email"}
            type={"text"}
            value={identifier}
            onChange={(e) => (
              setErrorMessage(""), setIdentifier(e.target.value)
            )}
            labelStyle={"mb-1 block font-semibold text-light-textSecondary"}
            placeholder={"john123 / john@email.com"}
            divStyle={""}
            inputStyle={
              "w-full border border-light-border py-2 px-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
            }
            id={"login-identifier"}
            isRequired={true}
          />
          <Input
            label={"Password"}
            type={showPassword ? "text" : "password"}
            labelStyle={"mb-1 block font-semibold text-light-textSecondary"}
            placeholder={"••••••••"}
            value={password}
            onChange={(e) => (setErrorMessage(""), setPassword(e.target.value))}
            divStyle={"relative"}
            inputStyle={
              "w-full border border-light-border py-2 px-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
            }
            id={"login-password"}
            isIcon={true}
            isRequired={true}
            icon={
              showPassword ? (
                <IoEyeOffOutline color="text-light-textSecondary" />
              ) : (
                <IoEyeOutline color="text-light-textSecondary" />
              )
            }
            iconPosition={"right"}
            onClick={handleTogglePassword}
          />
          <div className="flex justify-between items-center text-light-textSecondary text-sm">
            <Input
              type="checkbox"
              label="Remember me"
              value={isRememberMe}
              onChange={() => handleRememberMeChange(isRememberMe)}
              checked={isRememberMe}
              divStyle={"flex flex-row-reverse gap-1 items-center justify-end"}
              labelStyle={"text-[13px]"}
              id={"remember-me"}
            />
            <p className="hover:underline cursor-pointer w-full text-[13px] text-right text-brand-primary font-semibold">
              Forgot Password?
            </p>
          </div>
          {errorMessage && (
            <p className="text-red-500 text-sm font-medium">{errorMessage}</p>
          )}
          <PrimaryButton
            disabled={isLoading}
            handleClick={handleLogin}
            text={isLoading ? "Logging in..." : "Login"}
          />
          <div className="flex items-center gap-2">
            <div className="border border-brand-primary flex-1" />
            <p className="text-light-textSecondary text-[13px]">or</p>
            <div className="border border-brand-primary flex-1" />
          </div>
          <p className="text-light-textSecondary text-sm text-center">
            Don't have an account?{" "}
            <span className="text-brand-primary font-semibold hover:underline cursor-pointer">
              <Link to="/register">Register</Link>
            </span>
          </p>
        </div>
      </div>
      <div className="bg-brand-primary w-[50%] justify-center items-center flex flex-col gap-10 px-10">
        <p className="text-dark-textPrimary text-[50px] font-bold leading-none">
          Effortlessly manage your expenses.
        </p>
        <p className="text-dark-textPrimary font-normal text-[18px] leading-none">
          Track your income, and expenses all in one place. Get overview,
          insights, and control over your finances.
        </p>
        <img src={asset1} alt="Expense Tracker" className="w-[50%] h-auto" />
      </div>
    </div>
  );
};

export default Login;
