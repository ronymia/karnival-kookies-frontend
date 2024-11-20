"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  IoArrowBackOutline,
  IoArrowForwardOutline,
  IoArrowForwardSharp,
} from "react-icons/io5";

const Slider = ({
  img,
  running,
  borderWidth,
  borderClr,
  dots,
  prevNextBtn,
}) => {
  const [curr, setCurr] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (running) {
        if (curr < img.length - 1) {
          setCurr(curr + 1);
        } else {
          setCurr(0);
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [curr, img, running]);

  const prev = () =>
    setCurr((curr) => (curr === 0 ? img.length - 1 : curr - 1));
  const next = () => setCurr((curr) => (curr < img.length - 1 ? curr + 1 : 0));

  const slideVariants = {
    initial: {
      scale: 0.9,
      opacity: 1,
    },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        delay: 0, // Reduced delay for better responsiveness
        ease: [0.42, 0, 0.58, 1], // Custom easing for a smoother curve (ease-in-out)
      },
    },
    exit: {
      scale: 1.5, // Reduced scale change for a softer exit
      opacity: 0,
      transition: {
        duration: 0.5, // Shorter exit duration for snappy exits
        ease: [0.42, 0, 0.58, 1], // Consistent easing
      },
    },
  };

  return (
    <div className={`space-y-5 relative w-full h-screen overflow-hidden`}>
      <AnimatePresence>
        {/* Wrapping the motion.div in AnimatePresence to handle exit animation */}
        <motion.div
          key={curr}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className=" w-full h-screen flex flex-col justify-center items-center "
          style={{
            backgroundImage: `url(${img[curr]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroondRepeat: "no-repeat",
          }}
        >
          <motion.div
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="text-center text-base-300 flex flex-col items-center justify-center gap-5 w-full h-full bg-base-100 bg-opacity-30"
          >
            <div>
              <h2 className="text-4xl lg:text-6xl ">
                Authors Delicious sweets{" "}
              </h2>
              <h2 className="text-4xl lg:text-6xl text-primary">
                and chocolate
              </h2>
            </div>
            <p className="max-w-[300px]">
              Best Quality Cocoa Cras in laoreet metus, vitae efficitur libero.
              Nam sit amet orci.
            </p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
      {prevNextBtn && (
        <>
          <button
            onClick={prev}
            className="absolute top-1/2 left-2 rounded-full shadow text-4xl hover:text-primary text-base-300 transition-all active:scale-90"
          >
            <IoArrowBackOutline className={`text-[1.7rem]`} />
          </button>

          <button
            onClick={next}
            className="absolute top-1/2 right-2 rounded-full shadow text-4xl hover:text-primary text-base-300 transition-all active:scale-90"
          >
            <IoArrowForwardOutline className={`text-[1.7rem]`} />
          </button>
        </>
      )}
    </div>
  );
};

export default Slider;
