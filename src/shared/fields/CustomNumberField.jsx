"use client";
import { useEffect, useRef, useState } from "react";

export default function CustomNumberField({
  id,
  label,
  required,
  name,
  type = "number",
  value,
  defaultValue,
  placeholder,
  onChange,
  error = "",
  min,
  minMsg,
  max,
  maxMsg,
  minLength,
  maxLength,
  size,
  wrapperClassName,
  fieldClassName,
  disable = false,
  visibleBorder = false,
  onBlur = () => {},
  dataAuto,
}) {
  const inputRef = useRef();
  const [validationError, setValidationError] = useState(error);

  // Input value change validation field
  const onInputChange = () => {
    const inputValue = inputRef.current.value;
    const min = Number(inputRef.current.min);
    const max = Number(inputRef.current.max);
    const maxLength =
      inputRef.current.maxLength !== -1 ? inputRef.current.maxLength : Infinity;

    // Handle maxLength validation
    if (maxLength && inputValue.length > maxLength) {
      inputRef.current.value = inputValue.slice(0, maxLength);
    }

    // Handle number validations
    const numericValue = Number(inputRef.current.value);

    if (numericValue < 0) {
      setValidationError("Value cannot be negative");
    } else if (min && numericValue < min) {
      setValidationError(minMsg || `Value should be at least ${min}`);
    } else if (max && numericValue > max) {
      setValidationError(maxMsg || `Value should not exceed ${max}`);
    } else {
      setValidationError("");
    }
  };

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
    };

    const handleKeyDown = (e) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
      }
    };

    const inputElement = inputRef.current;

    if (inputElement) {
      inputElement.addEventListener("wheel", handleWheel, { passive: false });
      inputElement.addEventListener("keydown", handleKeyDown, {
        passive: false,
      });

      return () => {
        inputElement.removeEventListener("wheel", handleWheel);
        inputElement.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, []);

  return (
    <div data-auto={`container-${dataAuto}`} className={`${wrapperClassName} `}>
      {/* LABEL */}
      {label && (
        <label data-auto={`label-${dataAuto}`} htmlFor={id} className="label">
          <span className={`label-text text-md font-bold`}>
            {label}{" "}
            {required && !disable && (
              <span className="text-error font-bold text-md">*</span>
            )}
          </span>
        </label>
      )}
      {/* FIELD  */}
      <input
        data-auto={`${dataAuto}`}
        onBlur={onBlur}
        disabled={disable}
        id={id}
        value={value}
        defaultValue={defaultValue}
        type={type}
        name={name}
        min={min}
        max={max}
        minLength={minLength}
        maxLength={maxLength}
        size={size}
        placeholder={`${placeholder}${required ? "*" : ""}`}
        className={`bg-secondary text-base-300 ${
          disable &&
          `px-1  ${
            visibleBorder && "disabled:border-gray-300 border-opacity-10 px-4"
          }`
        } input focus:outline-primary input-bordered ${fieldClassName}`}
        onChange={onChange}
        ref={inputRef}
        onInput={onInputChange}
      />
      {/* VALIDATION MESSAGE  */}
      {(error || validationError) && (
        <label data-auto={`error-${dataAuto}`} className="label ">
          <span className="label-text-alt text-error">
            {error || validationError}
          </span>
        </label>
      )}
    </div>
  );
}
