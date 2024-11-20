"use client";

import { useRouter } from "next/navigation";

const NavigateComponent = ({ text, route }) => {
  const router = useRouter();

  const handleNavigationToHome = () => {
    router.push(route);
  };

  return <button onClick={handleNavigationToHome}>{text}</button>;
};

export default NavigateComponent;
