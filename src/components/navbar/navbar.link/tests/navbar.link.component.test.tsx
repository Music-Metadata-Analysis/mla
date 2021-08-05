import { render, screen, fireEvent } from "@testing-library/react";
import NextLink from "next/link";
import NavBarLink from "../navbar.link.component";

jest.mock("next/link", () => ({
  __esModule: true,
  default: jest
    .fn()
    .mockImplementation(
      ({ children }: { children: React.ReactChild }) => children
    ),
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

  describe("when selected is true", () => {
    beforeEach(() => arrange(true));

    it("should render NextLink as expected", () => {
      expect(NextLink).toBeCalledTimes(1);
      const call = (NextLink as jest.Mock).mock.calls[0];
      expect(call[0].href).toBe(mockHref);
      expect(call[0].passHref).toBe(true);
      expect(call[0].children).toBeDefined();
      expect(Object.keys(call[0]).length).toBe(3);
    });

    it("should have the correct styles", async () => {
      const link = (await screen.findByText(linkText)).parentElement;
      expect(link).toHaveStyleRule("border-radius", "10px");
      expect(link).toHaveStyleRule("border-width", "3px");
    });
  });

  describe("when selected is false", () => {
    beforeEach(() => arrange(false));

    it("should render NextLink as expected", () => {
      expect(NextLink).toBeCalledTimes(1);
      const call = (NextLink as jest.Mock).mock.calls[0];
      expect(call[0].href).toBe(mockHref);
      expect(call[0].passHref).toBe(true);
      expect(call[0].children).toBeDefined();
      expect(Object.keys(call[0]).length).toBe(3);
    });

    it("should have the correct styles", async () => {
      const link = (await screen.findByText(linkText)).parentElement;
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

    it("should render NextLink as expected", () => {
      expect(NextLink).toBeCalledTimes(1);
      const call = (NextLink as jest.Mock).mock.calls[0];
      expect(call[0].href).toBe(mockHref);
      expect(call[0].passHref).toBe(true);
      expect(call[0].children).toBeDefined();
      expect(Object.keys(call[0]).length).toBe(3);
    });

    it("should call the click tracker", () => {
      expect(mockClickTracker).toBeCalledTimes(1);
      const call = mockClickTracker.mock.calls[0];
      expect(call[0].constructor.name).toBe("SyntheticBaseEvent");
      expect(call[1]).toBe(linkText);
      expect(Object.keys(call).length).toBe(2);
    });
  });
});
