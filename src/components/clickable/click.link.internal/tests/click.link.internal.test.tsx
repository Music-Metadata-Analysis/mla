import { Box } from "@chakra-ui/react";
import { render, screen, fireEvent } from "@testing-library/react";
import ClickInternalLink from "../click.link.internal.component";
import mockAnalyticsHook from "@src/hooks/__mocks__/analytics.mock";
import mockRouterHook from "@src/hooks/__mocks__/router.mock";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("@src/hooks/analytics");

jest.mock("@src/hooks/router");

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock(["Box"])
);

describe("ButtonLink", () => {
  const linkText = "Link";
  const mockHref = "/mock/internal/href";

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const arrange = () => {
    render(<ClickInternalLink path={mockHref}>{linkText}</ClickInternalLink>);
  };

  it("should render Box Component as expected", () => {
    expect(Box).toBeCalledTimes(1);
    checkMockCall(Box, { cursor: "pointer" });
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
      expect(call[1]).toBe(mockHref);
      expect(Object.keys(call).length).toBe(2);
    });

    it("should navigate to the selected page", () => {
      expect(mockRouterHook.push).toBeCalledTimes(1);
      expect(mockRouterHook.push).toBeCalledWith(mockHref);
    });
  });
});
