import { renderHook } from "@testing-library/react-hooks";
import dk from "deep-keys";
import { useFlags, useFlagsmith } from "flagsmith/react";
import useFlagSmithVendor from "../flagsmith";
import { authVendor } from "@src/vendors/integrations/auth/vendor";
import { mockFlagsHook as mockHookValues } from "@src/vendors/integrations/flags/__mocks__/vendor.mock";
import type { AuthVendorHookInterface } from "@src/vendors/types/integrations/auth/vendor.types";
import type { FlagVendorHookInterface } from "@src/vendors/types/integrations/flags/vendor.types";

jest.mock("flagsmith/react");

jest.mock("@src/vendors/integrations/auth/vendor");

const MockUseFlags = jest.mocked(useFlags);
const MockUseFlagSmith = jest.mocked(useFlagsmith);

describe("useFlagSmithVendor", () => {
  let originalEnvironment: typeof process.env;
  let received: ReturnType<typeof arrange>;
  let mockFlagName: string | null | undefined;

  const mockGroup = "mockGroup";
  const mockIdentify = jest.fn();

  const mockAuthState = {
    user: { group: "mockGroup" },
  } as AuthVendorHookInterface;

  const mockFlagState = {
    enabledFlag: { enabled: true },
    disabledFlag: { enabled: false },
  } as unknown as ReturnType<typeof useFlags>;

  const mockFlagSmithStateNotRegistered = {
    identity: null,
    identify: mockIdentify,
  } as unknown as ReturnType<typeof MockUseFlagSmith>;

  const mockFlagSmithStateRegistered = {
    identity: "mockGroup",
    identify: mockIdentify,
  } as unknown as ReturnType<typeof MockUseFlagSmith>;

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
      expect(authVendor.hook).toBeCalledTimes(1);
      expect(authVendor.hook).toBeCalledWith();
    });

    it("should render the useFlagsmith hook during render", () => {
      expect(MockUseFlagSmith).toBeCalledTimes(1);
      expect(MockUseFlagSmith).toBeCalledWith();
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
        mockHookValues as Record<keyof FlagVendorHookInterface, unknown>
      ).sort();
      const hookKeys = dk(
        received.result.current as Record<
          keyof FlagVendorHookInterface,
          unknown
        >
      ).sort();
      expect(hookKeys).toStrictEqual(mockObjectKeys);
    });

    it("should contain the correct functions", () => {
      expect(received.result.current.isEnabled).toBeInstanceOf(Function);
    });
  };

  describe("when rendered", () => {
    beforeEach(() => {
      MockUseFlags.mockReturnValue(mockFlagState);
    });

    describe("with a group, that isn't registered,", () => {
      beforeEach(() => {
        MockUseFlagSmith.mockReturnValue(mockFlagSmithStateNotRegistered);
        jest.mocked(authVendor.hook).mockReturnValue(mockAuthState);
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
        MockUseFlagSmith.mockReturnValue(mockFlagSmithStateRegistered);
        jest.mocked(authVendor.hook).mockReturnValue(mockAuthState);
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
