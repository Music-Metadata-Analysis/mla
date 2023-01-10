import { localStorageManager } from "@chakra-ui/react";
import createColourModeManager from "../chakra.colour.mode.manager.utility";

jest.mock("@chakra-ui/react", () => ({
  cookieStorageManager: jest.fn(() => mockCookieStorageManager),
  localStorageManager: {
    get: jest.fn(() => "mockInitialLocalStorageValue"),
    set: jest.fn(),
    type: "local",
  },
}));

const mockCookieStorageManager = {
  get: jest.fn(),
  set: jest.fn(),
  type: "cookie",
};

describe("createColourModeManager", () => {
  let manager: ReturnType<typeof createColourModeManager>;
  let mockCookies: string | Record<string, string>;
  const mockInitialMode = "dark" as const;
  const mockChangeMode = "light" as const;

  const createInstance = () => {
    manager = createColourModeManager(mockCookies, mockInitialMode);
  };

  const checkInstance = () => {
    it("should have the expected properties", () => {
      expect(typeof manager.set).toBe("function");
      expect(typeof manager.get).toBe("function");
      expect(typeof manager.type).toBe("string");
    });
  };

  const checkSetter = () => {
    describe("when the set function is called", () => {
      beforeEach(() => {
        jest.mocked(localStorageManager.set).mockClear();
        manager.set(mockChangeMode);
      });

      it("should synchronize the locale storage value", () => {
        expect(localStorageManager.set).toBeCalledTimes(1);
        expect(localStorageManager.set).toBeCalledWith(mockChangeMode);
      });

      it("should synchronize the cookie storage value", () => {
        expect(mockCookieStorageManager.set).toBeCalledTimes(1);
        expect(mockCookieStorageManager.set).toBeCalledWith(mockChangeMode);
      });
    });
  };

  beforeEach(() => jest.clearAllMocks());

  describe("when cookies are a string", () => {
    beforeEach(() => {
      mockCookies = "mockCookies";
      createInstance();
    });

    checkInstance();

    it("should call the local storage setter to synchronize values", () => {
      expect(localStorageManager.get).toBeCalledTimes(1);
      expect(localStorageManager.get).toBeCalledWith(mockInitialMode);
      expect(localStorageManager.set).toBeCalledTimes(1);
      expect(localStorageManager.set).toBeCalledWith(
        jest.mocked(localStorageManager.get).mock.results[0].value
      );
    });

    it("should return the cookie storage manager", () => {
      expect(manager.get).toBe(mockCookieStorageManager.get);
      expect(manager.type).toBe(mockCookieStorageManager.type);
    });

    checkSetter();
  });

  describe("when cookies are an object", () => {
    beforeEach(() => {
      mockCookies = { mockCookies: "mockCookieValue" };
      createInstance();
    });

    checkInstance();

    it("should NOT call the local storage setter to synchronize values", () => {
      expect(localStorageManager.get).toBeCalledTimes(0);
      expect(localStorageManager.set).toBeCalledTimes(0);
    });

    it("should return the locale storage manager", () => {
      expect(manager.get).toBe(localStorageManager.get);
      expect(manager.type).toBe(localStorageManager.type);
    });

    checkSetter();
  });
});
