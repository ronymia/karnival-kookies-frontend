import { useCartContext } from "@/Context/ProjectProvider";
import Heading from "@/Shared/Heading";
import ViewField from "@/Shared/ViewField";
import React from "react";

const CheckoutStep3 = ({ formData, handleNextStep, handlePrevStep }) => {
  const { checkoutTotal } = useCartContext();
  return (
    <div className={`space-y-5`}>
      <Heading isSubHeading={false} heading={"Order Informations"} />
      <div className={`grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5`}>
        <ViewField title={"Name"} value={formData?.step1?.name} />
        <ViewField title={"Email"} value={formData?.step1?.email} />
        <ViewField title={"Phone"} value={formData?.step1?.phone} />
        <ViewField title={"Street"} value={formData?.step1?.streetAddress} />
        {formData?.step1?.apartment && (
          <ViewField title={"Apartment"} value={formData?.step1?.apartment} />
        )}
        <ViewField title={"City"} value={formData?.step1?.city} />
        <ViewField title={"State"} value={formData?.step1?.state} />
        <ViewField title={"Country"} value={formData?.step1?.country} />
        {formData?.step1?.postalCode && (
          <ViewField
            title={"Zip/Postal Code"}
            value={formData?.step1?.postalCode}
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
        value={formData?.step1?.deliveryInstruction}
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
