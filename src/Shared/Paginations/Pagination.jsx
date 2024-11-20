import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export const Pagination = ({ filters, setFilters, total }) => {
  const { page, perPage } = filters;
  const totalPage = Math.ceil(total / perPage);
  const array = Array.from(Array(totalPage ? totalPage : "").keys());

  const handleRight = () => {
    if (page < totalPage) {
      setFilters({ ...filters, page: page + 1 });
    } else {
      setFilters({ ...filters, page: 1 });
    }
  };
  const handleLeft = () => {
    if (page === 1) {
      setFilters({ ...filters, page: totalPage });
    } else if (page <= totalPage) {
      setFilters({ ...filters, page: page - 1 });
    }
  };

  if (perPage >= total) {
    return;
  }
  return (
    <div className={`flex justify-center items-center gap-2`}>
      <div
        onClick={handleLeft}
        data-tip="Previous Page"
        className={`tooltip tooltip-custom-primary tooltip-top flex justify-center items-center h-8 w-8 rounded-full font-semibold transition-transform hover:scale-105 active:scale-95 bg-btn-secondary text-heading-main`}
      >
        <FaArrowLeft />
      </div>
      {array?.map((a, i) => (
        <div
          key={a}
          onClick={() => setFilters({ ...filters, page: i + 1 })}
          className={`flex justify-center items-center h-8 w-8 rounded-full font-semibold transition-transform hover:scale-105 active:scale-95 ${
            page === a + 1
              ? "bg-primary text-base-300"
              : "bg-secondary text-base-300"
          }`}
        >
          <button>{a + 1}</button>
        </div>
      ))}
      <div
        onClick={handleRight}
        data-tip="Next Page"
        className={`tooltip tooltip-custom-primary tooltip-top flex justify-center items-center h-8 w-8 rounded-full font-semibold transition-transform hover:scale-105 active:scale-95 bg-btn-secondary text-heading-main`}
      >
        <FaArrowRight />
      </div>
    </div>
  );
};
