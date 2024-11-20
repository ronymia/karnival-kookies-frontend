import Swal from "sweetalert2";
import { errorHandler } from "./errorHandler";

export const deleteData = ({
  handler,
  data,
  deleteMsg,
  setIsUpdating,
  setIsDeleteLoading,
}) => {
  setIsDeleteLoading(true);
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    customClass: {
      confirmButton: "bg-primary",
      cancelButton: "bg-error",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      handler({ id: data?.id })
        .then((res) => {
          if (res?.success) {
            Swal.fire({
              title: "Deleted!",
              text: deleteMsg,
              icon: "success",
            });
            setIsUpdating(Math.random());
            setIsDeleteLoading(false);
          }
        })
        .catch((err) => {
          errorHandler({ err, setLoading: setIsDeleteLoading });
        });
    }
  });
};
