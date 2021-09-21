import { render, screen } from "@testing-library/react";
import NextLink from "next/link";
import mockAnalyticsHook from "../../../../hooks/tests/analytics.mock";
import StyledButton from "../../button.standard/button.standard.component";
import StyledButtonLink from "../button.link.component";

jest.mock("next/link", () => createMockedComponent("NextLink"));

jest.mock("../../button.standard/button.standard.component", () =>
  createMockedComponent("StyledButton")
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
  const mockAnalyticsName = "mockAnalyticsTestName";
  const mockColour = "mockColour";

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const arrange = () => {
    render(
      <StyledButtonLink
        bg={mockColour}
        analyticsName={mockAnalyticsName}
        href={mockHref}
      >
        {linkText}
      </StyledButtonLink>
    );
  };

  it("should render StyledButton as expected", () => {
    expect(StyledButton).toBeCalledTimes(1);
    const call = (StyledButton as jest.Mock).mock.calls[0];
    expect(call[0].bg).toBe(mockColour);
    expect(call[0].analyticsName).toBe(mockAnalyticsName);
    expect(call[0].children).toBeDefined();
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
    expect(ButtonText.parentElement).toHaveAttribute("target", "_blank");
  });
});
