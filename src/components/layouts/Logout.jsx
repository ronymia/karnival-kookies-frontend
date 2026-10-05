"use client";

import { errorHandler } from "@/helpers/errorHandler";
import { useLogOutUserMutation } from "@/redux/apis/authApis";
import { removeFromLocalStorage } from "@/helpers/local-storage";
import { localDBKey } from "@/constants/localDBKey";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import { FiLogOut } from "react-icons/fi";

export default function Logout() {
  const [userLogOut, logOutResult] = useLogOutUserMutation();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You will be logged out of your session.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Logout",
        cancelButtonText: "Cancel",
        buttonsStyling: false,
        allowOutsideClick: () => !Swal.isLoading(),
        allowEscapeKey: () => !Swal.isLoading(),
        showLoaderOnConfirm: true,
        customClass: {
          popup:
            "bg-base-100 text-base-300 border border-primary/20 rounded-2xl p-6 shadow-2xl",
          title: "text-base-300 font-bold text-xl",
          htmlContainer: "text-base-200 text-sm mt-2",
          confirmButton:
            "px-6 py-2.5 mx-2 rounded-md bg-red-500 text-white font-bold hover:brightness-110 transition-all cursor-pointer",
          cancelButton:
            "px-6 py-2.5 mx-2 rounded-md border border-base-200 text-base-300 font-semibold bg-transparent cursor-pointer text-black",
        },
        preConfirm: async () => {
          try {
            const res = await userLogOut().unwrap();
            return res;
          } catch (err) {
            Swal.showValidationMessage(
              err?.data?.message || "Logout failed. Please try again.",
            );
            return false;
          }
        },
      });

      if (result.isConfirmed && result.value?.success) {
        // Clear token from storage
        removeFromLocalStorage(localDBKey.token);
        removeFromLocalStorage(localDBKey.authKey);

        // NAVIGATE TO LOGIN PAGE
        router.push("/login");
      }
    } catch (err) {
      errorHandler({ err });
    }
  };

  return (
    <button
      type="button"
      disabled={logOutResult.isLoading}
      onClick={handleLogout}
      className="w-full px-3.5 py-2.5 text-sm font-semibold rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 border border-red-500/20 flex items-center gap-2.5 transition-all cursor-pointer"
    >
      <FiLogOut className="text-base" />
      <span>Logout</span>
    </button>
  );
}
