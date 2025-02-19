import { useSelector } from "react-redux";
import CustomLoading from "@/components/UI/loader/CustomLoading";
import { useAuth } from "@/Context/AuthProvider";
import { useRouter } from "next/navigation";

export default function withAuth(Component) {
  const WrappedComponent = (props) => {
    const { user } = useSelector((state) => state.auth);
    const { isLoading } = useAuth();
    const router = useRouter();

    // Handle loading state
    if (isLoading) {
      return <CustomLoading />;
    }

    // If not authenticated, redirect to login
    if (!user) {
      router.push("/login");
      return null;
    }

    // Render the protected component
    return <Component {...props} />;
  };

  return WrappedComponent;
}
