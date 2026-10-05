"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { Controller, useFormContext } from "react-hook-form";
import { FiChevronDown, FiCheck, FiX, FiSearch } from "react-icons/fi";
import useClickOutside from "@/hooks/useClickOutside";
import InputLabel from "@/components/form/input/InputLabel";
import InputError from "@/components/form/input/InputError";

/**
 * Normalizes any option shape into { value, label, raw }
 */
function normalizeOption(option) {
  if (option === null || option === undefined) return null;
  if (typeof option === "string" || typeof option === "number") {
    return { value: option, label: String(option), raw: option };
  }
  const value = option.value !== undefined ? option.value : option.id;
  const label = option.label !== undefined ? option.label : option.name || String(value);
  return { value, label, raw: option };
}

/**
 * Luxury Presentational Custom Dropdown Trigger & Floating Menu
 */
function CustomSelectView({
  name,
  label,
  options = [],
  value,
  onChange,
  onBlur,
  placeholder = "Select an option",
  disabled = false,
  required = false,
  isClearable = true,
  isSearchable = true,
  multiple = false,
  helperText,
  errorMessage,
  wrapperClassName = "",
  labelClassName = "",
  fieldClassName = "",
  testId,
  ...rest
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [openDirection, setOpenDirection] = useState("bottom");
  const [searchQuery, setSearchQuery] = useState("");
  
  const triggerRef = useRef(null);
  const searchInputRef = useRef(null);

  const containerRef = useClickOutside(() => {
    if (isOpen) {
      setIsOpen(false);
      onBlur?.();
    }
  });

  // Calculate smart drop direction if space below is too small
  const handleToggle = () => {
    if (disabled) return;
    if (!isOpen && triggerRef.current && typeof window !== "undefined") {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      // Only flip up if bottom is extremely tight and top has ample space
      if (spaceBelow < 180 && spaceAbove > 280) {
        setOpenDirection("top");
      } else {
        setOpenDirection("bottom");
      }
    }
    setIsOpen((prev) => !prev);
  };

  // Normalize options array
  const normalizedOptions = useMemo(() => {
    if (!Array.isArray(options)) return [];
    return options.map(normalizeOption).filter(Boolean);
  }, [options]);

  // Determine current selected items
  const selectedValues = useMemo(() => {
    if (value === null || value === undefined || value === "") return [];
    if (Array.isArray(value)) {
      return value.map((v) => (typeof v === "object" ? v?.value ?? v?.id : v));
    }
    if (typeof value === "object") {
      return [value.value ?? value.id];
    }
    return [value];
  }, [value]);

  const selectedOptions = useMemo(() => {
    return normalizedOptions.filter((opt) =>
      selectedValues.some((v) => String(v) === String(opt.value))
    );
  }, [normalizedOptions, selectedValues]);

  // Filter options by search query
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return normalizedOptions;
    const query = searchQuery.toLowerCase();
    return normalizedOptions.filter((opt) =>
      opt.label.toLowerCase().includes(query)
    );
  }, [normalizedOptions, searchQuery]);

  // Auto-focus search input when opened
  useEffect(() => {
    if (isOpen && isSearchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    if (!isOpen) {
      setSearchQuery("");
    }
  }, [isOpen, isSearchable]);

  const handleSelectOption = (option) => {
    if (disabled) return;

    if (multiple) {
      const isAlreadySelected = selectedValues.some(
        (v) => String(v) === String(option.value)
      );
      const newValues = isAlreadySelected
        ? selectedValues.filter((v) => String(v) !== String(option.value))
        : [...selectedValues, option.value];
      onChange?.(newValues);
    } else {
      onChange?.(option.value);
      setIsOpen(false);
      onBlur?.();
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (disabled) return;
    onChange?.(multiple ? [] : "");
  };

  const handleRemoveSingleItem = (e, valToRemove) => {
    e.stopPropagation();
    if (disabled) return;
    if (multiple) {
      const newValues = selectedValues.filter(
        (v) => String(v) !== String(valToRemove)
      );
      onChange?.(newValues);
    } else {
      onChange?.("");
    }
  };

  const hasError = !!errorMessage;

  return (
    <div
      ref={containerRef}
      data-testid={testId ? `${testId}_container` : undefined}
      className={`relative flex flex-col gap-1.5 w-full ${
        isOpen ? "z-50" : "z-10"
      } ${wrapperClassName}`}
    >
      {/* LABEL */}
      {label && (
        <InputLabel
          label={label}
          htmlFor={name}
          required={required}
          className={labelClassName}
          testId={testId}
        />
      )}

      {/* SELECT TRIGGER BUTTON */}
      <div
        ref={triggerRef}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        tabIndex={disabled ? -1 : 0}
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggle();
          }
          if (e.key === "Escape") {
            setIsOpen(false);
          }
        }}
        className={`min-h-[46px] w-full px-4 py-2.5 rounded-xl text-sm bg-[#151312] border transition-all flex items-center justify-between gap-2 select-none cursor-pointer outline-none ${
          hasError
            ? "border-red-500/80 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-500/5"
            : isOpen
            ? "border-primary ring-2 ring-primary/25 bg-[#1a1715]"
            : "border-primary/25 hover:border-primary/45 focus:border-primary focus:ring-2 focus:ring-primary/25"
        } ${disabled ? "opacity-50 cursor-not-allowed bg-black/40" : ""} ${fieldClassName}`}
      >
        {/* SELECTED VALUE OR CHIPS */}
        <div className="flex flex-wrap items-center gap-1.5 grow min-w-0 pr-1">
          {selectedOptions.length === 0 ? (
            <span className="text-neutral-500 truncate text-sm font-normal">
              {placeholder}
            </span>
          ) : multiple ? (
            selectedOptions.map((opt) => (
              <span
                key={opt.value}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-primary/15 border border-primary/30 text-primary text-xs font-medium"
              >
                <span className="truncate max-w-[120px]">{opt.label}</span>
                <button
                  type="button"
                  onClick={(e) => handleRemoveSingleItem(e, opt.value)}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  <FiX className="text-xs" />
                </button>
              </span>
            ))
          ) : (
            <span className="text-neutral-100 font-medium truncate text-sm">
              {selectedOptions[0]?.label}
            </span>
          )}
        </div>

        {/* CONTROLS (CLEAR & CHEVRON) */}
        <div className="flex items-center gap-1.5 shrink-0 text-neutral-400">
          {isClearable && selectedOptions.length > 0 && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear selection"
              className="p-1 rounded-full hover:bg-white/10 hover:text-neutral-200 transition-colors cursor-pointer"
            >
              <FiX className="text-sm" />
            </button>
          )}
          <FiChevronDown
            className={`text-base text-primary/80 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-primary" : ""
            }`}
          />
        </div>
      </div>

      {/* FLOATING DROPDOWN MENU */}
      {isOpen && (
        <div
          role="listbox"
          className={`absolute left-0 right-0 z-50 p-2 rounded-2xl bg-[#181513]/98 backdrop-blur-2xl border border-primary/30 shadow-2xl shadow-black/90 flex flex-col gap-1.5 max-h-72 overflow-hidden animate-in fade-in zoom-in-95 duration-150 ${
            openDirection === "top" ? "bottom-full mb-1.5" : "top-full mt-1.5"
          }`}
        >
          {/* SEARCH INPUT */}
          {isSearchable && (
            <div className="relative px-1 py-1 pb-1.5 border-b border-white/10">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-sm pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          )}

          {/* OPTIONS LIST */}
          <div className="overflow-y-auto max-h-56 space-y-0.5 pr-1">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-xs text-neutral-400 text-center">
                No matching options found
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = selectedValues.some(
                  (v) => String(v) === String(opt.value)
                );

                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelectOption(opt)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? "bg-primary/20 text-primary font-semibold border border-primary/30"
                        : "text-neutral-200 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && (
                      <FiCheck className="text-primary text-sm shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ERROR MESSAGE */}
      <InputError
        error={errorMessage}
        id={`${name}-error`}
        testId={testId}
      />

      {/* HELPER TEXT */}
      {!hasError && helperText && (
        <p className="text-xs text-neutral-400 mt-0.5">{helperText}</p>
      )}
    </div>
  );
}

/**
 * Universal Select Component supporting both React Hook Form & Standalone controlled mode.
 */
export default function Select({
  name,
  control: customControl,
  rules,
  defaultValue = "",
  value: controlledValue,
  onChange: controlledOnChange,
  handleOnSelect,
  error: errorProp,
  ...props
}) {
  const formContext = useFormContext();
  const control = customControl || formContext?.control;

  // React Hook Form mode when control or formContext is present and name is given
  if (control && name) {
    return (
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={rules}
        render={({ field, fieldState: { error } }) => {
          const errorMessage = error?.message || errorProp;

          const handleChange = (newVal) => {
            field.onChange(newVal);
            controlledOnChange?.(newVal);
            handleOnSelect?.(newVal);
          };

          return (
            <CustomSelectView
              name={name}
              value={field.value}
              onChange={handleChange}
              onBlur={field.onBlur}
              errorMessage={errorMessage}
              {...props}
            />
          );
        }}
      />
    );
  }

  // Standalone Controlled Mode
  const handleStandaloneChange = (newVal) => {
    controlledOnChange?.(newVal);
    handleOnSelect?.(newVal);
  };

  return (
    <CustomSelectView
      name={name}
      value={controlledValue}
      onChange={handleStandaloneChange}
      errorMessage={errorProp}
      {...props}
    />
  );
}

Select.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  options: PropTypes.array.isRequired,
  value: PropTypes.any,
  defaultValue: PropTypes.any,
  onChange: PropTypes.func,
  handleOnSelect: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  isClearable: PropTypes.bool,
  isSearchable: PropTypes.bool,
  multiple: PropTypes.bool,
  helperText: PropTypes.string,
  error: PropTypes.string,
  wrapperClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  fieldClassName: PropTypes.string,
  testId: PropTypes.string,
  control: PropTypes.object,
  rules: PropTypes.object,
};
