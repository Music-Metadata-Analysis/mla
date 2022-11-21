import uiFrameworkVendor from "@src/clients/ui.framework/vendor";

const useColourMode = () => {
  const colourModeHook = uiFrameworkVendor.colourModeHook();
  return colourModeHook;
};

export default useColourMode;

export type ColourModeHookType = ReturnType<typeof useColourMode>;
