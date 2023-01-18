import nextUtilities from "../ssr/utils/next";
import { webFrameworkVendorSSR } from "../vendor.ssr";

describe("webFrameworkVendorSSR", () => {
  it("should be configured with the correct properties", () => {
    expect(webFrameworkVendorSSR.utilities).toBe(nextUtilities);
  });
});
