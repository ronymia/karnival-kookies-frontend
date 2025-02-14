"use client";

import { BiSolidCheckCircle } from "react-icons/bi";
import React from "react";

export default function RadioButton({
  options = [],
  onChange = (e) => e,
  wrapperClassName = "",
  label = "",
  disabled = false,
  required = false,
  defaultChecked,
  inputFieldClassName,
  testId,
  error,
}) {
  return (
    <div
      data-testid={`${testId}_container`}
      className={`${wrapperClassName} flex flex-col justify-start gap-y-2`}
    >
      {/* LABEL */}
      {label && (
        <label
          // htmlFor={testId}
          data-testid={`${testId}_label`}
          className={`label-text text-md font-bold`}
        >
          {label}{" "}
          {required && <span className="text-error font-bold text-md">*</span>}
        </label>
      )}

      <div className={`grid gap-x-2 ${inputFieldClassName}`}>
        {options.map(({ name, title, value, Icon }, index) => {
          const isChecked = defaultChecked === value;
          return (
            <div key={index} className="w-full">
              <input
                type="radio"
                name={name}
                onChange={onChange}
                value={value}
                className="hidden"
                id={`${name}${value}`}
                defaultChecked={isChecked}
                disabled={disabled}
                aria-checked={isChecked}
                aria-labelledby={`${name}${value}-label`}
              />

              <label
                htmlFor={`${name}${value}`}
                id={`${name}${value}-label`}
                className={`${
                  isChecked
                    ? "relative bg-base-100 border-primary font-bold text-base-300"
                    : "bg-base-100 opacity-50 border-primary-content"
                } justify-center sm:flex-col lg:flex-row gap-x-1 rounded-lg border-2 px-5 input-md flex items-center cursor-pointer checked:text-primary`}
              >
                {isChecked && (
                  <BiSolidCheckCircle className="absolute bg-white rounded-full -right-2 -top-2 text-xl text-primary" />
                )}
                {Icon && <Icon className="text-md" />}
                <span
                  className={`text-sm ${!isChecked ? "text-base-300" : ""}`}
                >
                  {title}
                </span>
              </label>
            </div>
          );
        })}
      </div>

      {/* Error Message */}
      {error && (
        <p
          data-testid={`${testId}_error_message`}
          id={`${testId}-error`} // ID to link with input field's aria-describedby
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
