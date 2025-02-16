import CustomToaster from "@/components/UI/toaster/CustomToaster";
import { validationErrorHandler } from "@/Utils/validationErrorHandler";
import toast from "react-hot-toast";

export const errorHandler = ({ err, errorId }) => {
  switch (err?.status) {
    case 400:
      toast.custom((t) => (
        <CustomToaster t={t} type={"error"} text={err?.data?.message} />
      ));
      break;
    case 401:
      toast.custom((t) => (
        <CustomToaster t={t} type={"error"} text={`Unauthorized access`} />
      ));
      break;
    case 403:
      toast.custom((t) => (
        <CustomToaster
          t={t}
          type={"error"}
          text={`Your access is forbidden to perform this action`}
        />
      ));
      break;
    case 409:
      toast.custom((t) => (
        <CustomToaster t={t} type={"error"} text={err?.data?.message} />
      ));
      break;
    case 422:
      if (err?.data?.errorSources) {
        const errors = {};
        err?.data?.errorSources?.forEach((item) => {
          errors[item?.path] = item?.message;
        });
        validationErrorHandler(errors);
        return errors;
      }
      break;
    case 500:
      toast.custom((t) => (
        <CustomToaster t={t} type={"error"} text={err?.data?.message} />
      ));
      break;
    default:
      // Handle other status codes or provide a default error message
      toast.custom((t) => (
        <CustomToaster
          t={t}
          type={"error"}
          text={`An unexpected error occurred.`}
        />
      ));
  }
};
