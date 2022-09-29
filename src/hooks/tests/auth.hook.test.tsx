import { renderHook } from "@testing-library/react-hooks";
import dk from "deep-keys";
import mockHookValues from "../__mocks__/auth.mock";
import useAuth from "../auth";

jest.mock("@src/clients/auth/vendor");

describe("useAuth", () => {
  let originalEnvironment: typeof process.env;
  let received: ReturnType<typeof arrange>;
  const mockOauthProviderName = "google" as const;

  beforeAll(() => {
    originalEnvironment = process.env;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = originalEnvironment;
  });

  const arrange = () => {
    return renderHook(() => useAuth());
  };

  describe("when rendered", () => {
    beforeEach(() => {
      received = arrange();
    });

    it("should contain all the same properties as the mock hook", () => {
      const mockObjectKeys = dk(
        mockHookValues as unknown as Record<string, unknown>
      ).sort();
      const hookKeys = dk(
        received.result.current as unknown as Record<string, unknown>
      ).sort();
      expect(hookKeys).toStrictEqual(mockObjectKeys);
    });

    it("should contain the correct functions", () => {
      expect(received.result.current.signIn).toBe(mockHookValues.signIn);
      expect(received.result.current.signOut).toBe(mockHookValues.signOut);
    });

    it("should contain the correct defaults", () => {
      expect(received.result.current.user).toBeNull();
      expect(received.result.current.status).toBe("unauthenticated");
    });

    describe("signIn", () => {
      beforeEach(() => {
        received.result.current.signIn(mockOauthProviderName);
      });

      it("should call the underlying vendor hook", () => {
        expect(mockHookValues.signIn).toBeCalledTimes(1);
        expect(mockHookValues.signIn).toBeCalledWith(mockOauthProviderName);
      });
    });

    describe("signOut", () => {
      beforeEach(() => {
        received.result.current.signOut();
      });

      it("should call the underlying vendor hook", () => {
        expect(mockHookValues.signOut).toBeCalledTimes(1);
        expect(mockHookValues.signOut).toBeCalledWith();
      });
    });
  });
});
