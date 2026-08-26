"use client";

import { useEffect, useRef } from "react";
import "quill/dist/quill.snow.css";

const QuillEditor = ({
  value,
  onChange,
  id,
  label,
  quillClassName,
  wrapperClassName,
  placeholder,
  error,
  required,
  testId,
}) => {
  const containerRef = useRef(null);
  const quillRef = useRef(null);
  const isInternalChange = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current || quillRef.current) return;

    let isMounted = true;

    import("quill").then(({ default: Quill }) => {
      if (!isMounted || !containerRef.current || quillRef.current) return;

      const editorContainer = document.createElement("div");
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(editorContainer);

      const quill = new Quill(editorContainer, {
        theme: "snow",
        placeholder: placeholder || "",
        modules: {
          toolbar: [
            [{ header: "1" }, { header: "2" }, { font: [] }],
            [{ size: [] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image", "video"],
            ["clean"],
          ],
        },
      });

      if (value) {
        quill.root.innerHTML = value;
      }

      quill.on("text-change", () => {
        isInternalChange.current = true;
        const html = quill.root.innerHTML === "<p><br></p>" ? "" : quill.root.innerHTML;
        if (onChange) {
          onChange(html);
        }
        setTimeout(() => {
          isInternalChange.current = false;
        }, 0);
      });

      quillRef.current = quill;
    }).catch((err) => {
      console.error("Error loading Quill:", err);
    });

    return () => {
      isMounted = false;
      quillRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (quillRef.current && !isInternalChange.current) {
      const currentHTML = quillRef.current.root.innerHTML;
      if (value !== undefined && value !== currentHTML) {
        quillRef.current.root.innerHTML = value || "";
      }
    }
  }, [value]);

  return (
    <div className={`flex flex-col gap-2 mb-20 ${wrapperClassName || ""}`}>
      {label && (
        <label
          htmlFor={id}
          data-testid={`${testId}_label`}
          className="label-text text-md font-bold"
        >
          {label}{" "}
          {required && <span className="text-error font-bold text-md">*</span>}
        </label>
      )}

      <div
        id={id}
        ref={containerRef}
        className={`h-96 w-full text-base-300 ${quillClassName || ""}`}
      />

      {!!error && <p className="text-red-500 text-xs font-medium">{error}</p>}
    </div>
  );
};

export default QuillEditor;
