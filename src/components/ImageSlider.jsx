"use client";

import { getFullImageLink } from "@/Utils/getFullImageLink";
import { useState } from "react";

/**
 * Component for rendering a slider of images.
 *
 * @property {string[]} images - Array of image URLs.
 */

export default function ImageSlider({ images }) {
  const [imageIndex, setImageIndex] = useState(null);
  console.log({ images });

  /* direction
   * {left}
   * right
   */
  const changeSlide = (direction) => {
    if (direction === "left") {
      setImageIndex(imageIndex === 0 ? images.length - 1 : (prev) => prev - 1);
    } else {
      setImageIndex(imageIndex === images.length - 1 ? 0 : (prev) => prev + 1);
    }
  };

  console.log(getFullImageLink(images[0], "Products"));

  /* ****************************************
  
  ************************************************/
  return (
    <section className="flex flex-col items-center gap-4 p-4">
      {/* Fullscreen Slider */}
      {imageIndex !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
          {/* Left Arrow */}
          <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 rounded-full p-2 hover:bg-gray-600"
            onClick={() => changeSlide("left")}
          >
            {/* <img
              src="/arrow.png"
              alt="Previous"
              className="w-6 h-6 rotate-180"
            /> */}
            Previous
          </button>

          {/* Image */}
          <div className="relative w-3/4 max-w-4xl">
            <img
              src={getFullImageLink(images[imageIndex], "Products")}
              alt={`Slide ${imageIndex + 1}`}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Right Arrow */}
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 rounded-full p-2 hover:bg-gray-600"
            onClick={() => changeSlide("right")}
          >
            {/* <img src="/arrow.png" alt="Next" className="w-6 h-6" /> */}
            Next
          </button>

          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-white text-2xl font-bold p-2"
            onClick={() => setImageIndex(null)}
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Slider */}
      <div className="w-full max-w-2xl">
        <img
          src={getFullImageLink(images[0], "Products")}
          alt="Main Slide"
          className="w-full h-auto rounded-lg cursor-pointer shadow-lg"
          onClick={() => setImageIndex(0)}
        />
      </div>

      {/* Thumbnail Slider */}
      <div className="flex gap-2 overflow-x-auto w-full max-w-2xl py-2">
        {images.slice(1).map((image, index) => (
          <img
            key={index}
            // {console.log(first)}
            src={getFullImageLink(image, "Products")}
            alt={`Thumbnail ${index + 1}`}
            className="w-20 h-20 object-cover rounded-lg cursor-pointer shadow-md hover:scale-105 transition-transform"
            onClick={() => setImageIndex(index + 1)}
          />
        ))}
      </div>
    </section>
  );
}
