"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useLazyGetUserByTokenQuery } from "@/redux/apis/authApis";
import { useSelector } from "react-redux";
import CustomLoading from "@/components/UI/loader/CustomLoading";

// INITIALIZE PROJECT CONTEXT
export const AuthContext = createContext();

//
export default function AuthProvider({ children }) {
  const { token } = useSelector((state) => state.auth);
  const [isUserUpdated, setIsUserUpdated] = useState(Math.random());

  const userRefetch = () => setIsUserUpdated(Math.random());

  const [triggerGetUser, { isLoading }] = useLazyGetUserByTokenQuery();

  // GET CURRENT USER
  useEffect(() => {
    if (token) {
      triggerGetUser(token);
    }
  }, [isUserUpdated, token, triggerGetUser]);

  // PROVIDE VALUE
  const value = { isLoading, userRefetch };

  if (isLoading) {
    return <CustomLoading />;
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// AUTH CONTEXT
export const useAuth = () => {
  const context = useContext(AuthContext);

  return context;
};
