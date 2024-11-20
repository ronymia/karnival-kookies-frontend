const CustomLoading = ({ height = "h-[50vh] sm:h-[90vh]" }) => {
  return (
    <div className={`${height} w-full flex justify-center items-center`}>
      <span className="loading loading-spinner text-base-300 loading-lg"></span>
    </div>
  );
};

export default CustomLoading;
