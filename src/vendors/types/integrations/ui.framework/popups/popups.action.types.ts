import type { PopUpComponentNameType } from "./popups.state.types";

export type PopUpsControllerActionType =
  | {
      type: "HidePopUp";
      name: PopUpComponentNameType;
    }
  | {
      type: "RegisterPopUp";
      name: PopUpComponentNameType;
    }
  | {
      type: "ShowPopUp";
      name: PopUpComponentNameType;
    };
