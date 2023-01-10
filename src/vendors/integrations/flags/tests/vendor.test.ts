import useFlagSmith from "../hooks/flagsmith";
import FlagSmithProvider from "../providers/flagsmith";
import { flagVendor } from "../vendor";

describe("flagVendor", () => {
  it("should be configured with the correct properties", () => {
    expect(flagVendor.hook).toBe(useFlagSmith);
    expect(flagVendor.Provider).toBe(FlagSmithProvider);
  });
});
