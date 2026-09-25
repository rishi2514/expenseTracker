import React, { useState } from "react";
import Input from "../components/Input.jsx";
import asset1 from "../assets/asset1.png";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import {login} from "../api/auth.js"

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleTogglePassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleLogin = () => {
    login(email, password)
      .then((response) => {
        console.log("Login successful:", response.data);
        // Handle successful login, e.g., redirect to dashboard
      })
      .catch((error) => {
        console.error("Login failed:", error);
        // Handle login error, e.g., show error message to user
      });
  }

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
            label={"Email"}
            type={"email"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            labelStyle={"mb-1 block font-semibold text-light-textSecondary"}
            placeholder={"john@email.com"}
            divStyle={""}
            inputStyle={
              "w-full border border-light-border py-2 px-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
            }
            id={"login-email"}
          />
          <Input
            label={"Password"}
            type={showPassword ? "text" : "password"}
            labelStyle={"mb-1 block font-semibold text-light-textSecondary"}
            placeholder={"••••••••"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            divStyle={"relative"}
            inputStyle={
              "w-full border border-light-border py-2 px-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
            }
            id={"login-password"}
            isIcon={true}
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
              divStyle={"flex flex-row-reverse gap-1 items-center justify-end"}
              labelStyle={"text-[13px]"}
              id={"remember-me"}
            />
            <p className="hover:underline cursor-pointer w-full text-[13px] text-right text-brand-primary font-semibold">
              Forgot Password?
            </p>
          </div>
          <button onClick={handleLogin} className="w-full bg-brand-primary text-white py-2 px-3 rounded-2xl hover:bg-brand-primaryDark transition">
            Login
          </button>
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
