import { useContext } from "react";
import { ProjectContext } from "@/contexts/ProjectContext";

export const usePopupContext = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("usePopupContext must be used within a ProjectProvider");
  }
  return context;
};

export default usePopupContext;
