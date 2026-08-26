import useClickOutside from "@/hooks/useClickOutside";
import { useState, useEffect } from "react";
import { RxCrossCircled } from "react-icons/rx";

export default function Select({
  id,
  name,
  placeholder,
  value,
  handleOnSelect,
  error,
  label,
  wrapperClassName,
  fieldClassName = "",
  testId,
  required,
  CustomCloseIcon = RxCrossCircled,
  options = [],
}) {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useClickOutside(() => setIsOpen(false));

  // SET DEFAULT VALUE
  useEffect(() => {
    if (value) {
      setSelectedOptions(value);
    }
  }, [value]);

  // HANDLE OPTION SELECTION
  const handleSelect = (option) => {
    // IF ALREADY SELECTED
    if (selectedOptions.some((item) => item?.id === option?.id)) {
      setSelectedOptions([]);
      handleOnSelect?.(null);
      setIsOpen(false); // Close the options list after selection
      return;
    }

    //   UPDATE STATE
    setSelectedOptions([option]);
    if (handleOnSelect) {
      handleOnSelect(option);
    }
    setIsOpen(false); // Close the options list after selection
  };

  // HANDLE REMOVE
  const handleRemove = () => {
    setSelectedOptions([]);
    if (handleOnSelect) {
      handleOnSelect(null);
    }
  };

  return (
    <div
      ref={selectRef}
      data-testid={`${testId}_container`}
      className={`${wrapperClassName} flex flex-col justify-start gap-y-2 relative`}
    >
      {/* LABEL */}
      {label && (
        <label
          htmlFor={id}
          data-testid={`${testId}_label`}
          className={`label-text text-md font-bold`}
        >
          {label}{" "}
          {required && <span className="text-error font-bold text-md">*</span>}
        </label>
      )}

      {/* SELECTED OPTIONS */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex flex-wrap gap-1 text-base-300 bg-secondary rounded border border-solid px-2 py-2 input-bordered ${
          error
            ? "border-red-500 focus:border-red-500"
            : "input-bordered focus:border-primary"
        } ${fieldClassName} ${
          selectedOptions.length === 0 ? "input-md" : "h-auto py-[0.35rem]"
        } ${isOpen ? "border-2 border-primary" : ""} cursor-pointer`}
        aria-expanded={isOpen}
        aria-controls={``}
        aria-haspopup="listbox"
        role="combobox"
      >
        {selectedOptions.map((option) => (
          <span
            key={option.value}
            className={`font-medium bg-base-100 text-base-300 px-2 rounded cursor-pointer inline-flex items-center justify-center gap-3 py-1.5`}
          >
            {option?.label}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation(); // Prevent the options list from toggling
                handleRemove(option);
              }}
              aria-label={`Remove ${option?.label}`}
              className={``}
            >
              <CustomCloseIcon
                className={`text-red-500 hover:bg-red-500 rounded-full hover:text-base-300 `}
              />
            </button>
          </span>
        ))}
        {selectedOptions.length === 0 && (
          <span className="text-base-300">
            {placeholder || `Select an option`}
          </span>
        )}
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <p className="text-red-500 text-sm" data-testid={`${testId}_error`}>
          {error}
        </p>
      )}

      {/* OPTIONS LIST */}
      {isOpen && (
        <div
          className={`absolute top-20 z-50 w-full border-2 border-primary bg-base-100 rounded mt-1 overflow-y-auto max-h-[300px]`}
          role="listbox"
        >
          {/* FILTERED OPTIONS */}
          {options?.length > 0 ? (
            options.map((option) => (
              <div
                key={option?.id}
                onClick={() => handleSelect(option)}
                className={`cursor-pointer px-3 py-2 text-base-300 hover:text-base-300 border-b border-base-300 last:border-none bg-base-100  hover:bg-primary hover:opacity-100
                        ${
                          selectedOptions.some(
                            (item) => item?.id === option?.id
                          )
                            ? "bg-primary hover:opacity-100"
                            : "opacity-30 hover:bg-primary/30"
                        }
                    `}
                role="option"
                aria-selected={selectedOptions.some(
                  (item) => item?.id === option?.id
                )}
              >
                {option.label}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-base-300">No options found</div>
          )}
        </div>
      )}
    </div>
  );
}
