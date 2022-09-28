import { ChakraProvider, CSSReset, ColorModeProvider } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import UserInterfaceProvider from "../ui.chakra.provider";
import createTheme from "../ui.chakra.theme";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("@chakra-ui/react", () => {
  const { createComponent } = require("@fixtures/react");
  const mockedModules: { [index: string]: boolean | jest.Mock } = {};
  const providers = {
    ChakraProvider: "ChakraProvider",
    ColorModeProvider: "ColorModeProvider",
    CSSReset: "CSSReset",
  };
  Object.keys(providers).forEach((thisModule) => {
    mockedModules[thisModule as string] = createComponent(thisModule).default;
  });
  return mockedModules;
});

jest.mock("../ui.chakra.theme", () => {
  const chakra = jest.requireActual("@chakra-ui/react");
  return jest.fn().mockImplementation(() => chakra.extendTheme({}));
});

describe("UserInterfaceChakraProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = async () => {
    render(
      <UserInterfaceProvider>
        <div data-testid={"UserInterfaceProvider"}>Test</div>
      </UserInterfaceProvider>
    );
  };

  describe("When Rendered", () => {
    it("should call createTheme", () => {
      arrange();
      expect(createTheme).toBeCalledTimes(1);
      expect(createTheme).toBeCalledWith();
    });

    it("should initialize the ChakraProvider Provider", () => {
      arrange();
      expect(ChakraProvider).toBeCalledTimes(1);
      checkMockCall(ChakraProvider, { theme: createTheme() });
    });

    it("should initialize the CSSReset", () => {
      arrange();
      expect(CSSReset).toBeCalledTimes(1);
      checkMockCall(CSSReset, {});
    });

    it("should initialize the ColorModeProvider", () => {
      arrange();
      expect(ColorModeProvider).toBeCalledTimes(1);
      checkMockCall(ColorModeProvider, {
        options: {
          useSystemColorMode: false,
          initialColorMode: "dark",
        },
      });
    });
  });
});
