"use client";
import VerificationCode from "@/components/layouts/authentication/VerificationCode";
import Heading from "@/components/ui/heading/Heading";
import DatePicker from "@/components/ui/inputfields/DatePicker";
import InputField from "@/components/ui/inputfields/InputField";
import NumberField from "@/components/ui/inputfields/NumberField";
import PasswordField from "@/components/ui/inputfields/PasswordField";
import RadioButton from "@/components/ui/inputfields/RadioButton";
import CustomLoading from "@/components/ui/loader/CustomLoading";
import CustomToaster from "@/components/ui/toaster/CustomToaster";
import { errorHandler } from "@/helpers/errorHandler";
import { useRegisterUserMutation } from "@/redux/apis/authApis";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiSolidCheckCircle } from "react-icons/bi";

export default function RegisterPage() {
  // STATE
  const [currentTab, setCurrentTab] = useState("register");
  const [userRegister, registerResult] = useRegisterUserMutation();
  // STATE
  const router = useRouter();
  // STATE
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    country: "",
    city: "",
    postcode: "",
    date_of_birth: "",
    gender: "",
    password: "",
    role: "customer",
  });

  // CHANGE FORM DATA
  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // VALIDATION
  const [errors, setErrors] = useState({});
  const [codeError, setCodeError] = useState("");
  const validateForm = () => {
    const newErrors = {};

    //   VALIDATE NAME
    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Name is required";
    }

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

    //   VALIDATE DATE OF BIRTH
    if (!formData.date_of_birth || formData.date_of_birth.trim() === "") {
      newErrors.date_of_birth = "Date of birth is required";
    }

    //   VALIDATE GENDER
    if (!formData.gender || formData.gender.trim() === "") {
      newErrors.gender = "Gender is required";
    }

    //   VALIDATE PHONE
    if (!formData.phone || formData.phone.trim() === "") {
      newErrors.phone = "Phone is required";
    }

    //   VALIDATE ADDRESS
    if (!formData.address || formData.address.trim() === "") {
      newErrors.address = "Address is required";
    }

    //   VALIDATE COUNTRY
    if (!formData.country || formData.country.trim() === "") {
      newErrors.country = "Country is required";
    }

    //   VALIDATE CITY
    if (!formData.city || formData.city.trim() === "") {
      newErrors.city = "City is required";
    }

    //   VALIDATE POSTCODE
    if (!formData.postcode || formData.postcode.trim() === "") {
      newErrors.postcode = "Postcode is required";
    }

    //   VALIDATE PASSWORD
    if (!formData.password) {
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

  const createFunction = async () => {
    userRegister(formData)
      .unwrap()
      .then((res) => {
        if (res?.error) {
          return toast.custom((t) => (
            <CustomToaster t={t} type={"error"} text={res?.error} />
          ));
        }
        setCodeError(res?.error);

        if (res?.success) {
          setCurrentTab("code");
        }
        if (!res?.success) {
          setFormData({
            name: "",
            email: "",
            password: "",
          });
          toast.custom((t) => (
            <CustomToaster
              t={t}
              type={"error"}
              text={"Something went wrong. Please register again"}
            />
          ));
        }
      })
      .catch((err) => {
        const errors = errorHandler({ err });
        setErrors(errors);
      });
  };

  //   SUBMIT DATA
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      createFunction(formData);
    }
  };

  // Set Page Title in Client Component
  useEffect(() => {
    document.title = "Karnival Cookies | Sing up";
  }, []);

  /* ****************************************
  
  ********************************************************/
  if (registerResult.isLoading) {
    return <CustomLoading />;
  } else {
    return (
      <>
        {currentTab === "register" && (
          <div className={` block overflow-auto pt-32 pb-60 space-y-10`}>
            <Heading heading={"Create An Account"} isSubHeading={false} />
            {/* LOGIN AREA */}
            <form
              noValidate
              onSubmit={handleOnSubmit}
              className={`max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6`}
            >
              {/* NAME */}
              <InputField
                value={formData?.name}
                disable={false}
                fieldClassName={"w-full"}
                error={errors?.name}
                id={"name"}
                name={"name"}
                label={"Name"}
                onChange={handleFormChange}
                placeholder={"Name"}
                type={"text"}
                wrapperClassName={"w-full"}
                required={true}
              />
              {/* PHONE */}
              <NumberField
                value={formData?.phone}
                disable={false}
                fieldClassName={"w-full"}
                error={errors?.phone}
                id={"phone"}
                label={"Phone"}
                name={"phone"}
                onChange={handleFormChange}
                placeholder={"Phone"}
                wrapperClassName={"w-full"}
              />
              {/* EMAIL */}
              <InputField
                value={formData?.email}
                disable={false}
                fieldClassName={"w-full"}
                error={errors?.email}
                id={"email"}
                name={"email"}
                label={"Email"}
                onChange={handleFormChange}
                placeholder={"Email"}
                type={"email"}
                wrapperClassName={"w-full"}
                required={true}
              />
              {/* ADDRESS */}
              <InputField
                value={formData?.address}
                disable={false}
                fieldClassName={"w-full"}
                error={errors?.address}
                id={"address"}
                name={"address"}
                label={"Address"}
                onChange={handleFormChange}
                placeholder={"Address"}
                type={"text"}
                wrapperClassName={"w-full"}
                required={true}
              />
              {/* COUNTY */}
              <InputField
                value={formData?.country}
                disable={false}
                fieldClassName={"w-full"}
                error={errors?.country}
                id={"country"}
                name={"country"}
                label={"Country"}
                onChange={handleFormChange}
                placeholder={"Country"}
                type={"text"}
                wrapperClassName={"w-full"}
                required={true}
              />
              {/* CITY */}
              <InputField
                value={formData?.city}
                disable={false}
                fieldClassName={"w-full"}
                error={errors?.city}
                id={"city"}
                name={"city"}
                label={"City"}
                onChange={handleFormChange}
                placeholder={"City"}
                type={"text"}
                wrapperClassName={"w-full"}
                required={true}
              />
              {/* POSTCODE */}
              <InputField
                value={formData?.postcode}
                disable={false}
                fieldClassName={"w-full"}
                error={errors?.postcode}
                id={"postcode"}
                name={"postcode"}
                label={"Postcode"}
                onChange={handleFormChange}
                placeholder={"Postcode"}
                type={"text"}
                wrapperClassName={"w-full"}
                required={true}
              />

              {/* DATE OF BIRTH */}
              <DatePicker
                right={true}
                id={"date_of_birth"}
                name={"date_of_birth"}
                label={"Date of birth"}
                placeholder={"Date of birth"}
                required={true}
                onChange={(date) => {
                  setFormData({
                    ...formData,
                    date_of_birth: date,
                  });
                }}
                defaultDate={formData?.date_of_birth}
                error={errors?.date_of_birth}
              />

              {/* GENDER */}
              <RadioButton
                options={[
                  {
                    name: "gender",
                    title: "Male",
                    value: "male",
                    Icon: BiSolidCheckCircle,
                  },
                  {
                    name: "gender",
                    title: "Female",
                    value: "female",
                    Icon: BiSolidCheckCircle,
                  },
                ]}
                onChange={handleFormChange}
                wrapperClassName={""}
                inputFieldClassName={"grid-cols-2 gap-5"}
                label={"Gender"}
                required={true}
                defaultChecked={formData?.gender}
                error={errors?.gender}
              />
              {/* PASSWORD */}
              <PasswordField
                required={true}
                id="password"
                onChange={handleFormChange}
                value={formData?.password}
                label={"Password"}
                placeholder={`Password`}
                name={`password`}
                error={errors?.password}
                wrapperClassName={`w-full`}
                fieldClassName={`w-full`}
              />

              {/* BUTTON */}
              <div
                className={`md:col-span-2 flex flex-col justify-center items-center gap-5`}
              >
                <button
                  type="submit"
                  className={`text-primary border border-primary px-5 py-3 rounded-full gap-2 hover:border-base-300 hover:text-base-300 transition-[color] duration-700 w-44`}
                >
                  Register
                </button>

                <div className={` font-bold text-heading-main mb-10`}>
                  <span>Already have an account? </span>{" "}
                  <span
                    onClick={() => router.push("/login")}
                    className={`link link-hover text-btn-primary`}
                  >
                    Login
                  </span>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* VERIFICATION */}
        {currentTab === "code" && (
          <VerificationCode error={codeError} data={formData} />
        )}
      </>
    );
  }
}
