import Swal from "sweetalert2";
import toast from "react-hot-toast";
import CustomToaster from "@/components/ui/toaster/CustomToaster";

/**
 * Universal delete confirmation helper powered by SweetAlert2 with preConfirm.
 * Features luxury dark styling, inline mutation execution, loading spinners, and error validation.
 */
export const deleteData = ({
  handler,
  data,
  deleteMsg,
  title = "Confirm Delete",
}) => {
  const entityName = data?.name || data?.title || "item";

  return Swal.fire({
    title,
    text: `Are you sure you want to delete "${entityName}"? This action cannot be undone.`,
    icon: "warning",
    iconColor: "#eab308",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it",
    cancelButtonText: "Cancel",
    reverseButtons: true,
    buttonsStyling: false,
    background: "#161311",
    color: "#f5f5f5",
    customClass: {
      popup:
        "bg-[#161311]/95 border border-primary/30 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl text-neutral-100",
      title: "font-serif text-2xl font-medium text-white tracking-tight",
      htmlContainer: "text-neutral-300 text-xs sm:text-sm leading-relaxed mt-2",
      actions: "flex items-center justify-end gap-3 mt-6 w-full",
      confirmButton:
        "px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-red-600/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer",
      cancelButton:
        "px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 font-medium text-xs sm:text-sm transition-all cursor-pointer",
      loader: "border-primary",
      validationMessage: "bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-xs p-3 mt-3",
    },
    showLoaderOnConfirm: true,
    allowOutsideClick: () => !Swal.isLoading(),
    preConfirm: async () => {
      try {
        const id = data?.id || data?._id;
        const res = await handler(id).unwrap();
        return res;
      } catch (err) {
        const errorMessage =
          err?.data?.message || err?.error || "Failed to delete item";
        Swal.showValidationMessage(errorMessage);
        return false;
      }
    },
  }).then((result) => {
    if (result.isConfirmed) {
      toast.custom((t) => (
        <CustomToaster
          t={t}
          type="success"
          text={deleteMsg || `${entityName} deleted successfully`}
        />
      ));
    }
  });
};
