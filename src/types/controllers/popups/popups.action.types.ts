import type { PopUpComponentNameType } from "./popups.state.types";

export type PopUpsControllerActionType =
  | {
      type: "ShowPopUp";
      name: PopUpComponentNameType;
    }
  | {
      type: "HidePopUp";
      name: PopUpComponentNameType;
    };
