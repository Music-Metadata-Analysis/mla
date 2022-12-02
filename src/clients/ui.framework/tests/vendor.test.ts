import useChakraColourMode from "../colour.mode.hook/chakra";
import chakraConfiguration from "../config/chakra";
import useChakraPopUp from "../create.popup.hook/chakra";
import useChakraForm from "../form.hook/chakra";
import ChakraProvider from "../provider/chakra/chakra";
import uiFrameworkVendor from "../vendor";

jest.mock("../provider/chakra/chakra", () =>
  require("@fixtures/react/parent").createComponent("ChakraProvider")
);

describe("uiFrameworkVendor", () => {
  it("should be configured with the correct properties", () => {
    expect(uiFrameworkVendor.colourModeHook).toBe(useChakraColourMode);
    expect(uiFrameworkVendor.config).toBe(chakraConfiguration);
    expect(uiFrameworkVendor.createPopUpHook).toBe(useChakraPopUp);
    expect(uiFrameworkVendor.formHook).toBe(useChakraForm);
    expect(ChakraProvider).toBe(ChakraProvider);
  });
});
