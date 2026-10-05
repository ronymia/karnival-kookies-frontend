"use client";

import PropTypes from "prop-types";

/**
 * Reusable PageHeader for Admin & Dashboard views.
 * Supports breadcrumbs, title, description, badge, and action buttons.
 */
export default function PageHeader({
  title,
  description,
  breadcrumbs,
  action,
  badge,
  className = "",
}) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* OPTIONAL TOP ROW: BREADCRUMBS & ACTION */}
      {(breadcrumbs || action) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {breadcrumbs && <div>{breadcrumbs}</div>}
          {action && <div className="self-start sm:self-auto">{action}</div>}
        </div>
      )}

      {/* TITLE & DESCRIPTION ROW */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-3 border-b border-white/5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-white">
              {title}
            </h1>
            {badge && <div>{badge}</div>}
          </div>
          {description && (
            <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

PageHeader.propTypes = {
  title: PropTypes.node.isRequired,
  description: PropTypes.node,
  breadcrumbs: PropTypes.node,
  action: PropTypes.node,
  badge: PropTypes.node,
  className: PropTypes.string,
};
