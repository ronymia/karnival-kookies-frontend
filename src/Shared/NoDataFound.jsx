const NoDataFound = ({ containerClass = "h-auto", imgWidth = "w-[40%]" }) => {
  return (
    <div
      className={`w-full ${containerClass} flex flex-col justify-center items-center `}
    >
      <img
        className={`min-w-[300px] ${imgWidth} h-auto`}
        src="/noDataFound.svg"
        alt=""
      />
    </div>
  );
};

export default NoDataFound;
