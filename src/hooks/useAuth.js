"use client";

import { useSelector } from "react-redux";

export const useAuth = () => {
  const auth = useSelector((state) => state.auth);

  return {
    user: auth?.user || null,
    token: auth?.token || null,
    isAuthenticated: !!auth?.user && !!auth?.isAuthenticated,
    isAdmin: auth?.isAdmin || auth?.user?.role === "admin",
    isCustomer: auth?.user?.role === "customer",
    permissions: auth?.permissions || [],
    isLoading: false,
  };
};

export default useAuth;
