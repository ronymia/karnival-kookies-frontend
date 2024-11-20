"use client";

import React, { useEffect } from "react";
import { toast } from "react-hot-toast";

export default function CustomToaster({
  t,
  type,
  text,
  errors = {},
  pageId = "",
}) {
  console.log({ errors });
  useEffect(() => {
    const timeOut = setTimeout(() => {
      toast.dismiss(t.id);
    }, [2000]);

    return () => clearTimeout(timeOut);
  }, []);

  return (
    <div
      className={`${
        type === "error" && "border-red-600 bg-red-500  hover:border-red-500"
      } ${
        type === "success" &&
        "border-green-600 bg-green-500  hover:border-green-500"
      } ${
        type === "info" &&
        "border-indigo-600 bg-indigo-500 hover:border-indigo-500"
      } ${
        t.visible ? "animate-enter" : "animate-leave"
      } border max-w-md w-full duration-300 bg-base-100 shadow-md rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <div className="flex-1 w-0 p-3">
        <div className="flex items-start">
          <div className="ml-3 flex-1">
            {/* {type === "error" && (
              <p className="text-sm font-medium text-red-600">Error</p>
            )} */}
            {type === "success" && (
              <p className="text-sm font-medium text-white">Done</p>
            )}
            {type === "info" && (
              <p className="text-sm font-medium text-white ">Tips</p>
            )}
            <div className="mt-1 text-sm text-white">
              {type !== "error" ? (
                <>
                  {pageId ? `${pageId} - ` : ""}
                  {text}
                </>
              ) : (
                <>
                  {Object.keys(errors).length > 0 ? (
                    <>
                      <h5 className="font-semibold text-white">
                        {pageId ? `${pageId} - ` : ""}Unfortunately you have
                        some errors
                      </h5>
                      <ul className="list-decimal ml-5 text-white">{text}</ul>
                      <ul className="list-decimal ml-5 text-white">
                        {Object.keys(errors).map((field) =>
                          errors[field].map((errorMessage, index) => (
                            <li key={`${field}-${index}`}>{errorMessage}</li>
                          ))
                        )}
                      </ul>
                    </>
                  ) : (
                    <>
                      <h5 className="font-semibold">
                        Unfortunately you have some errors
                      </h5>
                      <ul className="list-decimal ml-5 text-white">{text}</ul>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* <div
        className={`flex border-l ${
          type === "error" && "border-red-600 hover:border-red-500"
        } ${type === "success" && "border-green-600 hover:border-green-500"} ${
          type === "info" && "border-indigo-600 hover:border-indigo-500"
        }`}
      >
        <button
          onClick={() => toast.dismiss(t.id)}
          className={`w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium ${
            type === "error" && "text-red-600 hover:text-red-500"
          } ${type === "success" && "text-green-600 hover:text-green-500"} ${
            type === "info" && "text-indigo-600 hover:text-indigo-500"
          } focus:outline-none`}
        >
          Close
        </button>
      </div>*/}
    </div>
  );
}
