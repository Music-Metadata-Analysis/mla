import { render, screen, fireEvent } from "@testing-library/react";
import AnalyticsExternalLinkWrapperContainer from "../analytics.link.external.container";
import mockAnalyticsHook from "@src/web/analytics/collection/state/hooks/__mocks__/analytics.hook.mock";

jest.mock("@src/web/analytics/collection/state/hooks/analytics.hook");

describe("AnalyticsExternalLinkWrapper", () => {
  const buttonText = "Click Me";
  const mockLink = "https://example.com";
  const mockClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const arrange = () => {
    render(
      <AnalyticsExternalLinkWrapperContainer href={mockLink}>
        <button onClick={mockClick}>{buttonText}</button>
      </AnalyticsExternalLinkWrapperContainer>
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
      expect(mockAnalyticsHook.trackExternalLinkClick).toBeCalledTimes(1);
      const call = mockAnalyticsHook.trackExternalLinkClick.mock.calls[0];
      expect(call[0].constructor.name).toBe("SyntheticBaseEvent");
      expect(call[1]).toBe(mockLink);
      expect(Object.keys(call).length).toBe(2);
    });
  });
});
