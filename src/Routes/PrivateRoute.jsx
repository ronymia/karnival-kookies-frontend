import { useAuthContext } from "@/Context/ProjectProvider";
import CustomLoading from "@/Shared/CustomLoading";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { isLoading } = useAuthContext(); // Use your context or state for loading
  const router = useRouter();

  // Handle loading state
  if (isLoading) {
    return <CustomLoading />; // Show a loading spinner while resolving authentication
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    router.push("/login");
    return null; // Avoid rendering children during redirection
  }

  // Render the protected component
  return children;
};

export default PrivateRoute;
