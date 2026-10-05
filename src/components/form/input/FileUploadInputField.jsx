"use client";

import React, { useState, useRef, useMemo } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import { Controller, useFormContext } from "react-hook-form";
import { FiUploadCloud, FiTrash2, FiPlus, FiImage, FiFileText } from "react-icons/fi";
import { getFullImageLink } from "@/utils/getFullImageLink";
import InputLabel from "./InputLabel";
import InputError from "./InputError";
import toast from "react-hot-toast";
import CustomToaster from "@/components/ui/toaster/CustomToaster";

/**
 * Returns a displayable URL for either a local File instance or remote filename.
 */
function getPreviewUrl(fileItem, folder = "Products") {
  if (!fileItem) return "/noDataFound.svg";
  if (fileItem instanceof File || fileItem instanceof Blob) {
    return URL.createObjectURL(fileItem);
  }
  if (typeof fileItem === "object" && fileItem?.file) {
    return getFullImageLink(fileItem.file, folder);
  }
  if (typeof fileItem === "string") {
    if (fileItem.startsWith("http") || fileItem.startsWith("blob:") || fileItem.startsWith("/")) {
      return fileItem;
    }
    return getFullImageLink(fileItem, folder);
  }
  return "/noDataFound.svg";
}

/**
 * Presentation View for File & Image Upload Area
 */
function FileUploadView({
  name,
  label,
  files = [],
  onChange,
  onBlur,
  multiple = true,
  accept = ".png, .jpg, .jpeg, .webp",
  maxSizeMB = 5,
  folder = "Products",
  disabled = false,
  required = false,
  helperText,
  errorMessage,
  wrapperClassName = "",
  labelClassName = "",
  testId,
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const fileList = useMemo(() => {
    if (!files) return [];
    return Array.isArray(files) ? files : [files];
  }, [files]);

  const handleProcessFiles = (incomingFileList) => {
    if (disabled) return;
    const rawFiles = Array.from(incomingFileList || []);
    const validFiles = [];

    rawFiles.forEach((file) => {
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type="error"
            text={`File "${file.name}" exceeds the ${maxSizeMB}MB size limit.`}
          />
        ));
      } else {
        validFiles.push(file);
      }
    });

    if (validFiles.length > 0) {
      if (multiple) {
        onChange?.([...fileList, ...validFiles]);
      } else {
        onChange?.(validFiles[0]);
      }
      onBlur?.();
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer?.files) {
      handleProcessFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleRemove = (indexToRemove, e) => {
    e?.stopPropagation();
    if (disabled) return;
    if (multiple) {
      const updated = fileList.filter((_, idx) => idx !== indexToRemove);
      onChange?.(updated);
    } else {
      onChange?.(null);
    }
    onBlur?.();
  };

  const hasError = !!errorMessage;

  return (
    <div
      data-testid={testId ? `${testId}_container` : undefined}
      className={`flex flex-col gap-2 w-full ${wrapperClassName}`}
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

      {/* HIDDEN FILE INPUT */}
      <input
        ref={fileInputRef}
        id={name ? `${name}-file-input` : "file-input"}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={(e) => {
          handleProcessFiles(e.target.files);
          e.target.value = ""; // Reset input
        }}
        className="hidden"
      />

      {/* MAIN CONTAINER */}
      <div
        className={`w-full rounded-2xl bg-[#151312] border transition-all p-4 space-y-4 min-h-[170px] flex flex-col justify-center ${
          hasError
            ? "border-red-500/80 ring-1 ring-red-500/20"
            : isDragOver
            ? "border-primary ring-2 ring-primary/25 bg-[#1a1715]"
            : "border-primary/25 hover:border-primary/45"
        }`}
      >
        {fileList.length === 0 ? (
          /* EMPTY STATE DROPZONE */
          <div
            onClick={() => !disabled && fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`pt-8 pb-9 px-4 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3.5 transition-all text-center cursor-pointer ${
              isDragOver
                ? "border-primary bg-primary/10"
                : "border-white/15 hover:border-primary/50 hover:bg-white/5"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary text-2xl shadow-sm">
              <FiUploadCloud />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-white">
                Choose files or drag & drop here
              </p>
              <p className="text-xs text-neutral-400">
                Allowed formats: {accept.replace(/\./g, "").toUpperCase()} (Max {maxSizeMB}MB)
              </p>
            </div>
            <button
              type="button"
              className="mt-2 mb-1 px-5 py-2 rounded-xl bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/40 text-xs font-semibold text-neutral-200 hover:text-primary transition-all cursor-pointer shadow-sm"
            >
              Browse Files
            </button>
          </div>
        ) : (
          /* FILLED STATE (TOP COMPACT DROPZONE + PREVIEWS GRID) */
          <>
            {/* TOP COMPACT DROPZONE STRIP */}
            {multiple && (
              <div
                onClick={() => !disabled && fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`py-3 px-4 rounded-xl border-2 border-dashed flex items-center justify-between transition-all cursor-pointer ${
                  isDragOver
                    ? "border-primary bg-primary/10"
                    : "border-white/15 hover:border-primary/40 hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2.5 text-xs text-neutral-300">
                  <div className="w-7 h-7 rounded-lg bg-primary/15 text-primary flex items-center justify-center text-sm">
                    <FiUploadCloud />
                  </div>
                  <span>
                    Drag and drop more files or{" "}
                    <strong className="text-primary font-semibold">browse</strong>
                  </span>
                </div>
                <button
                  type="button"
                  className="px-3 py-1 rounded-lg bg-white/5 hover:bg-primary/20 border border-white/10 text-xs font-medium text-neutral-200 hover:text-primary transition-colors"
                >
                  Add More
                </button>
              </div>
            )}

            {/* PREVIEWS GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-1">
              {fileList.map((fileItem, idx) => {
                const previewUrl = getPreviewUrl(fileItem, folder);
                const isLocal = fileItem instanceof File || fileItem instanceof Blob;
                const fileName = isLocal ? fileItem.name : `Image #${idx + 1}`;

                return (
                  <div
                    key={idx}
                    className="relative group aspect-square rounded-xl overflow-hidden bg-black/40 border border-white/10 shadow-md flex items-center justify-center"
                  >
                    <Image
                      src={previewUrl}
                      alt={`Upload preview ${idx + 1}`}
                      fill
                      sizes="160px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* OVERLAY ON HOVER */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={(e) => handleRemove(idx, e)}
                          aria-label="Remove image"
                          className="w-6 h-6 rounded-md bg-rose-950/90 border border-rose-500/50 text-rose-300 hover:bg-rose-600 hover:text-white flex items-center justify-center transition-all shadow-md cursor-pointer"
                        >
                          <FiTrash2 className="text-xs" />
                        </button>
                      </div>
                      <p className="text-[10px] text-white/90 truncate font-medium">
                        {fileName}
                      </p>
                    </div>

                    {/* LOCAL FILE PENDING BADGE */}
                    {isLocal && (
                      <span className="group-hover:hidden absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-black/80 text-[9px] font-bold text-amber-400 border border-amber-500/30">
                        Pending
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* STATUS SUMMARY */}
            <p className="text-[11px] text-neutral-400 flex items-center gap-1.5 pt-1 border-t border-white/10">
              <FiImage className="text-primary text-xs" /> {fileList.length}{" "}
              {fileList.length === 1 ? "image" : "images"} selected (new files will be uploaded on form submit).
            </p>
          </>
        )}
      </div>

      {/* ERROR MESSAGE */}
      <InputError error={errorMessage} id={`${name}-error`} testId={testId} />

      {/* HELPER TEXT */}
      {!hasError && helperText && (
        <p className="text-xs text-neutral-400">{helperText}</p>
      )}
    </div>
  );
}

/**
 * Universal FileUploadInputField supporting both React Hook Form & Standalone mode.
 */
export default function FileUploadInputField({
  name,
  control: customControl,
  rules,
  defaultValue = [],
  files: controlledFiles,
  onChange: controlledOnChange,
  error: errorProp,
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
          const errorMessage = error?.message || errorProp;

          const handleChange = (newFiles) => {
            field.onChange(newFiles);
            controlledOnChange?.(newFiles);
          };

          return (
            <FileUploadView
              name={name}
              files={field.value}
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
  return (
    <FileUploadView
      name={name}
      files={controlledFiles}
      onChange={controlledOnChange}
      errorMessage={errorProp}
      {...props}
    />
  );
}

FileUploadInputField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  files: PropTypes.array,
  onChange: PropTypes.func,
  defaultValue: PropTypes.array,
  multiple: PropTypes.bool,
  accept: PropTypes.string,
  maxSizeMB: PropTypes.number,
  folder: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  helperText: PropTypes.string,
  error: PropTypes.string,
  wrapperClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  testId: PropTypes.string,
  control: PropTypes.object,
  rules: PropTypes.object,
};
