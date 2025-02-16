import { useSelector } from "react-redux";
import CustomLoading from "@/components/UI/loader/CustomLoading";
import { useAuth } from "@/Context/AuthProvider";
import { useRouter } from "next/navigation";

const withPermission = (Component, allowedRoles) => {
  const WrappedComponent = (props) => {
    const { user } = useSelector((state) => state.auth);
    const { isLoading } = useAuth();
    const router = useRouter();

    if (isLoading) {
      return <CustomLoading />;
    }

    if (!user || !allowedRoles.includes(user.role)) {
      router.push("/login"); // Server-side redirect for App Router
      return null;
    }

    return <Component {...props} />;
  };

  WrappedComponent.displayName = `withPermission(${
    Component.displayName || Component.name
  })`;

  return WrappedComponent;
};

export default withPermission;
