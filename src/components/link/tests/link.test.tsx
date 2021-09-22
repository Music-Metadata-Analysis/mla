import { render, screen, fireEvent } from "@testing-library/react";
import NextLink from "next/link";
import mockAnalyticsHook from "../../../hooks/tests/analytics.mock";
import ButtonLink from "../link.component";

jest.mock("next/link", () => createMockedComponent("NextLink"));

jest.mock("../../../hooks/analytics", () => ({
  __esModule: true,
  default: () => mockAnalyticsHook,
}));

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("../../../tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

describe("SimpleLink", () => {
  const linkText = "Link";
  const mockHref = "test'";

  beforeEach(() => jest.clearAllMocks());

  const arrange = () => {
    render(<ButtonLink href={mockHref}>{linkText}</ButtonLink>);
  };

  it("should render NextLink as expected", () => {
    arrange();
    expect(NextLink).toBeCalledTimes(1);
    const call = (NextLink as jest.Mock).mock.calls[0];
    expect(call[0].href).toBe(mockHref);
    expect(call[0].children).toBeDefined();
    expect(Object.keys(call[0]).length).toBe(2);
  });

  describe("when a button is clicked", () => {
    beforeEach(async () => {
      arrange();
      const link = await screen.findByText(linkText);
      expect(link).not.toBeNull();
      fireEvent.click(link as HTMLElement);
    });

    it("should call the button tracker", () => {
      expect(mockAnalyticsHook.trackButtonClick).toBeCalledTimes(1);
      const call = mockAnalyticsHook.trackButtonClick.mock.calls[0];
      expect(call[0].constructor.name).toBe("SyntheticBaseEvent");
      expect(call[1]).toBe(linkText);
      expect(Object.keys(call).length).toBe(2);
    });
  });
});
