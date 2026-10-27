import { labelClasses } from "../utils/styles";

// Form field wrapper: label + control + hint / error message.
const Field = ({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
  className = "",
}) => (
  <div className={className}>
    <label htmlFor={htmlFor} className={labelClasses}>
      {label}
      {required && <span className="text-semantic-danger"> *</span>}
    </label>
    {children}
    {error ? (
      <p className="mt-1.5 text-xs font-medium text-semantic-danger">{error}</p>
    ) : hint ? (
      <p className="mt-1.5 text-xs text-light-textMuted">{hint}</p>
    ) : null}
  </div>
);

export default Field;
