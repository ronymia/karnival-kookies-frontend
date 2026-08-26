"use client";

import { useEffect, useState } from "react";
import { useLazyGetUserByTokenQuery } from "@/redux/apis/authApis";
import { useSelector } from "react-redux";
import CustomLoading from "@/components/ui/loader/CustomLoading";
import { AuthContext } from "@/contexts/AuthContext";

export default function AuthProvider({ children }) {
  const { token } = useSelector((state) => state.auth);
  const [isUserUpdated, setIsUserUpdated] = useState(0);

  const userRefetch = () => setIsUserUpdated((prev) => prev + 1);

  const [triggerGetUser, { isLoading }] = useLazyGetUserByTokenQuery();

  useEffect(() => {
    if (token) {
      triggerGetUser(token);
    }
  }, [isUserUpdated, token, triggerGetUser]);

  const value = { isLoading, userRefetch };

  if (isLoading) {
    return <CustomLoading />;
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
