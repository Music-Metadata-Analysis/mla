import NextAuthApiRoutes from "../../../pages/api/auth/[...nextauth]";

jest.mock("../../../backend/integrations/auth/vendor", () => ({
  ApiRoutes: "MockRoutes",
}));

describe("NextAuthApiRoutes", () => {
  it("should export the correct object", () => {
    expect(NextAuthApiRoutes).toBe("MockRoutes");
  });
});
