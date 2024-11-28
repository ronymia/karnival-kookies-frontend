import Swal from "sweetalert2";
import { errorHandlerV2 } from "./errorHandlerV2";

export const deleteDataV2 = ({ handler, data, deleteMsg }) => {
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
  }).then(async (result) => {
    if (result.isConfirmed) {
      await handler(data?.id)
        .then((res) => {
          if (res?.success) {
            Swal.fire({
              title: "Deleted!",
              text: deleteMsg,
              icon: "success",
            });
          }
        })
        .catch((err) => {
          errorHandlerV2({ err });
        });
    }
  });
};
