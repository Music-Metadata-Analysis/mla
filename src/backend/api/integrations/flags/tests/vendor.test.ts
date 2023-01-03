import FlagSmithClient from "../client/flagsmith";
import FlagSmithGroup from "../group/flagsmith";
import flagVendor from "../vendor";

describe("flagVendor", () => {
  it("should be configured with the correct properties", () => {
    expect(flagVendor.Client).toBe(FlagSmithClient);
    expect(flagVendor.Group).toBe(FlagSmithGroup);
  });
});
