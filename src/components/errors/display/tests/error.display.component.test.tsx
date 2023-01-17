import { WarningTwoIcon } from "@chakra-ui/icons";
import { Container, Flex } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import ErrorDisplay, { ErrorDisplayProps } from "../error.display.component";
import BillboardContainer from "@src/components/billboard/billboard.base/billboard.container";
import StyledButton from "@src/components/button/button.standard/button.standard.component";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import mockUseColour from "@src/hooks/ui/__mocks__/colour.hook.mock";

jest.mock("@src/hooks/ui/colour.hook");

jest.mock("@chakra-ui/icons", () =>
  require("@fixtures/chakra/icons").createChakraIconMock(["WarningTwoIcon"])
);

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock(["Container", "Flex"])
);

jest.mock("@src/components/billboard/billboard.base/billboard.container", () =>
  require("@fixtures/react/parent").createComponent("BillboardContainer")
);

jest.mock(
  "@src/components/button/button.standard/button.standard.component",
  () => require("@fixtures/react/parent").createComponent("StyledButton")
);

describe("ErrorDisplay", () => {
  let currentProps: Omit<ErrorDisplayProps, "children">;

  const mockMessage = "mockMessage";

  const baseProps: Omit<ErrorDisplayProps, "children"> = {
    buttonText: "mockButtonText",
    handleClick: jest.fn(),
    titleText: "mockTitleText",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    resetProps();
  });

  const arrange = () => {
    render(<ErrorDisplay {...currentProps}>{mockMessage}</ErrorDisplay>);
  };

  const resetProps = () => (currentProps = { ...baseProps });

  const checkBillBoardRender = () => {
    it("should render the BillboardContainer component as expected", () => {
      expect(BillboardContainer).toBeCalledTimes(1);
      checkMockCall(BillboardContainer, {
        titleText: currentProps.titleText,
      });
    });
  };

  const checkChakraFlexRender = () => {
    it("should render the chakra Flex component as expected", () => {
      expect(Flex).toBeCalledTimes(1);
      checkMockCall(Flex, {
        align: "center",
        direction: "column",
        justify: "center",
      });
    });
  };

  const checkChakraIconRender = () => {
    it("should render the Chakra WarningTwoIcon as expected", () => {
      expect(WarningTwoIcon).toBeCalledTimes(1);
      checkMockCall(WarningTwoIcon, {
        boxSize: 50,
        color: mockUseColour.errorColour.icon,
      });
    });
  };

  const checkChakraContainerRender = () => {
    it("should render the chakra Container component as expected", () => {
      expect(Container).toBeCalledTimes(1);
      checkMockCall(Container, {
        centerContent: true,
        fontSize: [20, 24, 30],
        maxW: "medium",
        textAlign: "center",
      });
    });
  };

  const checkChakraStyledButtonRender = () => {
    it("should render the Button correctly", () => {
      expect(StyledButton).toBeCalledTimes(1);
      checkMockCall(StyledButton, {
        analyticsName: "Clear Error State",
        mt: 5,
      });
    });

    it("should pass the handleClick function to Button", () => {
      expect(StyledButton).toBeCalledTimes(1);
      expect(jest.mocked(StyledButton).mock.calls[0][0].onClick).toBe(
        currentProps.handleClick
      );
    });

    it("should display the Button text correctly", async () => {
      expect(await screen.findByText(currentProps.buttonText)).toBeTruthy();
    });
  };

  const checkErrorMessage = () => {
    it("should display the error message", async () => {
      expect(await screen.findByText(mockMessage)).toBeTruthy();
    });
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    checkBillBoardRender();
    checkChakraFlexRender();
    checkChakraIconRender();
    checkChakraContainerRender();
    checkChakraStyledButtonRender();
    checkErrorMessage();
  });
});
