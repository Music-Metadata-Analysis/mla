import FlagSmithClientSSR from "../ssr/client/flagsmith";
import { flagVendorSSR } from "../vendor.ssr";

describe("flagVendorSSR", () => {
  it("should be configured with the correct properties", () => {
    expect(flagVendorSSR.Client).toBe(FlagSmithClientSSR);
  });
});
