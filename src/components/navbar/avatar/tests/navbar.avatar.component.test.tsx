import { Avatar } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import NavBarAvatar from "../navbar.avatar.component";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import mockColourHook from "@src/hooks/ui/__mocks__/colour.hook.mock";

jest.mock("@src/hooks/ui/colour.hook");

jest.mock("@chakra-ui/react", () => {
  const { createChakraMock } = require("@fixtures/chakra");
  return createChakraMock(["Avatar"]);
});

describe("NavBarAvatar", () => {
  let mockAuthData: { name?: string; image?: string };

  const mockAuthDataAuthenticated = {
    name: "mockUser",
    image: "https://mock/profile/url",
  };
  const mockAuthDataUnauthenticated = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    render(<NavBarAvatar user={mockAuthData} />);
  };

  describe("with an authenticated in user", () => {
    beforeEach(() => {
      mockAuthData = mockAuthDataAuthenticated;

      arrange();
    });

    it("should render the Avatar component correctly", () => {
      expect(Avatar).toBeCalledTimes(1);
      checkMockCall(Avatar, {
        bg: mockColourHook.buttonColour.background,
        loading: "eager",
        name: mockAuthDataAuthenticated.name,
        size: "sm",
        src: mockAuthDataAuthenticated.image,
      });
    });
  });

  describe("with an unauthenticated user", () => {
    beforeEach(() => {
      mockAuthData = mockAuthDataUnauthenticated;

      arrange();
    });

    it("should render the Avatar component correctly", () => {
      expect(Avatar).toBeCalledTimes(1);
      checkMockCall(Avatar, {
        bg: mockColourHook.buttonColour.background,
        loading: "eager",
        name: undefined,
        size: "sm",
        src: undefined,
      });
    });
  });
});
