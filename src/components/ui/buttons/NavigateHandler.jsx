"use client";

import PropTypes from "prop-types";
import { useRouter } from "next/navigation";
import Button from "./Button";

const NavigateHandler = ({ text, route }) => {
  const router = useRouter();
  return (
    <Button
      text={text}
      buttonClass="px-10 py-5"
      handler={() => router.push(route)}
    />
  );
};

/* <------------------------ PROP TYPES --------------------------> */

NavigateHandler.propTypes = {
  text: PropTypes.string,
  route: PropTypes.string,
};

export default NavigateHandler;
