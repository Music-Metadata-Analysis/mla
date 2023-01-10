import useChakraColour from "../colour.hook/chakra";
import useChakraColourMode from "../colour.mode.hook/chakra";
import chakraConfiguration from "../config/chakra";
import useChakraPopUp from "../create.popup.hook/chakra";
import useChakraForm from "../form.hook/chakra";
import usePopUpsController from "../popups/controller/popups.controller.hook";
import PopUpsControllerProvider from "../popups/provider/popups.provider";
import ChakraProvider from "../provider/chakra/chakra";
import { uiFrameworkVendor } from "../vendor";

jest.mock("../provider/chakra/chakra", () =>
  require("@fixtures/react/parent").createComponent("ChakraProvider")
);

describe("uiFrameworkVendor", () => {
  it("should be configured with the correct properties", () => {
    expect(uiFrameworkVendor.core.colourHook).toBe(useChakraColour);
    expect(uiFrameworkVendor.core.colourModeHook).toBe(useChakraColourMode);
    expect(uiFrameworkVendor.core.config).toBe(chakraConfiguration);
    expect(uiFrameworkVendor.core.formHook).toBe(useChakraForm);
    expect(uiFrameworkVendor.core.Provider).toBe(ChakraProvider);
    expect(uiFrameworkVendor.popups.creatorHook).toBe(useChakraPopUp);
    expect(uiFrameworkVendor.popups.Provider).toBe(PopUpsControllerProvider);
    expect(uiFrameworkVendor.popups.controllerHook).toBe(usePopUpsController);

    expect(Object.keys(uiFrameworkVendor.core).length).toBe(5);
    expect(Object.keys(uiFrameworkVendor.popups).length).toBe(3);
  });
});
