import React from "react";

const Input = ({
  label,
  type,
  id,
  placeholder,
  divStyle,
  inputStyle,
  labelStyle,
  isIcon,
  icon,
  iconPosition,
  onClick,
}) => {
  return (
    <div className={`w-full ${divStyle}`}>
      <label htmlFor={id} className={`peer ${labelStyle}`}>
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          id={id}
          className={`peer ${inputStyle}`}
          placeholder={placeholder}
        />
        {isIcon && (
          <button
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${iconPosition === "left" ? "left-3 right-auto" : ""}`}
            onClick={onClick}
          >
            {icon}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
