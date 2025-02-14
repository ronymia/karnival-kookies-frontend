import { useEffect, useRef } from "react";

export default function useClickOutside(callbackFn) {
  const ref = useRef(null);
  // Close the options list when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callbackFn?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callbackFn]);

  //
  return ref;
}
