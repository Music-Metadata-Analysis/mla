import { render, screen, fireEvent } from "@testing-library/react";
import ClickExternalLink from "../click.link.external.component";
import mockAnalyticsHook from "@src/web/analytics/collection/state/hooks/__mocks__/analytics.hook.mock";

jest.mock("@src/web/analytics/collection/state/hooks/analytics.hook");

describe("ButtonLink", () => {
  const linkText = "Link";
  const mockHref = "mockTestName";

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const arrange = () => {
    render(<ClickExternalLink href={mockHref}>{linkText}</ClickExternalLink>);
  };

  it("should render the <a> tag correctly", async () => {
    const LinkText = await screen.findByText(linkText);
    expect(LinkText.parentElement).toHaveAttribute("href", mockHref);
    expect(LinkText.parentElement).toHaveAttribute("rel", "noreferrer");
    expect(LinkText.parentElement).toHaveAttribute("target", "_blank");
  });

  describe("when the link is clicked", () => {
    beforeEach(async () => {
      const link = await screen.findByText(linkText);
      expect(link).not.toBeNull();
      fireEvent.click(link as HTMLElement);
    });

    it("should call the link click tracker", () => {
      expect(mockAnalyticsHook.trackExternalLinkClick).toBeCalledTimes(1);
      const call = mockAnalyticsHook.trackExternalLinkClick.mock.calls[0];
      expect(call[0].constructor.name).toBe("SyntheticBaseEvent");
      expect(call[1]).toBe(mockHref);
      expect(Object.keys(call).length).toBe(2);
    });
  });
});
