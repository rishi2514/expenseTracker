import { buttonPrimary } from "../utils/styles";
import { Spinner } from "./Spinner";

const PrimaryButton = ({
  handleClick,
  text,
  disabled,
  type = "button",
  loading = false,
  className = "",
}) => (
  <button
    type={type}
    onClick={handleClick}
    disabled={disabled || loading}
    className={`${buttonPrimary} ${className}`}
  >
    {loading && <Spinner className="h-4 w-4" />}
    {text}
  </button>
);

export default PrimaryButton;
