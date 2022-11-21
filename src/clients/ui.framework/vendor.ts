import useChakraColourMode from "./colourModeHook/chakra";
import type { UIFrameworkVendor } from "@src/types/clients/ui.framework/vendor.types";

const uiFrameworkVendor: UIFrameworkVendor = {
  colourModeHook: useChakraColourMode,
};

export default uiFrameworkVendor;
