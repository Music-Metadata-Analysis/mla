import flagsmith from "flagsmith/isomorphic";
import FlagSmithSSR from "../flagsmith";

jest.mock("@src/utils/voids", () => {
  const module = require("@src/utils/tests/voids.mock");
  return {
    normalizeNull: module.mockNormalizeNull,
    normalizeUndefined: module.mockNormalizeUndefined,
  };
});

jest.mock("flagsmith/isomorphic", () => ({
  init: jest.fn(),
  getState: jest.fn(),
}));

describe("FlagSmithSSR", () => {
  const mockFlagEnvironment = "mockFlagEnvironment";
  const mockFlagState = "mockFlagState";
  const mockIdentity = "mockIdentity";
  let originalEnvironment: typeof process.env;
  let instance: FlagSmithSSR;

  const setupEnv = () => {
    process.env.NEXT_PUBLIC_FLAG_ENVIRONMENT = mockFlagEnvironment;
  };

  beforeAll(() => {
    originalEnvironment = process.env;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    setupEnv();
    instance = new FlagSmithSSR();
  });

  afterAll(() => {
    process.env = originalEnvironment;
  });

  describe("getState", () => {
    let result: unknown;

    beforeEach(async () => {
      (flagsmith.getState as jest.Mock).mockReturnValueOnce(mockFlagState);
      result = await instance.getState(mockIdentity);
    });

    it("should initialize the vendor object correctly", () => {
      expect(flagsmith.init).toBeCalledTimes(1);
      expect(flagsmith.init).toBeCalledWith({
        environmentID: mockFlagEnvironment,
        identity: `normalizeUndefined(${mockIdentity})`,
      });
    });

    it("should call the vendor object's getState method correctly", () => {
      expect(flagsmith.getState).toBeCalledTimes(1);
      expect(flagsmith.getState).toBeCalledWith();
    });

    it("should return the vendor's flag state", () => {
      expect(result).toStrictEqual({
        serverState: mockFlagState,
        identity: `normalizeNull(${mockIdentity})`,
      });
    });
  });
});
