import CustomToaster from "@/Shared/CustomToaster";
import { validationErrorHandler } from "@/Utils/validationErrorHandler";
import toast from "react-hot-toast";

export const errorHandlerV2 = ({ err }) => {
  const obj = {};
  if (err?.status === 400) {
    toast.custom((t) => (
      <CustomToaster t={t} type={"error"} text={err?.data?.message} />
    ));
  } else if (err?.status === 401) {
    toast.custom((t) => (
      <CustomToaster t={t} type={"error"} text={`Unauthorized access`} />
    ));
  } else if (err?.status === 403) {
    toast.custom((t) => (
      <CustomToaster
        t={t}
        type={"error"}
        text={`Your access is forbidden to perform this action`}
      />
    ));
  } else if (err?.status === 422) {
    err?.data?.errorSources?.forEach((item) => {
      obj[item?.path] = item?.message;
    });
    validationErrorHandler(obj);
    return obj;
  } else if (err?.status === 500) {
    toast.custom((t) => (
      <CustomToaster t={t} type={"error"} text={err?.data?.message} />
    ));
  }
};
