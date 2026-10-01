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

// Maps a category name to a matching icon + tinted background.
const CATEGORY_STYLES = [
  { pattern: /food|restaurant|dining|cafe|coffee|lunch|dinner|breakfast|swiggy|zomato/i, Icon: IoRestaurantOutline, tone: "bg-orange-100 text-orange-600" },
  { pattern: /travel|taxi|cab|fuel|petrol|gas|flight|bus|metro|train|uber|ola/i, Icon: IoCarSportOutline, tone: "bg-sky-100 text-sky-600" },
  { pattern: /trip|vacation|hotel/i, Icon: IoAirplaneOutline, tone: "bg-indigo-100 text-indigo-600" },
  { pattern: /shop|cloth|mall|amazon|flipkart|shoes|apparel/i, Icon: IoBagHandleOutline, tone: "bg-pink-100 text-pink-600" },
  { pattern: /rent|home|house|emi|mortgage|property/i, Icon: IoHomeOutline, tone: "bg-violet-100 text-violet-600" },
  { pattern: /salary|income|business|freelance|invest|dividend|interest/i, Icon: IoTrendingUpOutline, tone: "bg-emerald-100 text-emerald-600" },
  { pattern: /grocer|vegetable|fruit|market|milk|kirana/i, Icon: IoCartOutline, tone: "bg-teal-100 text-teal-600" },
  { pattern: /movie|netflix|music|game|entertain|subscription|spotify/i, Icon: IoGameControllerOutline, tone: "bg-fuchsia-100 text-fuchsia-600" },
  { pattern: /medical|health|doctor|pharmacy|medicine|hospital|gym/i, Icon: IoMedkitOutline, tone: "bg-rose-100 text-rose-600" },
  { pattern: /education|course|book|school|college|fee|tuition/i, Icon: IoBookOutline, tone: "bg-blue-100 text-blue-600" },
  { pattern: /utility|electric|bill|internet|wifi|mobile|recharge|water|gas/i, Icon: IoFlashOutline, tone: "bg-amber-100 text-amber-600" },
  { pattern: /gift|donation|charity|fest/i, Icon: IoGiftOutline, tone: "bg-rose-100 text-rose-600" },
  { pattern: /bank|transfer|saving|wallet|atm/i, Icon: IoWalletOutline, tone: "bg-indigo-100 text-indigo-600" },
];

const FALLBACK = { Icon: IoPricetagOutline, tone: "bg-brand-primary/10 text-brand-primary" };

const resolveStyle = (name = "") =>
  CATEGORY_STYLES.find(({ pattern }) => pattern.test(name)) || FALLBACK;

const SIZES = {
  sm: "h-8 w-8 rounded-lg text-base",
  md: "h-10 w-10 rounded-xl text-lg",
  lg: "h-12 w-12 rounded-xl text-xl",
};

const CategoryIcon = ({ name = "", size = "md", className = "" }) => {
  const { Icon, tone } = resolveStyle(name);
  return (
    <div
      className={`flex shrink-0 items-center justify-center ${SIZES[size] || SIZES.md} ${tone} ${className}`}
      aria-hidden="true"
    >
      <Icon />
    </div>
  );
};

export default CategoryIcon;
