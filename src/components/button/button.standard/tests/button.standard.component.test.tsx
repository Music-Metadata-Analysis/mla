import { render, screen, fireEvent } from "@testing-library/react";
import mockAnalyticsHook from "../../../../hooks/tests/analytics.mock";
import checkMockCall from "../../../../tests/fixtures/mock.component.call";
import BaseButton from "../../button.base/button.base.component";
import StyledButton from "../button.standard.component";

jest.mock("../../button.base/button.base.component", () =>
  createMockedComponent("BaseButton")
);

jest.mock("../../../../hooks/analytics", () => ({
  __esModule: true,
  default: () => mockAnalyticsHook,
}));

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("../../../../tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

describe("StandardButton", () => {
  const linkText = "Link";
  const mockTestId = "mockTestId";
  const mockClickHandler = jest.fn();
  const mockAnalyticsName = "mockAnalyticsTestName";

  beforeEach(() => jest.clearAllMocks());

  const arrange = () => {
    render(
      <StyledButton
        data-testid={mockTestId}
        analyticsName={mockAnalyticsName}
        onClick={mockClickHandler}
      >
        {linkText}
      </StyledButton>
    );
  };

  it("should render BaseButton as expected", () => {
    arrange();
    expect(BaseButton).toBeCalledTimes(1);
    checkMockCall(BaseButton, {
      "data-testid": mockTestId,
    });
    expect((BaseButton as jest.Mock).mock.calls[0][0].onClick).toBe(
      mockClickHandler
    );
  });

  describe("when the button is clicked", () => {
    beforeEach(async () => {
      arrange();
      const link = await screen.findByText(linkText);
      expect(link).not.toBeNull();
      fireEvent.click(link as HTMLElement);
    });

    it("should call the button click tracker", () => {
      expect(mockAnalyticsHook.trackButtonClick).toBeCalledTimes(1);
      const call = mockAnalyticsHook.trackButtonClick.mock.calls[0];
      expect(call[0].constructor.name).toBe("SyntheticBaseEvent");
      expect(call[1]).toBe(mockAnalyticsName);
      expect(Object.keys(call).length).toBe(2);
    });
  });
});
