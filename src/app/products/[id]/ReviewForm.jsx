"use client";

import { postReview } from "@/apis/reviews";
import FormActions from "@/components/layouts/forms/FormActions";
import ButtonSpinner from "@/components/UI/buttons/ButtonSpinner";
import TextareaField from "@/components/UI/inputFields/TextareaField";
import CustomLoading from "@/components/UI/loader/CustomLoading";
import CustomToaster from "@/components/UI/toaster/CustomToaster";
import { usePopupContext } from "@/Context/ProjectProvider";
import { errorHandler } from "@/helpers/errorHandler";
import {
  useCreateReviewMutation,
  useUpdateReviewMutation,
} from "@/redux/apis/reviewApi";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { useParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function ReviewForm() {
  const { popupOption } = usePopupContext();
  // USER FROM REDUX STORE
  const { user } = useSelector((state) => state.auth);
  const params = useParams();
  const [createReview, createResult] = useCreateReviewMutation();
  const [updateReview, updateResult] = useUpdateReviewMutation();

  // USER FROM REDUX STORE
  const [formData, setFormData] = useState({
    id: popupOption?.data ? popupOption?.data?.id : "",
    product_id: params?.id || null,
    user_id: user?.id || null,
    rating: popupOption?.data ? popupOption?.data?.rating : 1,
    comment: popupOption?.data ? popupOption?.data?.comment : "",
  });

  console.log({ formData });

  // VALIDATION
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};

    // VALIDATE NAME
    if (!formData.product_id) {
      newErrors.product_id = "Product is required";
    }
    if (!formData.user_id) {
      newErrors.user_id = "User ID is required";
    }
    if (!formData.rating) {
      newErrors.rating = "rating is required";
    }

    if (!formData.comment || formData.comment.trim() === "") {
      newErrors.comment = "Comment is required";
    }

    setErrors(newErrors);
    console.log({ newErrors });
    // ValidationErrorHandler(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.custom((t) => (
        <CustomToaster
          t={t}
          type={"error"}
          errors={{
            validationErrors: Object.entries(newErrors).map((error, i) => {
              if (Array.isArray(error[1])) {
                return Object.entries(error[1][0])
                  ?.filter((error2, j) => error2[0] !== "id")
                  ?.map((error2, j) => error2[1])
                  ?.join(" & ");
              } else {
                return error[1];
              }
            }),
          }}
          text={`You are submitting invalid data`}
        />
      ));
    }

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };
  // CHANGE FORM DATA
  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const createFunction = async (data) => {
    await createReview(data)
      .unwrap()
      .then((res) => {
        console.log({ res });
        if (res?.success) {
          toast.custom((t) => (
            <CustomToaster
              t={t}
              type={"success"}
              text={`Review added successfully`}
            />
          ));

          setFormData({
            name: "",
            price: "",
            inStock: "",
            category: "",
            description: "",
            images: [],
          });
          popupOption?.onClose();
        }
      })
      .catch((err) => {
        errorHandler({ err });
      });
  };

  const updateFunction = async (data) => {
    await updateReview(data)
      .unwrap()
      .then((res) => {
        if (res?.success) {
          toast.custom((t) => (
            <CustomToaster
              t={t}
              type={"success"}
              text={`Review updated successfully`}
            />
          ));
          popupOption?.onClose();
        }
      })
      .catch((err) => {
        errorHandler({ err });
      });
  };

  // SUBMIT DATA
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (validateForm()) {
      if (popupOption?.data) {
        updateFunction(formData);
      } else {
        createFunction(formData);
      }
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className={` pb-12 h-full flex flex-col justify-between`}
    >
      <>
        <div>
          {/* RATING */}
          <label
            className={`text-base-300 font-semibold text-lg`}
            htmlFor="rating"
          >
            Rate Us
          </label>
          <Rating
            style={{ maxWidth: 200, display: "flex" }}
            value={formData?.rating}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                rating: e,
              }));
            }}
          />
        </div>

        {/* COMMENTS */}
        <TextareaField
          value={formData?.comment}
          disable={false}
          fieldClassName={"w-full"}
          error={errors?.comment}
          id={"comment"}
          label={"Comment"}
          name={"comment"}
          onChange={handleFormChange}
          placeholder={"Write your comment"}
          type={"text"}
          wrapperClassName={"w-full"}
        />
      </>

      <FormActions
        isLoading={createResult.isLoading || updateResult.isLoading}
        onCancel={popupOption?.onClose}
        submitText="Submit"
      />
    </form>
  );
}
