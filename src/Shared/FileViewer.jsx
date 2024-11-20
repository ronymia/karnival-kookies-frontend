"use client";
import { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { getFullImageLink } from "../Utils/getFullImageLink";
import { usePopupContext } from "@/Context/ProjectProvider";

const FileViewer = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { popupOption } = usePopupContext();
  const { files, onClose, fileFolder } = popupOption;
  console.log({ popupOption });

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

  // const handleDownload = async (i) => {
  //   const currentFile = files[i];

  //   try {
  //     const response = await fetch(currentFile);
  //     const blob = await response.blob();
  //     const blobUrl = URL.createObjectURL(blob);

  //     const downloadLink = document.createElement("a");
  //     downloadLink.href = blobUrl;
  //     downloadLink.download = `file_${i + 1}`;
  //     downloadLink.click();
  //   } catch (error) {
  //     console.error("Error downloading file:", error);
  //   }
  // };
  const handleDownload = (fileUrl) => {
    // Extract the file name from the URL
    const fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);

    fetch(fileUrl, {
      method: "GET",
      // mode: "cors",
    })
      .then((response) => response.blob())
      .then((blob) => {
        // Create a link element
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);

        // Append the link to the document
        document.body.appendChild(link);

        // Trigger a click on the link to start the download
        link.click();

        // Remove the link from the document
        document.body.removeChild(link);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    document.body.style.overflow = "hidden"; // Prevent scrolling when the file viewer is open
    return () => {
      document.body.style.overflow = "auto"; // Enable scrolling when the file viewer is closed
    };
  }, []);

  return (
    <div className="file-viewer pb-5">
      <div
        data-auto={`file-viewer-close-all-page`}
        className="overlay"
        onClick={onClose}
      ></div>

      <div className="relative pl-2">
        <h2 className={`pt-5 text-primary text-xl font-bold`}>
          Total {files?.length} {files?.length > 1 ? "files" : "file"} found{" "}
        </h2>
        {files.map((file, index) => (
          <div
            key={index}
            className={`file-slide pt-5 ${
              index === currentIndex ? "block" : "hidden"
            }`}
          >
            {file.endsWith(".pdf") ? (
              <>
                <div className="file-info flex justify-between items-center mb-3 pr-2">
                  <span className="file-name text-primary font-semibold">{`${
                    index + 1
                  }. ${file.split("/")[file.split("/").length - 1]}`}</span>
                </div>
                <iframe
                  data-auto={`file-viewer-iframe-all-page`}
                  src={
                    file.split("/")[0] === "" ? getFullImageLink(file) : file
                  }
                  className={`w-full h-[550px] md:h-[800px]`}
                />
              </>
            ) : (
              <div className={`min-h-[550px] md:min-h-[600px]`}>
                <div className="file-info flex justify-between items-center mb-3 pr-2">
                  <span className="file-name text-primary font-semibold">{`${
                    index + 1
                  }. ${file.split("/")[file.split("/").length - 1]}`}</span>
                </div>
                <img
                  data-auto={`file-viewer-image-all-page`}
                  src={getFullImageLink(file, fileFolder)}
                  alt={`${file.split("/")[file.split("/").length - 1]}`}
                />
              </div>
            )}
          </div>
        ))}
        {files.length > 1 && (
          <div className="w-full absolute top-1/3 flex justify-between items-center mt-5">
            <button
              data-auto={`file-viewer-previous-button-all-page`}
              className=" nav-btn prev h-10 w-10 rounded-full btn-primary  flex justify-center items-center"
              onClick={handlePrev}
            >
              <span className={`p-2 rounded-full bg-primary text-base-300`}>
                <IoIosArrowBack className=" text-xl " />{" "}
              </span>
            </button>
            <button
              data-auto={`file-viewer-next-button-all-page`}
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

      {/* CLOSE BUTTON  */}
      <div
        data-auto={`file-viewer-close-button-all-page`}
        className="flex flex-col md:flex-row w-full justify-center md:justify-end items-center mt-5 gap-2"
      >
        <button onClick={onClose} className="btn w-full btn-primary">
          Close
        </button>
      </div>
    </div>
  );
};

export default FileViewer;
