import { authVendor } from "../vendor";
import useNextAuth from "../web/hooks/next-auth";
import NextAuthProvider from "../web/providers/next-auth";

describe("authVendor", () => {
  it("should be configured with the correct properties", () => {
    expect(authVendor.hook).toBe(useNextAuth);
    expect(authVendor.Provider).toBe(NextAuthProvider);
  });
});
