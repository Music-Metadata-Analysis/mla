import { uiFrameworkVendor } from "@src/vendors/integrations/ui.framework/vendor";
import type { UIVendorColourHookType } from "@src/vendors/types/integrations/ui.framework/vendor.types";

const useColour = (): UIVendorColourHookType => {
  const colourHook = uiFrameworkVendor.core.colourHook();
  return colourHook;
};

export default useColour;

export type ColourHookType = ReturnType<typeof useColour>;
