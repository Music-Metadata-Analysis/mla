import useChakraColourMode from "./colour.mode.hook/chakra";
import useChakraPopUp from "./create.popup.hook/chakra";
import useChakraForm from "./form.hook/chakra";
import type { UIFrameworkVendor } from "@src/types/clients/ui.framework/vendor.types";

const uiFrameworkVendor: UIFrameworkVendor = {
  colourModeHook: useChakraColourMode,
  createPopUpHook: useChakraPopUp,
  formHook: useChakraForm,
};

export default uiFrameworkVendor;
