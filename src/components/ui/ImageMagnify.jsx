"use client";

import Image from "next/image";

const MagnifyImage = ({ smallSrc, largeSrc, width = 300, height = 300 }) => {
  return (
    <div className="relative overflow-hidden rounded-lg">
      <Image
        src={largeSrc || smallSrc}
        alt="Product Image"
        width={width}
        height={height}
        className="w-full h-auto object-cover"
      />
    </div>
  );
};

export default MagnifyImage;
