import PropTypes from "prop-types";

export default function ButtonLoading({ className }) {
  return (
    <span
      className={`loading loading-spinner loading-md text-primary ${className}`}
    ></span>
  );
}

/* <------------------------ PROP TYPES DEFINE --------------------------> */

ButtonLoading.propTypes = {
  className: PropTypes.string,
};
