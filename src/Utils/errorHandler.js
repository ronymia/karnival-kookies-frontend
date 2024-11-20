import CustomToaster from "@/Shared/CustomToaster";
import toast from "react-hot-toast";

export const errorHandler = ({ err, setLoading }) => {
  setLoading(false);
  if (err?.response?.status === 401) {
    toast.custom((t) => (
      <CustomToaster t={t} type={"error"} text={`Unauthorized access`} />
    ));
  } else if (err?.response?.status === 403) {
    toast.custom((t) => (
      <CustomToaster
        t={t}
        type={"error"}
        text={`Your access is forbidden to perform this action`}
      />
    ));
  } else if (err?.response?.status === 500) {
    toast.custom((t) => (
      <CustomToaster
        t={t}
        type={"error"}
        text={`Something went wrong. Please call the customer care`}
      />
    ));
  }
};
