import NextAuthSSR from "../ssr/next-auth";
import { authVendorSSR } from "../vendor.ssr";

describe("authVendorSSR", () => {
  it("should be configured with the correct properties", () => {
    expect(authVendorSSR.Client).toBe(NextAuthSSR);
  });
});
