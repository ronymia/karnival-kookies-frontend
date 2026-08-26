"use client";
import { Parallax } from "react-parallax";

const ParallaxComponent = ({ bgImg, children }) => {
  return (
    <Parallax
      blur={{ min: -30, max: 30 }}
      bgImage={bgImg}
      bgImageAlt="the menu"
      strength={200}
      className="object-cover h-[600px] w-full flex flex-col justify-center items-center"
    >
      {children}
    </Parallax>
  );
};

export default ParallaxComponent;
