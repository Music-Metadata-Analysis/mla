import { useContext } from "react";
import { PopUpsControllerContext } from "@src/vendors/integrations/ui.framework/popups/provider/popups.provider";
import type { PopUpComponentNameType } from "@src/vendors/types/integrations/ui.framework/popups/popups.state.types";

const usePopUpsController = (): PopUpsControllerHookType => {
  const popups = useContext(PopUpsControllerContext);

  const isValidPopup = (popup: PopUpComponentNameType): boolean => {
    const exists = Boolean(Object.keys(popups.state).includes(popup));
    if (!exists) {
      console.error(`ERROR: Reference to non-existent PopUp: '${popup}'`);
    }
    return exists;
  };

  const showPopUp = (popup: PopUpComponentNameType) => {
    if (isValidPopup(popup)) {
      popups.dispatch({ type: "ShowPopUp", name: popup });
    }
  };

  return {
    open: (popup: PopUpComponentNameType) => showPopUp(popup),
    status: (popup: PopUpComponentNameType) => {
      if (isValidPopup(popup)) {
        return popups.state[popup].status;
      }
      return false;
    },
  };
};

export default usePopUpsController;

export type PopUpsControllerHookType = {
  open: (popup: PopUpComponentNameType) => void;
  status: (popup: PopUpComponentNameType) => boolean;
};
