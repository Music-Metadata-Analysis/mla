import createPersistedReducer from "use-persisted-reducer";
import { getSSRreducer } from "../local.storage";

jest.mock("react", () => {
  return {
    useReducer: "mockRegularReducer" as mockReducer,
  };
});

jest.mock("use-persisted-reducer", () => jest.fn(() => mockPersistedReducer));

const mockRegularReducer = "mockRegularReducer";
const mockPersistedReducer = "mockPersistedReducer";
type mockReducer = typeof mockRegularReducer | typeof mockPersistedReducer;

describe("getSSRreducer", () => {
  let received: mockReducer;
  const mockKey = "mockKey";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    received = getSSRreducer(mockKey) as unknown as mockReducer;
  };

  describe("when running without a window object (SSR environment)", () => {
    let windowSpy: jest.SpyInstance;

    beforeEach(() => {
      windowSpy = jest
        .spyOn(global, "window", "get")
        .mockImplementationOnce(() => undefined as unknown as typeof window);
      arrange();
    });

    afterEach(() => {
      windowSpy.mockRestore();
    });

    it("should return a regular reducer", () => {
      expect(received).toBe(mockRegularReducer);
    });
  });

  describe("when running with a window object (Browser environment)", () => {
    beforeEach(() => {
      arrange();
    });

    it("should return a persisted reducer", () => {
      expect(received).toBe(mockPersistedReducer);
    });

    it("should use the correct key for local storage", () => {
      expect(createPersistedReducer).toBeCalledTimes(1);
      expect(createPersistedReducer).toBeCalledWith(mockKey);
    });
  });
});
