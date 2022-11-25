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

export interface UIFrameworkVendor {
  colourModeHook: () => VendorColourModeHookInterface;
  formHook: () => VendorFormHookInterface;
}
