import uiFrameworkVendor from "@src/clients/ui.framework/vendor";
import type { VendorColourHookType } from "@src/types/clients/ui.framework/vendor.types";

const useColour = (): VendorColourHookType => {
  const colourHook = uiFrameworkVendor.colourHook();
  return colourHook;
};

export default useColour;

export type ColourHookType = ReturnType<typeof useColour>;
