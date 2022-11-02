import { ChakraProvider, CSSReset } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import UserInterfaceProvider from "../chakra.provider";
import createTheme from "../chakra.theme";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("@chakra-ui/react", () => {
  const { createComponent } = require("@fixtures/react/parent");
  const mockedModule: { [index: string]: string | boolean | jest.Mock } = {};
  const providers = {
    ChakraProvider: "ChakraProvider",
    CSSReset: "CSSReset",
  };

  Object.keys(providers).forEach((thisProvider) => {
    mockedModule[thisProvider as string] =
      createComponent(thisProvider).default;
  });

  return mockedModule;
});

jest.mock("../chakra.colour.mode.manager", () =>
  jest.fn(() => mockColourModeManager)
);

jest.mock("../chakra.theme", () => {
  const chakra = jest.requireActual("@chakra-ui/react");
  return jest.fn(() => chakra.extendTheme({}));
});

const mockColourModeManager = {
  get: jest.fn(),
  set: jest.fn(),
};

describe("UserInterfaceChakraProvider", () => {
  let cookies: { [key: string]: string } | string;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = async () => {
    render(
      <UserInterfaceProvider cookies={cookies}>
        <div data-testid={"UserInterfaceProvider"}>Test</div>
      </UserInterfaceProvider>
    );
  };

  const checkCreateTheme = () => {
    it("should call createTheme", () => {
      expect(createTheme).toBeCalledTimes(1);
      expect(createTheme).toBeCalledWith();
    });
  };

  const checkCSSReset = () => {
    it("should initialize the CSSReset", () => {
      expect(CSSReset).toBeCalledTimes(1);
      checkMockCall(CSSReset, {});
    });
  };

  describe("when passed a string of cookies", () => {
    beforeEach(() => {
      cookies = "mockCookieString";

      arrange();
    });

    checkCreateTheme();
    checkCSSReset();

    it("should initialize the ChakraProvider Provider", () => {
      expect(ChakraProvider).toBeCalledTimes(1);
      checkMockCall(ChakraProvider, {
        colorModeManager: mockColourModeManager,
        theme: createTheme(),
      });
    });
  });

  describe("when passed an object of cookies", () => {
    beforeEach(() => {
      cookies = { mockCookie: "mockCookieValue" };

      arrange();
    });

    checkCreateTheme();
    checkCSSReset();

    it("should initialize the ChakraProvider Provider", () => {
      expect(ChakraProvider).toBeCalledTimes(1);
      checkMockCall(ChakraProvider, {
        colorModeManager: mockColourModeManager,
        theme: createTheme(),
      });
    });
  });
});
