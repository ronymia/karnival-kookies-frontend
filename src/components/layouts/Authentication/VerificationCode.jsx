"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CustomNumberFieldForOtp from "@/Shared/Fields/CustomNumberFieldForOtp";
import { IoIosArrowRoundForward } from "react-icons/io";
import ButtonSpinner from "@/components/UI/buttons/ButtonSpinner";
import { useVerifyUserEmailMutation } from "@/redux/apis/authApis";
import CustomToaster from "@/components/UI/toaster/CustomToaster";

const VerificationCode = ({ data }) => {
  const router = useRouter();
  const [verifyUserEmail, verifyUserEmailResult] = useVerifyUserEmailMutation();

  // FORM STATE
  const [formData, setFormData] = useState({
    digit_1: "",
    digit_2: "",
    digit_3: "",
    digit_4: "",
  });

  // VALIDATION
  const [errors, setErrors] = useState({});

  // VALIDATION
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
  const handleFormChange = (e, nextId, previousId) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    const nextInput = document.querySelector(`#${nextId}`);
    const previousInput = document.querySelector(`#${previousId}`);

    if (value === "") {
      previousInput?.focus(); // Move focus to the previous input
    } else {
      if (nextInput) {
        nextInput?.focus(); // Programmatically focus the element
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
  const handleOnSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      createFunction(formData);
    }
  };

  const createFunction = async (formData) => {
    await verifyUserEmail({
      otp:
        formData?.digit_1 +
        formData?.digit_2 +
        formData?.digit_3 +
        formData?.digit_4,
      email: data?.email,
    })
      .unwrap()
      .then((res) => {
        if (res?.success) {
          // CLEAR FORM
          setFormData({
            digit_1: "",
            digit_2: "",
            digit_3: "",
            digit_4: "",
          });

          // SUCCESS MESSAGE
          toast.custom((t) => (
            <CustomToaster t={t} type={"error"} text={res?.message} />
          ));
          // REDIRECT
          router.push("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Set Page Title in Client Component
  useEffect(() => {
    document.title = "Karnival Cookies | Email Verification";
  }, []);

  return (
    <>
      <div
        className={`flex flex-col justify-center items-center gap-10 p-5 pt-32 pb-60`}
      >
        {/* <----------------- HEADING --------------------------> */}
        <div className={`space-y-2 text-center`}>
          <h2 className={`text-xl font-bold`}>Enter Verification Code</h2>
          <p className={`font-medium text-sm`}>
            We Have Sent a Code to{" "}
            <span className={`font-bold text-primary text-base`}>
              {data?.email}
            </span>
          </p>
        </div>

        {/* <----------------- FORM --------------------------> */}
        <form
          noValidate
          onSubmit={handleOnSubmit}
          className={`flex flex-col gap-5 justify-center items-center`}
        >
          <div className={`flex gap-2`}>
            <CustomNumberFieldForOtp
              value={formData?.digit_1}
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
              value={formData?.digit_2}
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
              value={formData?.digit_3}
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
              value={formData?.digit_4}
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
          {/* <----------------- ERROR --------------------------> */}
          {!!errors?.digit && (
            <label className="label ">
              <span className="label-text-alt text-error">{errors?.digit}</span>
            </label>
          )}

          {/* <----------------- SUBMIT BUTTON --------------------------> */}
          <div className={`flex justify-center items-center group`}>
            <button
              type={`submit`}
              className={`text-primary border border-primary px-5 py-3 rounded-full flex items-center gap-2 group-hover:border-base-300 transition-[border]`}
            >
              {verifyUserEmailResult.isLoading ? (
                <ButtonSpinner />
              ) : (
                <>
                  <p className="group-hover:text-base-300 transition-[color] duration-700">
                    {`Submit`}
                  </p>
                  {
                    <IoIosArrowRoundForward className="group-hover:text-base-300 group-hover:translate-x-2  transition-transform duration-300" />
                  }
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default VerificationCode;
