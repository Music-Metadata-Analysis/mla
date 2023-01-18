import NextAuthClient from "../backend/client/next-auth";
import nextAuthConfiguration from "../backend/config/next-auth";
import ProfilePersistenceClient from "../backend/profile/profile.persistence.client.class";
import createRoutes from "../backend/routes/next-auth";
import { authVendorBackend } from "../vendor.backend";

describe("authVendorBackend", () => {
  it("should be configured with the correct properties", () => {
    expect(authVendorBackend.config).toBe(nextAuthConfiguration);
    expect(authVendorBackend.Client).toBe(NextAuthClient);
    expect(JSON.stringify(authVendorBackend.ApiRoutes)).toStrictEqual(
      JSON.stringify(createRoutes(ProfilePersistenceClient))
    );
  });
});
