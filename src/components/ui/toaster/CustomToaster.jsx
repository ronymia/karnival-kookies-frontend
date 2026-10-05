"use client";

import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { toast } from "react-hot-toast";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiAlertTriangle,
  FiX,
} from "react-icons/fi";

/**
 * Luxury dark glassmorphism toast notification component for react-hot-toast.
 */
export default function CustomToaster({
  t,
  type = "success",
  text = "",
  title = "",
  errors = {},
  pageId = "",
  duration = 4000,
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (t?.id) {
        toast.dismiss(t.id);
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [t?.id, duration]);

  // Status configuration mapping
  const config = {
    success: {
      border: "border-emerald-500/30 hover:border-emerald-500/50",
      glow: "shadow-emerald-950/40",
      accent: "text-emerald-400",
      badgeBg: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
      defaultTitle: "Success",
      Icon: FiCheckCircle,
    },
    error: {
      border: "border-rose-500/30 hover:border-rose-500/50",
      glow: "shadow-rose-950/40",
      accent: "text-rose-400",
      badgeBg: "bg-rose-500/15 border-rose-500/30 text-rose-400",
      defaultTitle: "Action Failed",
      Icon: FiAlertCircle,
    },
    warning: {
      border: "border-amber-500/30 hover:border-amber-500/50",
      glow: "shadow-amber-950/40",
      accent: "text-amber-400",
      badgeBg: "bg-amber-500/15 border-amber-500/30 text-amber-400",
      defaultTitle: "Attention",
      Icon: FiAlertTriangle,
    },
    info: {
      border: "border-primary/35 hover:border-primary/60",
      glow: "shadow-primary/20",
      accent: "text-primary",
      badgeBg: "bg-primary/15 border-primary/30 text-primary",
      defaultTitle: "Information",
      Icon: FiInfo,
    },
  };

  const current = config[type] || config.info;
  const { Icon } = current;
  const displayTitle = title || current.defaultTitle;
  const isVisible = t?.visible ?? true;

  const errorKeys = Object.keys(errors || {});

  return (
    <div
      role="alert"
      className={`relative max-w-md w-full p-4 rounded-2xl bg-[#181513]/95 backdrop-blur-xl border ${
        current.border
      } shadow-2xl ${current.glow} flex items-start gap-3.5 transition-all duration-300 font-sans ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
      }`}
    >
      {/* STATUS ICON BADGE */}
      <div
        className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${current.badgeBg}`}
      >
        <Icon className="text-lg" />
      </div>

      {/* CONTENT BODY */}
      <div className="flex flex-col grow min-w-0 pr-1">
        {/* HEADER / TITLE */}
        <div className="flex items-center gap-2">
          {pageId && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-400">
              {pageId}
            </span>
          )}
          <span
            className={`text-xs font-bold uppercase tracking-wider ${current.accent}`}
          >
            {displayTitle}
          </span>
        </div>

        {/* MESSAGE / TEXT */}
        {text && (
          <p className="text-xs sm:text-sm text-neutral-200 font-normal leading-relaxed mt-1">
            {text}
          </p>
        )}

        {/* DETAILED VALIDATION ERRORS LIST */}
        {type === "error" && errorKeys.length > 0 && (
          <div className="mt-2.5 pt-2 border-t border-white/10 space-y-1">
            {errorKeys.map((field) => {
              const fieldErrors = Array.isArray(errors[field])
                ? errors[field]
                : [errors[field]];
              return fieldErrors.map((msg, idx) => (
                <p
                  key={`${field}-${idx}`}
                  className="text-xs text-rose-300 flex items-start gap-1.5"
                >
                  <span className="text-rose-500 font-bold">•</span>
                  <span>{msg}</span>
                </p>
              ));
            })}
          </div>
        )}
      </div>

      {/* DISMISS BUTTON */}
      <button
        type="button"
        onClick={() => t?.id && toast.dismiss(t.id)}
        aria-label="Dismiss notification"
        className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
      >
        <FiX className="text-base" />
      </button>
    </div>
  );
}

CustomToaster.propTypes = {
  t: PropTypes.object,
  type: PropTypes.oneOf(["success", "error", "warning", "info"]),
  text: PropTypes.node,
  title: PropTypes.string,
  errors: PropTypes.object,
  pageId: PropTypes.string,
  duration: PropTypes.number,
};
