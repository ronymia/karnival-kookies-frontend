import PropTypes from "prop-types";
import React from "react";
import { FiSearch } from "react-icons/fi";

export default function SmallSearchField({
  fieldClassName = "",
  handleChange,
  wrapperClass = "",
  placeholder = "Search products...",
}) {
  return (
    <div className={`relative flex items-center w-auto ${wrapperClass}`}>
      <FiSearch className="absolute left-3.5 text-primary/70 pointer-events-none text-base" />
      <input
        onChange={handleChange}
        type="search"
        name="search"
        placeholder={placeholder}
        className={`bg-[#161311]/80 hover:bg-[#1a1614] backdrop-blur-md h-10 pl-10 pr-4 border border-primary/30 focus:border-primary rounded-xl text-neutral-100 placeholder-neutral-500 text-sm outline-none w-full md:w-[320px] transition-all focus:ring-1 focus:ring-primary/20 ${fieldClassName}`}
      />
    </div>
  );
}

/* <---------------------- PROP TYPES DEFINE ----------------------------> */
SmallSearchField.propTypes = {
  fieldClassName: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  wrapperClass: PropTypes.string,
  placeholder: PropTypes.string,
};
