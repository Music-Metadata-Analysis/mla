import { uiFrameworkVendor } from "@src/vendors/integrations/ui.framework/vendor";

const useColourMode = () => {
  const colourModeHook = uiFrameworkVendor.core.colourModeHook();
  return colourModeHook;
};

export default useColourMode;

export type ColourModeHookType = ReturnType<typeof useColourMode>;
