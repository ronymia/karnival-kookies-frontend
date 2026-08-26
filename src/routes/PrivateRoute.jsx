import CustomLoading from "@/components/ui/loader/CustomLoading";
import { useAuthContext } from "@/hooks/usePopupContext";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { isLoading } = useAuthContext();
  const router = useRouter();

  // Handle loading state
  if (isLoading) {
    return <CustomLoading />;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  // Render the protected component
  return children;
};

export default PrivateRoute;
