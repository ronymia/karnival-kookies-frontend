"use client";

import { errorHandlerV2 } from "@/helpers/errorHandlerV2";
import { useLogOutUserMutation } from "@/redux/apis/authApis";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function Logout() {
  const [userLogOut, logOutResult] = useLogOutUserMutation();
  const router = useRouter();
  const handleLogout = async () => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Logout!",
      customClass: {
        confirmButton: "bg-primary",
        cancelButton: "bg-error",
      },
    }).then(async (result) => {
      try {
        if (result.isConfirmed) {
          // CALL LOGOUT API
          const res = await userLogOut().unwrap();
          if (res?.success) {
            setIsUserComing(Math.random());
            // NAVIGATE TO LOGIN PAGE
            router.push("/login");
            // Clear storage
            if (typeof window !== "undefined") {
              localStorage.clear();
            }

            // SUCCESS MESSAGE
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Logout successful",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        }
      } catch (err) {
        errorHandlerV2({ err });
      }
    });
  };
  return (
    <button
      type="button"
      onClick={handleLogout}
      className="w-full px-4 py-2 text-sm font-medium bg-primary text-heading-main hover:text-gray-100 hover:bg-gray-700 rounded-md flex items-center justify-start"
    >
      Logout
    </button>
  );
}
