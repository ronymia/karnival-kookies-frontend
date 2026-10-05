import React from "react";

// ==================== CATEGORY TABLE CONFIG ====================

export const CATEGORY_TABLE_COLUMNS = [
  {
    header: "#",
    "data-label": "#",
    accessorKey: "count",
  },
  {
    header: "Category",
    "data-label": "Category",
    accessorKey: "name_display",
  },
  {
    header: "Description",
    "data-label": "Description",
    accessorKey: "description_table",
  },
  {
    header: "Status",
    "data-label": "Status",
    accessorKey: "status_display",
  },
];

/**
 * Formats raw category objects into UI-ready table rows with cell decorators.
 */
export function formatCategoryRows(categories = [], page = 1, limit = 20) {
  if (!Array.isArray(categories)) return [];

  return categories.map((cat, idx) => {
    const count = (page - 1) * limit + idx + 1;
    const firstLetter = cat.name?.charAt(0)?.toUpperCase() || "C";

    return {
      ...cat,
      count,
      name_display: (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/30 text-primary font-bold flex items-center justify-center text-xs shadow-md shadow-primary/10 shrink-0">
            {firstLetter}
          </div>
          <span className="font-semibold text-white group-hover:text-primary transition-colors">
            {cat.name}
          </span>
        </div>
      ),
      description_table: cat?.description ? (
        <p className="line-clamp-2 text-neutral-300 font-light max-w-md">
          {cat.description}
        </p>
      ) : (
        <span className="text-neutral-500 italic text-xs">
          No description provided
        </span>
      ),
      status_display: (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Active
        </span>
      ),
    };
  });
}
