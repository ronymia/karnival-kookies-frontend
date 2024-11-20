import { usePopupContext } from "@/Context/ProjectProvider";
import ViewField from "@/Shared/ViewField";
import { formatRole } from "@/Utils/formatRole";
import { getDate, getTime } from "@/Utils/getDate";
import React from "react";

const AdditionalInfoComponent = () => {
  const { popupOption } = usePopupContext();
  console.log({ popupOption });
  const checkoutInfo = popupOption?.data;
  return (
    <div className=" grid grid-cols-2 gap-5">
      <div className={`col-span-2`}>
        <ViewField title={"Order Id"} value={checkoutInfo?.orderId} />
      </div>
      <ViewField
        title={"paymentMethod"}
        value={formatRole(checkoutInfo?.paymentMethod)}
      />
      <ViewField title={"Status"} value={formatRole(checkoutInfo?.status)} />

      <div className={`col-span-2`}>
        <ViewField title={"User Email"} value={checkoutInfo?.userEmail} />
      </div>
      <ViewField
        title={"Total Amount"}
        value={checkoutInfo?.totalPayableAmount}
      />
      <ViewField
        title={"Created Date"}
        value={getDate(popupOption?.data?.createdAt)}
      />
      <ViewField
        title={"Created Time"}
        value={getTime(popupOption?.data?.createdAt)}
      />
      <ViewField
        title={"Last Updated Date"}
        value={getDate(popupOption?.data?.updatedAt)}
      />
      <ViewField
        title={"Last Updated Time"}
        value={getTime(popupOption?.data?.updatedAt)}
      />
    </div>
  );
};

export default AdditionalInfoComponent;
