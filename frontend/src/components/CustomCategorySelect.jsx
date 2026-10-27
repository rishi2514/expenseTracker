import { useState, useRef, useEffect } from "react";
import { IoChevronDownOutline, IoCheckmark, IoSearchOutline } from "react-icons/io5";
import CategoryIcon from "./CategoryIcon";

const CustomCategorySelect = ({
  id,
  value,
  onChange,
  categories = [],
  placeholder = "Select category",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  const selectedCategory = categories.find((c) => c._id === value);

  // Close dropdown on outside click
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

  // Focus search when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    if (!isOpen) {
      setSearch("");
    }
  }, [isOpen]);

  // Keyboard escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase().trim())
  );

  const handleSelect = (categoryId) => {
    onChange({ target: { value: categoryId } });
    setIsOpen(false);
  };

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
        <div className="flex items-center gap-2.5 min-w-0">
          {selectedCategory ? (
            <>
              <CategoryIcon name={selectedCategory.name} size="sm" className="h-6 w-6 text-xs rounded-md" />
              <span className="truncate font-semibold text-light-textPrimary text-xs">
                {selectedCategory.name}
              </span>
            </>
          ) : (
            <span className="text-light-textMuted text-xs">{placeholder}</span>
          )}
        </div>

        <IoChevronDownOutline
          className={`text-light-textMuted transition-transform duration-200 text-xs shrink-0 ${
            isOpen ? "rotate-180 text-brand-primary" : ""
          }`}
        />
      </button>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-xl border border-light-border bg-light-surface shadow-xl overflow-hidden animate-slide-up">
          {/* Search bar inside dropdown (if more than 5 categories) */}
          {categories.length > 5 && (
            <div className="p-2 border-b border-light-border/60">
              <div className="relative flex items-center">
                <IoSearchOutline className="absolute left-2.5 text-light-textMuted text-xs pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter categories…"
                  className="w-full rounded-lg bg-light-surfaceSecondary px-2.5 py-1.5 pl-7 text-[11px] text-light-textPrimary placeholder:text-light-textMuted outline-none"
                />
              </div>
            </div>
          )}

          {/* List of options */}
          <div className="max-h-52 overflow-y-auto p-1 space-y-0.5">
            {filteredCategories.length === 0 ? (
              <div className="py-4 text-center text-xs text-light-textMuted">
                No matching categories
              </div>
            ) : (
              filteredCategories.map((category) => {
                const isSelected = category._id === value;
                return (
                  <button
                    key={category._id}
                    type="button"
                    onClick={() => handleSelect(category._id)}
                    className={`w-full flex items-center justify-between gap-2.5 rounded-lg px-2.5 py-2 text-xs transition cursor-pointer ${
                      isSelected
                        ? "bg-brand-primary/10 text-brand-primary font-semibold"
                        : "text-light-textPrimary hover:bg-light-surfaceSecondary"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CategoryIcon
                        name={category.name}
                        size="sm"
                        className="h-6 w-6 text-xs rounded-md"
                      />
                      <span className="truncate">{category.name}</span>
                    </div>

                    {isSelected && (
                      <IoCheckmark className="text-brand-primary text-sm shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomCategorySelect;
