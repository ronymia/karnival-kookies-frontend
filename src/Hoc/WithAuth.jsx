import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import CustomLoading from "@/components/UI/loader/CustomLoading";
import { useAuthContext } from "@/Context/ProjectProvider";

export default function withAuth(Component) {
  const WrappedComponent = (props) => {
    const { token } = useSelector((state) => state.auth);
    const { isLoading } = useAuthContext();
    const router = useRouter();

    // Handle loading state
    if (isLoading) {
      return <CustomLoading />;
    }

    // If not authenticated, redirect to login
    if (!token) {
      router.push("/login");
      return null;
    }

    // Render the protected component
    return <Component {...props} />;
  };

  return WrappedComponent;
}
