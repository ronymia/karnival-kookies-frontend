"use client";
import { jwt, verifyUser } from "@/apis/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Button from "../Button";
import CustomToaster from "../CustomToaster";
import CustomNumberFieldForOtp from "../Fields/CustomNumberFieldForOtp";
import { useAuthContext } from "@/Context/ProjectProvider";
import { validationErrorHandler } from "@/Utils/validationErrorHandler";

const ResetPasswordCode = ({ data, setCurrentTab }) => {
  const [formData, setFormData] = useState({
    digit_1: "",
    digit_2: "",
    digit_3: "",
    digit_4: "",
  });

  // VALIDATION
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};

    //   VALIDATE NAME
    if (
      !formData.digit_1 ||
      !formData.digit_2 ||
      !formData.digit_3 ||
      !formData.digit_4
    ) {
      newErrors.digit = "Please Provide Full OTP";
    }

    setErrors(newErrors);

    validationErrorHandler(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  // CHANGE FORM DATA
  const handleFormChange = (e, nextId, previousId) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    const nextInput = document.querySelector(`#${nextId}`);
    const previousInput = document.querySelector(`#${previousId}`);

    if (value === "") {
      previousInput.focus(); // Move focus to the previous input
    } else {
      if (nextInput) {
        nextInput.focus(); // Programmatically focus the element
      }
    }
    if (
      formData?.digit_1 &&
      formData?.digit_2 &&
      formData?.digit_3 &&
      formData?.digit_4
    ) {
      setErrors({});
    }
  };

  //   SUBMIT DATA
  const handleSubmit = () => {
    if (validateForm()) {
      createFunction(formData);
    }
  };

  const [isSubmittingCode, setIsSubmittingCode] = useState(false);
  const createFunction = async (formData) => {
    setIsSubmittingCode(true);
    verifyUser({
      otp:
        formData?.digit_1 +
        formData?.digit_2 +
        formData?.digit_3 +
        formData?.digit_4,
      email: data?.email,
    })
      .then((res) => {
        if (res?.success) {
          setFormData({
            digit_1: "",
            digit_2: "",
            digit_3: "",
            digit_4: "",
          });
          setCurrentTab("new_password");
          setIsSubmittingCode(false);
        } else {
          toast.custom((t) => (
            <CustomToaster t={t} type={"error"} text={res?.message} />
          ));
          setIsSubmittingCode(false);
        }

        setIsSubmittingCode(false);
      })
      .catch((err) => {
        setIsSubmittingCode(false);
      });
  };

  return (
    <div
      className={`flex flex-col justify-center items-center gap-10 p-5 pt-32 pb-60`}
    >
      <img className={`w-40 mx-auto`} src="/storenetbdLogo.png" alt="" />
      <div className={`space-y-2 text-center`}>
        <h2 className={`text-xl font-bold`}>Enter Verification Code</h2>
        <p className={`font-medium text-[14px]`}>
          We have Sent a Code to {data?.email}
        </p>
      </div>
      <div className={`space-y-2 flex flex-col justify-center items-center`}>
        <div className={`flex gap-2`}>
          <CustomNumberFieldForOtp
            defaultValue={formData?.digit_1}
            disable={false}
            fieldClassName={"w-12"}
            id={"digit_1"}
            name={"digit_1"}
            placeholder={""}
            onChange={handleFormChange}
            wrapperClassName={"w-12"}
            maxLength={1}
          />
          <CustomNumberFieldForOtp
            defaultValue={formData?.digit_2}
            disable={false}
            fieldClassName={"w-12"}
            id={"digit_2"}
            name={"digit_2"}
            placeholder={""}
            onChange={handleFormChange}
            wrapperClassName={"w-12"}
            maxLength={1}
          />
          <CustomNumberFieldForOtp
            defaultValue={formData?.digit_3}
            disable={false}
            fieldClassName={"w-12"}
            id={"digit_3"}
            name={"digit_3"}
            placeholder={""}
            onChange={handleFormChange}
            wrapperClassName={"w-12"}
            maxLength={1}
          />
          <CustomNumberFieldForOtp
            defaultValue={formData?.digit_4}
            disable={false}
            fieldClassName={"w-12"}
            id={"digit_4"}
            name={"digit_4"}
            placeholder={""}
            onChange={handleFormChange}
            wrapperClassName={"w-12"}
            maxLength={1}
          />
        </div>
        <label className="label ">
          <span className="label-text-alt text-error">{errors?.digit}</span>
        </label>
      </div>
      <div className={`flex justify-center items-center`}>
        <Button
          text={"Submit"}
          handler={handleSubmit}
          isLoading={isSubmittingCode}
        />
      </div>
    </div>
  );
};

export default ResetPasswordCode;
