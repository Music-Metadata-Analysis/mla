import { render, screen, fireEvent } from "@testing-library/react";
import AnalyticsGenericWrapper from "../analytics.generic.component";
import Event from "@src/events/event.class";
import mockAnalyticsHook from "@src/hooks/__mocks__/analytics.mock";

jest.mock("@src/hooks/analytics");

describe("AnalyticsEventWrapper", () => {
  const buttonText = "Click Me";
  const mockEvent = new Event({
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
      <AnalyticsGenericWrapper eventDefinition={mockEvent}>
        <button onClick={mockClick}>{buttonText}</button>
      </AnalyticsGenericWrapper>
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
