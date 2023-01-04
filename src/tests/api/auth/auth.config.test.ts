import exports from "@fixtures/api/mock.api.exports";
import AuthVendorRoutes from "@src/pages/api/auth/[...nextauth]";

describe("AuthVendorRoutes", () => {
  it("should export the correct object", () => {
    expect(AuthVendorRoutes).toBe(exports.authVendor.ApiRoutes);
  });
});
