import { Box, Button } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import mockAuthHook, {
  mockUserProfile,
} from "../../../../hooks/tests/auth.mock.hook";
import mockColourHook from "../../../../hooks/tests/colour.hook.mock";
import checkMockCall from "../../../../tests/fixtures/mock.component.call";
import AnalyticsWrapper from "../../../analytics/analytics.button/analytics.button.component";
import Authentication from "../../../authentication/authentication.container";
import NavBarSessionControl from "../navbar.session.control.component";

jest.mock("../../../../hooks/auth", () => () => mockAuthHook);

jest.mock("../../../../hooks/colour", () => {
  return () => mockColourHook;
});

jest.mock(
  "../../../analytics/analytics.button/analytics.button.component",
  () => createMockedComponent("AnalyticsWrapper")
);

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

describe("NavSessionControl", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    render(<NavBarSessionControl />);
  };

  const checkAnalyticsWrapper = ({
    expectedCallCount,
  }: {
    expectedCallCount: number;
  }) => {
    it("should call the AnalyticsWrapper component with the expected props", () => {
      expect(AnalyticsWrapper).toBeCalledTimes(expectedCallCount);
      for (let i = 0; i < expectedCallCount; i++) {
        checkMockCall(AnalyticsWrapper, { buttonName: "NavBar SignIn" }, 0);
      }
    });
  };

  const checkAuthentication = ({
    expectedCallCount,
  }: {
    expectedCallCount: number;
  }) => {
    it("should call the Authentication component with the expected props", () => {
      expect(Authentication).toBeCalledTimes(expectedCallCount);
      for (let i = 0; i < expectedCallCount; i++) {
        checkMockCall(Authentication, { hidden: true }, 0, ["onModalClose"]);
      }
    });
  };

  const checkChakraBox = ({
    expectedCallCount,
  }: {
    expectedCallCount: number;
  }) => {
    it("should call the Box component with the expected props", () => {
      expect(Box).toBeCalledTimes(expectedCallCount);
      for (let i = 0; i < expectedCallCount; i++) {
        checkMockCall(Box, { pl: [0, 1, 2], pr: 0 }, i);
      }
    });
  };

  const checkChakraButton = ({
    expectedCallCount,
  }: {
    expectedCallCount: number;
  }) => {
    it("should call the Button component with the expected props", () => {
      expect(Button).toBeCalledTimes(expectedCallCount);
      for (let i = 0; i < expectedCallCount; i++) {
        checkMockCall(
          Button,
          {
            _hover: {
              bg: mockColourHook.navButtonColour.hoverBackground,
              textDecoration: "none",
            },
            bg: mockColourHook.navButtonColour.background,
            borderColor: mockColourHook.transparent,
            p: [1, 1, 2],
            rounded: "md",
            width: "100%",
          },
          i
        );
      }
    });
  };

  describe("when the user is logged in", () => {
    beforeEach(() => {
      mockAuthHook.user = mockUserProfile;
      mockAuthHook.status = "authenticated";
      arrange();
    });

    checkAuthentication({ expectedCallCount: 2 });
    checkAnalyticsWrapper({ expectedCallCount: 2 });
    checkChakraBox({ expectedCallCount: 2 });
    checkChakraButton({ expectedCallCount: 2 });
  });

  describe("when the user is NOT logged in", () => {
    beforeEach(() => {
      mockAuthHook.user = null;
      mockAuthHook.status = "unauthenticated";
      arrange();
    });

    checkAuthentication({ expectedCallCount: 1 });
    checkAnalyticsWrapper({ expectedCallCount: 1 });
    checkChakraBox({ expectedCallCount: 1 });
    checkChakraButton({ expectedCallCount: 1 });
  });
});
