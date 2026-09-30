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
  value,
  onChange,
  isRequired,
  error,
}) => {
  return (
    <div className={`w-full ${divStyle}`}>
      <label htmlFor={id} className={`peer ${labelStyle}`}>
        {label} {isRequired && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          id={id}
          className={`peer ${inputStyle}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
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
      {error && <p className="text-red-500 text-sm mt-1 ml-1">{error}</p>}
    </div>
  );
};

export default Input;
