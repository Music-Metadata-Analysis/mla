import createPersistedReducer from "use-persisted-reducer";
import { getPersistedUseReducer, getPersistedUseState } from "../local.storage";

jest.mock("react", () => {
  return {
    useReducer: "mockUseRegularReducer" as mockReducer,
    useState: "mockUseRegularState" as mockState,
  };
});

jest.mock("use-persisted-reducer", () =>
  jest.fn(() => mockUsePersistedReducer)
);

jest.mock(
  "../local.storage.state/local.storage.state",
  () => "mockUsePersistedState"
);

const mockUseRegularReducer = "mockUseRegularReducer";
const mockUseRegularState = "mockUseRegularState";
const mockUsePersistedReducer = "mockUsePersistedReducer";
const mockUsePersistedState = "mockUsePersistedState";
type mockReducer =
  | typeof mockUseRegularReducer
  | typeof mockUsePersistedReducer;
type mockState = typeof mockUseRegularState | typeof mockUsePersistedState;

describe("local.storage module", () => {
  let windowSpy: jest.SpyInstance;
  let receivedReducer: mockReducer;
  let receivedState: mockState;
  const mockKey = "mockKey";

  beforeEach(() => jest.clearAllMocks());

  const actCreateReducer = () => {
    receivedReducer = getPersistedUseReducer(mockKey) as unknown as mockReducer;
  };

  const actCreateState = () => {
    receivedState = getPersistedUseState() as unknown as mockState;
  };

  describe("when running without a window object (SSR environment)", () => {
    beforeEach(() => {
      windowSpy = jest
        .spyOn(global, "window", "get")
        .mockImplementationOnce(() => undefined as unknown as typeof window);
    });

    afterEach(() => {
      windowSpy.mockRestore();
    });

    describe("getSSRreducer", () => {
      beforeEach(() => {
        actCreateReducer();
      });

      it("should return a regular reducer", () => {
        expect(receivedReducer).toBe(mockUseRegularReducer);
      });
    });

    describe("getSSRhook", () => {
      beforeEach(() => {
        actCreateState();
      });

      it("should return a regular useState function", () => {
        expect(receivedState).toBe(mockUseRegularState);
      });
    });
  });

  describe("when running with a window object (Browser environment)", () => {
    describe("getSSRreducer", () => {
      beforeEach(() => {
        actCreateReducer();
      });

      it("should return a persisted reducer", () => {
        expect(receivedReducer).toBe(mockUsePersistedReducer);
      });

      it("should use the correct key for local storage", () => {
        expect(createPersistedReducer).toBeCalledTimes(1);
        expect(createPersistedReducer).toBeCalledWith(mockKey);
      });
    });

    describe("getSSRhook", () => {
      beforeEach(() => {
        actCreateState();
      });

      it("should return a persisted useState function", () => {
        expect(receivedState).toBe(mockUsePersistedState);
      });
    });
  });
});
