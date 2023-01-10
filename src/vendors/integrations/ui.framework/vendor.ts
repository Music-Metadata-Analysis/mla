import useChakraColour from "./colour.hook/chakra";
import useChakraColourMode from "./colour.mode.hook/chakra";
import chakraConfiguration from "./config/chakra";
import useChakraPopUp from "./create.popup.hook/chakra";
import useChakraForm from "./form.hook/chakra";
import usePopUpsController from "./popups/controller/popups.controller.hook";
import PopUpsControllerProvider from "./popups/provider/popups.provider";
import ChakraProvider from "./provider/chakra/chakra";
import type { UIFrameworkVendorInterface } from "@src/vendors/types/integrations/ui.framework/vendor.types";

export const uiFrameworkVendor: UIFrameworkVendorInterface = {
  core: {
    colourHook: useChakraColour,
    colourModeHook: useChakraColourMode,
    config: chakraConfiguration,
    formHook: useChakraForm,
    Provider: ChakraProvider,
  },
  popups: {
    controllerHook: usePopUpsController,
    creatorHook: useChakraPopUp,
    Provider: PopUpsControllerProvider,
  },
};
