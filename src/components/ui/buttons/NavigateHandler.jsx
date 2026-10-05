import Link from "next/link";
import PropTypes from "prop-types";
import { FiArrowRight } from "react-icons/fi";

const NavigateHandler = ({
  text,
  route,
  className = "",
  showIcon = true,
}) => {
  return (
    <Link
      href={route || "#"}
      className={`group relative inline-flex items-center justify-center gap-2.5 px-7 sm:px-9 py-3 sm:py-3.5 rounded-full bg-linear-to-r from-primary via-amber-500 to-[#e6aa38] hover:from-amber-400 hover:to-primary text-black font-semibold text-xs sm:text-sm tracking-wide shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer ${className}`}
    >
      <span>{text}</span>
      {showIcon && (
        <FiArrowRight className="text-base transition-transform duration-300 group-hover:translate-x-1.5" />
      )}
    </Link>
  );
};

NavigateHandler.propTypes = {
  text: PropTypes.string.isRequired,
  route: PropTypes.string.isRequired,
  className: PropTypes.string,
  showIcon: PropTypes.bool,
};

export default NavigateHandler;
