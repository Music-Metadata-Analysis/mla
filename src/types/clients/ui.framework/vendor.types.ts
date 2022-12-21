import type {
  VendorColourHookType,
  VendorColourModeType,
  VendorColourType,
  VendorConfigType,
  VendorProviderProps,
  VendorStateType,
} from "@src/clients/ui.framework/vendor.types";
import type { PopUpComponentType } from "@src/types/controllers/popups/component.popups.types";
import type { PopUpComponentNameType } from "@src/types/controllers/popups/popups.state.types";

export type UIVendorColourType = VendorColourType;

export type UIVendorColourHookType = VendorColourHookType;

export interface UIVendorColourModeHookInterface {
  colourMode: VendorColourModeType;
  toggle: () => void;
}

export type UIVendorColourModeType = VendorColourModeType;

export interface UIVendorFormHookInterface {
  error: {
    close: (fieldname: string) => void;
    open: (fieldname: string, message: string) => void;
  };
}

export interface UIVendorCreatePopUpHookInterface {
  name: PopUpComponentNameType;
  message: string;
  component: PopUpComponentType;
}

export type UIVendorProviderComponentProps = VendorProviderProps;

export type UIVendorStateType = VendorStateType;

export interface UIFrameworkVendorInterface {
  colourHook: () => UIVendorColourHookType;
  colourModeHook: () => UIVendorColourModeHookInterface;
  config: VendorConfigType;
  createPopUpHook: (props: UIVendorCreatePopUpHookInterface) => null;
  formHook: () => UIVendorFormHookInterface;
  Provider: (props: UIVendorProviderComponentProps) => JSX.Element;
}
