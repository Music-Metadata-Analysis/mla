import { Button } from "@chakra-ui/react";
import { render, screen, fireEvent } from "@testing-library/react";
import mockRouter from "../../../../tests/fixtures/mock.router";
import NavBarLink from "../navbar.link.component";

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("../../../../tests/fixtures/mock.chakra.react.factory.class");
  return factoryInstance.create(["Button"]);
});

jest.mock("next/router", () => ({
  __esModule: true,
  useRouter: () => mockRouter,
}));

describe("NavBarLink", () => {
  const linkText = "Link";
  const mockHref = "test";
  const mockClickTracker = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  const arrange = (selected: boolean) => {
    render(
      <NavBarLink
        href={mockHref}
        selected={selected}
        trackButtonClick={mockClickTracker}
      >
        {linkText}
      </NavBarLink>
    );
  };

  const checkButtonProps = () => {
    const call = (Button as jest.Mock).mock.calls[0];
    expect(call[0].px).toBe(2);
    expect(call[0].py).toBe(1);
    expect(call[0].rounded).toBe("md");
    expect(call[0].children).toBeDefined();
    expect(call[0]._hover).toBeDefined();
    expect(call[0].bg).toBeDefined();
    expect(call[0].onClick).toBeDefined();
    expect(Object.keys(call[0]).length).toBe(8);
  };

  describe("when selected is true", () => {
    beforeEach(() => arrange(true));

    it("should render the Button as expected", () => {
      expect(Button).toBeCalledTimes(1);
      checkButtonProps();
    });

    it("should have the correct styles", async () => {
      const link = await screen.findByText(linkText);
      expect(link).toHaveStyleRule("width", "100%");
      expect(link).not.toHaveStyleRule("margin", "3px");
      expect(link).toHaveStyleRule("border-radius", "10px");
      expect(link).toHaveStyleRule("border-width", "3px");
    });
  });

  describe("when selected is false", () => {
    beforeEach(() => arrange(false));

    it("should render the Button as expected", () => {
      expect(Button).toBeCalledTimes(1);
      checkButtonProps();
    });

    it("should have the correct styles", async () => {
      const link = await screen.findByText(linkText);
      expect(link).toHaveStyleRule("width", "100%");
      expect(link).toHaveStyleRule("margin", "3px");
      expect(link).not.toHaveStyleRule("border-radius", "10px");
      expect(link).not.toHaveStyleRule("border-width", "3px");
    });
  });

  describe("when a button is clicked", () => {
    beforeEach(async () => {
      arrange(false);
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
      expect(mockRouter.push).toBeCalledTimes(1);
      expect(mockRouter.push).toBeCalledWith(mockHref);
    });
  });
});
