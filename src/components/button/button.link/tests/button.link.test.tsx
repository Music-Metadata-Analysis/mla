import { render, screen, fireEvent } from "@testing-library/react";
import NextLink from "next/link";
import mockAnalyticsHook from "../../../../hooks/tests/analytics.mock";
import BaseButton from "../../button.base/button.base.component";
import StyledButtonLink from "../button.link.component";

jest.mock("next/link", () => createMockedComponent("NextLink"));

jest.mock("../../button.base/button.base.component", () =>
  createMockedComponent("BaseButton")
);

jest.mock("../../../../hooks/analytics", () => ({
  __esModule: true,
  default: () => mockAnalyticsHook,
}));

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("../../../../tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

describe("ButtonLink", () => {
  const linkText = "Link";
  const mockHref = "mockTestName";
  const mockColour = "mockColour";
  const mockClickHandler = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const arrange = () => {
    render(
      <StyledButtonLink
        onClick={mockClickHandler}
        bg={mockColour}
        href={mockHref}
      >
        {linkText}
      </StyledButtonLink>
    );
  };

  it("should render BaseButton as expected", () => {
    expect(BaseButton).toBeCalledTimes(1);
    const call = (BaseButton as jest.Mock).mock.calls[0];
    expect(call[0].bg).toBe(mockColour);
    expect(call[0].children).toBeDefined();
    expect(call[0].onClick).toBe(mockClickHandler);
    expect(Object.keys(call[0]).length).toBe(3);
  });

  it("should render NextLink as expected", () => {
    expect(NextLink).toBeCalledTimes(1);
    const call = (NextLink as jest.Mock).mock.calls[0];
    expect(call[0].href).toBe(mockHref);
    expect(call[0].passHref).toBe(true);
    expect(call[0].children).toBeDefined();
    expect(Object.keys(call[0]).length).toBe(3);
  });

  it("should pass the correct target to the <a> tag", async () => {
    const ButtonText = await screen.findByText(linkText);
    expect(ButtonText.parentElement?.parentElement).toHaveAttribute(
      "target",
      "_blank"
    );
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
