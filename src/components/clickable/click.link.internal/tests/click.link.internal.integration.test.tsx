import { render, screen, fireEvent } from "@testing-library/react";
import ClickInternalLinkContainer from "../click.link.internal.container";
import mockAnalyticsHook from "@src/hooks/__mocks__/analytics.hook.mock";
import mockRouterHook from "@src/web/navigation/routing/hooks/__mocks__/router.hook.mock";

jest.mock("@src/hooks/analytics.hook");

jest.mock("@src/web/navigation/routing/hooks/router.hook");

describe("ClickInternalLink", () => {
  const linkText = "Link";
  const mockPath = "/mock/internal/path";

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const arrange = () => {
    render(
      <ClickInternalLinkContainer path={mockPath}>
        {linkText}
      </ClickInternalLinkContainer>
    );
  };

  it("should render test link as expected", async () => {
    expect(await screen.findByText(linkText)).toBeTruthy();
  });

  describe("when the link is clicked", () => {
    beforeEach(async () => {
      const link = await screen.findByText(linkText);
      expect(link).not.toBeNull();
      fireEvent.click(link as HTMLElement);
    });

    it("should call the link click tracker", () => {
      expect(mockAnalyticsHook.trackInternalLinkClick).toBeCalledTimes(1);
      const call = mockAnalyticsHook.trackInternalLinkClick.mock.calls[0];
      expect(call[0].constructor.name).toBe("SyntheticBaseEvent");
      expect(call[1]).toBe(mockPath);
      expect(Object.keys(call).length).toBe(2);
    });

    it("should navigate to the selected page", () => {
      expect(mockRouterHook.push).toBeCalledTimes(1);
      expect(mockRouterHook.push).toBeCalledWith(mockPath);
    });
  });
});
