"use client";

import React from "react";
import ReactImageMagnify from "react-image-magnify";

const MagnifyImage = ({ smallSrc, largeSrc, width, height }) => {
  return (
    <>
      <ReactImageMagnify
        {...{
          smallImage: {
            alt: "Zoomable Image",
            isFluidWidth: true,
            src: smallSrc,
          },
          largeImage: {
            src: largeSrc,
            width: 1200,
            height: 1200,
          },
          enlargedImagePosition: "beside", // 'over', 'beside' or 'none'
        }}
      />
    </>
  );
};

export default MagnifyImage;
