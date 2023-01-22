import { Box, Button } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import NavBarSessionControl from "../navbar.session.control.component";
import Authentication from "@src/components/authentication/authentication.container";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import mockColourHook from "@src/hooks/ui/__mocks__/colour.hook.mock";
import AnalyticsButtonWrapperContainer from "@src/web/analytics/collection/components/analytics.button/analytics.button.container";

jest.mock("@src/hooks/auth.hook");

jest.mock("@src/hooks/ui/colour.hook");

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

jest.mock("@src/components/authentication/authentication.container", () =>
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
      expect(AnalyticsButtonWrapperContainer).toBeCalledTimes(
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
      expect(Authentication).toBeCalledTimes(expectedCallCount);
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
      expect(Box).toBeCalledTimes(expectedCallCount);
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
