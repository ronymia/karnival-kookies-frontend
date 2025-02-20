import Heading from "@/components/UI/Heading/Heading";
import ViewField from "@/Shared/ViewField";
import React from "react";
import { useSelector } from "react-redux";

const CheckoutStep3 = ({ formData, handleNextStep, handlePrevStep }) => {
  const { totalPrice: checkoutAmount } = useSelector((state) => state.cart);

  /* ============================================
  
  ==================================================*/
  return (
    <div className={`space-y-5`}>
      <Heading isSubHeading={false} heading={"Order Information"} />
      <div className={`grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5`}>
        <ViewField
          title={"Recipient Name"}
          value={formData?.shipping_info?.recipient_name}
        />
        <ViewField title={"Email"} value={formData?.shipping_info?.email} />
        <ViewField title={"Phone"} value={formData?.shipping_info?.phone} />
        <ViewField title={"Address"} value={formData?.shipping_info?.address} />
        <ViewField
          title={"Apartment"}
          value={formData?.shipping_info?.apartment}
        />
        <ViewField title={"City"} value={formData?.shipping_info?.city} />
        <ViewField title={"formData"} value={formData?.shipping_info?.state} />
        <ViewField title={"Country"} value={formData?.shipping_info?.country} />
        {formData?.shipping_info?.postal_code && (
          <ViewField
            title={"Zip/Postal Code"}
            value={formData?.shipping_info?.postal_code}
          />
        )}
        <ViewField
          title={"Payment Amount"}
          value={`$${checkoutAmount?.toFixed(2)}`}
        />
      </div>

      {formData?.shipping_info?.delivery_instruction && (
        <ViewField
          title={"Delivery Instruction"}
          value={formData?.shipping_info?.delivery_instruction}
        />
      )}
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
          Submit
        </button>
      </div>
    </div>
  );
};

export default CheckoutStep3;
