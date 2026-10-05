"use client";

import { useState } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "motion/react";
import {
  FiSearch,
  FiSliders,
  FiX,
  FiCheck,
  FiChevronDown,
  FiRotateCcw,
  FiTrash2,
} from "react-icons/fi";

export default function FilterPanel({
  searchTerm = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  showSearch = true,
  defaultOpen = true,
  isOpen,
  onToggleOpen,
  activeFilterCount = 0,
  title = "Filters",
  description,
  children,
  onApply,
  onReset,
  applyText = "Apply Filters",
  resetText = "Reset",
  totalItems,
  itemLabel = "items",
  activeChips = [],
  onClearAll,
  className = "",
}) {
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);

  // Controlled or uncontrolled panel open state
  const isPanelOpen = isOpen !== undefined ? isOpen : internalIsOpen;
  const togglePanel = () => {
    if (onToggleOpen) {
      onToggleOpen(!isPanelOpen);
    } else {
      setInternalIsOpen((prev) => !prev);
    }
  };

  const hasActiveFilters = activeChips.length > 0 || Boolean(searchTerm);

  return (
    <div className={`w-full space-y-4 ${className}`}>
      {/* <================= TOP ACTION BAR: FILTER TOGGLE + SEARCH =================> */}
      <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1 max-w-xl">
          {/* FILTER TOGGLE BUTTON */}
          <button
            type="button"
            onClick={togglePanel}
            className={`px-4 sm:px-5 py-2.5 rounded-full border text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all duration-200 cursor-pointer shadow-sm shrink-0 ${
              isPanelOpen
                ? "bg-primary text-black border-primary shadow-primary/30 scale-[1.02]"
                : activeFilterCount > 0
                ? "bg-primary/20 border-primary text-primary"
                : "bg-[#161311]/85 border-primary/25 text-neutral-300 hover:text-primary hover:border-primary/50"
            }`}
          >
            {isPanelOpen ? (
              <FiX className="text-sm" />
            ) : (
              <FiSliders className="text-sm" />
            )}
            <span>Filter</span>
            {activeFilterCount > 0 && !isPanelOpen && (
              <span className="w-5 h-5 rounded-full bg-primary text-black text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
            <FiChevronDown
              className={`text-xs transition-transform duration-200 ${
                isPanelOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* SEARCH INPUT */}
          {showSearch && (
            <div className="relative flex-1">
              <div className="relative flex items-center w-full bg-[#161311]/85 border border-primary/25 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 rounded-full transition-all duration-200 shadow-md shadow-black/40 px-3.5 py-1.5">
                <FiSearch className="text-primary/70 text-base mr-2 shrink-0" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full bg-transparent text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none py-1"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => onSearchChange && onSearchChange("")}
                    className="text-neutral-400 hover:text-white p-1 ml-1 cursor-pointer transition-colors"
                    aria-label="Clear search"
                  >
                    <FiX className="text-sm" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* <================= FULL-WIDTH EXPANDABLE DRAWER =================> */}
      <AnimatePresence initial={false}>
        {isPanelOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="w-full relative z-20"
          >
            <div className="w-full bg-[#161311]/95 border border-primary/30 rounded-3xl p-5 sm:p-7 backdrop-blur-xl shadow-2xl shadow-black/60 space-y-6 relative">
              {/* DRAWER TITLE */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                    <FiSliders className="text-xs" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base sm:text-lg font-normal text-white">
                      {title}
                    </h3>
                    {description && (
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        {description}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={togglePanel}
                  className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close filter drawer"
                >
                  <FiX className="text-base" />
                </button>
              </div>

              {/* CUSTOM FILTER FIELDS (SLOTS) */}
              {children}

              {/* FOOTER ACTIONS */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10">
                <div>
                  {totalItems !== undefined && (
                    <span className="text-xs text-neutral-400">
                      <span className="font-semibold text-primary">
                        {totalItems}
                      </span>{" "}
                      {totalItems === 1 ? itemLabel.replace(/s$/, "") : itemLabel}{" "}
                      available
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                  {onReset && (
                    <button
                      type="button"
                      onClick={onReset}
                      className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <FiRotateCcw className="text-xs" />
                      {resetText}
                    </button>
                  )}
                  {onApply && (
                    <button
                      type="button"
                      onClick={onApply}
                      className="px-6 py-2 rounded-xl bg-primary hover:bg-primary/90 text-black text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-95 cursor-pointer"
                    >
                      <FiCheck className="text-sm" />
                      {applyText}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* <================= RESULTS & ACTIVE FILTERS BAR =================> */}
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
        {/* RESULT COUNT & ACTIVE CHIPS */}
        <div className="flex flex-wrap items-center gap-2">
          {totalItems !== undefined && (
            <span className="text-xs sm:text-sm text-neutral-300 font-medium">
              Showing{" "}
              <span className="text-primary font-bold">{totalItems}</span>{" "}
              {totalItems === 1 ? itemLabel.replace(/s$/, "") : itemLabel}
              {hasActiveFilters && ":"}
            </span>
          )}

          {activeChips.map((chip) => (
            <span
              key={chip.id || chip.label}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-medium"
            >
              {chip.label}
              {chip.onRemove && (
                <button
                  type="button"
                  onClick={chip.onRemove}
                  className="hover:text-white cursor-pointer ml-0.5"
                  aria-label={`Remove ${chip.label}`}
                >
                  <FiX className="text-xs" />
                </button>
              )}
            </span>
          ))}
        </div>

        {/* CLEAR ALL BUTTON */}
        {hasActiveFilters && onClearAll && (
          <button
            type="button"
            onClick={onClearAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/25 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-xs font-semibold transition-all cursor-pointer shrink-0"
          >
            <FiTrash2 className="text-xs" />
            <span>Clear All</span>
          </button>
        )}
      </div>
    </div>
  );
}

FilterPanel.propTypes = {
  searchTerm: PropTypes.string,
  onSearchChange: PropTypes.func,
  searchPlaceholder: PropTypes.string,
  showSearch: PropTypes.bool,
  defaultOpen: PropTypes.bool,
  isOpen: PropTypes.bool,
  onToggleOpen: PropTypes.func,
  activeFilterCount: PropTypes.number,
  title: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.node,
  onApply: PropTypes.func,
  onReset: PropTypes.func,
  applyText: PropTypes.string,
  resetText: PropTypes.string,
  totalItems: PropTypes.number,
  itemLabel: PropTypes.string,
  activeChips: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.string.isRequired,
      onRemove: PropTypes.func,
    })
  ),
  onClearAll: PropTypes.func,
  className: PropTypes.string,
};
