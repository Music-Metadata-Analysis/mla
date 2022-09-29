import flagsmith from "flagsmith/isomorphic";
import FlagSmithSSR from "../flagsmith";

jest.mock("@src/utils/voids");

jest.mock("flagsmith/isomorphic");

describe("FlagSmithSSR", () => {
  const mockFlagEnvironment = "mockFlagEnvironment";
  const mockFlagState = { environmentID: "mocked" } as ReturnType<
    typeof flagsmith.getState
  >;
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
      jest.mocked(flagsmith.getState).mockReturnValueOnce(mockFlagState);
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
