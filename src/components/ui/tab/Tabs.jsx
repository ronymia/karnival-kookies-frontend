"use client";

import PropTypes from "prop-types";
import { motion } from "motion/react";

export default function Tabs({ tabs, activeTab, setActiveTab }) {
  if (!tabs || tabs.length === 0) return null;

  return (
    <div className="flex justify-center items-center w-full px-2">
      <div className="inline-flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-full bg-[#161311]/85 border border-primary/25 backdrop-blur-md max-w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden shadow-lg shadow-black/30">
        {tabs.map((tab) => {
          const isActive = activeTab === tab?.id;
          return (
            <button
              key={tab?.id}
              type="button"
              onClick={() => setActiveTab(tab?.id)}
              className={`relative px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer shrink-0 whitespace-nowrap ${
                isActive
                  ? "text-black shadow-md shadow-primary/30"
                  : "text-neutral-300 hover:text-white hover:bg-white/5"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeCategoryTab"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  className="absolute inset-0 rounded-full bg-linear-to-r from-primary via-amber-500 to-[#e6aa38] z-0"
                />
              )}
              <span className="relative z-10">{tab?.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
    })
  ),
  activeTab: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setActiveTab: PropTypes.func.isRequired,
};
