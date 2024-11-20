import { useCartContext } from "@/Context/ProjectProvider";
import CustomField from "@/Shared/Fields/CustomField";
import Heading from "@/Shared/Heading";
import React, { useState } from "react";

const CheckoutStep2 = ({ handleNextStep, handlePrevStep }) => {
  const { checkoutTotal, selectedItems } = useCartContext();
  const [isCouponFieldActive, setIsCouponFieldActive] = useState(false);
  return (
    <div className={`space-y-5`}>
      <Heading isSubHeading={false} heading={"Payment Information"} />
      <div className={`p-5 bg-primary text-base-300 font-bold`}>Summary</div>
      <div className={`px-5 flex flex-col gap-3`}>
        {selectedItems.map((item, i) => (
          <div
            key={i}
            className={`flex justify-between items-center text-[14px] sm:text-xl`}
          >
            <p className={` font-semibold`}>{item?.product?.name}</p>{" "}
            <p className={` text-primary`}>
              <span>
                {item?.product?.discountPrice
                  ? item?.product?.discountPrice
                  : item?.product?.regularPrice}{" "}
                * {item?.quantity}
              </span>{" "}
              ={" "}
              <span>
                $
                {item?.product?.discountPrice
                  ? item?.product?.discountPrice * item?.quantity
                  : item?.product?.regularPrice * item?.quantity}
              </span>
            </p>
          </div>
        ))}
      </div>
      <div className={`border-b-2 border-primary`}></div>
      <div
        className={`flex justify-between items-center px-5 text-[14px] sm:text-xl`}
      >
        <p className={` font-semibold`}>Subtotal</p>{" "}
        <p className={` text-primary`}>${checkoutTotal?.toFixed(2)}</p>
      </div>
      <div className={`border-b-2 border-primary`}></div>
      <div
        className={`flex justify-between items-center px-5 text-[14px] sm:text-xl`}
      >
        <p className={` font-semibold`}>Total</p>{" "}
        <p className={` text-primary`}>${checkoutTotal?.toFixed(2)}</p>
      </div>

      <div className={`text-xl font-semibold space-y-3`}>
        <p>
          Payment Method: <span className={`text-primary`}>Stripe</span>
        </p>
        {/* <p>
          Have any coupon?{" "}
          <span className={`link link-hover hover:text-primary`}>Use it</span>
        </p>
        <CustomField
          value={formData?.step1?.name}
          disable={false}
          fieldClassName={"w-full"}
          error={errors?.name}
          id={"name"}
          label={"Name"}
          name={"name"}
          onChange={handleFormChange}
          placeholder={"Name"}
          type={"text"}
          wrapperClassName={"w-full"}
          required={true}
        /> */}
      </div>
      <div className="flex flex-col md:flex-row w-full justify-center md:justify-end items-center py-5 gap-2">
        <button
          disabled={false}
          onClick={handlePrevStep}
          className="btn w-full md:btn-wide btn-primary"
        >
          Previous
        </button>
        <button
          disabled={false}
          onClick={() => handleNextStep(true)}
          className="btn w-full md:btn-wide btn-primary"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CheckoutStep2;
