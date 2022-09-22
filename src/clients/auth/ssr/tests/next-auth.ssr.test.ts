import { getSession } from "next-auth/react";
import NextAuthSSR from "../next-auth";

jest.mock("next-auth/react", () => ({
  getSession: jest.fn(),
}));

describe("NextAuthSSR", () => {
  let instance: NextAuthSSR;
  let windowSpy: jest.SpyInstance;
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

  describe("when running without a window object (SSR environment)", () => {
    beforeEach(() => {
      windowSpy = jest
        .spyOn(global, "window", "get")
        .mockImplementationOnce(() => undefined as unknown as typeof window);
    });

    afterEach(() => {
      windowSpy.mockRestore();
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

  describe("when running with a window object (Browser environment)", () => {
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
