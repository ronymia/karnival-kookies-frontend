"use client";
import { getFullImageLink } from "@/utils/getFullImageLink";
import { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export default function FileViewer({ files, handleClosePopup, testId }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : files.length - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < files.length - 1 ? prevIndex + 1 : 0
    );
  };

  return (
    <div className="p-5 h-full flex flex-col gap-5 relative">
      <div className="relative">
        {/* <=================== TOTAL FILES FOUND ====================> */}
        <h2 className={`text-primary text-lg font-medium`}>
          Total <span className="font-bold text-4xl">{files?.length}</span>{" "}
          {files?.length > 1 ? "files" : "file"} found{" "}
        </h2>

        {/* <=================== FILES ====================> */}
        {files?.map((file, index) => (
          <div
            key={index}
            className={`file-slide ${
              index === currentIndex ? "block" : "hidden"
            }`}
          >
            {file?.endsWith(".pdf") ? (
              <>
                {/* <=================== PDF VIEWER ====================> */}
                <div className=" flex justify-between items-center mb-3 pr-2">
                  <span className="file-name text-primary font-semibold">{`${
                    index + 1
                  }. ${file?.split("/")[file?.split("/")?.length - 1]}`}</span>
                </div>
                <iframe
                  data-testid={`file-viewer-iframe-all-page`}
                  src={
                    file.split("/")[0] === "" ? getFullImageLink(file) : file
                  }
                  className={`w-full h-[550px] md:h-[800px]`}
                />
              </>
            ) : (
              /*  <=================== IMAGE VIEWER ====================> */
              <div className={`h-full`}>
                <div className="flex justify-between items-center mb-3 pr-2">
                  <span className=" text-primary font-semibold">{`${
                    index + 1
                  }. ${file?.split("/")[file?.split("/")?.length - 1]}`}</span>
                </div>
                <img
                  data-testid={`file-viewer-image-all-page`}
                  src={getFullImageLink(file)}
                  alt={file}
                />
              </div>
            )}
          </div>
        ))}

        {/* <=================== NAVIGATION BUTTONS ====================> */}
        {files?.length > 1 && (
          <div className="w-full absolute top-1/3 flex justify-between items-center mt-5">
            <button
              data-testid={`file-viewer-previous-button-all-page`}
              className=" nav-btn prev h-10 w-10 rounded-full btn-primary  flex justify-center items-center"
              onClick={handlePrev}
            >
              <span className={`p-2 rounded-full bg-primary text-base-300`}>
                <IoIosArrowBack className=" text-xl " />{" "}
              </span>
            </button>
            <button
              data-testid={`file-viewer-next-button-all-page`}
              className=" nav-btn next h-10 w-10 rounded-full btn-primary  flex justify-center items-center"
              onClick={handleNext}
            >
              <span className={`p-2 rounded-full bg-primary text-base-300`}>
                <IoIosArrowForward className=" text-xl" />
              </span>
            </button>
          </div>
        )}
      </div>

      {/* <=================== CLOSE BUTTON ====================> */}
      <div
        data-testid={`${testId}_close`}
        className="mt-auto mb-5 flex flex-col md:flex-row w-full justify-center md:justify-end items-center gap-2"
      >
        <button onClick={handleClosePopup} className="btn w-full btn-primary">
          Close
        </button>
      </div>
    </div>
  );
}
