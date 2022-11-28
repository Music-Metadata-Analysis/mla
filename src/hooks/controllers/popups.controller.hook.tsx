import { useContext } from "react";
import { PopUpsControllerContext } from "@src/providers/controllers/popups/popups.provider";
import type { PopUpComponentNameType } from "@src/types/controllers/popups/popups.state.types";

const usePopUpsController = () => {
  const popups = useContext(PopUpsControllerContext);

  const showPopUp = (popup: PopUpComponentNameType) => {
    popups.dispatch({ type: "ShowPopUp", name: popup });
  };

  return {
    open: (popup: PopUpComponentNameType) => showPopUp(popup),
    status: (popup: PopUpComponentNameType) => popups.state[popup].status,
  };
};

export default usePopUpsController;

export type PopUpsControllerHookType = ReturnType<typeof usePopUpsController>;
