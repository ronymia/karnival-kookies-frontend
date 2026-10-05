"use client";

import React from "react";
import PropTypes from "prop-types";
import { Controller, useFormContext } from "react-hook-form";
import InputLabel from "./InputLabel";
import InputError from "./InputError";

export default function SelectInputField({
  name,
  label,
  options = [],
  defaultValue = "",
  disabled = false,
  required = false,
  placeholder = "Select an option",
  helperText,
  wrapperClassName = "",
  labelClassName = "",
  selectClassName = "",
  errorClassName = "",
  testId,
  control: customControl,
  rules,
  ...rest
}) {
  const formContext = useFormContext();
  const control = customControl || formContext?.control;

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      render={({ field, fieldState: { error } }) => {
        const errorMessage = error?.message || rest.error;
        const hasError = !!errorMessage;

        return (
          <div
            data-testid={testId ? `${testId}_container` : undefined}
            className={`flex flex-col gap-1.5 w-full ${wrapperClassName}`}
          >
            {/* LABEL */}
            <InputLabel
              label={label}
              htmlFor={name}
              required={required}
              className={labelClassName}
              testId={testId}
            />

            {/* SELECT WRAPPER */}
            <div className="relative flex items-center w-full">
              <select
                id={name}
                name={name}
                disabled={disabled}
                data-testid={testId}
                aria-invalid={hasError}
                aria-describedby={hasError ? `${name}-error` : undefined}
                className={`w-full px-4 py-3 pr-9 rounded-xl text-sm text-white bg-[#151312] border transition-all outline-none appearance-none cursor-pointer ${
                  hasError
                    ? "border-red-500/80 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-500/5"
                    : "border-primary/25 hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/25 focus:bg-[#1a1715]"
                } ${
                  disabled ? "opacity-50 cursor-not-allowed bg-black/40" : ""
                } ${selectClassName}`}
                {...field}
                value={field.value ?? ""}
                {...rest}
              >
                {placeholder && (
                  <option value="" disabled className="bg-[#171412] text-neutral-500">
                    {placeholder}
                  </option>
                )}
                {options.map((opt) => (
                  <option
                    key={opt.value ?? opt.id}
                    value={opt.value ?? opt.id}
                    className="bg-[#171412] text-white"
                  >
                    {opt.label ?? opt.name}
                  </option>
                ))}
              </select>

              {/* CHEVRON ICON */}
              <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-primary/80 text-xs">
                ▾
              </div>
            </div>

            {/* ERROR MESSAGE */}
            <InputError
              error={errorMessage}
              id={`${name}-error`}
              className={errorClassName}
              testId={testId}
            />

            {/* HELPER TEXT */}
            {!hasError && helperText && (
              <p className="text-xs text-white/50 mt-0.5">{helperText}</p>
            )}
          </div>
        );
      }}
    />
  );
}

SelectInputField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.string,
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
    })
  ).isRequired,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  helperText: PropTypes.string,
  wrapperClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  selectClassName: PropTypes.string,
  errorClassName: PropTypes.string,
  testId: PropTypes.string,
  control: PropTypes.object,
  rules: PropTypes.object,
  error: PropTypes.string,
};
