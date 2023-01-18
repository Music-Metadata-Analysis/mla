import AuthVendorRoutes from "@src/pages/api/auth/[...nextauth]";

jest.mock("@src/vendors/integrations/auth/vendor.backend", () => ({
  authVendorBackend: {
    ApiRoutes: "mockRoutes",
  },
}));

describe("AuthVendorRoutes", () => {
  it("should export the correct object", () => {
    expect(AuthVendorRoutes).toBe("mockRoutes");
  });
});
