import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import { waitFor, screen, render } from "@testing-library/react";
import UserInterfaceProvider from "../ui.provider";

const providers = {
  ChakraProvider: "ChakraProvider",
  ColorModeProvider: "ColorModeProvider",
};

const createMock = (name: string) =>
  jest.fn(({ children }: { children: React.ReactChildren }) => {
    return <div data-testid={name}>{children}</div>;
  });

jest.mock("@chakra-ui/react", () => {
  const mockedModules: { [index: string]: boolean | jest.Mock } = {
    __esModule: true,
  };
  Object.keys(providers).forEach((thisModule) => {
    mockedModules[thisModule as string] = createMock(thisModule);
  });
  return mockedModules;
});

describe("UserInterfaceProvider", () => {
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
    it("should initialize the ChakraProvider Provider", async () => {
      arrange();
      await waitFor(() => expect(ChakraProvider).toBeCalledTimes(1));
      expect(await screen.findByTestId(providers.ChakraProvider)).toBeTruthy;
    });

    it("should initialize the ColorModeProvider", async () => {
      arrange();
      await waitFor(() => expect(ColorModeProvider).toBeCalledTimes(1));
      expect(await screen.findByTestId(providers.ColorModeProvider)).toBeTruthy;
    });
  });
});
