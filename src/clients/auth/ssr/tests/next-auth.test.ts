import { getSession } from "next-auth/react";
import NextAuthSSR from "../next-auth";

jest.mock("next-auth/react", () => ({
  getSession: jest.fn(),
}));

describe("NextAuthSSR", () => {
  let instance: NextAuthSSR;
  const mockSession = {
    name: "mockUser",
    email: "mock@mock.com",
    image: "https://mockprofile.com/mock.jpeg",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    instance = new NextAuthSSR();
  });

  describe("getSession", () => {
    let result: unknown;

    beforeEach(async () => {
      (getSession as jest.Mock).mockResolvedValue(mockSession);
      result = await instance.getSession();
    });

    it("should call the vendor object's getSession method correctly", () => {
      expect(getSession).toBeCalledTimes(1);
      expect(getSession).toBeCalledWith();
    });

    it("should return the vendor's auth state", () => {
      expect(result).toBe(mockSession);
    });
  });
});
