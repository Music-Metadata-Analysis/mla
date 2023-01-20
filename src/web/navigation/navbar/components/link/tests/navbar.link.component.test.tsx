import { Button } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import NavBarLink from "../navbar.link.component";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import mockColourHook from "@src/hooks/ui/__mocks__/colour.hook.mock";

jest.mock("@src/hooks/ui/colour.hook");

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock(["Button"])
);

describe("NavBarLink", () => {
  let mockSelected: boolean;
  let mockTransaction: boolean;

  const linkText = "Link";
  const mockHandleClick = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  const arrange = () => {
    render(
      <NavBarLink
        handleClick={mockHandleClick}
        selected={mockSelected}
        transaction={mockTransaction}
      >
        {linkText}
      </NavBarLink>
    );
  };

  const checkChakraButton = ({
    expectedBorderColour,
  }: {
    expectedBorderColour: string;
  }) => {
    it("should call the underlying StyledButton component as expected", () => {
      checkMockCall(
        Button,
        {
          _hover: {
            bg: mockColourHook.navButtonColour.hoverBackground,
            textDecoration: "none",
          },
          bg: mockColourHook.navButtonColour.background,
          borderColor: expectedBorderColour,
          disabled: mockTransaction,
          m: [1, 2, 2],
          pl: [1, 2, 2],
          pr: [1, 2, 2],
          rounded: "md",
        },
        0,
        ["onClick"],
        true
      );
    });

    it("should have the correct styles", async () => {
      const link = await screen.findByText(linkText);
      expect(link).toHaveStyleRule("width", "100%");
      expect(link).toHaveStyleRule("border-radius", "10px");
      expect(link).toHaveStyleRule("border-width", "3px");
    });
  };

  describe("when there is NOT a transaction", () => {
    beforeEach(() => (mockTransaction = false));

    describe("when selected is false", () => {
      beforeEach(() => {
        mockSelected = false;

        arrange();
      });

      checkChakraButton({ expectedBorderColour: mockColourHook.transparent });
    });

    describe("when selected is true", () => {
      beforeEach(() => {
        mockSelected = true;

        arrange();
      });

      checkChakraButton({
        expectedBorderColour: mockColourHook.navButtonColour.selectedBackground,
      });
    });
  });

  describe("when there is a transaction", () => {
    beforeEach(() => (mockTransaction = true));

    describe("when selected is false", () => {
      beforeEach(() => {
        mockSelected = false;

        arrange();
      });

      checkChakraButton({ expectedBorderColour: mockColourHook.transparent });
    });

    describe("when selected is true", () => {
      beforeEach(() => {
        mockSelected = true;

        arrange();
      });

      checkChakraButton({
        expectedBorderColour: mockColourHook.navButtonColour.selectedBackground,
      });
    });
  });
});
