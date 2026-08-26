"use client";
import Button from "@/components/ui/buttons/Button";
import { usePopupContext } from "@/hooks/usePopupContext";
import { useGetReviewsQuery } from "@/redux/apis/reviewApi";
import "@smastrom/react-rating/style.css";
import { useParams } from "next/navigation";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { RiEdit2Fill } from "react-icons/ri";
import { useSelector } from "react-redux";
import ReviewCard from "./ReviewCard";

export default function Reviews() {
  const { setPopupOption, popupOption } = usePopupContext();
  // USER FROM REDUX STORE
  const { user } = useSelector((state) => state.auth);
  const params = useParams();

  const [filters, setFilters] = useState({
    product_id: params?.id,
    user_id: user?.id,
  });

  const { data, isLoading } = useGetReviewsQuery({
    product_id: filters?.product_id,
  });

  const myReview = data?.data?.data?.find(
    (review) => review?.user_id === filters?.user_id
  );

  const sortedReviews = data?.data?.data?.sort((a, b) => {
    if (a?.user_id === filters?.user_id) {
      return -1;
    }
    if (b?.user_id === filters?.user_id) {
      return 1;
    }
    return 0;
  });

  // HANDLE CREATE
  const handleCreate = () => {
    setPopupOption({
      ...popupOption,
      open: true,
      type: "reviewForm",
      title: "Add Your Review",
    });
  };
  // HANDLE EDIT
  const handleEdit = (data) => {
    setPopupOption({
      ...popupOption,
      open: true,
      type: "reviewForm",
      title: "Edit Your Review",
      data: data,
    });
  };

  // CALCULATE AVERAGE RATING OF THIS PRODUCT
  const average =
    (5 * data?.data?.star?.star_5 +
      4 * data?.data?.star?.star_4 +
      3 * data?.data?.star?.star_3 +
      2 * data?.data?.star?.star_2 +
      1 * data?.data?.star?.star_1) /
    data?.meta?.total;

  return (
    <div className={`max-w-screen-xl mx-auto px-5 pb-40 space-y-10`}>
      {/* HEADER */}
      <header className={`flex justify-between items-center`}>
        <h2
          className={`text-[30px] hover:text-primary cursor-pointer border-b-4 border-primary inline-block`}
        >
          Reviews
        </h2>
        {!myReview && <Button text={"Write a Review"} handler={handleCreate} />}
      </header>

      {/* CONTENT BODY */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-5`}>
        {/* REVIEWS */}
        <section className={`flex items-start justify-between`}>
          {sortedReviews?.length > 0 ? (
            sortedReviews?.map((review) => (
              <>
                <ReviewCard key={review?.id} review={review} />
                {/* EDIT BUTTON */}
                {review?.user_id === filters?.user_id && (
                  <RiEdit2Fill
                    onClick={() => handleEdit(myReview)}
                    className={` top-3 right-0 text-2xl`}
                  />
                )}
              </>
            ))
          ) : (
            <div>No Reviews Yet</div>
          )}
        </section>

        {/* RATING */}
        <section
          className={`flex flex-col gap-10 px-5 py-10 md:p-20 rounded-lg`}
        >
          {/* AVERAGE RATING */}
          <div className={` flex flex-col justify-center items-center`}>
            <div className="space-y-5">
              <p className={`text-4xl font-bold`}> Average Rating</p>
              <p className={`flex text-7xl`}>
                <span>{average ? average.toFixed(2) : "0.00"}</span>{" "}
                <FaStar className={`text-yellow-500 `} />
              </p>
              <p
                className={`text-primary bg-green-100 px-5 py-1 rounded-full inline-block`}
              >
                Based on{" "}
                <span className={`font-bold text-2xl`}>
                  {data?.meta?.total}
                </span>{" "}
                ratings
              </p>
            </div>
          </div>

          {/* RATING BAR */}
          <div className={`flex flex-col gap-5`}>
            <BarChart
              label={"Stars"}
              star={5}
              total={data?.meta?.total}
              value={data?.data?.star?.star_5}
            />
            <BarChart
              label={"Stars"}
              star={4}
              total={data?.meta?.total}
              value={data?.data?.star?.star_4}
            />
            <BarChart
              label={"Stars"}
              star={3}
              total={data?.meta?.total}
              value={data?.data?.star?.star_3}
            />
            <BarChart
              label={"Stars"}
              star={2}
              total={data?.meta?.total}
              value={data?.data?.star?.star_2}
            />
            <BarChart
              label={"Stars"}
              star={1}
              total={data?.meta?.total}
              value={data?.data?.star?.star_1}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function BarChart({ label, star, total, value }) {
  return (
    <div className={`flex items-center gap-2`}>
      <p className={`flex items-center gap-1`}>
        <span>{star}</span> <span>{label}</span>
      </p>
      <div className="w-[80%] bg-gray-200 h-4 rounded-[5px] ">
        <div
          className="bg-yellow-500 h-4 rounded-[5px]"
          style={{
            width: `${(value / total) * 100}%`,
          }}
        ></div>
      </div>
      <p>{value}</p>
    </div>
  );
}
