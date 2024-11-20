"use client";
import { getAllReviews } from "@/apis/reviews";
import { useAuthContext, usePopupContext } from "@/Context/ProjectProvider";
import Button from "@/Shared/Button";
import { errorHandler } from "@/Utils/errorHandler";
import { Rating } from "@smastrom/react-rating";
import moment from "moment";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import "@smastrom/react-rating/style.css";
import ReviewCard from "./ReviewCard";
import { RiEdit2Fill } from "react-icons/ri";
import { FaStar } from "react-icons/fa";

const Reviews = () => {
  const { setPopupOption, popupOption } = usePopupContext();
  const { user } = useAuthContext();
  const [isUpdating, setIsUpdating] = useState();
  const params = useParams();

  const [data, setData] = useState([]);
  const myReview = data?.data?.find((review) => review?.email == user?.email);
  console.log({ myReview });
  const [isReviewsComing, setIsReviewsComing] = useState(false);
  useEffect(() => {
    setIsReviewsComing(true);
    getAllReviews({ id: params.id })
      .then((res) => {
        setData(res);
        setIsReviewsComing(false);
      })
      .catch((err) => {
        setIsReviewsComing(false);
        errorHandler({ err, setLoading: setIsReviewsComing });
      });
  }, [isUpdating]);

  console.log({ data });

  // HANDLE CREATE
  const handleCreate = () => {
    setPopupOption({
      ...popupOption,
      open: true,
      type: "review",
      title: "Add Your Review",
      setIsUpdating: setIsUpdating,
    });
  };
  // HANDLE EDIT
  const handleEdit = (data) => {
    setPopupOption({
      ...popupOption,
      open: true,
      type: "review",
      title: "Edit Your Review",
      data: data,
      setIsUpdating: setIsUpdating,
    });
  };

  const average =
    (5 * data?.stars?.stars_5 +
      4 * data?.stars?.stars_4 +
      3 * data?.stars?.stars_3 +
      2 * data?.stars?.stars_2 +
      1 * data?.stars?.stars_1) /
    data?.total;

  return (
    <div className={`max-w-screen-xl mx-auto px-5 pb-40 space-y-10`}>
      <div className={`flex justify-between items-center`}>
        <h2
          className={`text-[30px] hover:text-primary cursor-pointer border-b-4 border-primary inline-block`}
        >
          Review
        </h2>
        {!myReview && <Button text={"Write a Review"} handler={handleCreate} />}
      </div>
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-5`}>
        <div className={`space-y-5`}>
          {myReview && (
            <div className={`space-y-3`}>
              <h2
                className={`text-center hover:text-primary cursor-pointer flex justify-center items-center `}
              >
                <span className={`border-b-4 border-primary`}>My Review</span>
              </h2>
              <div className={`relative`}>
                <ReviewCard review={myReview} />
                <RiEdit2Fill
                  onClick={() => handleEdit(myReview)}
                  className={`absolute top-3 right-0 text-2xl`}
                />
              </div>
            </div>
          )}

          <div className={`space-y-5`}>
            <h2
              className={`text-center hover:text-primary cursor-pointer flex justify-center items-center `}
            >
              <span className={`border-b-4 border-primary`}>All Reviews</span>
            </h2>
            {data?.data?.length > 0 ? (
              data?.data?.map((review) => (
                <ReviewCard key={review?.id} review={review} />
              ))
            ) : (
              <div>No Reviews Yet</div>
            )}
          </div>
        </div>
        <div className={`flex flex-col gap-10 px-5 py-10 md:p-20 rounded-lg`}>
          {/* DATA AREA */}
          <div className={` flex flex-col justify-center items-center`}>
            <div className="space-y-5">
              <p className={`text-4xl font-bold`}> Data checking</p>
              <p className={`flex text-7xl`}>
                <span>{average ? average.toFixed(2) : "0.00"}</span>{" "}
                <FaStar className={`text-yellow-500 `} />
              </p>
              <p
                className={`text-primary bg-green-100 px-5 py-1 rounded-full inline-block`}
              >
                Based on {data?.total} ratings
              </p>
            </div>
          </div>
          <div className={`flex flex-col gap-5`}>
            <div className={`flex items-center gap-2`}>
              <p className={`flex items-center gap-1`}>
                <span>5</span> <span>Stars</span>
              </p>
              <div className="w-[80%] bg-gray-200 h-4 rounded-[5px] ">
                <div
                  className="bg-yellow-500 h-4 rounded-[5px]"
                  style={{
                    width: `${(data?.stars?.stars_5 / data?.total) * 100}%`,
                  }}
                ></div>
              </div>
              <p>{data?.stars?.stars_5}</p>
            </div>
            <div className={`flex items-center gap-2`}>
              <p className={`flex items-center gap-1`}>
                <span>4</span> <span>Stars</span>
              </p>
              <div className="w-[80%] bg-gray-200 h-4 rounded-[5px] ">
                <div
                  className="bg-yellow-500 h-4 rounded-[5px]"
                  style={{
                    width: `${(data?.stars?.stars_4 / data?.total) * 100}%`,
                  }}
                ></div>
              </div>
              <p>{data?.stars?.stars_4}</p>
            </div>
            <div className={`flex items-center gap-2`}>
              <p className={`flex items-center gap-1`}>
                <span>3</span> <span>Stars</span>
              </p>
              <div className="w-[80%] bg-gray-200 h-4 rounded-[5px] ">
                <div
                  className="bg-yellow-500 h-4 rounded-[5px]"
                  style={{
                    width: `${(data?.stars?.stars_3 / data?.total) * 100}%`,
                  }}
                ></div>
              </div>
              <p>{data?.stars?.stars_3}</p>
            </div>
            <div className={`flex items-center gap-2`}>
              <p className={`flex items-center gap-1`}>
                <span>2</span> <span>Stars</span>
              </p>
              <div className="w-[80%] bg-gray-200 h-4 rounded-[5px] ">
                <div
                  className="bg-yellow-500 h-4 rounded-[5px]"
                  style={{
                    width: `${(data?.stars?.stars_2 / data?.total) * 100}%`,
                  }}
                ></div>
              </div>
              <p>{data?.stars?.stars_2}</p>
            </div>
            <div className={`flex items-center gap-2`}>
              <p className={`flex items-center gap-1`}>
                <span>1</span> <span>Stars</span>
              </p>
              <div className="w-[80%] bg-gray-200 h-4 rounded-[5px] ">
                <div
                  className="bg-yellow-500 h-4 rounded-[5px]"
                  style={{
                    width: `${(data?.stars?.stars_1 / data?.total) * 100}%`,
                  }}
                ></div>
              </div>
              <p>{data?.stars?.stars_1}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
