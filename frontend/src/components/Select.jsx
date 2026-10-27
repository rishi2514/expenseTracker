import { IoChevronDown } from "react-icons/io5";
import { selectClasses } from "../utils/styles";

// Styled native <select>. `options` = [{ value, label }].
const Select = ({
  id,
  value,
  onChange,
  options = [],
  placeholder,
  className = "",
  disabled,
  ariaLabel,
}) => (
  <div className={`relative ${className}`}>
    <select
      id={id}
      aria-label={ariaLabel}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`${selectClasses} w-full`}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <IoChevronDown
      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-light-textMuted"
      aria-hidden="true"
    />
  </div>
);

export default Select;
