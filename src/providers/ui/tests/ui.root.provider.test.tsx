import { render, screen } from "@testing-library/react";
import BackGround from "../background/background.component";
import UserInterfaceChakraProvider from "../chakra/chakra.provider";
import UserInterfaceRootProvider from "../ui.root.provider";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("../background/background.component", () =>
  require("@fixtures/react/parent").createComponent("BackGround")
);

jest.mock("../chakra/chakra.provider", () =>
  require("@fixtures/react/parent").createComponent(
    "UserInterfaceChakraProvider"
  )
);

describe("UserInterfaceRootProvider", () => {
  const mockChildComponent = "MockChildComponent";
  const mockCookies = { mockCookie: "mockCookieValue" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(
      <UserInterfaceRootProvider cookies={mockCookies}>
        <div>{mockChildComponent}</div>
      </UserInterfaceRootProvider>
    );
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should call BackGround with the correct props", () => {
      expect(BackGround).toBeCalledTimes(1);
      checkMockCall(BackGround, {});
    });

    it("should call UserInterfaceChakraProvider with the correct props", () => {
      expect(UserInterfaceChakraProvider).toBeCalledTimes(1);
      checkMockCall(UserInterfaceChakraProvider, { cookies: mockCookies });
    });

    it("should return the mock child component", async () => {
      expect(await screen.findByText(mockChildComponent)).toBeTruthy();
    });
  });
});
