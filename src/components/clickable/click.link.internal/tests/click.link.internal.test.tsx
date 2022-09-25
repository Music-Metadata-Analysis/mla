import { render, screen, fireEvent } from "@testing-library/react";
import NextLink from "next/link";
import ClickInternalLink from "../click.link.internal.component";
import mockAnalyticsHook from "@src/hooks/tests/analytics.mock.hook";

jest.mock("next/link", () => createMockedComponent("NextLink"));

jest.mock("@src/hooks/analytics", () => () => mockAnalyticsHook);

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("@src/tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

describe("ButtonLink", () => {
  const linkText = "Link";
  const mockHref = "mockTestName";

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const arrange = () => {
    render(<ClickInternalLink href={mockHref}>{linkText}</ClickInternalLink>);
  };

  it("should render NextLink as expected", () => {
    expect(NextLink).toBeCalledTimes(1);
    const call = (NextLink as jest.Mock).mock.calls[0];
    expect(call[0].href).toBe(mockHref);
    expect(call[0].children).toBeDefined();
    expect(Object.keys(call[0]).length).toBe(2);
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
  });
});
