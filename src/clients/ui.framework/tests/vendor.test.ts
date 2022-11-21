import useChakraColourMode from "../colour.mode.hook/chakra";
import uiFrameworkVendor from "../vendor";

describe("uiFrameworkVendor", () => {
  it("should be configured with the correct properties", () => {
    expect(uiFrameworkVendor.colourModeHook).toBe(useChakraColourMode);
  });
});
