import { Avatar } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import NavBarAvatar from "../navbar.avatar.component";
import mockAuthHook, { mockUserProfile } from "@src/hooks/tests/auth.mock.hook";
import mockColourHook from "@src/hooks/tests/colour.hook.mock";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("@chakra-ui/react", () => {
  return {
    Avatar: jest.fn().mockImplementation(() => <div>MockComponent</div>),
    Box: jest.requireActual("@chakra-ui/react").Box,
  };
});

jest.mock("@src/hooks/auth", () => () => mockAuthHook);

jest.mock("@src/hooks/colour", () => () => mockColourHook);

describe("NavBarAvatar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    render(<NavBarAvatar />);
  };

  describe("with a logged in user", () => {
    beforeEach(() => {
      mockAuthHook.user = mockUserProfile;
      mockAuthHook.status = "authenticated";
      arrange();
    });

    it("should render the Avatar component correctly", () => {
      expect(Avatar).toBeCalledTimes(1);
      checkMockCall(Avatar, {
        bg: mockColourHook.buttonColour.background,
        loading: "eager",
        name: mockUserProfile.name,
        size: "sm",
        src: mockUserProfile.image,
      });
    });
  });

  describe("without a logged in user", () => {
    beforeEach(() => {
      mockAuthHook.user = null;
      mockAuthHook.status = "unauthenticated";
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
