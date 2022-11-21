import useChakraColourMode from "./colour.mode.hook/chakra";
import type { UIFrameworkVendor } from "@src/types/clients/ui.framework/vendor.types";

const uiFrameworkVendor: UIFrameworkVendor = {
  colourModeHook: useChakraColourMode,
};

export default uiFrameworkVendor;
