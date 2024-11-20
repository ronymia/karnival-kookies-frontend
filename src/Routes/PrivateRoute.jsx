import { useAuthContext } from "@/Context/ProjectProvider";
import CustomLoading from "@/Shared/CustomLoading";
import { useRouter } from "next/navigation";

const PrivateRoute = ({ children }) => {
  const { user, isLoading } = useAuthContext();
  const router = useRouter();

  if (isLoading) {
    return <CustomLoading />; // Replace with your custom loading component here.
  } else {
    if (!user) {
      return router.push("/login");
    }
    return children;
  }
};

export default PrivateRoute;
