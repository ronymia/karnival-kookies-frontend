"use client";
import CustomMultiStepper from "@/Shared/steppers/CustomMultiStepper";
import { validationErrorHandler } from "@/Utils/validationErrorHandler";
import { useEffect, useState } from "react";
import CheckoutStep1 from "./CheckoutStep1";
import CheckoutStep2 from "./CheckoutStep2";
import CheckoutStep3 from "./CheckoutStep3";
import PaymentStep4 from "./PaymentStep4";
import PrivateRoute from "@/Routes/PrivateRoute";
import useCheckoutReducer from "./checkoutReducer";
import { useSelector } from "react-redux";

const Page = () => {
  const { user } = useSelector((state) => state.auth);
  const [step, setStep] = useState(1);

  const { state, dispatch } = useCheckoutReducer();

  const [formData, setFormData] = useState({
    step1: {
      name: "",
      email: "",
      phone: "",
      streetAddress: "",
      apartment: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      deliveryInstruction: "",
    },
  });
  console.log({ formData });

  // SET USER
  useEffect(() => {
    ["email"].forEach((field) => {
      dispatch({
        type: "UPDATE_SHIPPING_INFO",
        payload: {
          field: field,
          value: user?.email,
        },
      });
    });
  }, []);

  const handleNextStep = async (validateForm) => {
    if (step === 1) {
      if (validateForm()) {
        setStep((prev) => prev + 1);
      }
    } else if (step === 2 || step === 3) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
  };

  // VALIDATION
  const [errors1, setErrors1] = useState({});
  const validateForm1 = () => {
    const newErrors = {};

    // VALIDATE NAME
    if (!state.shipping_info.name || state.shipping_info.name.trim() === "") {
      newErrors.name = "Name is required";
    }
    // VALIDATE STREET
    if (
      !state.shipping_info.streetAddress ||
      state.shipping_info.streetAddress.trim() === ""
    ) {
      newErrors.streetAddress = "Street is required";
    }
    // VALIDATE CITY
    if (!state.shipping_info.city || state.shipping_info.city.trim() === "") {
      newErrors.city = "City is required";
    }
    // VALIDATE STATE
    if (!state.shipping_info.state || state.shipping_info.state.trim() === "") {
      newErrors.state = "State is required";
    }
    // VALIDATE COUNTRY
    if (
      !state.shipping_info.country ||
      state.shipping_info.country.trim() === ""
    ) {
      newErrors.country = "Country is required";
    }
    // VALIDATE PHONE
    if (!state.shipping_info.phone) {
      newErrors.phone = "Phone is required";
    }
    // VALIDATE EMAIL
    if (
      !state?.shipping_info?.email ||
      state?.shipping_info?.email.trim() === ""
    ) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i.test(
        state?.shipping_info?.email?.trim()
      )
    ) {
      newErrors.email = "Invalid email";
    }

    setErrors1(newErrors);
    console.log({ newErrors });
    validationErrorHandler(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  return (
    <PrivateRoute>
      <div
        className={`max-w-screen-xl mx-auto px-5 md:px-10 flex flex-col justify-center items-center gap-10 pt-32 mb-60 w-full `}
      >
        <div className=" mb-5 w-full md:w-1/2 ">
          <CustomMultiStepper
            steps={[
              {
                serial: 1,
                id: 1,
                title: "Shipping Information",
              },
              {
                serial: 2,
                id: 2,
                title: "Payment Information",
              },
              {
                serial: 3,
                id: 3,
                title: "Order Review",
              },
              {
                serial: 4,
                id: 4,
                title: "Confirm Payment",
              },
            ]}
            currentStep={step}
          />
        </div>
        <div className={`w-full`}>
          {step === 1 && (
            <CheckoutStep1
              errors={errors1}
              setErrors={setErrors1}
              validateForm={validateForm1}
              handleNextStep={handleNextStep}
              state={state}
              dispatch={dispatch}
            />
          )}
          {step === 2 && (
            <CheckoutStep2
              handleNextStep={handleNextStep}
              handlePrevStep={handlePrevStep}
              state={state}
              dispatch={dispatch}
            />
          )}
          {step === 3 && (
            <CheckoutStep3
              handleNextStep={handleNextStep}
              handlePrevStep={handlePrevStep}
              state={state}
            />
          )}
          {step === 4 && (
            <PaymentStep4
              handleNextStep={handleNextStep}
              handlePrevStep={handlePrevStep}
              state={state}
              dispatch={dispatch}
            />
          )}
        </div>
      </div>
    </PrivateRoute>
  );
};

export default Page;
