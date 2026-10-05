"use client";

import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Controller, useFormContext } from "react-hook-form";
import InputLabel from "./InputLabel";
import InputError from "./InputError";
import "quill/dist/quill.snow.css";

/**
 * Pure Quill editor instance view
 */
function QuillEditorView({
  value,
  onChange,
  onBlur,
  placeholder = "Write description...",
  id,
  minHeight = "min-h-[140px]",
  disabled = false,
  hasError = false,
}) {
  const containerRef = useRef(null);
  const quillRef = useRef(null);
  const isInternalChange = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current || quillRef.current) return;

    let isMounted = true;

    import("quill").then(({ default: Quill }) => {
      if (!isMounted || !containerRef.current || quillRef.current) return;

      const editorContainer = document.createElement("div");
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(editorContainer);

      const quill = new Quill(editorContainer, {
        theme: "snow",
        placeholder: placeholder || "",
        readOnly: disabled,
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "clean"],
          ],
        },
      });

      if (value) {
        quill.root.innerHTML = value;
      }

      quill.on("text-change", () => {
        isInternalChange.current = true;
        const html = quill.root.innerHTML === "<p><br></p>" ? "" : quill.root.innerHTML;
        onChange?.(html);
        setTimeout(() => {
          isInternalChange.current = false;
        }, 0);
      });

      quill.root.addEventListener("blur", () => {
        onBlur?.();
      });

      quillRef.current = quill;
    }).catch((err) => {
      console.error("Error loading Quill:", err);
    });

    return () => {
      isMounted = false;
      quillRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (quillRef.current && !isInternalChange.current) {
      const currentHTML = quillRef.current.root.innerHTML;
      if (value !== undefined && value !== currentHTML) {
        quillRef.current.root.innerHTML = value || "";
      }
    }
  }, [value]);

  useEffect(() => {
    if (quillRef.current) {
      quillRef.current.enable(!disabled);
    }
  }, [disabled]);

  return (
    <div
      id={id}
      ref={containerRef}
      className={`w-full rich-quill-wrapper ${hasError ? "has-error" : ""} ${disabled ? "is-disabled" : ""}`}
    />
  );
}

/**
 * Reusable RichTextInputField with React Hook Form and Standalone support.
 */
export default function RichTextInputField({
  name,
  label,
  value: controlledValue,
  onChange: controlledOnChange,
  defaultValue = "",
  placeholder = "Write description...",
  minHeight = "min-h-[140px]",
  disabled = false,
  required = false,
  helperText,
  error: errorProp,
  wrapperClassName = "",
  labelClassName = "",
  testId,
  control: customControl,
  rules,
  id,
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
          const errorMessage = error?.message || errorProp;
          const hasError = !!errorMessage;

          return (
            <div
              data-testid={testId ? `${testId}_container` : undefined}
              className={`flex flex-col gap-1.5 w-full ${wrapperClassName}`}
            >
              {label && (
                <InputLabel
                  label={label}
                  htmlFor={name || id}
                  required={required}
                  className={labelClassName}
                  testId={testId}
                />
              )}

              <QuillEditorView
                id={name || id}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder={placeholder}
                minHeight={minHeight}
                disabled={disabled}
                hasError={hasError}
              />

              <InputError
                error={errorMessage}
                id={`${name}-error`}
                testId={testId}
              />

              {!hasError && helperText && (
                <p className="text-xs text-neutral-400 mt-0.5">{helperText}</p>
              )}
            </div>
          );
        }}
      />
    );
  }

  // Standalone Controlled Mode
  const hasError = !!errorProp;

  return (
    <div
      data-testid={testId ? `${testId}_container` : undefined}
      className={`flex flex-col gap-1.5 w-full ${wrapperClassName}`}
    >
      {label && (
        <InputLabel
          label={label}
          htmlFor={id || name}
          required={required}
          className={labelClassName}
          testId={testId}
        />
      )}

      <QuillEditorView
        id={id || name}
        value={controlledValue}
        onChange={controlledOnChange}
        placeholder={placeholder}
        minHeight={minHeight}
        disabled={disabled}
        hasError={hasError}
      />

      <InputError error={errorProp} id={`${id || name}-error`} testId={testId} />

      {!hasError && helperText && (
        <p className="text-xs text-neutral-400 mt-0.5">{helperText}</p>
      )}
    </div>
  );
}

RichTextInputField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  defaultValue: PropTypes.string,
  placeholder: PropTypes.string,
  minHeight: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  helperText: PropTypes.string,
  error: PropTypes.string,
  wrapperClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  testId: PropTypes.string,
  control: PropTypes.object,
  rules: PropTypes.object,
  id: PropTypes.string,
};
