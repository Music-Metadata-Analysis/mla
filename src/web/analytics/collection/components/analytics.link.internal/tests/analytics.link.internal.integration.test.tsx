import { render, screen, fireEvent } from "@testing-library/react";
import AnalyticsInternalLinkWrapperContainer from "../analytics.link.internal.container";
import mockAnalyticsCollectionHook from "@src/web/analytics/collection/state/hooks/__mocks__/analytics.hook.mock";

jest.mock("@src/web/analytics/collection/state/hooks/analytics.hook");

describe("AnalyticsInternalLinkWrapper", () => {
  const buttonText = "Click Me";
  const mockLinkName = "test button";
  const mockClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const arrange = () => {
    render(
      <AnalyticsInternalLinkWrapperContainer href={mockLinkName}>
        <button onClick={mockClick}>{buttonText}</button>
      </AnalyticsInternalLinkWrapperContainer>
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

    it("should call the button tracker", () => {
      expect(
        mockAnalyticsCollectionHook.trackInternalLinkClick
      ).toHaveBeenCalledTimes(1);
      const call =
        mockAnalyticsCollectionHook.trackInternalLinkClick.mock.calls[0];
      expect(call[0].constructor.name).toBe("SyntheticBaseEvent");
      expect(call[1]).toBe(mockLinkName);
      expect(Object.keys(call).length).toBe(2);
    });
  });
});
