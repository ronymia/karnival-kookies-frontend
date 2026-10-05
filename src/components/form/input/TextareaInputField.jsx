"use client";

import React from "react";
import PropTypes from "prop-types";
import { Controller, useFormContext } from "react-hook-form";
import InputLabel from "./InputLabel";
import InputError from "./InputError";

export default function TextareaInputField({
  name,
  label,
  placeholder = "",
  defaultValue = "",
  disabled = false,
  readOnly = false,
  required = false,
  rows = 4,
  helperText,
  wrapperClassName = "",
  labelClassName = "",
  inputClassName = "",
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

            {/* TEXTAREA ELEMENT */}
            <textarea
              id={name}
              name={name}
              rows={rows}
              placeholder={placeholder}
              disabled={disabled}
              readOnly={readOnly}
              data-testid={testId}
              aria-invalid={hasError}
              aria-describedby={hasError ? `${name}-error` : undefined}
              className={`w-full px-4 py-3 rounded-xl text-sm text-white bg-[#151312] border transition-all placeholder:text-neutral-500 outline-none resize-none ${
                hasError
                  ? "border-red-500/80 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-500/5"
                  : "border-primary/25 hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/25 focus:bg-[#1a1715]"
              } ${
                disabled ? "opacity-50 cursor-not-allowed bg-black/40" : ""
              } ${inputClassName}`}
              {...field}
              value={field.value ?? ""}
              {...rest}
            />

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

TextareaInputField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  defaultValue: PropTypes.string,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  rows: PropTypes.number,
  helperText: PropTypes.string,
  wrapperClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  inputClassName: PropTypes.string,
  errorClassName: PropTypes.string,
  testId: PropTypes.string,
  control: PropTypes.object,
  rules: PropTypes.object,
  error: PropTypes.string,
};
