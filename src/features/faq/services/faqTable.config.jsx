import React from "react";
import SplitDescription from "@/shared/SplitDescription";
import { htmlToPlainText } from "@/utils/htmlToPlainText";
import { FiHelpCircle } from "react-icons/fi";

export const FAQ_TABLE_COLUMNS = [
  {
    header: "#",
    accessorKey: "count",
    minWidth: 5,
    show: true,
    isMainField: true,
  },
  {
    header: "QUESTION",
    accessorKey: "question_display",
    minWidth: 40,
    show: true,
    isMainField: true,
  },
  {
    header: "ANSWER",
    accessorKey: "answer_display",
    minWidth: 50,
    show: true,
  },
];

/**
 * Formats raw FAQ records into rich table rows.
 */
export function formatFaqRows(faqs = [], currentPage = 1, pageSize = 10) {
  if (!Array.isArray(faqs)) return [];

  return faqs.map((faq, idx) => {
    return {
      ...faq,
      count: (currentPage - 1) * pageSize + idx + 1,

      // QUESTION DISPLAY WITH ICON
      question_display: (
        <div className="flex items-start gap-2.5 py-1">
          <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shrink-0 mt-0.5 shadow-sm">
            <FiHelpCircle className="text-sm" />
          </div>
          <span className="font-semibold text-white text-sm leading-snug hover:text-primary transition-colors">
            {faq.question}
          </span>
        </div>
      ),

      // ANSWER DISPLAY
      answer_display: (
        <div className="text-xs text-neutral-300 leading-relaxed max-w-xl">
          <SplitDescription
            text={htmlToPlainText(faq.answer)}
            length={80}
          />
        </div>
      ),
    };
  });
}
