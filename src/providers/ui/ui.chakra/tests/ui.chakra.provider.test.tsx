import { ChakraProvider, CSSReset } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import UserInterfaceProvider from "../ui.chakra.provider";
import createTheme from "../ui.chakra.theme";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("@chakra-ui/react", () => {
  const { createComponent } = require("@fixtures/react/parent");
  const mockedModule: { [index: string]: string | boolean | jest.Mock } = {};
  const providers = {
    ChakraProvider: "ChakraProvider",
    ColorModeProvider: "ColorModeProvider",
    CSSReset: "CSSReset",
  };
  const moduleFunctions = ["cookieStorageManager"];

  Object.keys(providers).forEach((thisProvider) => {
    mockedModule[thisProvider as string] =
      createComponent(thisProvider).default;
  });
  moduleFunctions.forEach((thisFunction) => {
    mockedModule[thisFunction as string] = jest
      .fn()
      .mockReturnValue(thisFunction);
  });
  mockedModule["localStorageManager"] = "localStorageManager";

  return mockedModule;
});

jest.mock("../ui.chakra.theme", () => {
  const chakra = jest.requireActual("@chakra-ui/react");
  return jest.fn(() => chakra.extendTheme({}));
});

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
        colorModeManager: "localStorageManager",
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
        colorModeManager: "localStorageManager",
        theme: createTheme(),
      });
    });
  });
});
