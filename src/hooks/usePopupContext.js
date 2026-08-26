import { useContext } from "react";
import { ProjectContext } from "@/contexts/ProjectContext";

export const usePopupContext = () => {
  const { popupOption, setPopupOption } = useContext(ProjectContext);
  return { popupOption, setPopupOption };
};

export const useAuthContext = () => {
  return null;
};

export default usePopupContext;
