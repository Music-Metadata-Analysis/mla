export type VendorColourModeType = "light" | "dark";

interface VendorColourModeHookInterface {
  colourMode: VendorColourModeType;
  toggle: () => void;
}

export interface UIFrameworkVendor {
  colourModeHook: () => VendorColourModeHookInterface;
}
