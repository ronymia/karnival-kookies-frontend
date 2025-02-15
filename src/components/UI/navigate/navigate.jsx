"use client";

import { useRouter } from "next/navigation";

export default function NavigateComponent({ text, route }) {
  const router = useRouter();

  const handleNavigationToHome = () => {
    router.push(route);
  };

  return <button onClick={handleNavigationToHome}>{text}</button>;
}
