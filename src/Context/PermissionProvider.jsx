import { useSelector } from "react-redux";
import { useAuth } from "./AuthProvider";
import { redirect } from "next/navigation";

export default function PermissionProvider({ children, allowedRoles }) {
  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useAuth();
  if (!user || !allowedRoles.includes(user.role)) {
    redirect("/login"); // Server-side redirect for App Router
  }
  return children;
}
