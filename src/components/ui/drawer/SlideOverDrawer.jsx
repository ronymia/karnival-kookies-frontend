"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "motion/react";
import { FiX } from "react-icons/fi";

const SIZE_MAP = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  full: "max-w-full",
};

/**
 * Highly reusable SlideOverDrawer (Sheet Drawer) powered by Framer Motion.
 * Supports right/left sliding, sizes (sm to 2xl), custom headers/footers, and portal mounting.
 */
export default function SlideOverDrawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  headerExtra,
  size = "md",
  position = "right",
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEsc = true,
  className = "",
  bodyClassName = "",
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ESC key listener & body scroll lock
  useEffect(() => {
    if (!closeOnEsc) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose?.();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, closeOnEsc]);

  if (!isMounted) return null;

  const sizeClass = SIZE_MAP[size] || size || "max-w-md";
  const isRight = position === "right";
  const initialOffset = isRight ? "100%" : "-100%";

  const drawerContent = (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[9999] overflow-hidden"
        >
          {/* BACKDROP OVERLAY */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeOnBackdropClick ? onClose : undefined}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
          />

          {/* SLIDE-OVER CONTAINER */}
          <div
            className={`fixed inset-y-0 max-w-full flex ${
              isRight ? "right-0 pl-10" : "left-0 pr-10"
            }`}
          >
            <motion.div
              initial={{ x: initialOffset }}
              animate={{ x: 0 }}
              exit={{ x: initialOffset }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className={`w-screen ${sizeClass} bg-[#161311]/95 border-primary/25 backdrop-blur-2xl shadow-2xl shadow-black/90 flex flex-col justify-between ${
                isRight ? "border-l" : "border-r"
              } ${className}`}
            >
              {/* STICKY DRAWER HEADER */}
              {(title || showCloseButton || headerExtra) && (
                <div className="px-6 py-5 border-b border-white/10 flex items-start justify-between bg-white/[0.02] shrink-0">
                  <div className="space-y-1 pr-4">
                    {title && (
                      <h3 className="font-serif text-xl sm:text-2xl font-medium text-white tracking-tight">
                        {title}
                      </h3>
                    )}
                    {subtitle && (
                      <p className="text-xs text-neutral-400 font-light leading-relaxed">
                        {subtitle}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {headerExtra}
                    {showCloseButton && (
                      <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/10 flex items-center justify-center transition-all cursor-pointer"
                        aria-label="Close drawer"
                      >
                        <FiX className="text-base" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* SCROLLABLE CONTENT BODY */}
              <div
                className={`flex-1 overflow-y-auto p-6 space-y-6 ${bodyClassName}`}
              >
                {children}
              </div>

              {/* OPTIONAL STICKY FOOTER */}
              {footer && (
                <div className="p-6 border-t border-white/10 bg-white/[0.02] shrink-0">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(drawerContent, document.body);
}

// ==================== COMPOUND SUB-COMPONENTS (OPTIONAL COMPOSITIONAL USE) ====================

SlideOverDrawer.Header = function DrawerHeader({
  title,
  subtitle,
  children,
  onClose,
  className = "",
}) {
  return (
    <div
      className={`px-6 py-5 border-b border-white/10 flex items-start justify-between bg-white/[0.02] shrink-0 ${className}`}
    >
      <div className="space-y-1">
        {title && (
          <h3 className="font-serif text-xl sm:text-2xl font-medium text-white tracking-tight">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="text-xs text-neutral-400 font-light leading-relaxed">
            {subtitle}
          </p>
        )}
        {children}
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/10 flex items-center justify-center transition-all cursor-pointer shrink-0"
          aria-label="Close drawer"
        >
          <FiX className="text-base" />
        </button>
      )}
    </div>
  );
};

SlideOverDrawer.Body = function DrawerBody({ children, className = "" }) {
  return (
    <div className={`flex-1 overflow-y-auto p-6 space-y-6 ${className}`}>
      {children}
    </div>
  );
};

SlideOverDrawer.Footer = function DrawerFooter({ children, className = "" }) {
  return (
    <div
      className={`p-6 border-t border-white/10 bg-white/[0.02] shrink-0 ${className}`}
    >
      {children}
    </div>
  );
};

// ==================== PROP TYPES ====================

SlideOverDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  headerExtra: PropTypes.node,
  size: PropTypes.oneOf(["sm", "md", "lg", "xl", "2xl", "full", PropTypes.string]),
  position: PropTypes.oneOf(["right", "left"]),
  showCloseButton: PropTypes.bool,
  closeOnBackdropClick: PropTypes.bool,
  closeOnEsc: PropTypes.bool,
  className: PropTypes.string,
  bodyClassName: PropTypes.string,
};

SlideOverDrawer.Header.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  children: PropTypes.node,
  onClose: PropTypes.func,
  className: PropTypes.string,
};

SlideOverDrawer.Body.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

SlideOverDrawer.Footer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
