import useChakraColour from "./web/colour.hook/chakra";
import useChakraColourMode from "./web/colour.mode.hook/chakra";
import chakraConfiguration from "./web/config/chakra";
import useChakraPopUp from "./web/create.popup.hook/chakra";
import useChakraForm from "./web/form.hook/chakra";
import usePopUpsController from "./web/popups/controller/popups.controller.hook";
import PopUpsControllerProvider, {
  PopUpsControllerContext,
} from "./web/popups/provider/popups.provider";
import ChakraProvider from "./web/provider/chakra/chakra";
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
    Context: PopUpsControllerContext,
    Provider: PopUpsControllerProvider,
  },
};
