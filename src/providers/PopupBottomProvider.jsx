import React from "react";
import { PopupBottomContext } from "@/contexts/PopupBottomContext";

export default function PopupBottomProvider({ children }) {
  return (
    <PopupBottomContext.Provider value={null}>
      {children}
    </PopupBottomContext.Provider>
  );
}
