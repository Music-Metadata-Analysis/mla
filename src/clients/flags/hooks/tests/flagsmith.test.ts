import { renderHook } from "@testing-library/react-hooks";
import dk from "deep-keys";
import { useFlags, useFlagsmith } from "flagsmith/react";
import useAuth from "../../../../hooks/auth";
import mockUseFlagsHook from "../../../../hooks/tests/flags.mock.hook";
import useFlagSmithVendor from "../flagsmith";

jest.mock("flagsmith/react", () => ({
  useFlags: jest.fn(),
  useFlagsmith: jest.fn(),
}));

jest.mock("../../../../hooks/auth", () => jest.fn());

describe("useFlagSmithVendor", () => {
  let originalEnvironment: typeof process.env;
  let received: ReturnType<typeof arrange>;
  let mockFlagName: string | null | undefined;
  const mockIdentify = jest.fn();
  const mockGroup = "mockGroup";

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
    return renderHook(() => useFlagSmithVendor());
  };

  const checkHookRender = () => {
    it("should render the useAuth hook during render", () => {
      expect(useAuth).toBeCalledTimes(1);
      expect(useAuth).toBeCalledWith();
    });

    it("should render the useFlagsmith hook during render", () => {
      expect(useFlagsmith).toBeCalledTimes(1);
      expect(useFlagsmith).toBeCalledWith();
    });
  };

  const checkIdentify = () => {
    it("should identify the user correctly", () => {
      expect(mockIdentify).toBeCalledTimes(1);
      expect(mockIdentify).toBeCalledWith(mockGroup);
    });
  };

  const checkDoesNotIdentify = () => {
    it("should NOT attempt to identify the user", () => {
      expect(mockIdentify).toBeCalledTimes(0);
    });
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
    });

    describe("with a group, that isn't registered,", () => {
      beforeEach(() => {
        (useFlagsmith as jest.Mock).mockReturnValue({
          identity: null,
          identify: mockIdentify,
        });
        (useAuth as jest.Mock).mockReturnValue({
          user: { group: "mockGroup" },
        });
        received = arrange();
      });

      describe("given an invalid flagName", () => {
        describe("when the flag name is: null", () => {
          beforeEach(() => {
            mockFlagName = null;
          });

          checkHookRender();
          checkHookProperties();
          checkIdentify();

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

          checkHookRender();
          checkHookProperties();
          checkIdentify();

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

          checkHookRender();
          checkHookProperties();
          checkIdentify();

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

          checkHookRender();
          checkHookProperties();
          checkIdentify();

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

          checkHookRender();
          checkHookProperties();
          checkIdentify();

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

    describe("with a group, that is registered,", () => {
      beforeEach(() => {
        (useFlagsmith as jest.Mock).mockReturnValue({
          identity: "mockGroup",
          identify: mockIdentify,
        });
        (useAuth as jest.Mock).mockReturnValue({
          user: { group: "mockGroup" },
        });
        received = arrange();
      });

      describe("given an invalid flagName", () => {
        describe("when the flag name is: null", () => {
          beforeEach(() => {
            mockFlagName = null;
          });

          checkHookRender();
          checkHookProperties();
          checkDoesNotIdentify();

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

          checkHookRender();
          checkHookProperties();
          checkDoesNotIdentify();

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

          checkHookRender();
          checkHookProperties();
          checkDoesNotIdentify();

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

          checkHookRender();
          checkHookProperties();
          checkDoesNotIdentify();

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

          checkHookRender();
          checkHookProperties();
          checkDoesNotIdentify();

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
});
