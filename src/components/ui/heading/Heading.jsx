import PropTypes from "prop-types";

export default function Heading({
  isSubHeading = true,
  isWave = true,
  subHeading,
  heading,
  headingClass = "text-white",
  headingContainerClass = "flex flex-col justify-center items-center text-center gap-1.5",
}) {
  return (
    <section className={headingContainerClass}>
      {/* <----------------- SUB HEADING --------------------------> */}
      {isSubHeading && subHeading && (
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-primary/90">
          {subHeading}
        </p>
      )}

      {/* <----------------- HEADING --------------------------> */}
      <h2
        className={`font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal tracking-tight ${headingClass}`}
      >
        {heading}
      </h2>

      {/* <----------------- WAVE --------------------------> */}
      {isWave && (
        <div className="w-[100px] pt-1">
          <div className="wavy-line-heading"></div>
        </div>
      )}
    </section>
  );
}

/* <------------------------ PROP TYPES DEFINE --------------------------------> */
Heading.propTypes = {
  isSubHeading: PropTypes.bool,
  isWave: PropTypes.bool,
  subHeading: PropTypes.string,
  heading: PropTypes.string,
  headingClass: PropTypes.string,
  headingContainerClass: PropTypes.string,
};
