import NextAuthClient from "../client/next-auth.client.class";
import ProfilePersistanceClient from "../profile/profile.persistance.client.class";
import createRoutes from "../routes/next-auth.api.routes";
import authVendor from "../vendor";

describe("authVendor", () => {
  it("should be configured with the correct properties", () => {
    expect(authVendor.Client).toBe(NextAuthClient);
    expect(JSON.stringify(authVendor.ApiRoutes)).toStrictEqual(
      JSON.stringify(createRoutes(ProfilePersistanceClient))
    );
  });
});
