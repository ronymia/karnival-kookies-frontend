import React from "react";

export default function loading() {
  return (
    <div
      className={`h-[50vh] sm:h-[90vh] w-full flex justify-center items-center`}
    >
      <span className="loading loading-spinner text-base-300 loading-lg"></span>
    </div>
  );
}
