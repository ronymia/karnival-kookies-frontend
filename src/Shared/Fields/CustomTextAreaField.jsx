export default function CustomTextareaField({
  id,
  label,
  required = false,
  type,
  name,
  value,
  placeholder,
  onChange,
  error,
  defaultValue,
  rows = 10,
  height = "h-52",
  wrapperClassName,
  fieldClassName,
  disable,
  visibleBorder = false,
  maxLength,
  resize = "both",
  minLength,
}) {
  return (
    <div className={`${wrapperClassName}`}>
      {/* LABEL */}
      {label ? (
        <label htmlFor={id} className="label">
          <span className={`label-text text-md font-bold`}>
            {label}{" "}
            {required && <span className="text-error font-bold">*</span>}
          </span>
        </label>
      ) : (
        ""
      )}
      {/* FIELD  */}
      <textarea
        style={{
          resize: resize,
        }}
        maxLength={maxLength}
        minLength={minLength}
        disabled={disable}
        rows={rows}
        id={id}
        onChange={onChange}
        value={value}
        type={type}
        name={name}
        defaultValue={defaultValue}
        placeholder={`${placeholder}${required ? "*" : ""}`}
        className={`bg-secondary text-base-300 ${
          disable &&
          `${visibleBorder && "disabled:border-gray-200 border-opacity-10"}`
        } focus:outline-primary scrollbar input input-bordered ${height} pt-3 ${fieldClassName}`}
      />
      {/* VALIDATION MESSAGE  */}
      {error && (
        <label className="label h-7">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
}
