import React, { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import asset1 from "../assets/asset1.png";
import {
  IoEyeOffOutline,
  IoEyeOutline,
  IoCameraOutline,
  IoTrashOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { register } from "../api/auth";
import PrimaryButton from "../components/PrimaryButton";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleRemoveAvatar = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setAvatar(null);
    setAvatarPreview(null);
    const fileInput = document.getElementById("register-avatar");
    if (fileInput) fileInput.value = "";
  };

  const handleRegister = () => {
    // check for empty fields
    if (!userName || !email || !password) {
      setError("Please fill in all required fields");
      return;
    }

    // check for valid email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // check for password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    // If all validations pass, proceed with registration logic
    setIsLoading(true);
    setError("");
    register(userName, name, email, password, avatar)
      .then((response) => {
        console.log("Registration successful:", response.data);
        //TODO: Handle successful registration (e.g., redirect to login page)
      })
      .catch((err) => {
        console.error("Registration failed:", err);
        setError(err?.message || "Registration failed. Please try again.");
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
          <div className="flex flex-col items-center gap-1.5">
            <div className="relative group">
              <label
                htmlFor="register-avatar"
                className={`cursor-pointer block relative w-20 h-20 rounded-full overflow-hidden transition-all duration-200 shadow-sm hover:shadow-md bg-light-surfaceSecondary ${
                  avatarPreview
                    ? "border-2 border-brand-primary"
                    : "border-2 border-dashed border-light-border hover:border-brand-primary"
                }`}
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-light-textSecondary group-hover:text-brand-primary transition-colors">
                    <IoPersonOutline className="text-3xl" />
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-medium gap-0.5">
                  <IoCameraOutline className="text-base" />
                  <span>{avatarPreview ? "Change" : "Upload"}</span>
                </div>
              </label>

              {/* Camera / Upload Badge */}
              <label
                htmlFor="register-avatar"
                className="absolute bottom-0 right-0 bg-brand-primary text-white p-1.5 rounded-full shadow-md cursor-pointer hover:bg-brand-primaryDark transition-colors"
                title={avatarPreview ? "Change Photo" : "Upload Photo"}
              >
                <IoCameraOutline className="text-xs" />
              </label>

              {/* Remove button if avatar is selected */}
              {avatarPreview && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md transition-colors cursor-pointer"
                  title="Remove Photo"
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
            <p className="text-[12px] text-light-textSecondary">
              Upload profile photo <span className="text-light-textMuted">(optional)</span>
            </p>
          </div>

          <div className="flex gap-4">
            <Input
              label={"Username"}
              type={"text"}
              value={userName}
              onChange={(e) => (setError(""), setUserName(e.target.value))}
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
            onChange={(e) => (setError(""), setEmail(e.target.value))}
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
            onChange={(e) => (setError(""), setPassword(e.target.value))}
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
          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
          <PrimaryButton
            disabled={isLoading}
            handleClick={handleRegister}
            text={isLoading ? "Registering..." : "Register"}
          />
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
