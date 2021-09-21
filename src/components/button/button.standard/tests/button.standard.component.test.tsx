import { Button } from "@chakra-ui/react";
import { render, screen, fireEvent } from "@testing-library/react";
import mockAnalyticsHook from "../../../../hooks/tests/analytics.mock";
import StyledButton from "../button.standard.component";

jest.mock("next/link", () => createMockedComponent("NextLink"));

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("../../../../tests/fixtures/mock.chakra.react.factory.class");
  return factoryInstance.create(["Button"]);
});

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

describe("StandardButton", () => {
  const linkText = "Link";
  const mockClickHandler = jest.fn();
  const mockAnalyticsName = "mockAnalyticsTestName";

  beforeEach(() => jest.clearAllMocks());

  const arrange = () => {
    render(
      <StyledButton
        analyticsName={mockAnalyticsName}
        onClick={mockClickHandler}
      >
        {linkText}
      </StyledButton>
    );
  };

  it("should render Button as expected", () => {
    arrange();
    expect(Button).toBeCalledTimes(1);
    const call = (Button as jest.Mock).mock.calls[0];
    expect(call[0].bg).toBeDefined();
    expect(call[0].borderWidth).toBeDefined();
    expect(call[0].borderColor).toBeDefined();
    expect(call[0].children).toBeDefined();
    expect(call[0].color).toBeDefined();
    expect(call[0].onClick).toBe(mockClickHandler);
    expect(Object.keys(call[0]).length).toBe(6);
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
      expect(call[1]).toBe(mockAnalyticsName);
      expect(Object.keys(call).length).toBe(2);
    });
  });
});
