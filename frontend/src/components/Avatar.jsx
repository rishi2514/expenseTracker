import { getInitials } from "../utils/format";
import { colorForName } from "../utils/palette";

const Avatar = ({ user, className }) => {
  if (user?.avatar && user.avatar.trim() !== "") {
    return (
      <img
        src={user.avatar}
        alt={user.name || user.userName || "Avatar"}
        className={`${className} shrink-0 rounded-full object-cover`}
      />
    );
  }
  const name = user?.name || user?.userName || "";
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${className}`}
      style={{ backgroundColor: colorForName(name) }}
      aria-hidden="true"
    >
      {getInitials(name)}
    </span>
  );
};

export default Avatar;