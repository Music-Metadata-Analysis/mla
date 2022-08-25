import Flagsmith from "flagsmith-nodejs";
import FlagSmithClient from "../flagsmith";

jest.mock("flagsmith-nodejs", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    getEnvironmentFlags: mockGetEnvironmentFlags,
  })),
}));

const mockGetEnvironmentFlags = jest.fn(() => ({
  isFeatureEnabled: mockIsFeatureEnabled,
}));
const mockIsFeatureEnabled = jest.fn();

describe(FlagSmithClient.name, () => {
  let instance: FlagSmithClient;
  let mockFlagName: string;
  const mockEnvironmentName = "TestEnvironment";

  beforeEach(() => jest.clearAllMocks());

  const arrange = () => (instance = new FlagSmithClient(mockEnvironmentName));

  describe("when initialized", () => {
    beforeEach(() => arrange());

    describe("with an enabled flag name", () => {
      describe("isEnabled", () => {
        let result: boolean;

        beforeEach(async () => {
          mockIsFeatureEnabled.mockImplementationOnce(() => true);
          result = await instance.isEnabled(mockFlagName);
        });

        it("should query the correct FlagSmith environment", () => {
          expect(Flagsmith).toBeCalledTimes(1);
          expect(Flagsmith).toBeCalledWith({
            environmentKey: mockEnvironmentName,
          });
        });

        it("should query the flags from FlagSmith", () => {
          expect(mockGetEnvironmentFlags).toBeCalledTimes(1);
        });

        it("should check if this specific feature is enabled", () => {
          expect(mockIsFeatureEnabled).toBeCalledTimes(1);
          expect(mockIsFeatureEnabled).toBeCalledWith(mockFlagName);
        });

        it("should return true", () => {
          expect(result).toBe(true);
        });
      });
    });

    describe("with an disabled flag name", () => {
      describe("isEnabled", () => {
        let result: boolean;

        beforeEach(async () => {
          mockIsFeatureEnabled.mockImplementationOnce(() => false);
          result = await instance.isEnabled(mockFlagName);
        });

        it("should query the correct FlagSmith environment", () => {
          expect(Flagsmith).toBeCalledTimes(1);
          expect(Flagsmith).toBeCalledWith({
            environmentKey: mockEnvironmentName,
          });
        });

        it("should query the flags from FlagSmith", () => {
          expect(mockGetEnvironmentFlags).toBeCalledTimes(1);
        });

        it("should check if this specific feature is enabled", () => {
          expect(mockIsFeatureEnabled).toBeCalledTimes(1);
          expect(mockIsFeatureEnabled).toBeCalledWith(mockFlagName);
        });

        it("should return false", () => {
          expect(result).toBe(false);
        });
      });
    });
  });
});
