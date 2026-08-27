"use client";

import { useAuth } from "@/hooks/useAuth";
import CustomToaster from "@/shared/CustomToaster";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

const AdminRoute = ({ children }) => {
  const { user, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!isAdmin) {
      toast.custom((t) => (
        <CustomToaster
          t={t}
          type="error"
          text="Only admin can access this route"
        />
      ));
      router.push("/");
    }
  }, [user, isAdmin, router]);

  if (!user || !isAdmin) {
    return null;
  }

  return children;
};

export default AdminRoute;
