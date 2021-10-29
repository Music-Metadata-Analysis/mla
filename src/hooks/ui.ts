import { useContext } from "react";
import { UserInterfaceImagesContext } from "../providers/ui/ui.images/ui.images.provider";
import { UserInterfacePopUpsContext } from "../providers/ui/ui.popups/ui.popups.provider";
import type { PopUpNameType } from "../types/ui/popups/ui.popups.state.types";

const useUserInterface = () => {
  const images = useContext(UserInterfaceImagesContext);
  const popups = useContext(UserInterfacePopUpsContext);

  const hidePopUp = (popup: PopUpNameType) => {
    popups.dispatch({ type: "HidePopUp", name: popup });
  };

  const showPopUp = (popup: PopUpNameType) => {
    popups.dispatch({ type: "ShowPopUp", name: popup });
  };

  return {
    popups: {
      close: (popup: PopUpNameType) => hidePopUp(popup),
      open: (popup: PopUpNameType) => showPopUp(popup),
      status: (popup: PopUpNameType) => popups.status[popup].status,
    },
    images: {
      count: images.loadedCount,
      load: () => images.setLoadedCount((prevState) => prevState + 1),
      reset: () => images.setLoadedCount(0),
    },
  };
};

export default useUserInterface;
