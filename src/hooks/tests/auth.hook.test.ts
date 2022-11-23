import { renderHook } from "@testing-library/react-hooks";
import dk from "deep-keys";
import mockHookValues from "../__mocks__/auth.mock";
import useAuth from "../auth";
import authVendor from "@src/clients/auth/vendor";

jest.mock("@src/clients/auth/vendor");

describe("useAuth", () => {
  let received: ReturnType<typeof arrange>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return renderHook(() => useAuth());
  };

  describe("when rendered", () => {
    beforeEach(() => {
      received = arrange();
    });

    it("should contain all the same properties as the mock colour hook", () => {
      const mockObjectKeys = dk(
        mockHookValues as unknown as Record<string, unknown>
      ).sort();
      const hookKeys = dk(
        received.result.current as unknown as Record<string, unknown>
      ).sort();
      expect(hookKeys).toStrictEqual(mockObjectKeys);
    });

    it("should call the underlying vendor hook during render", () => {
      expect(authVendor.hook).toBeCalledTimes(1);
      expect(authVendor.hook).toBeCalledWith();
    });

    it("should return the vendor hook", () => {
      expect(received.result.current).toBe(mockHookValues);
    });
  });
});
