import { useAuthContext } from "@/Context/ProjectProvider";
import CustomLoading from "@/Shared/CustomLoading";
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
