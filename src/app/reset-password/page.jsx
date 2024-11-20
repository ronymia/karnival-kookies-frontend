"use client";
import { isUserExist } from "@/apis/auth";
import NewPassword from "@/Shared/auth/NewPassword";
import ResetPasswordCode from "@/Shared/auth/ResetPasswordCode";
import Button from "@/Shared/Button";
import CustomField from "@/Shared/Fields/CustomField";
import { validationErrorHandler } from "@/Utils/validationErrorHandler";
import { useState } from "react";

const Page = () => {
  const [currentTab, setCurrentTab] = useState("reset_password");
  const [formData, setFormData] = useState({
    email: "",
  });

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

  const [isUserFound, setIsUserFound] = useState(false);
  //   SUBMIT DATA
  const handleSubmit = () => {
    if (validateForm()) {
      setIsUserFound(true);
      isUserExist({ email: formData?.email })
        .then((res) => {
          if (res?.error) {
            setErrors({
              ...errors,
              email: res?.error?.email,
            });
            setIsUserFound(false);
          } else if (res?.success) {
            setCurrentTab("code");
            setIsUserFound(false);
          }
        })
        .catch((err) => {
          setIsUserFound(false);
        });
    }
  };

  return (
    <>
      {currentTab === "reset_password" && (
        <div
          className={`max-w-[360px] mx-auto flex flex-col gap-10 p-5 pt-32 pb-60 `}
        >
          <div className={`space-y-2 text-center`}>
            <h2 className={`text-xl font-bold`}>Enter your email</h2>
          </div>
          <div
            className={`space-y-2 flex flex-col justify-center items-center`}
          >
            {/* EMAIL */}
            <CustomField
              defaultValue={formData?.email}
              disable={false}
              fieldClassName={"w-full"}
              error={errors?.email}
              id={"email"}
              name={"email"}
              onChange={handleFormChange}
              placeholder={"Email"}
              type={"email"}
              wrapperClassName={"w-full"}
              required={true}
            />
          </div>
          <div className={`flex justify-center items-center`}>
            <Button
              text={"Submit"}
              handler={handleSubmit}
              isLoading={isUserFound}
            />
          </div>
        </div>
      )}
      {currentTab === "code" && (
        <ResetPasswordCode data={formData} setCurrentTab={setCurrentTab} />
      )}
      {currentTab === "new_password" && <NewPassword data={formData} />}
    </>
  );
};

export default Page;
