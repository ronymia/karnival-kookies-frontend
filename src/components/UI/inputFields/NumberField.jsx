"use client";

export default function NumberField({
  inputProps,
  id,
  name,
  label,
  maxLength,
  minLength,
  value,
  defaultValue, // Ensure a default value is set
  placeholder = "", // Default placeholder
  required = false,
  readOnly = false,
  disabled = false,
  fieldClassName,
  wrapperClassName,
  dataAuto,
  onChange = (event) => event,
  error,
}) {
  //
  const handleInput = (event) => {
    const input = event.currentTarget;
    if (maxLength && input.value.length > maxLength) {
      input.value = input.value.slice(0, maxLength);
    }
  };

  return (
    <div
      data-auto={`${dataAuto}_container`}
      className={`${wrapperClassName} flex flex-col justify-start gap-y-2 w-full`}
    >
      {/* LABEL */}
      {label && (
        <label
          htmlFor={id}
          data-auto={`${dataAuto}_label`}
          className={`label-text font-bold`}
        >
          {label} {required && <span className="text-error font-bold">*</span>}
        </label>
      )}

      {/* INPUT FIELD */}
      <input
        {...inputProps}
        data-auto={dataAuto}
        type="number"
        id={id}
        name={name}
        onChange={onChange}
        onInput={handleInput}
        value={value}
        // defaultValue={defaultValue}
        maxLength={maxLength}
        minLength={minLength}
        disabled={disabled}
        placeholder={placeholder}
        aria-placeholder={placeholder} // Use aria-placeholder for accessibility
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        readOnly={readOnly}
        autoComplete="off" // Disable autocomplete
        spellCheck={false} // Disable spell checking
        autoFocus={false} // Don't auto-focus
        className={`text-base-300 bg-secondary rounded border border-solid  px-3 py-2 placeholder:text-sm placeholder:capitalize input-md focus:outline-primary input-bordered
        ${
          error
            ? "border-red-500 focus:border-red-500"
            : "input-bordered focus:border-primary"
        } 
        ${fieldClassName} `}
      />

      {/* Error Message */}
      <p
        data-auto={`${dataAuto}_error_message`}
        id={`${id}-error`} // ID to link with input field's aria-describedby
        role="alert"
        aria-label="error message"
        aria-live="assertive" // Ensures screen readers announce the message immediately
        aria-atomic="true" // Ensures the whole message is read out
        className="text-xs text-red-500"
      >
        {error}
      </p>
    </div>
  );
}
