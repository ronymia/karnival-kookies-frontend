import React from "react";

export default function SmallSearchField({
  fieldClassName,
  handleChange,
  wrapperClass,
}) {
  return (
    <div className={`flex w-auto ${wrapperClass}`}>
      <input
        onChange={handleChange}
        type={"type"}
        name={"search"}
        placeholder={`search here`}
        className={`bg-secondary input h-10 border border-primary rounded-lg outline-none w-full md:w-[350px]  focus:outline-none input-bordered ${fieldClassName}`}
      />
    </div>
  );
}
