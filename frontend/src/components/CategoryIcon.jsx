import {
  IoAirplaneOutline,
  IoBagHandleOutline,
  IoBookOutline,
  IoCarSportOutline,
  IoCartOutline,
  IoFlashOutline,
  IoGameControllerOutline,
  IoGiftOutline,
  IoHomeOutline,
  IoMedkitOutline,
  IoPricetagOutline,
  IoRestaurantOutline,
  IoTrendingUpOutline,
  IoWalletOutline,
} from "react-icons/io5";

// Maps a category name to a matching icon + color.
// We use an inline style for the bg (with opacity) so it adapts to the theme
// without needing hardcoded "bg-orange-100" Tailwind classes (which stay light
// even in dark mode).
const CATEGORY_STYLES = [
  { pattern: /food|restaurant|dining|cafe|coffee|lunch|dinner|breakfast|swiggy|zomato/i, Icon: IoRestaurantOutline, color: "#f97316" },
  { pattern: /travel|taxi|cab|fuel|petrol|gas|flight|bus|metro|train|uber|ola/i,         Icon: IoCarSportOutline,    color: "#0ea5e9" },
  { pattern: /trip|vacation|hotel/i,                                                     Icon: IoAirplaneOutline,    color: "#6366f1" },
  { pattern: /shop|cloth|mall|amazon|flipkart|shoes|apparel/i,                           Icon: IoBagHandleOutline,   color: "#ec4899" },
  { pattern: /rent|home|house|emi|mortgage|property/i,                                   Icon: IoHomeOutline,        color: "#8b5cf6" },
  { pattern: /salary|income|business|freelance|invest|dividend|interest/i,               Icon: IoTrendingUpOutline,  color: "#10b981" },
  { pattern: /grocer|vegetable|fruit|market|milk|kirana/i,                               Icon: IoCartOutline,        color: "#14b8a6" },
  { pattern: /movie|netflix|music|game|entertain|subscription|spotify/i,                 Icon: IoGameControllerOutline, color: "#d946ef" },
  { pattern: /medical|health|doctor|pharmacy|medicine|hospital|gym/i,                   Icon: IoMedkitOutline,      color: "#ef4444" },
  { pattern: /education|course|book|school|college|fee|tuition/i,                       Icon: IoBookOutline,        color: "#3b82f6" },
  { pattern: /utility|electric|bill|internet|wifi|mobile|recharge|water|gas/i,          Icon: IoFlashOutline,       color: "#f59e0b" },
  { pattern: /gift|donation|charity|fest/i,                                              Icon: IoGiftOutline,        color: "#f43f5e" },
  { pattern: /bank|transfer|saving|wallet|atm/i,                                        Icon: IoWalletOutline,      color: "#4f46e5" },
];

const FALLBACK = { Icon: IoPricetagOutline, color: "#6366f1" };

const resolveStyle = (name = "") =>
  CATEGORY_STYLES.find(({ pattern }) => pattern.test(name)) || FALLBACK;

const SIZES = {
  sm: "h-8 w-8 rounded-lg text-base",
  md: "h-10 w-10 rounded-xl text-lg",
  lg: "h-12 w-12 rounded-xl text-xl",
};

const CategoryIcon = ({ name = "", size = "md", className = "" }) => {
  const { Icon, color } = resolveStyle(name);
  return (
    <div
      className={`flex shrink-0 items-center justify-center ${SIZES[size] || SIZES.md} ${className}`}
      style={{ backgroundColor: `${color}1a`, color }}
      aria-hidden="true"
    >
      <Icon />
    </div>
  );
};

export default CategoryIcon;
