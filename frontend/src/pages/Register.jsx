import React, { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import asset1 from "../assets/asset1.png";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { register } from "../api/auth";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({
    userName: "",
    email: "",
    password: "",
    avatar: "",
    name: "",
    api: "",
  });

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = () => {
    // check for empty fields
    if (!userName || !email || !password) {
      setError({
        ...error,
        userName: !userName ? "Username is required" : "",
        email: !email ? "Email is required" : "",
        password: !password ? "Password is required" : "",
      });
      return;
    }

    // check for valid email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError({ ...error, email: "Please enter a valid email address" });
      return;
    }

    // check for password length
    if (password.length < 6) {
      setError({
        ...error,
        password: "Password must be at least 6 characters long",
      });
      return;
    }

    // If all validations pass, proceed with registration logic
    setIsLoading(true);
    register(userName, name, email, password, avatar)
      .then((response) => {
        console.log("Registration successful:", response.data);
        // Handle successful registration (e.g., redirect to login page)
      })
      .catch((error) => {
        console.error("Registration failed:", error);
        // Handle registration error (e.g., display error message)
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="flex flex-row-reverse h-screen w-full">
      <div className="w-[50%] flex justify-center items-center">
        <div className=" flex flex-col gap-5">
          <h1 className="text-light-textPrimary text-[44px] font-bold leading-none text-center">
            Welcome!
          </h1>
          <p className="text-light-textSecondary font-normal leading-none">
            Fill your details to create your account and start managing your
            expenses.
          </p>

          {/* Avatar Input */}
          <div className="flex justify-center">
            <label htmlFor="register-avatar" className="cursor-pointer">
              <input type="file" id="register-avatar" className="hidden" />
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </label>

            <input type="file" id="register-avatar" className="hidden" />
          </div>

          <div className="flex gap-4">
            <Input
              label={"Username"}
              type={"text"}
              value={userName}
              onChange={(e) => (
                setError({ ...error, userName: "" }),
                setUserName(e.target.value)
              )}
              labelStyle={"mb-1 block font-semibold text-light-textSecondary"}
              placeholder={"john_doe"}
              divStyle={""}
              inputStyle={
                "w-full border border-light-border py-2 px-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
              }
              id={"register-username"}
              isRequired={true}
              error={error.userName}
            />
            <Input
              label={"Full Name"}
              type={"text"}
              value={name}
              onChange={(e) => setName(e.target.value)}
              labelStyle={"mb-1 block font-semibold text-light-textSecondary"}
              placeholder={"John Doe"}
              divStyle={""}
              inputStyle={
                "w-full border border-light-border py-2 px-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
              }
              id={"register-name"}
            />
          </div>
          <Input
            label={"Email"}
            type={"email"}
            value={email}
            onChange={(e) => (
              setError({ ...error, email: "" }),
              setEmail(e.target.value)
            )}
            labelStyle={"mb-1 block font-semibold text-light-textSecondary"}
            placeholder={"john@email.com"}
            divStyle={""}
            inputStyle={
              "w-full border border-light-border py-2 px-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
            }
            id={"register-email"}
            isRequired={true}
          />
          <Input
            label={"Password"}
            type={showPassword ? "text" : "password"}
            labelStyle={"mb-1 block font-semibold text-light-textSecondary"}
            placeholder={"••••••••"}
            value={password}
            onChange={(e) => (
              setError({ ...error, password: "" }),
              setPassword(e.target.value)
            )}
            divStyle={"relative"}
            inputStyle={
              "w-full border border-light-border py-2 px-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
            }
            id={"register-password"}
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
            isRequired={true}
          />
          <button
            onClick={handleRegister}
            disabled={isLoading}
            className="w-full bg-brand-primary text-white py-2 px-3 rounded-2xl hover:bg-brand-primaryDark transition"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
          <div className="flex items-center gap-2">
            <div className="border border-brand-primary flex-1" />
            <p className="text-light-textSecondary text-[13px]">or</p>
            <div className="border border-brand-primary flex-1" />
          </div>
          <p className="text-light-textSecondary text-sm text-center">
            Already have an account?{" "}
            <span className="text-brand-primary font-semibold hover:underline cursor-pointer">
              <Link to="/login">Login</Link>
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

export default Register;
