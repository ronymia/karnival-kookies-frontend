import PropTypes from "prop-types";

const Heading = ({
  isSubHeading = true,
  isWave = true,
  subHeading,
  heading,
  headingClass = " text-base-300",
  headingContainerClass = "flex flex-col justify-center items-center",
}) => {
  return (
    <section className={`${headingContainerClass}`}>
      {/* <----------------- SUB HEADING --------------------------> */}
      {isSubHeading && (
        <p className="text-sm font-medium text-primary">{subHeading}</p>
      )}

      {/* <----------------- HEADING --------------------------> */}
      <h2 className={`text-2xl md:text-4xl font-bold ${headingClass}`}>
        {heading}
      </h2>

      {/* <----------------- WAVE --------------------------> */}
      {isWave && (
        <div className={`w-[100px] `}>
          <div className={`wavy-line-heading`}></div>
        </div>
      )}
    </section>
  );
};

/* <------------------------ PROP TYPES DEFINE --------------------------------> */
Heading.propTypes = {
  isSubHeading: PropTypes.bool,
  isWave: PropTypes.bool,
  subHeading: PropTypes.string,
  heading: PropTypes.string,
  headingClass: PropTypes.string,
  headingContainerClass: PropTypes.string,
};
export default Heading;
