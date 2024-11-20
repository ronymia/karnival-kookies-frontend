"use client";

import { useRouter } from "next/navigation";
import Button from "../Button";

const NavigateHandler = ({ text, route }) => {
  const router = useRouter();
  return (
    <Button
      text={text}
      paddings="px-10 py-5"
      handler={() => router.push(route)}
    />
  );
};

export default NavigateHandler;
