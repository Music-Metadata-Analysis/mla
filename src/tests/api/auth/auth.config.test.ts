import NextAuthApiRoutes from "@src/pages/api/auth/[...nextauth]";

jest.mock("@src/backend/api/integrations/auth/vendor", () => ({
  ApiRoutes: "MockRoutes",
}));

describe("NextAuthApiRoutes", () => {
  it("should export the correct object", () => {
    expect(NextAuthApiRoutes).toBe("MockRoutes");
  });
});
