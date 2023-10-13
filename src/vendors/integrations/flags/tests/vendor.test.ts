import { flagVendor } from "../vendor";
import useFlagSmith from "../web/hooks/flagsmith";
import FlagSmithProvider from "../web/providers/flagsmith";

describe("flagVendor", () => {
  it("should be configured with the correct properties", () => {
    expect(flagVendor.hook).toBe(useFlagSmith);
    expect(flagVendor.Provider).toBe(FlagSmithProvider);
    expect(Object.keys(flagVendor).length).toBe(2);
  });
});
