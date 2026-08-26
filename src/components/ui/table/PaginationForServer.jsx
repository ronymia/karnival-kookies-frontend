"use client";

import { useRouter } from "next/navigation";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export const PaginationForServer = ({ total, page, perPage }) => {
  console.log({ total });
  const totalPage = Math.ceil(total / perPage);
  const array = Array.from(Array(totalPage ? totalPage : "").keys());
  const router = useRouter();

  const handleRight = () => {
    if (parseInt(page) < totalPage) {
      router.push(`?page=${parseInt(page) + 1}&perPage=${parseInt(perPage)}`);
    } else {
      router.push(`?page=1&perPage=${parseInt(perPage)}`);
    }
  };
  const handleLeft = () => {
    if (parseInt(page) === 1) {
      router.push(`?page=${totalPage}&perPage=${parseInt(perPage)}`);
    } else if (parseInt(page) <= totalPage) {
      router.push(`?page=${parseInt(page) - 1}&perPage=${parseInt(perPage)}`);
    }
  };

  if (parseInt(perPage) >= total) {
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
          onClick={() => router.push(`?page=${a + 1}&perPage=${perPage}`)}
          className={`flex justify-center items-center bg-secondary h-8 w-8 rounded-full font-semibold transition-transform hover:scale-105 active:scale-95 ${
            parseInt(page) === a + 1
              ? "bg-btn-primary text-heading-secondary"
              : "bg-btn-secondary text-heading-main"
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
