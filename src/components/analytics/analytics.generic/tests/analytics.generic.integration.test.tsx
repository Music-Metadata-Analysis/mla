import { render, fireEvent, screen } from "@testing-library/react";
import AnalyticsButtonGenericContainer from "../analytics.generic.container";
import mockAnalyticsHook from "@src/hooks/__mocks__/analytics.hook.mock";
import { analyticsVendor } from "@src/vendors/integrations/analytics/vendor";

jest.mock("@src/hooks/analytics.hook");

describe("AnalyticsGenericWrapper", () => {
  const buttonText = "Click Me";
  const mockEvent = new analyticsVendor.EventDefinition({
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
