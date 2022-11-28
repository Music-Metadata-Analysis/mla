import type { PopUpComponentType } from "@src/types/controllers/popups/component.popups.types";
import type { PopUpComponentNameType } from "@src/types/controllers/popups/popups.state.types";

export type VendorColourModeType = "light" | "dark";

interface VendorColourModeHookInterface {
  colourMode: VendorColourModeType;
  toggle: () => void;
}

export interface VendorFormHookInterface {
  error: {
    close: (fieldname: string) => void;
    open: (fieldname: string, message: string) => void;
  };
}

export interface VendorCreatePopUpHookProps {
  name: PopUpComponentNameType;
  message: string;
  component: PopUpComponentType;
}

export interface UIFrameworkVendor {
  colourModeHook: () => VendorColourModeHookInterface;
  createPopUpHook: (props: VendorCreatePopUpHookProps) => null;
  formHook: () => VendorFormHookInterface;
}
