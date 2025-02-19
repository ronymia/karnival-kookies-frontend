import React, { createContext } from "react";

const PopupBottomContext = createContext(null);

export default function PopupBottomProvider({ children }) {
  return (
    <PopupBottomContext.Provider value={null}>
      {children}
    </PopupBottomContext.Provider>
  );
}
