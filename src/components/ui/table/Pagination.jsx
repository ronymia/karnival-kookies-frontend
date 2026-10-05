"use client";

import PropTypes from "prop-types";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Pagination({
  filters,
  setFilters,
  total,
  totalPage,
  totalPages,
  currentPage,
  page,
  pageSize,
  perPage,
  onPageChange,
  className = "",
}) {
  // Normalize current page (1-based index)
  const activePage = Math.max(
    1,
    Number(currentPage || page || filters?.page || 1)
  );

  // Normalize page size / perPage
  const limit = Math.max(
    1,
    Number(pageSize || perPage || filters?.limit || filters?.perPage || 10)
  );

  // Calculate total pages safely
  const calculatedTotalPages = Math.max(
    1,
    Number(
      totalPage ||
        totalPages ||
        (typeof total === "number" ? Math.ceil(total / limit) : 1)
    )
  );

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > calculatedTotalPages || newPage === activePage) {
      return;
    }

    if (typeof onPageChange === "function") {
      onPageChange(newPage);
    } else if (typeof setFilters === "function") {
      setFilters((prev) => {
        if (typeof prev === "object" && prev !== null) {
          return { ...prev, page: newPage };
        }
        return { ...(filters || {}), page: newPage };
      });
    }
  };

  // If there's only 1 page, no need to render pagination controls
  if (calculatedTotalPages <= 1) {
    return null;
  }

  // Generate page numbers with sliding window & ellipsis
  const getPageNumbers = () => {
    if (calculatedTotalPages <= 7) {
      return Array.from({ length: calculatedTotalPages }, (_, i) => i + 1);
    }
    if (activePage <= 4) {
      return [1, 2, 3, 4, 5, "...", calculatedTotalPages];
    }
    if (activePage >= calculatedTotalPages - 3) {
      return [
        1,
        "...",
        calculatedTotalPages - 4,
        calculatedTotalPages - 3,
        calculatedTotalPages - 2,
        calculatedTotalPages - 1,
        calculatedTotalPages,
      ];
    }
    return [
      1,
      "...",
      activePage - 1,
      activePage,
      activePage + 1,
      "...",
      calculatedTotalPages,
    ];
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={`flex items-center gap-1.5 ${className}`}
    >
      {/* PREVIOUS BUTTON */}
      <button
        type="button"
        onClick={() => handlePageChange(activePage - 1)}
        disabled={activePage <= 1}
        title="Previous Page"
        aria-label="Previous Page"
        className="flex items-center justify-center h-8 w-8 rounded-xl font-medium transition-all duration-150 text-xs bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-neutral-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none disabled:hover:bg-white/5 cursor-pointer"
      >
        <FaChevronLeft className="text-[10px]" />
      </button>

      {/* PAGE NUMBERS */}
      {pageNumbers.map((p, idx) => {
        if (p === "...") {
          return (
            <span
              key={`ellipsis-${idx}`}
              className="flex items-center justify-center h-8 w-6 text-neutral-500 text-xs select-none"
            >
              ...
            </span>
          );
        }

        const isActive = p === activePage;

        return (
          <button
            key={`page-${p}`}
            type="button"
            onClick={() => handlePageChange(p)}
            aria-current={isActive ? "page" : undefined}
            className={`flex items-center justify-center h-8 min-w-[32px] px-2 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
              isActive
                ? "bg-primary text-black shadow-md shadow-primary/25 font-bold"
                : "bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-neutral-300 hover:text-white"
            }`}
          >
            {p}
          </button>
        );
      })}

      {/* NEXT BUTTON */}
      <button
        type="button"
        onClick={() => handlePageChange(activePage + 1)}
        disabled={activePage >= calculatedTotalPages}
        title="Next Page"
        aria-label="Next Page"
        className="flex items-center justify-center h-8 w-8 rounded-xl font-medium transition-all duration-150 text-xs bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-neutral-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none disabled:hover:bg-white/5 cursor-pointer"
      >
        <FaChevronRight className="text-[10px]" />
      </button>
    </nav>
  );
}

/* <================================ PROP TYPES DEFINE ================================> */
Pagination.propTypes = {
  filters: PropTypes.object,
  setFilters: PropTypes.func,
  total: PropTypes.number,
  totalPage: PropTypes.number,
  totalPages: PropTypes.number,
  currentPage: PropTypes.number,
  page: PropTypes.number,
  pageSize: PropTypes.number,
  perPage: PropTypes.number,
  onPageChange: PropTypes.func,
  className: PropTypes.string,
};
