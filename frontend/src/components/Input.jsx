import React from "react";

const Input = ({ label, type, id, placeholder, divStyle, inputStyle }) => {
  return (
    <div className={`w-full ${divStyle}`}>
      <label
        htmlFor={id}
        className="mb-2 block font-semibold text-light-textSecondary"
      >
        {label}
      </label>
      <input
        type={type}
        id={id}
        className={`w-full rounded-3xl border border-light-border bg-light-surface px-3 py-2 text-light-textPrimary placeholder:text-light-textMuted focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-accent/30 ${inputStyle}`}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Input;
