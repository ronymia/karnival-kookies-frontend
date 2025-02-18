"use client";
import PropTypes from "prop-types";
import { IoIosArrowRoundForward } from "react-icons/io";
import ButtonSpinner from "./ButtonSpinner";

const Button = ({
  text,
  icon = true,
  buttonClass = "",
  wrapperClass = "inline-block",
  handler,
  isLoading = false,
  type = "button",
}) => {
  return (
    <div className={`${wrapperClass} group`}>
      <button
        type={type}
        onClick={handler}
        className={`${buttonClass} text-primary border border-primary px-5 py-3 rounded-full flex items-center gap-2 group-hover:border-base-300 transition-[border]`}
      >
        {isLoading ? (
          <ButtonSpinner />
        ) : (
          <>
            <p className="group-hover:text-base-300 transition-[color] duration-700">
              {text}
            </p>
            {icon && (
              <IoIosArrowRoundForward className="group-hover:text-base-300 group-hover:translate-x-2  transition-transform duration-300" />
            )}
          </>
        )}
      </button>
    </div>
  );
};

/* <------------------------ PROP TYPES --------------------------> */

Button.propTypes = {
  type: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  icon: PropTypes.bool,
  buttonClass: PropTypes.string,
  wrapperClass: PropTypes.string,
  handler: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default Button;
