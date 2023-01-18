import { render, screen } from "@testing-library/react";
import ChakraProvider from "../chakra";
import ChakraMainBackGround from "../chakra.background/background.component";
import ChakraConfigurationProvider from "../chakra.provider/chakra.configuration.provider.component";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";

jest.mock("../chakra.background/background.component", () =>
  require("@fixtures/react/parent").createComponent("ChakraMainBackGround")
);

jest.mock("../chakra.provider/chakra.configuration.provider.component", () =>
  require("@fixtures/react/parent").createComponent(
    "ChakraConfigurationProvider"
  )
);

describe("ChakraProvider", () => {
  const mockCookies = { mockCookie: "mockCookieValue" };

  const MockChildComponent = "MockChildComponent";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(
      <ChakraProvider cookies={mockCookies}>
        <div>{MockChildComponent}</div>
      </ChakraProvider>
    );
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should call BackGround with the correct props", () => {
      expect(ChakraMainBackGround).toBeCalledTimes(1);
      checkMockCall(ChakraMainBackGround, {});
    });

    it("should call UserInterfaceChakraProvider with the correct props", () => {
      expect(ChakraConfigurationProvider).toBeCalledTimes(1);
      checkMockCall(ChakraConfigurationProvider, { cookies: mockCookies });
    });

    it("should return the mock child component", async () => {
      expect(await screen.findByText(MockChildComponent)).toBeTruthy();
    });
  });
});
