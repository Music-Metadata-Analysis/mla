import { renderHook } from "@testing-library/react-hooks";
import dk from "deep-keys";
import mockUseFlagsHook from "./flags.mock.hook";
import useFlags from "../flags";

jest.mock("@src/clients/flags/vendor", () => ({
  hook: () => mockUseFlagsHook,
}));

describe("useFlags", () => {
  let originalEnvironment: typeof process.env;
  let received: ReturnType<typeof arrange>;
  const mockFlagName = "mockFlag";

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
    return renderHook(() => useFlags());
  };

  describe("when rendered", () => {
    beforeEach(() => {
      received = arrange();
    });

    it("should contain all the same properties as the mock hook", () => {
      const mockObjectKeys = dk(
        mockUseFlagsHook as unknown as Record<string, unknown>
      ).sort();
      const hookKeys = dk(
        received.result.current as unknown as Record<string, unknown>
      ).sort();
      expect(hookKeys).toStrictEqual(mockObjectKeys);
    });

    it("should contain the correct functions", () => {
      expect(received.result.current.isEnabled).toBe(
        mockUseFlagsHook.isEnabled
      );
    });

    describe("isEnabled", () => {
      let result: boolean;

      beforeEach(() => {
        (mockUseFlagsHook.isEnabled as jest.Mock).mockReturnValueOnce(true);
        result = received.result.current.isEnabled(mockFlagName);
      });

      it("should call the underlying vendor hook", () => {
        expect(mockUseFlagsHook.isEnabled).toBeCalledTimes(1);
        expect(mockUseFlagsHook.isEnabled).toBeCalledWith(mockFlagName);
      });

      it("should return the expected value", () => {
        expect(result).toBe(true);
      });
    });
  });
});
