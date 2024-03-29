import { Box, Button } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import NavBarSessionControl from "../navbar.session.control.component";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import AnalyticsButtonWrapperContainer from "@src/web/analytics/collection/components/analytics.button/analytics.button.container";
import Authentication from "@src/web/authentication/sign.in/components/authentication.container";
import mockColourHook from "@src/web/ui/colours/state/hooks/__mocks__/colour.hook.mock";

jest.mock("@src/web/authentication/session/hooks/auth.hook");

jest.mock("@src/web/ui/colours/state/hooks/colour.hook");

jest.mock("@chakra-ui/react", () => {
  const mockModule = require("@fixtures/chakra").createChakraMock([
    "Box",
    "Button",
  ]);
  mockModule.useDisclosure = () => mockUseDisclosure();
  return mockModule;
});

jest.mock(
  "@src/web/analytics/collection/components/analytics.button/analytics.button.container",
  () =>
    require("@fixtures/react/parent").createComponent(
      "AnalyticsButtonWrapperContainer"
    )
);

jest.mock(
  "@src/web/authentication/sign.in/components/authentication.container",
  () =>
    require("@fixtures/react/child").createComponent(
      "MockAuthenticationContainer"
    )
);

const mockUseDisclosure = jest.fn();

describe("NavSessionControl", () => {
  let mockButtonType: "signIn" | "signOut";
  let mockShowAuthenticationModal: boolean;

  const mockAnalyticsButtonName = "mockAnalyticsButtonName";
  const mockHandleClick = jest.fn();
  const mockOnAuthenticationModalClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    render(
      <NavBarSessionControl
        analyticsButtonName={mockAnalyticsButtonName}
        buttonType={mockButtonType}
        handleClick={mockHandleClick}
        onAuthenticationModalClose={mockOnAuthenticationModalClose}
        showAuthenticationModal={mockShowAuthenticationModal}
      />
    );
  };

  const checkAnalyticsWrapper = ({
    expectedCallCount,
  }: {
    expectedCallCount: number;
  }) => {
    it("should call the AnalyticsButtonWrapperContainer component with the expected props", () => {
      expect(AnalyticsButtonWrapperContainer).toHaveBeenCalledTimes(
        expectedCallCount
      );
      for (let i = 0; i < expectedCallCount; i++) {
        checkMockCall(
          AnalyticsButtonWrapperContainer,
          { buttonName: mockAnalyticsButtonName },
          0
        );
      }
    });
  };

  const checkAuthentication = ({
    expectedCallCount,
    hidden,
  }: {
    expectedCallCount: number;
    hidden: boolean;
  }) => {
    it("should call the Authentication component with the expected props", () => {
      expect(Authentication).toHaveBeenCalledTimes(expectedCallCount);
      for (let i = 0; i < expectedCallCount; i++) {
        checkMockCall(Authentication, { hidden }, 0, ["onModalClose"]);
      }
    });
  };

  const checkChakraBox = ({
    expectedCallCount,
  }: {
    expectedCallCount: number;
  }) => {
    it("should call the Box component with the expected props", () => {
      expect(Box).toHaveBeenCalledTimes(expectedCallCount);
      for (let i = 0; i < expectedCallCount; i++) {
        checkMockCall(Box, { pl: [0, 2, 2], pr: [0, 0.5] }, i);
      }
    });
  };

  const checkChakraButton = ({
    expectedCallCount,
  }: {
    expectedCallCount: number;
  }) => {
    it("should call the Button component with the expected props", () => {
      expect(Button).toHaveBeenCalledTimes(expectedCallCount);
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
            p: 1,
            rounded: "md",
            width: "100%",
          },
          i
        );
      }
    });
  };

  describe("when the buttonType is 'signIn'", () => {
    beforeEach(() => {
      mockButtonType = "signIn";
    });

    describe("when the showAuthenticationModal is 'true'", () => {
      beforeEach(() => {
        mockShowAuthenticationModal = true;

        arrange();
      });

      checkAnalyticsWrapper({ expectedCallCount: 1 });
      checkAuthentication({ expectedCallCount: 1, hidden: false });
      checkChakraBox({ expectedCallCount: 1 });
      checkChakraButton({ expectedCallCount: 1 });
    });
  });
});
