import { Box, Button } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import NavBarSessionControl from "../navbar.session.control.component";
import AnalyticsWrapper from "@src/components/analytics/analytics.button/analytics.button.component";
import Authentication from "@src/components/authentication/authentication.container";
import mockAuthHook, { mockUserProfile } from "@src/hooks/__mocks__/auth.mock";
import mockColourHook from "@src/hooks/__mocks__/colour.mock";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("@src/hooks/auth");

jest.mock("@src/hooks/colour");

jest.mock("@chakra-ui/react", () => {
  const mockModule = require("@fixtures/chakra").createChakraMock([
    "Box",
    "Button",
  ]);
  mockModule.useDisclosure = () => mockUseDisclosure();
  return mockModule;
});

jest.mock(
  "@src/components/analytics/analytics.button/analytics.button.component",
  () => require("@fixtures/react/parent").createComponent("AnalyticsWrapper")
);

jest.mock("@src/components/authentication/authentication.container", () =>
  require("@fixtures/react/child").createComponent(
    "MockAuthenticationContainer"
  )
);

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
