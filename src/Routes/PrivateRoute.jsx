import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
  // USER FROM REDUX STORE
  const { isAuthenticated } = useSelector((state) => state.auth);
  const router = useRouter();

  if (!isAuthenticated) {
    return router.push("/login");
  }
  return children;
};

export default PrivateRoute;
