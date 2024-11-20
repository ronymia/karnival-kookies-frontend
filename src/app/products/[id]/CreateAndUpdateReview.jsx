"use client";

import { useAuthContext, usePopupContext } from "@/Context/ProjectProvider";
import ButtonSpinner from "@/Shared/ButtonSpinner";
import CustomLoading from "@/Shared/CustomLoading";
import CustomToaster from "@/Shared/CustomToaster";
import CustomTextareaField from "@/Shared/Fields/CustomTextAreaField";
import { useParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { postReview, updateReview } from "@/apis/reviews";
import { errorHandler } from "@/Utils/errorHandler";

const CreateAndUpdateReview = () => {
  const { popupOption } = usePopupContext();
  console.log({ popupOption });
  const { user } = useAuthContext();
  const params = useParams();
  console.log({ params });
  const [formData, setFormData] = useState({
    id: popupOption?.data ? popupOption?.data?.id : "",
    productId: params?.id,
    email: user?.email,
    rating: popupOption?.data ? popupOption?.data?.rating : 1,
    comment: popupOption?.data ? popupOption?.data?.comment : "",
  });

  console.log({ formData });

  // VALIDATION
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};

    // VALIDATE NAME
    if (!formData.productId) {
      newErrors.productId = "Product is required";
    }
    if (!formData.email || formData.email.trim() === "") {
      newErrors.email = "Email is required";
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

  // SUBMIT DATA
  const handleSubmit = async () => {
    // Validate form
    if (validateForm()) {
      if (popupOption?.data) {
        updateFunction(formData);
      } else {
        createFunction(formData);
      }
    }
  };

  const [isCategoryCreating, setIsCategoryCreating] = useState(false);
  const createFunction = (data) => {
    setIsCategoryCreating(true);
    postReview(data)
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
          popupOption?.setIsUpdating(Math.random());
          setIsCategoryCreating(false);
        }
      })
      .catch((err) => {
        errorHandler({ err, setLoading: setIsCategoryCreating });
      });
  };

  const [isCategoryUpdating, setIsCategoryUpdating] = useState(false);
  const updateFunction = (data) => {
    setIsCategoryUpdating(true);
    updateReview(data)
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
          popupOption.setIsUpdating(Math.random());
          setIsCategoryUpdating(false);
        }
      })
      .catch((err) => {
        errorHandler({ err, setLoading: setIsCategoryUpdating });
      });
  };

  if (isCategoryCreating || isCategoryUpdating) {
    return <CustomLoading />;
  }
  return (
    <div className={` pb-12 h-full flex flex-col justify-between`}>
      <div>
        <div>
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
              console.log({ e });
              setFormData((prev) => ({
                ...prev,
                rating: e,
              }));
            }}
          />
        </div>

        {/* DESCRIPTION */}
        <CustomTextareaField
          defaultValue={formData?.comment}
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
      </div>
      <div className="flex flex-col md:flex-row w-full justify-center md:justify-end items-center py-5 gap-2">
        <button
          disabled={isCategoryCreating || isCategoryUpdating}
          onClick={popupOption?.onClose}
          className="btn w-full md:btn-wide btn-outline btn-primary"
        >
          Cancel
        </button>
        <button
          disabled={isCategoryCreating || isCategoryUpdating}
          onClick={handleSubmit}
          className="btn w-full md:btn-wide btn-primary"
        >
          {isCategoryCreating || isCategoryUpdating ? (
            <ButtonSpinner />
          ) : popupOption?.data ? (
            "Update"
          ) : (
            "Create"
          )}
        </button>
      </div>
    </div>
  );
};

export default CreateAndUpdateReview;
