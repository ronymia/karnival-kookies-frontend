import { usePopupContext } from "@/Context/ProjectProvider";
import SplitDescription from "@/Shared/SplitDescription";
import ViewField from "@/Shared/ViewField";
import { formatRole } from "@/Utils/formatRole";
import { getDate } from "@/Utils/getDate";

const ViewProduct = () => {
  const { popupOption } = usePopupContext();
  console.log({ popupOption });
  return (
    <div className={`px-2 py-5 flex flex-col justify-between gap-10 h-[70vh]`}>
      <div className=" grid grid-cols-2 gap-5">
        <ViewField title={"Name"} value={popupOption?.data?.name} />
        <ViewField
          title={"Price"}
          value={
            popupOption?.data?.discountPrice &&
            popupOption?.data?.discountPrice > 0
              ? `$${popupOption?.data?.discountPrice}`
              : `$${popupOption?.data?.regularPrice}`
          }
        />
        <ViewField title={"Stock Level"} value={popupOption?.data?.inStock} />
        <ViewField
          title={"Category"}
          value={formatRole(popupOption?.data?.category_table)}
        />
        <ViewField
          title={"Created At"}
          value={getDate(popupOption?.data?.createdAt)}
        />
        <ViewField
          title={"Last Updated"}
          value={getDate(popupOption?.data?.updatedAt)}
        />
        <div className={`col-span-2`}>
          <ViewField
            title={"Description"}
            value={
              <SplitDescription
                text={popupOption?.data?.description}
                length={200}
              />
            }
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row w-full justify-center md:justify-end items-center mt-5 gap-2">
        <button
          onClick={popupOption?.onClose}
          className="btn w-full md:btn-wide btn-outline btn-primary"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ViewProduct;
