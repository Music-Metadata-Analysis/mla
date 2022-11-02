import { useContext } from "react";
import { PopUpsControllerContext } from "@src/providers/controllers/popups/popups.provider";
import type { PopUpComponentNameType } from "@src/types/controllers/popups/popups.state.types";

const usePopUps = () => {
  const popups = useContext(PopUpsControllerContext);

  const hidePopUp = (popup: PopUpComponentNameType) => {
    popups.dispatch({ type: "HidePopUp", name: popup });
  };

  const showPopUp = (popup: PopUpComponentNameType) => {
    popups.dispatch({ type: "ShowPopUp", name: popup });
  };

  return {
    close: (popup: PopUpComponentNameType) => hidePopUp(popup),
    open: (popup: PopUpComponentNameType) => showPopUp(popup),
    status: (popup: PopUpComponentNameType) => popups.status[popup].status,
  };
};

export default usePopUps;
