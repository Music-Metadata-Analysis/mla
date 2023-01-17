import { Box } from "@chakra-ui/react";
import { render, screen, fireEvent } from "@testing-library/react";
import ClickInternalLink from "../click.link.internal.component";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import mockAnalyticsHook from "@src/hooks/__mocks__/analytics.hook.mock";

jest.mock("@src/hooks/analytics.hook");

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock(["Box"])
);

describe("ClickInternalLink", () => {
  const linkText = "Link";
  const mockPath = "/mock/internal/path";

  const mockRouterClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const arrange = () => {
    render(
      <ClickInternalLink clickHandler={mockRouterClick} path={mockPath}>
        {linkText}
      </ClickInternalLink>
    );
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
      expect(call[1]).toBe(mockPath);
      expect(Object.keys(call).length).toBe(2);
    });

    it("should call the routing click handler", () => {
      expect(mockRouterClick).toBeCalledTimes(1);
    });
  });
});
