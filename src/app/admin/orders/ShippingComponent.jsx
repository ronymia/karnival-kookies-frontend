import { usePopupContext } from "@/Context/ProjectProvider";
import SplitDescription from "@/Shared/SplitDescription";
import ViewField from "@/Shared/ViewField";
import { formatRole } from "@/Utils/formatRole";
import { getDate } from "@/Utils/getDate";
import React from "react";

const ShippingComponent = () => {
  const { popupOption } = usePopupContext();
  console.log({ popupOption });
  const { checkoutInfo } = popupOption?.data;
  return (
    <div className=" grid grid-cols-2 gap-5">
      <ViewField title={"Name"} value={checkoutInfo?.name} />
      <ViewField title={"Phone"} value={checkoutInfo?.phone} />
      <div className={`col-span-2`}>
        <ViewField title={"Email"} value={checkoutInfo?.email} />
      </div>
      <div className={`col-span-2`}>
        <ViewField title={"State"} value={checkoutInfo?.state} />
      </div>
      <ViewField title={"Street"} value={checkoutInfo?.streetAddress} />
      <ViewField title={"Zip/Postcode"} value={checkoutInfo?.postalCode} />
      <ViewField title={"City"} value={checkoutInfo?.city} />
      <ViewField title={"Country"} value={checkoutInfo?.country} />
      <ViewField title={"Apartment No"} value={checkoutInfo?.apartment} />
      <div className={`col-span-2`}>
        <ViewField
          title={"Delivery Instructions"}
          value={
            <SplitDescription
              text={checkoutInfo?.deliveryInstruction}
              length={200}
            />
          }
        />
      </div>
    </div>
  );
};

export default ShippingComponent;
