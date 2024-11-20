import { useAuthContext } from "@/Context/ProjectProvider";
import CustomLoading from "@/Shared/CustomLoading";
import CustomToaster from "@/Shared/CustomToaster";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const AdminRoute = ({ children }) => {
  const { user, isLoading, isAdmin } = useAuthContext();
  const router = useRouter();

  if (isLoading) {
    return <CustomLoading />; // Replace with your custom loading component here.
  } else {
    if (!user) {
      return router.push("/login");
    }
    if (!isAdmin) {
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
  }
};

export default AdminRoute;
