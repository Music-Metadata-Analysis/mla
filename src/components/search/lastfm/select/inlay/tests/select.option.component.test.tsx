import { render, screen } from "@testing-library/react";
import Option, { testIDs } from "../select.option.component";
import Button from "@src/components/button/button.standard/button.standard.component";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock(
  "@src/components/button/button.standard/button.standard.component",
  () => {
    const { createComponent } = require("@fixtures/react");
    return createComponent("Button");
  }
);

describe("SearchSelection", () => {
  const mockClickHandler = jest.fn();
  const mockAnalyticsName = "mockAnalyticsName";
  const mockButtonText = "mockButtonText";
  const mockIndicatorText = "mockIndicatorText";
  let visible: boolean;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    render(
      <Option
        analyticsName={mockAnalyticsName}
        buttonText={mockButtonText}
        clickHandler={mockClickHandler}
        visibleIndicators={visible}
        indicatorText={mockIndicatorText}
      />
    );
  };

  describe("when indicators are visible", () => {
    beforeEach(() => {
      visible = true;
      arrange();
    });

    it("should display the indicator text", async () => {
      expect(await screen.findByText(mockIndicatorText + ":")).toBeTruthy();
    });

    it("should display the button text", async () => {
      expect(await screen.findByText(mockButtonText)).toBeTruthy();
    });

    it("should render the button with the correct props", () => {
      expect(Button).toBeCalledTimes(1);
      checkMockCall(Button, {
        analyticsName: "mockAnalyticsName",
        "data-testid": "OptionButton",
        m: 1,
        w: [150, 150, 200],
      });
    });
  });

  describe("when indicators are NOT visible", () => {
    beforeEach(() => {
      visible = false;
      arrange();
    });

    it("should NOT display the indicator text", () => {
      expect(screen.queryByText(mockIndicatorText + ":")).toBeNull();
    });

    it("should display the button text", async () => {
      expect(await screen.findByText(mockButtonText)).toBeTruthy();
    });

    it("should render the button with the correct props", () => {
      expect(Button).toBeCalledTimes(1);
      checkMockCall(Button, {
        analyticsName: "mockAnalyticsName",
        "data-testid": testIDs.OptionButton,
        m: 1,
        w: [150, 150, 200],
      });
    });
  });
});
