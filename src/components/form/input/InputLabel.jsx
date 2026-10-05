"use client";

import React from "react";
import PropTypes from "prop-types";

export default function InputLabel({
  label,
  htmlFor,
  required = false,
  className = "",
  testId,
  children,
}) {
  const content = label || children;
  if (!content) return null;

  return (
    <label
      htmlFor={htmlFor}
      data-testid={testId ? `${testId}_label` : undefined}
      className={`text-sm font-semibold text-white/90 flex items-center justify-between ${className}`}
    >
      <span>
        {content}
        {required && <span className="text-red-400 ml-1 font-bold">*</span>}
      </span>
    </label>
  );
}

InputLabel.propTypes = {
  label: PropTypes.node,
  htmlFor: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string,
  testId: PropTypes.string,
  children: PropTypes.node,
};
