import React from "react";
import PropTypes from "prop-types";

export default function ShowSocialCard({ Icon, text, content, href }) {
  const contentElement = href ? (
    <a
      href={href}
      className="text-xs sm:text-sm text-neutral-300 hover:text-primary transition-colors block"
    >
      {content}
    </a>
  ) : (
    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
      {content}
    </p>
  );

  return (
    <div className="flex items-start gap-3 group">
      {Icon && (
        <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center shrink-0 mt-0.5 text-primary group-hover:border-primary/60 group-hover:bg-primary/20 transition-all shadow-sm">
          <Icon className="text-sm" />
        </div>
      )}
      <div className="space-y-0.5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-primary/80">
          {text}
        </p>
        {contentElement}
      </div>
    </div>
  );
}

ShowSocialCard.propTypes = {
  Icon: PropTypes.elementType,
  text: PropTypes.string,
  content: PropTypes.string,
  href: PropTypes.string,
};
