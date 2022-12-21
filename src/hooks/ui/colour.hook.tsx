import uiFrameworkVendor from "@src/clients/ui.framework/vendor";
import type { UIVendorColourHookType } from "@src/types/clients/ui.framework/vendor.types";

const useColour = (): UIVendorColourHookType => {
  const colourHook = uiFrameworkVendor.colourHook();
  return colourHook;
};

export default useColour;

export type ColourHookType = ReturnType<typeof useColour>;
