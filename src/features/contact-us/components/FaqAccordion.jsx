"use client";

import { useState } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "motion/react";
import { FiChevronDown, FiHelpCircle } from "react-icons/fi";

export default function FaqAccordion({ faqs = [] }) {
  const [openIndex, setOpenIndex] = useState(0); // First item open by default

  const toggleItem = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3.5">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={faq.id || faq.question || index}
            className={`rounded-2xl border transition-all duration-200 overflow-hidden backdrop-blur-md ${
              isOpen
                ? "bg-[#171412] border-primary/40 shadow-lg shadow-primary/5"
                : "bg-[#161311]/85 border-white/10 hover:border-primary/25"
            }`}
          >
            {/* ACCORDION HEADER / TRIGGER */}
            <button
              type="button"
              onClick={() => toggleItem(index)}
              className="w-full flex items-center justify-between p-5 sm:p-6 text-left cursor-pointer transition-colors gap-4"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 transition-colors ${
                    isOpen
                      ? "bg-primary text-black font-bold"
                      : "bg-white/5 text-primary border border-primary/20"
                  }`}
                >
                  <FiHelpCircle className="text-sm" />
                </div>
                <span
                  className={`font-serif text-base sm:text-lg font-normal transition-colors ${
                    isOpen ? "text-primary" : "text-white"
                  }`}
                >
                  {faq.question}
                </span>
              </div>

              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 border transition-all duration-200 ${
                  isOpen
                    ? "bg-primary/20 border-primary text-primary rotate-180"
                    : "bg-white/5 border-white/10 text-neutral-400"
                }`}
              >
                <FiChevronDown />
              </div>
            </button>

            {/* ACCORDION CONTENT (ANIMATED) */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-neutral-300 font-light leading-relaxed border-t border-white/5">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

FaqAccordion.propTypes = {
  faqs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      question: PropTypes.string.isRequired,
      answer: PropTypes.string.isRequired,
    })
  ),
};
