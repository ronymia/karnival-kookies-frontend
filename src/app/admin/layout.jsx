"use client";
import { useSelector } from "react-redux";

export default function AdminLayout({ children }) {
  const { user } = useSelector((state) => state.auth);

  // if (!user) {
  //   return <div>Loading...</div>;
  // }

  return children;
}
