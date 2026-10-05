"use client";

import React from "react";
import PropTypes from "prop-types";
import ButtonSpinner from "./ButtonSpinner";

const VARIANTS = {
  primary:
    "bg-linear-to-r from-primary to-amber-500 hover:from-amber-400 hover:to-primary text-black font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]",
  secondary:
    "bg-primary/15 hover:bg-primary/25 text-primary border border-primary/30 hover:border-primary/50 font-semibold hover:scale-[1.02] active:scale-[0.98]",
  outline:
    "border border-primary/40 hover:border-primary text-primary hover:bg-primary/10 font-semibold hover:scale-[1.02] active:scale-[0.98]",
  ghost:
    "bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 font-medium active:scale-[0.98]",
  danger:
    "bg-red-600 hover:bg-red-500 text-white font-bold shadow-lg shadow-red-600/30 hover:scale-[1.02] active:scale-[0.98]",
  "danger-outline":
    "border border-red-500/30 hover:border-red-500 text-red-400 hover:bg-red-500/10 font-medium active:scale-[0.98]",
};

const SIZES = {
  sm: "px-3.5 py-1.5 text-xs gap-1.5",
  md: "px-5 py-2.5 text-xs sm:text-sm gap-2",
  lg: "px-7 py-3 text-sm sm:text-base gap-2.5",
  icon: "p-2 text-base",
};

const ROUNDED_MAP = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
};

/**
 * Reusable luxury Button component.
 * Standardized to match input field rounded-xl curvature by default.
 */
export default function Button({
  children,
  text,
  variant = "primary",
  size = "md",
  rounded = "xl",
  icon: StartIcon,
  startIcon,
  endIcon: EndIcon,
  isLoading = false,
  disabled = false,
  type = "button",
  onClick,
  className = "",
  ...props
}) {
  const variantClass = VARIANTS[variant] || VARIANTS.primary;
  const sizeClass = SIZES[size] || SIZES.md;
  const roundedClass = ROUNDED_MAP[rounded] || "rounded-xl";
  const isDisabled = disabled || isLoading;

  const content = children || text;
  const EffectiveStartIcon = startIcon || StartIcon;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`inline-flex items-center justify-center tracking-wide transition-all duration-200 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${variantClass} ${sizeClass} ${roundedClass} ${className}`}
      {...props}
    >
      {isLoading ? (
        <ButtonSpinner />
      ) : (
        <>
          {EffectiveStartIcon && (
            <span className="shrink-0">
              {typeof EffectiveStartIcon === "function" ? (
                <EffectiveStartIcon className="text-base" />
              ) : (
                EffectiveStartIcon
              )}
            </span>
          )}

          {content && <span>{content}</span>}

          {EndIcon && (
            <span className="shrink-0">
              {typeof EndIcon === "function" ? (
                <EndIcon className="text-base" />
              ) : (
                EndIcon
              )}
            </span>
          )}
        </>
      )}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node,
  text: PropTypes.string,
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "outline",
    "ghost",
    "danger",
    "danger-outline",
  ]),
  size: PropTypes.oneOf(["sm", "md", "lg", "icon"]),
  rounded: PropTypes.oneOf(["none", "sm", "md", "lg", "xl", "2xl", "full"]),
  icon: PropTypes.oneOfType([PropTypes.elementType, PropTypes.node]),
  startIcon: PropTypes.oneOfType([PropTypes.elementType, PropTypes.node]),
  endIcon: PropTypes.oneOfType([PropTypes.elementType, PropTypes.node]),
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  onClick: PropTypes.func,
  className: PropTypes.string,
};
