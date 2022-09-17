import { render, screen } from "@testing-library/react";
import checkMockCall from "../../../../../../tests/fixtures/mock.component.call";
import Button from "../../../../../button/button.standard/button.standard.component";
import Option from "../select.option.component";

jest.mock(
  "../../../../../button/button.standard/button.standard.component",
  () => createMockedComponent("Button")
);

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("../../../../../../tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

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
        "data-testid": "OptionButton",
        m: 1,
        w: [150, 150, 200],
      });
    });
  });
});
