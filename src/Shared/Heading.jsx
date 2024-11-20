const Heading = ({
  isSubHeading = true,
  isWave = true,
  subHeading,
  heading,
  headingClass = " text-base-300",
  headingContainerClass = "flex flex-col justify-center items-center",
}) => {
  return (
    <div className={`${headingContainerClass}`}>
      {isSubHeading && (
        <p className="text-[14px] font-medium text-primary">{subHeading}</p>
      )}

      <h2 className={`text-2xl md:text-4xl font-bold ${headingClass}`}>
        {heading}
      </h2>
      {isWave && (
        <div className={`w-[100px] `}>
          <div className={`wavy-line-heading`}></div>
        </div>
      )}
    </div>
  );
};

export default Heading;
