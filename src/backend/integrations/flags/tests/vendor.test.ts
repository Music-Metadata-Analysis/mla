import FlagSmithClient from "../client/flagsmith.client.class";
import flagVendor from "../vendor";

describe("flagVendor", () => {
  it("should be configured with the correct properties", () => {
    expect(flagVendor.Client).toBe(FlagSmithClient);
  });
});
