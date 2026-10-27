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
  checked,
  isRequired,
  error,
  autoComplete,
  disabled,
  name,
  iconLabel = "Toggle",
}) => {
  return (
    <div className={`w-full ${divStyle || ""}`}>
      {label && (
        <label htmlFor={id} className={labelStyle}>
          {label} {isRequired && <span className="text-semantic-danger">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          id={id}
          name={name}
          className={`peer ${inputStyle || ""}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          checked={checked}
          autoComplete={autoComplete}
          disabled={disabled}
        />
        {isIcon && (
          <button
            type="button"
            onClick={onClick}
            aria-label={iconLabel}
            className={`absolute top-1/2 -translate-y-1/2 rounded-md p-1 text-light-textMuted transition hover:text-light-textPrimary ${
              iconPosition === "left" ? "left-3" : "right-3"
            }`}
          >
            {icon}
          </button>
        )}
      </div>
      {error && <p className="mt-1 ml-1 text-sm text-semantic-danger">{error}</p>}
    </div>
  );
};

export default Input;
