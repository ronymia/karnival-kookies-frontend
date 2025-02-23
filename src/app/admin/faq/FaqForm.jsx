"use client";
import { usePopupContext } from "@/Context/ProjectProvider";
import { useState } from "react";
import toast from "react-hot-toast";
import { validationErrorHandler } from "@/Utils/validationErrorHandler";
import { errorHandler } from "@/helpers/errorHandler";
import CustomLoading from "@/components/UI/loader/CustomLoading";
import InputField from "@/components/UI/inputFields/InputField";
import TextareaField from "@/components/UI/inputFields/TextareaField";
import CustomToaster from "@/components/UI/toaster/CustomToaster";
import {
  useCreateFaqMutation,
  useUpdateFaqMutation,
} from "@/redux/apis/faqApi";
import FormActions from "@/components/layouts/forms/FormActions";

export default function FaqForm() {
  const { popupOption } = usePopupContext();

  const [createFaq, createResult] = useCreateFaqMutation();
  const [updateFaq, updateResult] = useUpdateFaqMutation();

  //
  const [formData, setFormData] = useState({
    id: popupOption?.data ? popupOption?.data?.id : null,
    question: popupOption?.data ? popupOption?.data?.question : "",
    answer: popupOption?.data ? popupOption?.data?.answer : "",
  });

  // VALIDATION
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};

    // VALIDATE question
    if (!formData.question || formData.question.trim() === "") {
      newErrors.question = "Question is required";
    }
    if (!formData.answer || formData.answer.trim() === "") {
      newErrors.answer = "Answer is required";
    }

    setErrors(newErrors);
    // console.log({ newErrors });
    if (Object.keys(newErrors).length > 0) {
      validationErrorHandler(newErrors);
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
    await createFaq(data)
      .unwrap()
      .then((res) => {
        if (res?.success) {
          // SHOW SUCCESS MESSAGE
          toast.custom((t) => (
            <CustomToaster
              t={t}
              type={"success"}
              text={`Question added successfully`}
            />
          ));

          // CLEAR FORM DATA
          setFormData({
            question: "",
            answer: "",
          });

          // CLOSE POPUP
          popupOption?.onClose();
        }
      })
      .catch((err) => {
        errorHandler({ err });
      });
  };

  const updateFunction = async (data) => {
    await updateFaq(data)
      .unwrap()
      .then((res) => {
        if (res?.success) {
          //  SHOW SUCCESS MESSAGE
          toast.custom((t) => (
            <CustomToaster
              t={t}
              type={"success"}
              text={`FAQ updated successfully`}
            />
          ));

          // CLEAR FORM DATA
          setFormData({
            question: "",
            answer: "",
          });

          // CLOSE POPUP
          popupOption?.onClose();
        }
      })
      .catch((err) => {
        errorHandler({ err });
      });
  };

  // SUBMIT DATA
  const handleOnSubmit = async () => {
    // Validate form
    if (validateForm()) {
      if (popupOption?.data) {
        updateFunction(formData);
      } else {
        createFunction(formData);
      }
    }
  };

  /* *************************************
  
  &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&*/

  if (createResult.isLoading || updateResult.isLoading) {
    return <CustomLoading />;
  }
  return (
    <form
      noValidate
      onSubmit={handleOnSubmit}
      className={`p-4 h-full flex flex-col gap-3`}
    >
      <>
        {/* QUESTION */}
        <InputField
          value={formData?.question}
          disable={false}
          fieldClassName={"w-full"}
          error={errors?.["question"]}
          id={"question"}
          label={"Question"}
          name={"question"}
          onChange={handleFormChange}
          placeholder={"Question"}
          type={"text"}
          wrapperClassName={"w-full"}
          required={true}
        />

        {/* ANSWER */}
        <TextareaField
          value={formData?.answer}
          disable={false}
          required={true}
          fieldClassName={"w-full"}
          error={errors?.["answer"]}
          id={"answer"}
          label={"Answer"}
          name={"answer"}
          onChange={handleFormChange}
          placeholder={"Answer"}
          type={"text"}
          wrapperClassName={"w-full"}
        />
      </>

      {/* ACTION BUTTONS */}
      <FormActions
        isLoading={createResult.isLoading || updateResult.isLoading}
        onCancel={popupOption?.onClose}
        submitText="Submit"
      />
    </form>
  );
}
