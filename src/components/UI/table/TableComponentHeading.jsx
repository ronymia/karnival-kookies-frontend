import PropTypes from "prop-types";

export default function TableComponentHeading({
  routes,
  heading,
  headingClass = "text-base-300",
  headingContainerClass = "flex flex-col justify-center items-center",
}) {
  return (
    <div className={`${headingContainerClass} space-y-3`}>
      <h2 className={`text-2xl md:text-4xl font-bold ${headingClass}`}>
        {heading}
      </h2>
      {routes}
    </div>
  );
}

/* <------------------------ PROP TYPES DEFINE --------------------------------> */
TableComponentHeading.propTypes = {
  routes: PropTypes.element,
  heading: PropTypes.string,
  headingClass: PropTypes.string,
  headingContainerClass: PropTypes.string,
};
