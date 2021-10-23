import { Box, Button } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import mockColourHook from "../../../../hooks/tests/colour.hook.mock";
import checkMockCall from "../../../../tests/fixtures/mock.component.call";
import AnalyticsWrapper from "../../../analytics/analytics.button/analytics.button.component";
import Authentication from "../../../authentication/authentication.container";
import NavBarSessionControl from "../navbar.session.control.component";

jest.mock("../../../../hooks/colour", () => {
  return () => mockColourHook;
});

jest.mock(
  "../../../analytics/analytics.button/analytics.button.component",
  () => createMockedComponent("AnalyticsWrapper")
);

jest.mock("next-auth/client", () => ({
  useSession: () => mockUseSession(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock("@chakra-ui/react", () => ({
  useDisclosure: () => mockUseDisclosure(),
}));

jest.mock("../../../authentication/authentication.container", () => {
  return jest.fn(() => <div>MockComponent</div>);
});

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("../../../../tests/fixtures/mock.chakra.react.factory.class");
  return factoryInstance.create(["Box", "Button"]);
});

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("../../../../tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

const mockUseDisclosure = jest.fn();
const mockUseSession = jest.fn();

describe("NavSessionControl", () => {
  const buttonProps = {
    _hover: {
      bg: mockColourHook.navButtonColour.hoverBackground,
      textDecoration: "none",
    },
    bg: mockColourHook.navButtonColour.background,
    borderColor: mockColourHook.transparent,
    p: "10px",
    rounded: "md",
    width: "100%",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    render(<NavBarSessionControl />);
  };

  describe("when the user is logged in", () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue([{ user: true }, true]);
      arrange();
    });

    it("should render the Authentication modal twice", () => {
      expect(Authentication).toBeCalledTimes(2);
      checkMockCall(Authentication, { hidden: true }, 0, ["onModalClose"]);
      checkMockCall(Authentication, { hidden: true }, 1, ["onModalClose"]);
    });

    it("should render the AnalyticsWrapper component twice", () => {
      expect(AnalyticsWrapper).toBeCalledTimes(2);
      checkMockCall(AnalyticsWrapper, { buttonName: "NavBar SignIn" }, 0);
      checkMockCall(AnalyticsWrapper, { buttonName: "NavBar SignOut" }, 1);
    });

    it("should render the Box component twice", () => {
      expect(Box).toBeCalledTimes(2);
      checkMockCall(Box, { pl: [0, 2], pr: 2 }, 0);
      checkMockCall(Box, { pl: [0, 2], pr: 2 }, 1);
    });

    it("should render the Button twice", () => {
      expect(Button).toBeCalledTimes(2);
      checkMockCall(Button, buttonProps, 0);
      checkMockCall(Button, buttonProps, 1);
    });
  });

  describe("when the user is NOT logged in", () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue([null, false]);
      arrange();
    });

    it("should render the Authentication modal twice", () => {
      expect(Authentication).toBeCalledTimes(1);
      checkMockCall(Authentication, { hidden: true }, 0, ["onModalClose"]);
    });

    it("should render the AnalyticsWrapper once", () => {
      expect(AnalyticsWrapper).toBeCalledTimes(1);
      checkMockCall(AnalyticsWrapper, { buttonName: "NavBar SignIn" }, 0);
    });

    it("should render the Box component once", () => {
      expect(Box).toBeCalledTimes(1);
      checkMockCall(Box, { pl: [0, 2], pr: 2 }, 0);
    });

    it("should render the Button once", () => {
      expect(Button).toBeCalledTimes(1);
      checkMockCall(Button, buttonProps, 0);
    });
  });
});
