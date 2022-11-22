import { render, fireEvent, screen } from "@testing-library/react";
import AnalyticsButtonWrapperContainer from "../analytics.button.container";
import mockAnalyticsHook from "@src/hooks/__mocks__/analytics.mock";

jest.mock("@src/hooks/analytics");

describe("AnalyticsButtonWrapper", () => {
  const buttonText = "Click Me";
  const mockButtonName = "test button";

  const mockClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const arrange = () => {
    render(
      <AnalyticsButtonWrapperContainer buttonName={mockButtonName}>
        <button onClick={mockClick}>{buttonText}</button>
      </AnalyticsButtonWrapperContainer>
    );
  };

  describe("when clicked", () => {
    beforeEach(async () =>
      fireEvent.click(await screen.findByText(buttonText))
    );

    it("should call the click handler as expected", () => {
      expect(mockClick).toBeCalledTimes(1);
    });

    it("should call the analytics button tracker", () => {
      expect(mockAnalyticsHook.trackButtonClick).toBeCalledTimes(1);
      const call = mockAnalyticsHook.trackButtonClick.mock.calls[0];
      expect(call[0].constructor.name).toBe("SyntheticBaseEvent");
      expect(call[1]).toBe(mockButtonName);
      expect(Object.keys(call).length).toBe(2);
    });
  });
});
