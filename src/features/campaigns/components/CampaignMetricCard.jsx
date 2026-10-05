"use client";

import PropTypes from "prop-types";

const VARIANT_STYLES = {
  default: {
    container: "bg-white/[0.03] border-white/10 hover:border-white/20",
    icon: "text-primary",
    label: "text-neutral-400",
  },
  primary: {
    container: "bg-primary/10 border-primary/20 hover:border-primary/30",
    icon: "text-primary",
    label: "text-primary/90",
  },
  success: {
    container: "bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/30",
    icon: "text-emerald-400",
    label: "text-emerald-400",
  },
  warning: {
    container: "bg-white/[0.03] border-white/10 hover:border-white/20",
    icon: "text-amber-400",
    label: "text-neutral-400",
  },
  info: {
    container: "bg-white/[0.03] border-white/10 hover:border-white/20",
    icon: "text-blue-400",
    label: "text-neutral-400",
  },
};

export default function CampaignMetricCard({
  title,
  label,
  value,
  icon: Icon,
  variant = "default",
  isLoading = false,
  className = "",
  iconClassName = "",
}) {
  const cardLabel = title || label;
  const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.default;

  return (
    <div
      className={`p-4 rounded-2xl border transition-all duration-200 ${styles.container} ${className}`}
    >
      <div className="flex items-center gap-2 text-xs">
        {Icon && (
          <Icon className={`text-sm shrink-0 ${iconClassName || styles.icon}`} />
        )}
        <span className={styles.label}>{cardLabel}</span>
      </div>

      {isLoading ? (
        <div className="h-8 w-16 bg-white/10 rounded-lg animate-pulse mt-1.5" />
      ) : (
        <p className="font-mono text-2xl font-bold text-white mt-1.5">
          {value ?? 0}
        </p>
      )}
    </div>
  );
}

CampaignMetricCard.propTypes = {
  title: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  icon: PropTypes.elementType,
  variant: PropTypes.oneOf(["default", "primary", "success", "warning", "info"]),
  isLoading: PropTypes.bool,
  className: PropTypes.string,
  iconClassName: PropTypes.string,
};
