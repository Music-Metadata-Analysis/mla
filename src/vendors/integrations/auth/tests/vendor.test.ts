import useNextAuth from "../hooks/next-auth";
import NextAuthProvider from "../providers/next-auth";
import { authVendor } from "../vendor";

describe("authVendor", () => {
  it("should be configured with the correct properties", () => {
    expect(authVendor.hook).toBe(useNextAuth);
    expect(authVendor.Provider).toBe(NextAuthProvider);
  });
});
