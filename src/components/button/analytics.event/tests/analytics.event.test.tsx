import { render, screen, fireEvent } from "@testing-library/react";
import EventDefinition from "../../../../events/event.class";
import mockAnalyticsHook from "../../../../hooks/tests/analytics.mock";
import AnalyticsEventWrapper from "../analytics.event.component";

jest.mock("../../../../hooks/analytics", () => ({
  __esModule: true,
  default: () => mockAnalyticsHook,
}));

describe("AnalyticsEventWrapper", () => {
  const buttonText = "Click Me";
  const mockEvent = new EventDefinition({
    category: "TEST",
    label: "TEST",
    action: "Test Event",
    value: 0,
  });
  const mockClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const arrange = () => {
    render(
      <AnalyticsEventWrapper eventDefinition={mockEvent}>
        <button onClick={mockClick}>{buttonText}</button>
      </AnalyticsEventWrapper>
    );
  };

  it("should render test button as expected", async () => {
    expect(await screen.findByText(buttonText)).toBeTruthy();
  });

  describe("when the test button is clicked", () => {
    beforeEach(async () => {
      const link = await screen.findByText(buttonText);
      expect(link).not.toBeNull();
      fireEvent.click(link as HTMLElement);
    });

    it("should call the event tracker", () => {
      expect(mockAnalyticsHook.event).toBeCalledTimes(1);
      expect(mockAnalyticsHook.event).toBeCalledWith(mockEvent);
    });
  });
});
