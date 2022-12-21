import NextAuthClient from "../client/next-auth";
import nextAuthConfiguration from "../config/next-auth";
import ProfilePersistenceClient from "../profile/profile.persistence.client.class";
import createRoutes from "../routes/next-auth";
import authVendor from "../vendor";

describe("authVendor", () => {
  it("should be configured with the correct properties", () => {
    expect(authVendor.config).toBe(nextAuthConfiguration);
    expect(authVendor.Client).toBe(NextAuthClient);
    expect(JSON.stringify(authVendor.ApiRoutes)).toStrictEqual(
      JSON.stringify(createRoutes(ProfilePersistenceClient))
    );
  });
});
