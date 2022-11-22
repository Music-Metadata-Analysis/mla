import { render, fireEvent, screen } from "@testing-library/react";
import AnalyticsButtonGenericContainer from "../analytics.generic.container";
import Event from "@src/events/event.class";
import mockAnalyticsHook from "@src/hooks/__mocks__/analytics.mock";

jest.mock("@src/hooks/analytics");

describe("AnalyticsGenericWrapper", () => {
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
      <AnalyticsButtonGenericContainer eventDefinition={mockEvent}>
        <button onClick={mockClick}>{buttonText}</button>
      </AnalyticsButtonGenericContainer>
    );
  };

  describe("when clicked", () => {
    beforeEach(async () =>
      fireEvent.click(await screen.findByText(buttonText))
    );

    it("should call the click handler as expected", () => {
      expect(mockClick).toBeCalledTimes(1);
    });

    it("should call the analytics event emitter", () => {
      expect(mockAnalyticsHook.event).toBeCalledTimes(1);
      expect(mockAnalyticsHook.event).toBeCalledWith(mockEvent);
    });
  });
});
