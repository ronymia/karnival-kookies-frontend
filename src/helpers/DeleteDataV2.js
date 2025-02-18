import Swal from "sweetalert2";
import { errorHandler } from "./errorHandler";

export const deleteDataV2 = ({ handler, data, deleteMsg }) => {
  Swal.fire({
    title: "Confirm Delete",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Delete",
    customClass: {
      confirmButton: "bg-primary",
      cancelButton: "bg-error",
    },
  })
    .then(async (result) => {
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
            errorHandler({ err });
          });
      }
    })
    .catch((err) => {
      errorHandler({ err });
    });
};
