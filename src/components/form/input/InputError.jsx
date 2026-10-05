"use client";

import React from "react";
import PropTypes from "prop-types";

export default function InputError({
  error,
  id,
  className = "",
  testId,
  children,
}) {
  const message = error || children;
  if (!message) return null;

  return (
    <p
      id={id}
      data-testid={testId ? `${testId}_error` : undefined}
      role="alert"
      className={`text-xs text-red-400 font-medium flex items-center gap-1 mt-0.5 ${className}`}
    >
      {message}
    </p>
  );
}

InputError.propTypes = {
  error: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
  testId: PropTypes.string,
  children: PropTypes.node,
};
