"use client";

import { useAuth } from "@/hooks/useAuth";
import { redirect } from "next/navigation";

export default function PermissionProvider({ children, allowedRoles }) {
  const { user } = useAuth();
  if (!user || !allowedRoles.includes(user?.role)) {
    redirect("/login");
  }
  return children;
}
