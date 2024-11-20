"use client";
import { usePopupContext } from "@/Context/ProjectProvider";
import CustomLoading from "@/Shared/CustomLoading";
import CustomToaster from "@/Shared/CustomToaster";
import { useState } from "react";
import toast from "react-hot-toast";
import ButtonSpinner from "@/Shared/ButtonSpinner";
import CustomField from "@/Shared/Fields/CustomField";
import CustomTextareaField from "@/Shared/Fields/CustomTextAreaField";
import { errorHandler } from "@/Utils/errorHandler";
import { postFaq, updateFaq } from "@/apis/faqs";

const CreateAndUpdateFaq = () => {
  const { popupOption } = usePopupContext();
  console.log({ popupOption });
  const [formData, setFormData] = useState({
    id: popupOption?.data ? popupOption?.data?.id : "",
    question: popupOption?.data ? popupOption?.data?.question : "",
    answer: popupOption?.data ? popupOption?.data?.answer : "",
  });

  // VALIDATION
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};

    // VALIDATE NAME
    if (!formData.question || formData.question.trim() === "") {
      newErrors.question = "Question is required";
    }
    if (!formData.answer || formData.answer.trim() === "") {
      newErrors.answer = "Answer is required";
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

  const [isFaqCreating, setIsFaqCreating] = useState(false);
  const createFunction = (data) => {
    setIsFaqCreating(true);
    postFaq(data)
      .then((res) => {
        console.log({ res });
        if (res?.success) {
          toast.custom((t) => (
            <CustomToaster
              t={t}
              type={"success"}
              text={`FAQ added successfully`}
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
          popupOption.setIsUpdating(Math.random());
          setIsFaqCreating(false);
        }
      })
      .catch((err) => {
        errorHandler({ err, setLoading: setIsFaqCreating });
      });
  };

  const [isFaqUpdating, setIsFaqUpdating] = useState(false);
  const updateFunction = (data) => {
    setIsFaqUpdating(true);
    updateFaq(data)
      .then((res) => {
        if (res?.success) {
          toast.custom((t) => (
            <CustomToaster
              t={t}
              type={"success"}
              text={`FAQ updated successfully`}
            />
          ));
          popupOption?.onClose();
          popupOption.setIsUpdating(Math.random());
          setIsFaqUpdating(false);
        }
      })
      .catch((err) => {
        errorHandler({ err, setLoading: setIsFaqUpdating });
      });
  };

  if (isFaqCreating || isFaqUpdating) {
    return <CustomLoading />;
  }
  return (
    <div className={` pb-12 h-full flex flex-col justify-between`}>
      <div>
        {/* NAME */}
        <CustomField
          defaultValue={formData?.question}
          disable={false}
          fieldClassName={"w-full"}
          error={errors?.question}
          id={"question"}
          label={"Question"}
          name={"question"}
          onChange={handleFormChange}
          placeholder={"Question"}
          type={"text"}
          wrapperClassName={"w-full"}
          required={true}
        />

        {/* DESCRIPTION */}
        <CustomTextareaField
          defaultValue={formData?.answer}
          disable={false}
          fieldClassName={"w-full"}
          error={errors?.answer}
          id={"answer"}
          label={"Answer"}
          name={"answer"}
          onChange={handleFormChange}
          placeholder={"Answer"}
          type={"text"}
          wrapperClassName={"w-full"}
        />
      </div>
      <div className="flex flex-col md:flex-row w-full justify-center md:justify-end items-center py-5 gap-2">
        <button
          disabled={isFaqCreating || isFaqUpdating}
          onClick={popupOption?.onClose}
          className="btn w-full md:btn-wide btn-outline btn-primary"
        >
          Cancel
        </button>
        <button
          disabled={isFaqCreating || isFaqUpdating}
          onClick={handleSubmit}
          className="btn w-full md:btn-wide btn-primary"
        >
          {isFaqCreating || isFaqUpdating ? (
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

export default CreateAndUpdateFaq;
