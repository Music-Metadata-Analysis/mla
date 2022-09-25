import { getSession } from "next-auth/react";
import NextAuthSSR from "../next-auth";
import { isBuildTime } from "@src/utils/next";

jest.mock("next-auth/react", () => ({
  getSession: jest.fn(),
}));

jest.mock("@src/utils/next", () => ({
  isBuildTime: jest.fn(),
}));

describe("NextAuthSSR", () => {
  let instance: NextAuthSSR;
  const mockSession = {
    name: "mockUser",
    email: "mock@mock.com",
    image: "https://mockprofile.com/mock.jpeg",
  };
  const mockRequest = {};

  beforeEach(() => {
    jest.clearAllMocks();
    instance = new NextAuthSSR();
  });

  describe("when running at build time", () => {
    beforeEach(() => {
      (isBuildTime as jest.Mock).mockReturnValueOnce(true);
    });

    describe("getSession", () => {
      let result: unknown;

      beforeEach(async () => {
        result = await instance.getSession(mockRequest);
      });

      it("should NOT call the vendor object's getSession method", () => {
        expect(getSession).toBeCalledTimes(0);
      });

      it("should return null", () => {
        expect(result).toBeNull();
      });
    });
  });

  describe("when running outside of build time", () => {
    beforeEach(() => {
      (isBuildTime as jest.Mock).mockReturnValueOnce(false);
    });

    describe("getSession", () => {
      let result: unknown;

      beforeEach(async () => {
        (getSession as jest.Mock).mockResolvedValue(mockSession);
        result = await instance.getSession(mockRequest);
      });

      it("should call the vendor object's getSession method correctly", () => {
        expect(getSession).toBeCalledTimes(1);
        expect(getSession).toBeCalledWith(mockRequest);
      });

      it("should return the vendor's auth state", () => {
        expect(result).toBe(mockSession);
      });
    });
  });
});
