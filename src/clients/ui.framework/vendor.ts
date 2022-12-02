import useChakraColour from "./colour.hook/chakra";
import useChakraColourMode from "./colour.mode.hook/chakra";
import chakraConfiguration from "./config/chakra";
import useChakraPopUp from "./create.popup.hook/chakra";
import useChakraForm from "./form.hook/chakra";
import ChakraProvider from "./provider/chakra/chakra";
import type { UIFrameworkVendor } from "@src/types/clients/ui.framework/vendor.types";

const uiFrameworkVendor: UIFrameworkVendor = {
  colourHook: useChakraColour,
  colourModeHook: useChakraColourMode,
  config: chakraConfiguration,
  createPopUpHook: useChakraPopUp,
  formHook: useChakraForm,
  Provider: ChakraProvider,
};

export default uiFrameworkVendor;
