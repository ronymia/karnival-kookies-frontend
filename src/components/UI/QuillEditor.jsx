import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Import Quill's CSS for styling
import { useState } from "react";

// Dynamically import react-quill to prevent SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const QuillEditor = ({
  value,
  onChange,
  id,
  name,
  label,
  quillClassName,
  wrapperClassName,
  placeholder,
  disable,
  error,
}) => {
  // MODULES
  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
      ["clean"], // Remove formatting button
    ],
  };

  // FORMATS
  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "image",
    "video",
  ];

  /* ====================================
  
  ===============================================*/
  return (
    <div className={`flex flex-col gap-2 mb-20 ${wrapperClassName}`}>
      {/* LABEL */}
      <label htmlFor="" className="text-sm font-medium text-base-300">
        {label}
      </label>

      {/* EDITOR */}
      <ReactQuill
        id={id}
        // defaultValue={}
        placeholder={placeholder}
        value={value}
        modules={modules}
        formats={formats}
        onChange={onChange}
        theme="snow"
        className={`h-96 w-full text-base-300 placeholder:text-white ${quillClassName}`}
      />

      {/* ERROR MESSAGE */}
      {!!error && <p className="text-red-500 text-xs font-medium">{error}</p>}
    </div>
  );
};

export default QuillEditor;
