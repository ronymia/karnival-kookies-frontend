"use client";

import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function PasswordField({
  id,
  label,
  required = false,
  name,
  value,
  placeholder,
  onChange,
  error,
  defaultValue,
  wrapperClassName,
  fieldClassName,
  testId,
}) {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div
      data-testid={`${testId}_wrapper`}
      className={`${wrapperClassName} flex flex-col justify-start gap-y-2`}
    >
      {/* <------------------------- LABEL -------------------------> */}
      <label data-testid={`${testId}_label`} htmlFor={id} className="">
        <span
          data-testid={`${testId}_label_text`}
          className="label-text text-md font-bold"
        >
          {label}{" "}
          {required && <span className="text-error font-bold text-md">*</span>}
        </span>
      </label>

      {/* <------------------------- INPUT FIELD -------------------------> */}
      <div data-testid={`${testId}_icons`} className={`w-full relative`}>
        {isVisible ? (
          <AiOutlineEyeInvisible
            onClick={() => {
              setIsVisible(!isVisible);
            }}
            className="absolute right-3 text-xl top-1/2 -translate-y-1/2"
          />
        ) : (
          <AiOutlineEye
            onClick={() => {
              setIsVisible(!isVisible);
            }}
            className="absolute right-3 text-xl top-1/2 -translate-y-1/2"
          />
        )}
        <input
          data-testid={testId}
          id={id}
          required
          onChange={onChange}
          type={isVisible ? "text" : "password"}
          defaultValue={defaultValue}
          value={value}
          name={name}
          aria-placeholder={placeholder} // Use aria-placeholder for accessibility
          aria-invalid={error}
          aria-describedby={error ? `${id}-error` : undefined}
          autoComplete="off" // Disable autocomplete
          spellCheck={false} // Disable spell checking
          autoFocus={false} // Don't auto-focus
          placeholder={`${placeholder}${required && "*"}`}
          className={`bg-secondary rounded border border-solid  px-3 py-2 placeholder:text-sm placeholder:capitalize input-md focus:outline-primary input-bordered  ${
            error
              ? "border-red-500 focus:border-red-500"
              : "input-bordered focus:border-primary"
          }  ${fieldClassName}`}
        />
      </div>

      {/* Error Message */}
      {error && (
        <p
          data-testid={`${testId}_error`}
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
