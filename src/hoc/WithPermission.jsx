"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const withPermission = (Component, allowedRoles) => {
  const WrappedComponent = (props) => {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!user || !allowedRoles.includes(user.role)) {
        router.push("/login");
      }
    }, [user, router]);

    if (!user || !allowedRoles.includes(user.role)) {
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
