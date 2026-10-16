import { useState, useRef, useEffect } from "react";
import {
  IoCalendarOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
} from "react-icons/io5";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// Helper: formats a date string "YYYY-MM-DD" into a friendly display
const formatDisplayDate = (dateStr) => {
  if (!dateStr) return "Pick a date";
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return dateStr;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDate = new Date(year, month - 1, day);
  const diffDays = Math.round((startOfToday - startOfDate) / 86400000);

  const formatted = date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: year !== now.getFullYear() ? "numeric" : undefined,
  });

  if (diffDays === 0) return `Today (${formatted})`;
  if (diffDays === 1) return `Yesterday (${formatted})`;
  return formatted;
};

const CustomDatePicker = ({
  id,
  value,
  onChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Parse initial selected date or default to today
  const parsedDate = value ? new Date(`${value}T00:00:00`) : new Date();
  const [viewYear, setViewYear] = useState(() => parsedDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(() => parsedDate.getMonth());

  // Keep view aligned if value changes externally
  useEffect(() => {
    if (value) {
      const d = new Date(`${value}T00:00:00`);
      if (!Number.isNaN(d.getTime())) {
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
      }
    }
  }, [value]);

  // Click outside to close
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  // Escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Month navigation
  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Generate days in month
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay(); // 0 is Sunday

  const selectDay = (day) => {
    const pad = (n) => String(n).padStart(2, "0");
    const dateStr = `${viewYear}-${pad(viewMonth + 1)}-${pad(day)}`;
    onChange({ target: { value: dateStr } });
    setIsOpen(false);
  };

  const setQuickDate = (offsetDays) => {
    const d = new Date();
    d.setDate(d.getDate() - offsetDays);
    const pad = (n) => String(n).padStart(2, "0");
    const dateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    onChange({ target: { value: dateStr } });
    setIsOpen(false);
  };

  const todayStr = (() => {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  })();

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Trigger Button */}
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-2 rounded-xl border border-light-border bg-light-surface px-3 py-2 text-xs transition outline-none ${
          isOpen
            ? "border-brand-primary ring-3 ring-brand-primary/12"
            : "hover:border-brand-primary/40"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <IoCalendarOutline className="text-brand-primary text-sm shrink-0" />
          <span className="truncate font-semibold text-light-textPrimary text-xs">
            {formatDisplayDate(value)}
          </span>
        </div>

        <span className="text-[10px] text-light-textMuted uppercase font-medium tracking-wide">
          Change
        </span>
      </button>

      {/* Popover Calendar */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 z-50 w-[270px] rounded-xl border border-light-border bg-light-surface p-3 shadow-xl animate-slide-up">
          {/* Calendar Header with Month/Year Navigation */}
          <div className="flex items-center justify-between pb-2 border-b border-light-border/60">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1 rounded-lg text-light-textMuted hover:text-light-textPrimary hover:bg-light-surfaceSecondary transition"
              aria-label="Previous month"
            >
              <IoChevronBackOutline className="text-xs" />
            </button>

            <span className="text-xs font-bold text-light-textPrimary tracking-tight">
              {MONTHS[viewMonth]} {viewYear}
            </span>

            <button
              type="button"
              onClick={nextMonth}
              className="p-1 rounded-lg text-light-textMuted hover:text-light-textPrimary hover:bg-light-surfaceSecondary transition"
              aria-label="Next month"
            >
              <IoChevronForwardOutline className="text-xs" />
            </button>
          </div>

          {/* Weekday Row */}
          <div className="grid grid-cols-7 gap-1 pt-2 pb-1 text-center">
            {WEEKDAYS.map((day) => (
              <span
                key={day}
                className="text-[10px] font-semibold text-light-textMuted uppercase"
              >
                {day}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Empty slots for month starting offset */}
            {Array.from({ length: firstDayIndex }).map((_, index) => (
              <span key={`empty-${index}`} className="h-7 w-7" />
            ))}

            {/* Days in Month */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const pad = (n) => String(n).padStart(2, "0");
              const currentDayStr = `${viewYear}-${pad(viewMonth + 1)}-${pad(day)}`;
              const isSelected = value === currentDayStr;
              const isToday = todayStr === currentDayStr;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => selectDay(day)}
                  className={`h-7 w-7 rounded-lg text-xs font-medium transition cursor-pointer flex items-center justify-center ${
                    isSelected
                      ? "bg-brand-primary text-white font-bold shadow-xs"
                      : isToday
                        ? "border border-brand-primary/50 text-brand-primary font-semibold hover:bg-light-surfaceSecondary"
                        : "text-light-textPrimary hover:bg-light-surfaceSecondary"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Quick Buttons Footer */}
          <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-light-border/60">
            <button
              type="button"
              onClick={() => setQuickDate(0)}
              className="text-[11px] font-semibold text-brand-primary hover:underline"
            >
              Today
            </button>

            <button
              type="button"
              onClick={() => setQuickDate(1)}
              className="text-[11px] font-medium text-light-textSecondary hover:text-light-textPrimary"
            >
              Yesterday
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;
