import Heading from "@/Shared/Heading";
import ViewField from "@/Shared/ViewField";
import React from "react";
import { useSelector } from "react-redux";

const CheckoutStep3 = ({ state, handleNextStep, handlePrevStep }) => {
  const { totalPrice: checkoutTotal } = useSelector((state) => state.cart);

  /* ============================================
  
  ==================================================*/
  return (
    <div className={`space-y-5`}>
      <Heading isSubHeading={false} heading={"Order Information"} />
      <div className={`grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5`}>
        <ViewField title={"Name"} value={state?.shipping_info?.name} />
        <ViewField title={"Email"} value={state?.shipping_info?.email} />
        <ViewField title={"Phone"} value={state?.shipping_info?.phone} />
        <ViewField
          title={"Street"}
          value={state?.shipping_info?.streetAddress}
        />
        {state?.shipping_info?.apartment && (
          <ViewField
            title={"Apartment"}
            value={state?.shipping_info?.apartment}
          />
        )}
        <ViewField title={"City"} value={state?.shipping_info?.city} />
        <ViewField title={"State"} value={state?.shipping_info?.state} />
        <ViewField title={"Country"} value={state?.shipping_info?.country} />
        {state?.shipping_info?.postalCode && (
          <ViewField
            title={"Zip/Postal Code"}
            value={state?.shipping_info?.postalCode}
          />
        )}
        <ViewField title={"Payment Method"} value={"Stripe"} />
        <ViewField
          title={"Payment Amount"}
          value={`$${checkoutTotal?.toFixed(2)}`}
        />
      </div>
      <ViewField
        title={"Additional Information"}
        value={state?.shipping_info?.deliveryInstruction}
      />
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
