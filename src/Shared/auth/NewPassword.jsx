"use client";
import React, { useState } from "react";
import CustomPasswordField from "../Fields/CustomPasswordField";
import Button from "../Button";
import { validationErrorHandler } from "@/Utils/validationErrorHandler";
import { jwt, updateUserPassword } from "@/apis/auth";
import toast from "react-hot-toast";
import CustomToaster from "../CustomToaster";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/Context/ProjectProvider";

const NewPassword = ({ data }) => {
  console.log({ data });
  const router = useRouter();
  const { setIsUserComing } = useAuthContext();

  const [formData, setFormData] = useState({
    ...data,
    password: "",
    password_confirmation: "",
  });

  console.log({ formData });

  // VALIDATION
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};

    //   VALIDATE EMAIL
    if (!formData?.email || formData?.email.trim() === "") {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i.test(
        formData?.email?.trim()
      )
    ) {
      newErrors.email = "Invalid email";
    }

    if (!formData?.password || formData?.password.trim() === "") {
      newErrors.password = "Password is required";
    }
    if (formData.password) {
      if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(formData?.password)) {
        newErrors.password =
          "Password should have at least one uppercase, lowercase and number";
      }
      if (formData?.password?.length < 8) {
        newErrors.password = "Password should have at least 8 character";
      }
    }
    if (formData?.password_confirmation !== formData?.password) {
      newErrors.password_confirmation = "Password does not match";
    }

    setErrors(newErrors);

    validationErrorHandler(newErrors);

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

  const [isPending, setIsPending] = useState(false);
  //   SUBMIT DATA
  const handleSubmit = () => {
    if (validateForm()) {
      setIsPending(true);
      updateUserPassword(formData?.email, {
        password: formData?.password,
      })
        .then((res) => {
          console.log({ resFromXd: res });
          if (res?.error) {
            setErrors({
              ...errors,
              email: res?.error?.email,
            });
          } else if (res?.success) {
            jwt({ email: formData?.email }).then((res) => {
              console.log({ res });
              if (res?.success) {
                setFormData((prev) => ({
                  email: "",
                  password: "",
                  password_confirmation: "",
                }));
                toast.custom((t) => (
                  <CustomToaster
                    t={t}
                    type={"success"}
                    text={`Password reset successfully`}
                  />
                ));
                setIsUserComing(Math.random());
                router.push("/");
              }
            });
          }
          setIsPending(false);
        })
        .catch((err) => {
          setIsPending(false);
        });
    }
  };

  return (
    <div
      className={`max-w-[360px] mx-auto flex flex-col gap-10 p-5 pt-32 pb-60`}
    >
      <div className={`space-y-2 text-center`}>
        <h2 className={`text-xl font-bold`}>Reset your password</h2>
      </div>
      <div className={`space-y-2 flex flex-col justify-center items-center`}>
        {/* PASSWORD */}
        <CustomPasswordField
          required={true}
          id="password"
          onChange={handleFormChange}
          value={formData?.password}
          label={`Password`}
          placeholder={`Password`}
          name={`password`}
          error={errors?.password}
          wrapperClassName={`w-full`}
          fieldClassName={`w-full`}
        />
        {/* PASSWORD CONFIRMATION */}
        <CustomPasswordField
          required={true}
          id="password_confirmation"
          onChange={handleFormChange}
          value={formData?.password_confirmation}
          label={`Confirm Password`}
          placeholder={`Password`}
          name={`password_confirmation`}
          error={errors?.password_confirmation}
          wrapperClassName={`w-full`}
          fieldClassName={`w-full`}
        />
      </div>
      <div className={`flex justify-center items-center`}>
        <Button text={"Submit"} handler={handleSubmit} isLoading={isPending} />
      </div>
    </div>
  );
};

export default NewPassword;
