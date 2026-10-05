"use client";

import React from "react";
import PropTypes from "prop-types";
import { Controller, useFormContext } from "react-hook-form";
import InputError from "./InputError";

/**
 * Presentational luxury toggle switch view
 */
export function ToggleSwitchView({
  checked = false,
  onChange,
  disabled = false,
  label,
  description,
  id,
  name,
  className = "",
  testId,
}) {
  const isChecked = Boolean(checked);

  const handleToggle = () => {
    if (disabled) return;
    onChange?.(!isChecked);
  };

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onChange?.(!isChecked);
    }
  };

  return (
    <div
      data-testid={testId ? `${testId}_container` : undefined}
      className={`flex items-center justify-between gap-4 select-none ${className}`}
    >
      {(label || description) && (
        <div
          onClick={handleToggle}
          className={`flex flex-col cursor-pointer ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {label && (
            <span className="text-sm font-semibold text-white tracking-wide">
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-neutral-400 font-normal">
              {description}
            </span>
          )}
        </div>
      )}

      <button
        id={id || name}
        type="button"
        role="switch"
        aria-checked={isChecked}
        disabled={disabled}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        data-testid={testId}
        className={`relative inline-flex h-6.5 w-12 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-black ${
          isChecked
            ? "bg-primary shadow-md shadow-primary/30"
            : "bg-white/15 border border-white/10 hover:bg-white/20"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span
          className={`pointer-events-none inline-block h-5.5 w-5.5 transform rounded-full shadow-md transition-transform duration-200 ease-in-out ${
            isChecked
              ? "translate-x-5.5 bg-black"
              : "translate-x-0 bg-white"
          }`}
        />
      </button>
    </div>
  );
}

ToggleSwitchView.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  label: PropTypes.node,
  description: PropTypes.node,
  id: PropTypes.string,
  name: PropTypes.string,
  className: PropTypes.string,
  testId: PropTypes.string,
};

/**
 * Universal Toggle Switch / Checkbox Input integrated with React Hook Form
 */
export default function ToggleInputField({
  name,
  label,
  description,
  checked: controlledChecked,
  onChange: controlledOnChange,
  defaultValue = false,
  disabled = false,
  wrapperClassName = "",
  testId,
  control: customControl,
  rules,
  isNumeric = false, // When true, converts true/false to 1/0 for APIs
  ...props
}) {
  const formContext = useFormContext();
  const control = customControl || formContext?.control;

  // React Hook Form Mode
  if (control && name) {
    return (
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={rules}
        render={({ field, fieldState: { error } }) => {
          const isChecked = isNumeric ? Number(field.value) === 1 : Boolean(field.value);

          const handleChange = (nextVal) => {
            const finalVal = isNumeric ? (nextVal ? 1 : 0) : nextVal;
            field.onChange(finalVal);
            controlledOnChange?.(finalVal);
          };

          return (
            <div className={`flex flex-col gap-1 w-full ${wrapperClassName}`}>
              <ToggleSwitchView
                name={name}
                id={name}
                checked={isChecked}
                onChange={handleChange}
                disabled={disabled}
                label={label}
                description={description}
                testId={testId}
                {...props}
              />
              {error?.message && <InputError error={error.message} id={`${name}-error`} />}
            </div>
          );
        }}
      />
    );
  }

  // Standalone Mode
  const isChecked = isNumeric ? Number(controlledChecked) === 1 : Boolean(controlledChecked);

  const handleStandaloneChange = (nextVal) => {
    const finalVal = isNumeric ? (nextVal ? 1 : 0) : nextVal;
    controlledOnChange?.(finalVal);
  };

  return (
    <div className={`flex flex-col gap-1 w-full ${wrapperClassName}`}>
      <ToggleSwitchView
        name={name}
        checked={isChecked}
        onChange={handleStandaloneChange}
        disabled={disabled}
        label={label}
        description={description}
        testId={testId}
        {...props}
      />
    </div>
  );
}

ToggleInputField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.node,
  description: PropTypes.node,
  checked: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  onChange: PropTypes.func,
  defaultValue: PropTypes.any,
  disabled: PropTypes.bool,
  wrapperClassName: PropTypes.string,
  testId: PropTypes.string,
  control: PropTypes.object,
  rules: PropTypes.object,
  isNumeric: PropTypes.bool,
};
