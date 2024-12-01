import { useAuthContext } from "@/Context/ProjectProvider";
import CustomLoading from "@/Shared/CustomLoading";
import CustomToaster from "@/Shared/CustomToaster";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const AdminRoute = ({ children }) => {
  // USER FROM REDUX STORE
  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useAuthContext(); // Use your context or state for loading
  const router = useRouter();

  // Handle loading state
  if (isLoading) {
    return <CustomLoading />; // Show a loading spinner while resolving authentication
  }

  if (!user) {
    return router.push("/login");
  }
  if (user?.role !== "admin") {
    toast.custom((t) => (
      <CustomToaster
        t={t}
        type={"error"}
        text={`Only admin can access this route`}
      />
    ));
    return router.push("/");
  }
  return children;
};

export default AdminRoute;
