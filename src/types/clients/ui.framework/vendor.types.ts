import type {
  VendorColourHookType,
  VendorColourModeType,
  VendorConfigType,
  VendorProviderProps,
} from "@src/clients/ui.framework/vendor.types";
export type {
  VendorColourType,
  VendorColourHookType,
  VendorColourModeType,
  VendorProviderProps,
  VendorStateType,
} from "@src/clients/ui.framework/vendor.types";
import type { PopUpComponentType } from "@src/types/controllers/popups/component.popups.types";
import type { PopUpComponentNameType } from "@src/types/controllers/popups/popups.state.types";

export interface VendorColourModeHookInterface {
  colourMode: VendorColourModeType;
  toggle: () => void;
}

export interface VendorCreatePopUpHookProps {
  name: PopUpComponentNameType;
  message: string;
  component: PopUpComponentType;
}

export interface VendorFormHookInterface {
  error: {
    close: (fieldname: string) => void;
    open: (fieldname: string, message: string) => void;
  };
}

export interface UIFrameworkVendor {
  colourHook: () => VendorColourHookType;
  colourModeHook: () => VendorColourModeHookInterface;
  config: VendorConfigType;
  createPopUpHook: (props: VendorCreatePopUpHookProps) => null;
  formHook: () => VendorFormHookInterface;
  Provider: (props: VendorProviderProps) => JSX.Element;
}
