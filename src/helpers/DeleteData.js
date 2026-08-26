import CustomConfirmation from "@/components/ui/modal/CustomConfirmation";
import { errorHandler } from "./errorHandler";

export const deleteData = ({ handler, data }) => {
  CustomConfirmation.showConfirmation({
    title: "Confirm Delete",
    text: `Are you sure you want to delete this ${data?.title} ?`,
    showCancelButton: true,
    confirmButtonText: "Delete",
    icon: "delete",
    onConfirm: async () => {
      await handler(data?.id)
        .unwrap()
        .then((res) => {
          if (res?.success) {
            CustomConfirmation.showConfirmation({
              title: "Deleted!",
              confirmButtonText: "Okay",
            });
          }
        })
        .catch((err) => {
          errorHandler({ err, errorId: data?.id });
        });
    },
  });
};
