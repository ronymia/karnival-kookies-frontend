"use client";
import PropTypes from "prop-types";
import React from "react";

const FixedBgComponent = ({
  component,
  url = "/chocolate.jpg",
  wrapperClass = "py-40",
}) => {
  return (
    <div
      style={{
        backgroundImage: `url('${url}')`,
        backgroundSize: "200%",
      }}
      className={`bg-fixed bg-center bg-repeat bg-cover `}
    >
      <div className={`bg-base-100/60 ${wrapperClass}`}>
        {component}
      </div>
    </div>
  );
};

// PROPS TYPE DEFINE
FixedBgComponent.propTypes = {
  component: PropTypes.element.isRequired,
  url: PropTypes.string,
  wrapperClass: PropTypes.string,
};

export default FixedBgComponent;
