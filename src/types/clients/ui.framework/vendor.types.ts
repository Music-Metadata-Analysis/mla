export type ColourModeType = "light" | "dark";

interface ColourModeHookInterface {
  colourMode: ColourModeType;
  toggle: () => void;
}

export interface UIFrameworkVendor {
  colourModeHook: () => ColourModeHookInterface;
}
