import React from "react";

const PrimaryButton = ({handleClick, text, disabled}) => {
  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className="w-full bg-brand-primary text-white py-2 px-3 rounded-2xl hover:bg-brand-primaryDark transition"
    >
      {text}
    </button>
  );
};

export default PrimaryButton;
