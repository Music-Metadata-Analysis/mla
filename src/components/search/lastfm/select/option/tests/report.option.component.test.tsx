import { Flex } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import ReportOption from "../report.option.component";
import { testIDs } from "../report.option.identifiers";
import Button from "@src/components/button/button.standard/button.standard.component";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock(["Flex"])
);

jest.mock(
  "@src/components/button/button.standard/button.standard.component",
  () => require("@fixtures/react/parent").createComponent("Button")
);

describe("ReportOption", () => {
  let display: boolean;

  const mockAnalyticsName = "mockAnalyticsName";
  const mockButtonText = "mockButtonText";
  const mockIndicatorText = "mockIndicatorText";

  const mockClickHandler = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    render(
      <ReportOption
        analyticsName={mockAnalyticsName}
        buttonText={mockButtonText}
        clickHandler={mockClickHandler}
        displayIndicator={display}
        indicatorText={mockIndicatorText}
      />
    );
  };

  const checkChakraFlexRender = () => {
    it("should render the chakra Flex component with the correct props", () => {
      expect(Flex).toBeCalledTimes(1);
      checkMockCall(Flex, {
        align: "center",
        justify: "center",
        mt: 2,
      });
    });
  };

  const checkButtonRender = () => {
    it("should render the Button component with the correct props", () => {
      expect(Button).toBeCalledTimes(1);
      checkMockCall(Button, {
        analyticsName: mockAnalyticsName,
        "data-testid": testIDs.OptionButton,
        m: 1,
        w: [150, 150, 200],
      });
    });
  };

  describe("when indicators are visible", () => {
    beforeEach(() => {
      display = true;

      arrange();
    });

    it("should display the indicator text", async () => {
      expect(await screen.findByText(mockIndicatorText + ":")).toBeTruthy();
    });

    it("should display the button text", async () => {
      expect(await screen.findByText(mockButtonText)).toBeTruthy();
    });

    checkChakraFlexRender();
    checkButtonRender();
  });

  describe("when indicators are NOT visible", () => {
    beforeEach(() => {
      display = false;

      arrange();
    });

    it("should NOT display the indicator text", () => {
      expect(screen.queryByText(mockIndicatorText + ":")).toBeNull();
    });

    it("should display the button text", async () => {
      expect(await screen.findByText(mockButtonText)).toBeTruthy();
    });

    checkChakraFlexRender();
    checkButtonRender();
  });
});
