import { renderHook } from "@testing-library/react-hooks";
import dk from "deep-keys";
import mockHookValues from "../__mocks__/flags.mock";
import useFlags from "../flags";

jest.mock("@src/clients/flags/vendor");

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
      const mockObjectKeys = dk(mockHookValues).sort();
      const hookKeys = dk(
        received.result.current as typeof mockHookValues
      ).sort();
      expect(hookKeys).toStrictEqual(mockObjectKeys);
    });

    it("should contain the correct functions", () => {
      expect(received.result.current.isEnabled).toBe(mockHookValues.isEnabled);
    });

    describe("isEnabled", () => {
      let result: boolean;

      beforeEach(() => {
        jest.mocked(mockHookValues.isEnabled).mockReturnValueOnce(true);
        result = received.result.current.isEnabled(mockFlagName);
      });

      it("should call the underlying vendor hook", () => {
        expect(mockHookValues.isEnabled).toBeCalledTimes(1);
        expect(mockHookValues.isEnabled).toBeCalledWith(mockFlagName);
      });

      it("should return the expected value", () => {
        expect(result).toBe(true);
      });
    });
  });
});
