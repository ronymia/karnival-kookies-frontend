"use client";

import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

export default function OtpInputField({
  length = 4,
  value,
  onChange,
  disabled = false,
  autoFocus = true,
  className = "",
  inputClassName = "",
  error = false,
}) {
  const inputRefs = useRef([]);

  // Extract array of digits from value (supports object { digit_1: "1" }, string "1234", or array)
  const getDigits = () => {
    if (!value) return Array(length).fill("");
    if (typeof value === "string") {
      const arr = value.split("").slice(0, length);
      while (arr.length < length) arr.push("");
      return arr;
    }
    if (Array.isArray(value)) {
      const arr = [...value].slice(0, length);
      while (arr.length < length) arr.push("");
      return arr;
    }
    if (typeof value === "object") {
      return Array.from({ length }, (_, i) => String(value[`digit_${i + 1}`] || ""));
    }
    return Array(length).fill("");
  };

  const digits = getDigits();

  // Auto-focus the first empty field on mount if autoFocus is true
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      const firstEmptyIndex = digits.findIndex((d) => !d);
      const targetIndex = firstEmptyIndex === -1 ? 0 : firstEmptyIndex;
      inputRefs.current[targetIndex]?.focus();
    }
  }, []);

  const triggerChange = (newDigits) => {
    const otpString = newDigits.join("");
    const otpObject = newDigits.reduce((acc, digit, idx) => {
      acc[`digit_${idx + 1}`] = digit;
      return acc;
    }, {});

    onChange?.(otpString, otpObject);
  };

  const handleInputChange = (index, e) => {
    const val = e.target.value.replace(/\D/g, "");
    if (!val) {
      const newDigits = [...digits];
      newDigits[index] = "";
      triggerChange(newDigits);
      return;
    }

    const newDigits = [...digits];
    // Take the last typed character
    const char = val[val.length - 1];
    newDigits[index] = char;
    triggerChange(newDigits);

    // Auto-focus next input
    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newDigits = [...digits];

      if (newDigits[index]) {
        // If current box has a value, clear it
        newDigits[index] = "";
        triggerChange(newDigits);
      } else if (index > 0) {
        // If current box is empty, clear the previous box and move focus back
        newDigits[index - 1] = "";
        triggerChange(newDigits);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === "Delete") {
      e.preventDefault();
      const newDigits = [...digits];
      newDigits[index] = "";
      triggerChange(newDigits);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pastedData) return;

    const newDigits = [...digits];
    pastedData.split("").forEach((char, idx) => {
      newDigits[idx] = char;
    });
    triggerChange(newDigits);

    const focusTargetIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[focusTargetIndex]?.focus();
  };

  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          id={`digit_${index + 1}`}
          name={`digit_${index + 1}`}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={2}
          value={digit}
          disabled={disabled}
          autoComplete="one-time-code"
          onChange={(e) => handleInputChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className={`w-13 h-14 sm:w-14 sm:h-15 text-center text-2xl font-bold text-white bg-[#151312] border rounded-2xl transition-all outline-none select-none ${
            error
              ? "border-red-500/80 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-500/5"
              : "border-primary/30 hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/25 focus:bg-[#1a1715]"
          } ${
            disabled ? "opacity-50 cursor-not-allowed bg-black/40" : ""
          } ${inputClassName}`}
        />
      ))}
    </div>
  );
}

OtpInputField.propTypes = {
  length: PropTypes.number,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.object,
  ]),
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  autoFocus: PropTypes.bool,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  error: PropTypes.bool,
};
