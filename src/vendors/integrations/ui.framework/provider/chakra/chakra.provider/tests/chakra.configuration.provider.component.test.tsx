import { ChakraProvider, CSSReset } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import ChakraConfigurationProvider from "../chakra.configuration.provider.component";
import createColourModeManager from "../utilities/chakra.colour.mode.manager.utility";
import createChakraTheme from "../utilities/chakra.theme.utility";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";

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

jest.mock("../utilities/chakra.colour.mode.manager.utility");

jest.mock("../utilities/chakra.theme.utility", () => {
  const chakra = jest.requireActual("@chakra-ui/react");
  return jest.fn(() => chakra.extendTheme({}));
});

describe("ChakraConfigurationProvider", () => {
  let cookies: { [key: string]: string } | string;

  const mockColourModeManager = {
    get: jest.fn(),
    set: jest.fn(),
    type: "cookie" as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .mocked(createColourModeManager)
      .mockImplementation(() => mockColourModeManager);
  });

  const arrange = async () => {
    render(
      <ChakraConfigurationProvider cookies={cookies}>
        <div data-testid={"UserInterfaceProvider"}>Test</div>
      </ChakraConfigurationProvider>
    );
  };

  const checkCreateTheme = () => {
    it("should call createTheme", () => {
      expect(createChakraTheme).toBeCalledTimes(1);
      expect(createChakraTheme).toBeCalledWith();
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
        theme: createChakraTheme(),
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
        theme: createChakraTheme(),
      });
    });
  });
});
