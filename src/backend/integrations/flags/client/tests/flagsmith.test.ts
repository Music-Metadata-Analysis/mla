import Flagsmith from "flagsmith-nodejs";
import FlagSmithClient from "../flagsmith";

jest.mock("flagsmith-nodejs", () =>
  jest.fn(() => ({
    getEnvironmentFlags: mockGetEnvironmentFlags,
    getIdentityFlags: mockGetIdentityFlags,
  }))
);

const mockGetEnvironmentFlags = jest.fn(() => ({
  isFeatureEnabled: mockIsFeatureEnabled,
}));
const mockGetIdentityFlags = jest.fn(() => ({
  isFeatureEnabled: mockIsFeatureEnabled,
}));
const mockIsFeatureEnabled = jest.fn();

describe(FlagSmithClient.name, () => {
  let instance: FlagSmithClient;
  let mockFlagName: string;
  const mockEnvironmentName = "mockEnvironmentName";
  const mockGroupName = "mockGroupName";

  beforeEach(() => jest.clearAllMocks());

  const arrange = () => (instance = new FlagSmithClient(mockEnvironmentName));

  const checkFlagSmithEnvironmentSelection = () => {
    it("should query the correct FlagSmith environment", () => {
      expect(Flagsmith).toBeCalledTimes(1);
      expect(Flagsmith).toBeCalledWith({
        environmentKey: mockEnvironmentName,
      });
    });
  };

  const checkFlagSmithGroupQuery = () => {
    it("should query the group's flags from FlagSmith", () => {
      expect(mockGetIdentityFlags).toBeCalledTimes(1);
      expect(mockGetIdentityFlags).toBeCalledWith(mockGroupName);
    });

    it("should check if this specific feature is enabled", () => {
      expect(mockIsFeatureEnabled).toBeCalledTimes(1);
      expect(mockIsFeatureEnabled).toBeCalledWith(mockFlagName);
    });
  };

  const checkFlagSmithEnvironmentQuery = () => {
    it("should query the environment's flags from FlagSmith", () => {
      expect(mockGetEnvironmentFlags).toBeCalledTimes(1);
      expect(mockGetEnvironmentFlags).toBeCalledWith();
    });

    it("should check if this specific feature is enabled", () => {
      expect(mockIsFeatureEnabled).toBeCalledTimes(1);
      expect(mockIsFeatureEnabled).toBeCalledWith(mockFlagName);
    });
  };

  describe("when initialized", () => {
    beforeEach(() => arrange());

    describe("with an enabled flag name", () => {
      beforeEach(() => {
        mockIsFeatureEnabled.mockImplementationOnce(() => true);
      });

      describe("isEnabled", () => {
        let result: boolean;

        describe("when called with a group", () => {
          beforeEach(async () => {
            result = await instance.isEnabled(mockFlagName, mockGroupName);
          });

          checkFlagSmithEnvironmentSelection();
          checkFlagSmithGroupQuery();

          it("should return true", () => {
            expect(result).toBe(true);
          });
        });

        describe("when called without a group", () => {
          beforeEach(async () => {
            result = await instance.isEnabled(mockFlagName);
          });

          checkFlagSmithEnvironmentSelection();
          checkFlagSmithEnvironmentQuery();

          it("should return true", () => {
            expect(result).toBe(true);
          });
        });
      });
    });

    describe("with an disabled flag name", () => {
      beforeEach(() => {
        mockIsFeatureEnabled.mockImplementationOnce(() => false);
      });

      describe("isEnabled", () => {
        let result: boolean;

        describe("when called with a group", () => {
          beforeEach(async () => {
            result = await instance.isEnabled(mockFlagName, mockGroupName);
          });

          checkFlagSmithEnvironmentSelection();
          checkFlagSmithGroupQuery();

          it("should return false", () => {
            expect(result).toBe(false);
          });
        });

        describe("when called without a group", () => {
          beforeEach(async () => {
            result = await instance.isEnabled(mockFlagName);
          });

          checkFlagSmithEnvironmentSelection();
          checkFlagSmithEnvironmentQuery();

          it("should return false", () => {
            expect(result).toBe(false);
          });
        });
      });
    });
  });
});
