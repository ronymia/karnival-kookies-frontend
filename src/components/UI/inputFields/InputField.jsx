"use client";

import React from "react";

export default function InputField({
  id,
  name,
  value,
  defaultValue,
  error,
  label,
  type = "text",
  placeholder,

  required = false,
  readOnly = false,
  disabled = false,

  wrapperClassName,
  fieldClassName,
  testId,
  onChange = (event) => event,
}) {
  return (
    <div
      data-testid={`${testId}_container`}
      className={`${wrapperClassName} flex flex-col justify-start gap-y-2`}
    >
      {/* LABEL */}
      {label && (
        <label
          htmlFor={id}
          data-testid={`${testId}_label`}
          className={`label-text text-md font-bold`}
        >
          {label}{" "}
          {required && <span className="text-error font-bold text-md">*</span>}
        </label>
      )}

      {/* INPUT FIELD */}
      <input
        data-testid={testId}
        type={type} // Set input type as needed
        id={id}
        name={name}
        onChange={onChange}
        value={value} // Ensure value is never undefined
        defaultValue={defaultValue}
        placeholder={placeholder}
        readOnly={readOnly}
        disabled={disabled}
        aria-label={label} // Use aria-label for accessibility
        aria-placeholder={placeholder} // Use aria-placeholder for accessibility
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        autoComplete="off" // Disable autocomplete
        spellCheck={false} // Disable spell checking
        autoFocus={false} // Don't auto-focus
        className={`text-base-300 bg-secondary rounded border border-solid  px-3 py-2 placeholder:text-sm placeholder:capitalize input-md focus:outline-primary input-bordered
        ${
          error
            ? "border-red-500 focus:border-red-500"
            : "input-bordered focus:border-primary"
        } 
        ${fieldClassName} `}
      />

      {/* Error Message */}
      {error && (
        <p
          data-testid={`${testId}_error_message`}
          id={`${id}-error`} // ID to link with input field's aria-describedby
          role="alert"
          aria-label="error message"
          aria-live="assertive" // Ensures screen readers announce the message immediately
          aria-atomic="true" // Ensures the whole message is read out
          className="text-xs text-red-500"
        >
          {error}
        </p>
      )}
    </div>
  );
}
