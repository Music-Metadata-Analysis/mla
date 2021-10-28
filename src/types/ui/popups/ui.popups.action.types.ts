import type { PopUpNameType } from "./ui.popups.state.types";

export type UserInterfacePopUpsActionType =
  | {
      type: "ShowPopUp";
      name: PopUpNameType;
    }
  | {
      type: "HidePopUp";
      name: PopUpNameType;
    };
