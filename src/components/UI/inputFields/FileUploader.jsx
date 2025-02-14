import { getFullImageLink } from "@/Utils/getFullImageLink";
import React, { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { ImFilesEmpty } from "react-icons/im";
import { IoCloudUploadSharp } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import CustomPopup from "../modal/CustomPopup";
import FileViewer from "../modal/FileViewer";

export default function FileUploader({
  id,
  label,
  testId,
  required,
  accept,
  multiple = false,
  wrapperClassName,
  fieldClassName,
  onFileSelect = (event) => event,
  isFileUploading = false,
  onRemove = (event) => event,
  onDrop = (event) => event,
  files = [],
  error,
}) {
  // STATE DECLARATION
  const [dragOver, setDragOver] = useState(false);
  //
  const [popupOption, setPopupOption] = useState({
    open: false,
    type: "",
    title: "",
    data: null,
    closeOnDocumentClick: false,
    overlayStyle: { background: "red" },
    onClose: () => {
      setPopupOption({ ...popupOption, open: false });
    },
  });

  // SET DRAG OVER
  useEffect(() => {
    setDragOver(false);
  }, [files]);

  // HANDLE ON DROP
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFiles = e.dataTransfer.files;
    onDrop(droppedFiles);
  };

  // HANDLE ON CHANGE
  const handleOnChange = (e) => {
    onFileSelect(e.target.files);
  };

  // HANDLE DRAG OVER
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // HANDLE DRAG LEAVE
  const handleDragLeave = () => {
    setDragOver(false);
  };

  // HANDLE FILE REMOVE
  const handleFileRemove = (file) => {
    onRemove(file);
  };

  // HANDLE VIEW FILES
  const handleViewFiles = (files) => {
    setPopupOption((prev) => ({
      ...prev,
      open: true,
      type: "view",
      title: "View Files",
      data: files,
    }));
  };

  return (
    <>
      <CustomPopup
        popupOption={popupOption}
        setPopupOption={setPopupOption}
        Component={
          <>
            {popupOption?.type === "view" && (
              <FileViewer
                files={popupOption?.data}
                handleClosePopup={() => {
                  setPopupOption((prev) => ({
                    ...prev,
                    open: false,
                    type: "",
                    title: "",
                    data: null,
                  }));
                }}
              />
            )}
          </>
        }
      />

      <div
        data-testid={`${testId}_container`}
        className={`${wrapperClassName} flex flex-col justify-start gap-y-2`}
      >
        {/* LABEL */}
        {label && (
          <label
            htmlFor={id}
            data-testid={`${testId}_label`}
            className={`label-text text-md font-bold`}
          >
            {label}{" "}
            {required && (
              <span className="text-error font-bold text-md">*</span>
            )}
          </label>
        )}

        {/* <==================== HEADER =====================> */}
        <div
          className={`border rounded-lg ${
            error ? "border-error" : "border-primary-content"
          }`}
        >
          <div className="px-5 py-2 flex items-star md:items-center justify-start gap-2">
            <div className="border rounded-full border-gray-500 h-8 w-8 md:h-10 md:w-10 flex justify-center items-center">
              <ImFilesEmpty className="text-sm text-gray-500" />
            </div>
            <div>
              <h3 className="text-sm md:text-md font-medium text-base-300">
                Upload files
              </h3>
              <h5 className="text-xs md:text-md font-light text-base-300">
                Select and upload the files of your choice
              </h5>
            </div>
          </div>
          <hr className="mb-5" />

          {/* <=================== BODY =====================> */}
          <div className={`relative`}>
            {/* <=================== LOADING =====================> */}
            {isFileUploading && (
              <div
                className={`absolute bg-opacity-70 top-0 left-[1.25rem]  h-full flex gap-2 flex-col justify-center items-center w-[calc(100%-2.5rem)] rounded-xl z-40 bg-primary-content`}
              >
                <span
                  className={`loading loading-spinner text-primary loading-lg`}
                ></span>

                <h1 className={`text-primary `}>Uploading...</h1>
              </div>
            )}

            {/* <=================== MAIN CONTENT =====================> */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`${
                dragOver ? "opacity-70" : "opacity-100"
              } flex flex-col items-center justify-center border-2 border-dashed border-gray-500 rounded-lg py-8 px-5 m-5`}
            >
              {/* <=================== THIS ONE FOR DRAG =====================> */}
              {files?.length === 0 && (
                <label
                  htmlFor="file-input"
                  className="absolute h-full w-full top-0 left-0"
                ></label>
              )}
              {/* <=================== FILE INPUT =====================> */}
              <input
                onChange={handleOnChange}
                multiple={multiple}
                id={`file-input`}
                className="hidden"
                type="file"
                accept={accept}
              />
              {files.length === 0 ? (
                /* <=================== EMPTY STATE =====================> */
                <>
                  <IoCloudUploadSharp className="text-3xl text-base-300" />
                  <span className="text-sm md:text-md font-semibold text-center text-base-300">
                    Choose a file or drag & drop it here
                  </span>
                  <span className="text-xs font-light text-center text-base-300">
                    {`Allowed ${accept} files under 5MB`}
                  </span>
                  <label
                    htmlFor="file-input"
                    disabled
                    className=" border mt-5 opacity-50 px-2 md:px-10 py-1 md:py-2 rounded-md border-gray-500 text-base-300"
                  >
                    Browse File
                  </label>
                </>
              ) : (
                /* <=================== NOT EMPTY STATE =====================> */
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 h-auto">
                  {files?.map((file) => (
                    <div key={file} className="flex flex-col items-center">
                      <div
                        key={file}
                        className="relative w-[200px] sm:w-[100px] h-[200px] sm:h-[100px] shadow-md rounded-xl  group flex justify-center items-center"
                      >
                        {file !== "" && (
                          <div onClick={() => handleViewFiles([file])}>
                            {file?.file?.endsWith(".png") ||
                            file?.file?.endsWith(".jpg") ||
                            file?.file?.endsWith(".jpeg") ||
                            file?.file?.endsWith(".JPEG") ||
                            file?.file?.endsWith(".JPG") ? (
                              <img
                                src={getFullImageLink(file)}
                                alt={file}
                                className="h-full w-full duration-200 absolute top-0 cursor-pointer  rounded-xl  right-0 object-cover group-hover:opacity-20"
                              />
                            ) : (
                              <div className="h-full w-full duration-200 absolute top-0 cursor-pointer  rounded-xl  right-0 object-cover group-hover:opacity-20 flex justify-center items-center">
                                <img
                                  src={getFullImageLink(file)}
                                  alt={file}
                                  className="h-full w-full duration-200 absolute top-0 cursor-pointer  rounded-xl  right-0 object-cover group-hover:opacity-20"
                                />
                              </div>
                            )}
                          </div>
                        )}
                        {/* <=================== REMOVE BUTTON =====================> */}
                        <button
                          className="absolute -top-2 hover:scale-125 duration-200 -right-2 flex justify-center items-center bg-error w-7 h-7 rounded-full overflow-hidden shadow-md"
                          onClick={() => handleFileRemove(file)}
                        >
                          <RxCross2 className="text-base-300" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* <=================== ADD MORE =====================> */}
                  {multiple && (
                    <label
                      data-tip="Add more"
                      htmlFor="file-input"
                      className="flex flex-col items-center tooltip tooltip-right tooltip-primary"
                    >
                      <div className="w-[200px] sm:w-[100px] h-[200px] sm:h-[100px] bg-base-300  shadow-md rounded-xl border-2 border-dashed   group flex justify-center items-center  hover:border-primary cursor-pointer text-gray-500 hover:text-primary">
                        <FiPlus className="text-5xl md:text-3xl" />
                      </div>
                    </label>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* <==================== ERROR MESSAGE =====================> */}
        {error && (
          <p
            data-testid={`${testId}_error_message`}
            id={`${id}-error`} // ID to link with input field's aria-describedby
            role="alert"
            aria-label="error message"
            aria-live="assertive" // Ensures screen readers announce the message immediately
            aria-atomic="true" // Ensures the whole message is read out
            className="text-xs text-red-500"
          >
            {error}
          </p>
        )}
      </div>
    </>
  );
}
