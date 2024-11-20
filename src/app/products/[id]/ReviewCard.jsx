import { Rating } from "@smastrom/react-rating";
import moment from "moment";
import React from "react";

const ReviewCard = ({ review }) => {
  return (
    <div className={`flex gap-3`}>
      <div className="h-9 w-9 flex-shrink-0 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        <span className="text-sm font-medium text-primary flex-shrink-0">
          {review?.name
            ?.split(" ")
            ?.map((char) => char.charAt(0).toUpperCase())}
        </span>
      </div>
      <div className={`space-y-3`}>
        <div>
          <div className={`flex flex-col sm:flex-row sm:items-center sm:gap-2`}>
            <p className={`font-bold text-base-300`}>{review?.name}</p>
            <p>{moment(review?.createdAt).fromNow()}</p>
          </div>
          <Rating
            style={{ maxWidth: 50, display: "flex" }}
            value={review?.rating}
            readOnly
          />
        </div>
        <p className={`font-medium`}>{review?.comment}</p>
      </div>
    </div>
  );
};

export default ReviewCard;
