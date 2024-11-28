"use client";

import { BiSolidCheckCircle } from "react-icons/bi";

export default function CustomRadioButton({
  options = [],
  onChange = (e) => e,
  wrapperClassName = "",
  label = "",
  disabled = false,
  required = false,
  defaultChecked,
  inputFieldClassName,
}) {
  return (
    <div className={`${wrapperClassName}`}>
      <label className="label flex justify-between">
        <span
          className={`label-text text-md font-bold ${
            disabled && "text-gray-500"
          }`}
        >
          {label}{" "}
          {required && <span className="text-error font-bold text-md">*</span>}
        </span>
      </label>
      <div className={`grid gap-x-2 ${inputFieldClassName}`}>
        {options?.map(({ name, title, value, Icon }, index) => (
          <div key={index} className={`w-full`}>
            <input
              type="radio"
              name={name}
              onClick={onChange}
              value={value}
              className={`hidden`}
              id={`${name}${value}`}
              defaultChecked={defaultChecked === value}
            />

            <label
              htmlFor={`${name}${value}`}
              className={`${
                defaultChecked === value
                  ? " relative bg-primary-content border-primary font-semibold"
                  : "bg-base-100 opacity-50 border-primary-content"
              } justify-center sm:flex-col lg:flex-row gap-x-1 rounded-lg border-2 px-5 h-11 flex items-center cursor-pointer checked:text-primary `}
            >
              {defaultChecked === value ? (
                <BiSolidCheckCircle
                  className={`absolute bg-white rounded-full -right-2 -top-2 text-xl text-primary`}
                />
              ) : (
                ""
              )}
              {Icon && <Icon className={`text-md`} />}{" "}
              <span
                className={`text-sm ${
                  defaultChecked !== value && "text-base-300"
                }`}
              >
                {title}
              </span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
