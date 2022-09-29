import { Button } from "@chakra-ui/react";
import { render, screen, fireEvent } from "@testing-library/react";
import NavBarLink from "../navbar.link.component";
import mockColourHook from "@src/hooks/__mocks__/colour.mock";
import mockRouterHook from "@src/hooks/__mocks__/router.mock";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("@src/hooks/colour");

jest.mock("@src/hooks/router");

jest.mock("@chakra-ui/react", () => {
  const { createChakraMock } = require("@fixtures/chakra");
  return createChakraMock(["Button"]);
});

describe("NavBarLink", () => {
  const linkText = "Link";
  const mockPath = "test";
  const mockClickTracker = jest.fn();
  let selected: boolean;

  beforeEach(() => jest.clearAllMocks());

  const arrange = () => {
    render(
      <NavBarLink
        path={mockPath}
        selected={selected}
        trackButtonClick={mockClickTracker}
      >
        {linkText}
      </NavBarLink>
    );
  };

  const checkButtonProps = () => {
    checkMockCall(
      Button,
      {
        _hover: {
          bg: mockColourHook.navButtonColour.hoverBackground,
          textDecoration: "none",
        },
        bg: mockColourHook.navButtonColour.background,
        borderColor: selected
          ? mockColourHook.navButtonColour.selectedBackground
          : mockColourHook.transparent,
        pl: [1, 1, 2],
        pr: [1, 1, 2],
        rounded: "md",
      },
      0,
      ["onClick"],
      true
    );
  };

  describe("when selected is true", () => {
    beforeEach(() => {
      selected = true;
      arrange();
    });

    it("should render the Button as expected", () => {
      expect(Button).toBeCalledTimes(1);
      checkButtonProps();
    });

    it("should have the correct styles", async () => {
      const link = await screen.findByText(linkText);
      expect(link).toHaveStyleRule("width", "100%");
      expect(link).toHaveStyleRule("border-radius", "10px");
      expect(link).toHaveStyleRule("border-width", "3px");
    });
  });

  describe("when selected is false", () => {
    beforeEach(() => {
      selected = false;
      arrange();
    });

    it("should render the Button as expected", () => {
      expect(Button).toBeCalledTimes(1);
      checkButtonProps();
    });

    it("should have the correct styles", async () => {
      const link = await screen.findByText(linkText);
      expect(link).toHaveStyleRule("width", "100%");
      expect(link).toHaveStyleRule("border-radius", "10px");
      expect(link).toHaveStyleRule("border-width", "3px");
    });

    describe("when a button is clicked", () => {
      beforeEach(async () => {
        const link = await screen.findByText(linkText);
        expect(link).not.toBeNull();
        fireEvent.click(link as HTMLElement);
      });

      it("should render the Button as expected", () => {
        expect(Button).toBeCalledTimes(1);
        checkButtonProps();
      });

      it("should call the click tracker", () => {
        expect(mockClickTracker).toBeCalledTimes(1);
        const call = mockClickTracker.mock.calls[0];
        expect(call[0].constructor.name).toBe("SyntheticBaseEvent");
        expect(call[1]).toBe(linkText);
        expect(Object.keys(call).length).toBe(2);
      });

      it("should route to the expected page", () => {
        expect(mockRouterHook.push).toBeCalledTimes(1);
        expect(mockRouterHook.push).toBeCalledWith(mockPath);
      });
    });
  });
});
