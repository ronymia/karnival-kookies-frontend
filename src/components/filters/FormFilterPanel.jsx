"use client";

import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import FilterPanel from "./FilterPanel";
import {
  Select,
  InputField,
  ToggleInputField,
  InputLabel,
} from "@/components/form";

/**
 * Dynamic Filter Field Renderer that handles different input types.
 */
function DynamicFilterField({ field, formValues }) {
  const {
    type = "text",
    name,
    label,
    placeholder,
    options = [],
    isClearable = true,
    isSearchable = false,
    multiple = false,
    minName,
    maxName,
    minPlaceholder = "Min",
    maxPlaceholder = "Max",
    step,
    min,
    max,
    colSpan = "",
    render,
    helperText,
    ...rest
  } = field;

  // Compute dynamic label if function is passed
  const resolvedLabel =
    typeof label === "function" ? label(formValues) : label;

  switch (type) {
    case "select":
      return (
        <div className={colSpan}>
          <Select
            name={name}
            label={resolvedLabel}
            placeholder={placeholder || `Select ${resolvedLabel || "option"}`}
            options={options}
            isClearable={isClearable}
            isSearchable={isSearchable}
            multiple={multiple}
            helperText={helperText}
            {...rest}
          />
        </div>
      );

    case "range":
    case "number-range":
      return (
        <div className={`flex flex-col gap-1.5 w-full ${colSpan}`}>
          {resolvedLabel && <InputLabel label={resolvedLabel} />}
          <div className="grid grid-cols-2 gap-2">
            <InputField
              name={minName}
              type="number"
              min={min}
              max={max}
              step={step}
              placeholder={minPlaceholder}
            />
            <InputField
              name={maxName}
              type="number"
              min={min}
              max={max}
              step={step}
              placeholder={maxPlaceholder}
            />
          </div>
          {helperText && (
            <p className="text-xs text-neutral-400 mt-0.5">{helperText}</p>
          )}
        </div>
      );

    case "number":
      return (
        <div className={colSpan}>
          <InputField
            name={name}
            type="number"
            min={min}
            max={max}
            step={step}
            label={resolvedLabel}
            placeholder={placeholder}
            helperText={helperText}
            {...rest}
          />
        </div>
      );

    case "toggle":
    case "switch":
      return (
        <div className={`flex items-end pb-1 ${colSpan}`}>
          <ToggleInputField
            name={name}
            label={resolvedLabel}
            description={placeholder || helperText}
            {...rest}
          />
        </div>
      );

    case "custom":
      return (
        <div className={colSpan}>
          {render ? render({ formValues, field }) : null}
        </div>
      );

    case "text":
    default:
      return (
        <div className={colSpan}>
          <InputField
            name={name}
            type="text"
            label={resolvedLabel}
            placeholder={placeholder}
            helperText={helperText}
            {...rest}
          />
        </div>
      );
  }
}

/**
 * Inner grid wrapper that observes form values for dynamic labels.
 */
function FilterFieldsGrid({ fields = [], gridClassName = "" }) {
  const formValues = useWatch();

  return (
    <div
      className={`grid gap-4 ${
        gridClassName || "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      }`}
    >
      {fields.map((field, idx) => (
        <DynamicFilterField
          key={field.name || field.minName || idx}
          field={field}
          formValues={formValues}
        />
      ))}
    </div>
  );
}

/**
 * Reusable, Schema/Config-Driven Filter Form Panel powered by React Hook Form.
 */
export default function FormFilterPanel({
  fields = [],
  values = {},
  defaultValues = {},
  onApply,
  onReset,
  searchTerm = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  showSearch = true,
  title = "Advanced Filters",
  description,
  activeChips = [],
  activeFilterCount = 0,
  totalItems,
  itemLabel = "items",
  gridClassName = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  className = "",
  defaultOpen = false,
}) {
  const methods = useForm({
    defaultValues: {
      ...defaultValues,
      ...values,
    },
  });

  const { reset, handleSubmit } = methods;

  // Sync internal form when external filter values change
  useEffect(() => {
    reset({
      ...defaultValues,
      ...values,
    });
  }, [values, defaultValues, reset]);

  const handleApplyForm = (formData) => {
    onApply?.(formData);
  };

  const handleResetForm = () => {
    reset(defaultValues);
    onReset?.(defaultValues);
  };

  return (
    <FilterPanel
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
      searchPlaceholder={searchPlaceholder}
      showSearch={showSearch}
      defaultOpen={defaultOpen}
      activeFilterCount={activeFilterCount}
      title={title}
      description={description}
      totalItems={totalItems}
      itemLabel={itemLabel}
      activeChips={activeChips}
      onApply={handleSubmit(handleApplyForm)}
      onReset={handleResetForm}
      onClearAll={handleResetForm}
      className={className}
    >
      <FormProvider {...methods}>
        <FilterFieldsGrid fields={fields} gridClassName={gridClassName} />
      </FormProvider>
    </FilterPanel>
  );
}

FormFilterPanel.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf([
        "text",
        "number",
        "select",
        "range",
        "number-range",
        "toggle",
        "switch",
        "custom",
      ]),
      name: PropTypes.string,
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
      placeholder: PropTypes.string,
      options: PropTypes.array,
      isClearable: PropTypes.bool,
      isSearchable: PropTypes.bool,
      multiple: PropTypes.bool,
      minName: PropTypes.string,
      maxName: PropTypes.string,
      minPlaceholder: PropTypes.string,
      maxPlaceholder: PropTypes.string,
      step: PropTypes.string,
      min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      colSpan: PropTypes.string,
      render: PropTypes.func,
      helperText: PropTypes.string,
    })
  ).isRequired,
  values: PropTypes.object,
  defaultValues: PropTypes.object,
  onApply: PropTypes.func.isRequired,
  onReset: PropTypes.func,
  searchTerm: PropTypes.string,
  onSearchChange: PropTypes.func,
  searchPlaceholder: PropTypes.string,
  showSearch: PropTypes.bool,
  title: PropTypes.string,
  description: PropTypes.string,
  activeChips: PropTypes.array,
  activeFilterCount: PropTypes.number,
  totalItems: PropTypes.number,
  itemLabel: PropTypes.string,
  gridClassName: PropTypes.string,
  className: PropTypes.string,
  defaultOpen: PropTypes.bool,
};
