import { renderHook } from "@testing-library/react-hooks";
import dk from "deep-keys";
import { useFlags } from "flagsmith/react";
import mockUseFlagsHook from "../../../../hooks/tests/flags.mock.hook";
import useFlagSmith from "../flagsmith";

jest.mock("flagsmith/react", () => ({
  useFlags: jest.fn(),
}));

describe("useFlagSmith", () => {
  let originalEnvironment: typeof process.env;
  let received: ReturnType<typeof arrange>;
  let mockFlagName: string | null | undefined;

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
    return renderHook(() => useFlagSmith());
  };

  const checkHookProperties = () => {
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
      expect(received.result.current.isEnabled).toBeInstanceOf(Function);
    });
  };

  describe("when rendered", () => {
    beforeEach(() => {
      (useFlags as jest.Mock).mockImplementation(() => ({
        enabledFlag: { enabled: true },
        disabledFlag: { enabled: false },
      }));
      received = arrange();
    });

    describe("given an invalid flagName", () => {
      beforeEach(() => {
        received = arrange();
      });

      describe("when the flag name is: null", () => {
        beforeEach(() => {
          mockFlagName = null;
        });

        checkHookProperties();

        describe("isEnabled", () => {
          let result: boolean;

          beforeEach(
            () => (result = received.result.current.isEnabled(mockFlagName))
          );

          it("should return false", () => {
            expect(result).toBe(false);
          });
        });
      });

      describe("when the flag name is: undefined", () => {
        beforeEach(() => {
          mockFlagName = undefined;
        });

        checkHookProperties();

        describe("isEnabled", () => {
          let result: boolean;

          beforeEach(
            () => (result = received.result.current.isEnabled(mockFlagName))
          );

          it("should return false", () => {
            expect(result).toBe(false);
          });
        });
      });

      describe(`when the flag name is: "wrong-name"`, () => {
        beforeEach(() => {
          mockFlagName = "wrong-name";
        });

        checkHookProperties();

        describe("isEnabled", () => {
          let result: boolean;

          beforeEach(
            () => (result = received.result.current.isEnabled(mockFlagName))
          );

          it("should return false", () => {
            expect(result).toBe(false);
          });
        });
      });
    });

    describe("given a valid flagName", () => {
      describe(`when the flag name is: enabledFlag`, () => {
        beforeEach(() => {
          mockFlagName = "enabledFlag";
        });

        describe("isEnabled", () => {
          let result: boolean;

          beforeEach(() => {
            result = received.result.current.isEnabled(mockFlagName);
          });

          it("should return true", () => {
            expect(result).toBe(true);
          });
        });
      });

      describe(`when the flag name is: disabledFlag`, () => {
        beforeEach(() => {
          mockFlagName = "disabledFlag";
        });

        describe("isEnabled", () => {
          let result: boolean;

          beforeEach(() => {
            result = received.result.current.isEnabled(mockFlagName);
          });

          it("should return false", () => {
            expect(result).toBe(false);
          });
        });
      });
    });
  });
});
