import React from "react";
import SplitDescription from "@/shared/SplitDescription";
import { FiGlobe } from "react-icons/fi";
import { MetaDataService } from "./metaDataService";

export const META_DATA_TABLE_COLUMNS = [
  {
    header: "#",
    accessorKey: "count",
    minWidth: 5,
    show: true,
    isMainField: true,
  },
  {
    header: "TARGET PAGE",
    accessorKey: "page_badge",
    minWidth: 25,
    show: true,
    isMainField: true,
  },
  {
    header: "SEO TITLE",
    accessorKey: "title_display",
    minWidth: 35,
    show: true,
    isMainField: true,
  },
  {
    header: "META DESCRIPTION",
    accessorKey: "description_display",
    minWidth: 40,
    show: true,
  },
];

/**
 * Formats raw metadata records into rich table rows.
 */
export function formatMetaDataRows(
  items = [],
  currentPage = 1,
  pageSize = 10
) {
  if (!Array.isArray(items)) return [];

  return items.map((m, idx) => {
    const pageLabel = MetaDataService.formatMetaKey(m.meta_key);

    return {
      ...m,
      count: (currentPage - 1) * pageSize + idx + 1,

      // TARGET PAGE BADGE
      page_badge: (
        <div className="flex items-center gap-2 py-1">
          <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shrink-0 shadow-sm">
            <FiGlobe className="text-sm" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-white text-xs sm:text-sm">
              {pageLabel}
            </span>
            <code className="text-[10px] text-neutral-400 font-mono">
              {m.meta_key}
            </code>
          </div>
        </div>
      ),

      // SEO TITLE DISPLAY
      title_display: (
        <span className="font-semibold text-white text-xs sm:text-sm leading-snug hover:text-primary transition-colors">
          {m.title}
        </span>
      ),

      // META DESCRIPTION DISPLAY
      description_display: (
        <div className="text-xs text-neutral-300 leading-relaxed max-w-lg">
          <SplitDescription text={m.description} length={75} />
        </div>
      ),
    };
  });
}
