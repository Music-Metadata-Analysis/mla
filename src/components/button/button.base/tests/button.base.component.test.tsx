import { Button } from "@chakra-ui/react";
import { render, screen, fireEvent } from "@testing-library/react";
import BaseButton from "../button.base.component";
import mockAnalyticsHook from "@src/hooks/tests/analytics.mock.hook";
import mockColourHook from "@src/hooks/tests/colour.hook.mock";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("@src/hooks/colour", () => () => mockColourHook);

jest.mock("@src/hooks/analytics", () => () => mockAnalyticsHook);

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("@src/tests/fixtures/mock.chakra.react.factory.class");
  return factoryInstance.create(["Button"]);
});

describe("StandardButton", () => {
  const linkText = "Link";
  const mockClickHandler = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  const arrange = () => {
    render(<BaseButton onClick={mockClickHandler}>{linkText}</BaseButton>);
  };

  it("should render Button as expected", () => {
    arrange();
    expect(Button).toBeCalledTimes(1);
    checkMockCall(Button, {
      _hover: {
        bg: mockColourHook.buttonColour.hoverBackground,
      },
      bg: mockColourHook.buttonColour.background,
      borderColor: mockColourHook.buttonColour.border,
      borderWidth: 1,
      color: mockColourHook.buttonColour.foreground,
    });
  });

  describe("when a button is clicked", () => {
    beforeEach(async () => {
      arrange();
      const link = await screen.findByText(linkText);
      expect(link).not.toBeNull();
      fireEvent.click(link as HTMLElement);
    });

    it("should call the mock handler as expected", () => {
      expect(mockClickHandler).toBeCalledTimes(1);
    });
  });
});
