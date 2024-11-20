import { usePopupContext } from "@/Context/ProjectProvider";
import SplitDescription from "@/Shared/SplitDescription";
import ViewField from "@/Shared/ViewField";
import { formatRole } from "@/Utils/formatRole";
import { getDate, getTime } from "@/Utils/getDate";

const ViewUser = () => {
  const { popupOption } = usePopupContext();
  console.log({ popupOption });
  return (
    <div
      data-auto={`container-viewUser`}
      className={`px-2 py-5 flex flex-col justify-between gap-10 h-[70vh]`}
    >
      <div className=" grid grid-cols-2 gap-5">
        <ViewField title={"Name"} value={popupOption?.data?.name} />

        <ViewField title={"Phone"} value={popupOption?.data?.phone} />
        <ViewField title={"Role"} value={popupOption?.data?.role} />
        <ViewField
          title={"Is Verified"}
          value={popupOption?.data?.isVerified ? "Yes" : "No"}
        />
        <div className={`col-span-2`}>
          <ViewField title={"Email"} value={popupOption?.data?.email} />
        </div>
        <ViewField
          title={"Created Date"}
          value={getDate(popupOption?.data?.createdAt)}
        />
        <ViewField
          title={"Created Time"}
          value={getTime(popupOption?.data?.createdAt)}
        />
        <ViewField
          title={"Updated Date"}
          value={getDate(popupOption?.data?.updatedAt)}
        />
        <ViewField
          title={"Updated Time"}
          value={getTime(popupOption?.data?.updatedAt)}
        />
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

export default ViewUser;
