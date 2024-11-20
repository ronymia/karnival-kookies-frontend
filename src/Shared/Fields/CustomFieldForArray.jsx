import { IoInformationCircleSharp } from "react-icons/io5";
import { RxCrossCircled } from "react-icons/rx";

export default function CustomFieldForArray({
  pattern = "",
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
  disable = false,
  wrapperClassName,
  fieldClassName,
  onBlur = () => {},
  hint = "",
  visibleBorder = false,
  labelClass = "",
  taskField,
  maxLength,
  minLength,
  dataCyInput,
  dataCyLabel,
  dataCyError,
  array,
  setFormData,
}) {
  const handleDeleteInput = (fieldName, value) => {
    const formName = fieldName?.split("_")[0];
    setFormData((prev) => ({
      ...prev,
      [formName]: prev[formName]?.filter((data) => data !== value),
    }));
  };

  // const handleFormArrayChange = (e) => {
  //   const { name, value } = e.target;
  //   const formName = name?.split("_")[0];
  //   const formIndex = parseInt(name?.split("_")[1], 10);

  //   const updatedArray = [...formData[formName]];
  //   updatedArray[formIndex] = value;

  //   setFormData((prev) => ({
  //     ...prev,
  //     [formName]: updatedArray,
  //   }));
  // };

  return (
    <div className={`${wrapperClassName}`}>
      {/* LABEL */}
      <div
        data-auto={`custom-field-label-all-page`}
        className={`flex items-center gap-2`}
      >
        {label && (
          <label htmlFor={id} className="label" data-cy={dataCyLabel}>
            <span className={`label-text text-md font-bold ${labelClass}`}>
              {label}{" "}
              {label && required && !disable && (
                <span className="text-error font-bold text-md">*</span>
              )}
            </span>
          </label>
        )}
        {hint && (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-circle btn-ghost btn-xs"
            >
              <IoInformationCircleSharp className={`text-primary`} />
            </div>
            <div
              tabIndex={0}
              className="card compact dropdown-content z-[1] shadow-lg border border-primary-content shadow-primary-content bg-base-300 rounded-xl w-64"
            >
              <div tabIndex={0} className="card-body">
                <h2 className="card-title text-primary">{label}</h2>
                <p> {hint}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FIELD  */}
      <div className={`relative`}>
        <input
          data-cy={dataCyInput}
          onInvalidCapture={() => {}}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          disabled={disable}
          id={id}
          onChange={onChange}
          value={value}
          type={type}
          name={name}
          onBlur={onBlur}
          defaultValue={defaultValue}
          placeholder={`${placeholder}${
            required ? (taskField ? "" : "*") : ""
          }`}
          className={`input bg-base-300

        ${
          disable &&
          `px-1 py-0 border ${
            visibleBorder && "disabled:border-gray-200 border-opacity-10 px-4"
          }`
        }  focus:outline-primary rounded-md ${
            taskField ? "focus:input-bordered font-bold" : "input-bordered"
          } ${fieldClassName}`}
        />
        {array?.length > 1 && (
          <RxCrossCircled
            onClick={(e) => handleDeleteInput(name, value)}
            className={`absolute text-2xl -top-2 -right-2 text-white bg-error rounded-full transition-transform hover:scale-105 active:scale-95`}
          />
        )}
      </div>

      {/* VALIDATION MESSAGE  */}
      {error && (
        <label
          data-auto={`custom-field-error-message-all-page`}
          className="label h-7"
          data-cy={dataCyError}
        >
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
}
