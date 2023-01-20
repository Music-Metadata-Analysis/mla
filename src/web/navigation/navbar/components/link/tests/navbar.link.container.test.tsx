import { render } from "@testing-library/react";
import NavBarLink from "../navbar.link.component";
import NavBarLinkContainer from "../navbar.link.container";
import mockRouterHook from "@src/web/navigation/routing/hooks/__mocks__/router.hook.mock";
import type { MouseEvent } from "react";

jest.mock("@src/web/navigation/routing/hooks/router.hook");

jest.mock("../navbar.link.component", () =>
  require("@fixtures/react/child").createComponent(["NavBarLink"])
);

describe("NavBarLinkContainer", () => {
  let mockPath: string;
  let mockTransaction: boolean;
  let mockSelected: boolean;

  const mockMouseEvent = { button: 0 } as MouseEvent<HTMLElement>;
  const mockCloseMobileMenu = jest.fn();
  const mockTracker = jest.fn();
  const linkText = "Link";

  beforeEach(() => jest.clearAllMocks());

  const arrange = () => {
    render(
      <NavBarLinkContainer
        closeMobileMenu={mockCloseMobileMenu}
        path={mockPath}
        selected={mockSelected}
        tracker={mockTracker}
        transaction={mockTransaction}
      >
        {linkText}
      </NavBarLinkContainer>
    );
  };

  const checkNavBarLink = () => {
    it("should render the title NavBarLink with the correct props", () => {
      expect(NavBarLink).toBeCalledTimes(1);
      const call = jest.mocked(NavBarLink).mock.calls[0][0];

      expect(call.children).toBe(linkText);
      expect(typeof call.handleClick).toBe("function");
      expect(call.selected).toBe(mockSelected);
      expect(call.transaction).toBe(mockTransaction);

      expect(Object.keys(call).length).toBe(4);
    });
  };

  const checkNavBarLinkClick = () => {
    describe("when the link click handler function is invoked", () => {
      beforeEach(() => {
        expect(NavBarLink).toBeCalledTimes(1);
        const call = jest.mocked(NavBarLink).mock.calls[0][0];
        call.handleClick(mockMouseEvent);
      });

      it("should call the analytics tracker as expected", () => {
        expect(mockTracker).toBeCalledTimes(1);
        expect(mockTracker).toBeCalledWith(mockMouseEvent, linkText);
      });

      it("should close the mobile menu as expected", () => {
        expect(mockCloseMobileMenu).toBeCalledTimes(1);
        expect(mockCloseMobileMenu).toBeCalledWith();
      });

      it("should change the url to the link's path", () => {
        expect(mockRouterHook.push).toBeCalledTimes(1);
        expect(mockRouterHook.push).toBeCalledWith(mockPath);
      });
    });
  };

  describe("when there is NOT a transaction", () => {
    beforeEach(() => (mockTransaction = false));

    describe("when selected is false", () => {
      beforeEach(() => {
        mockSelected = false;

        arrange();
      });

      checkNavBarLink();
      checkNavBarLinkClick();
    });

    describe("when selected is true", () => {
      beforeEach(() => {
        mockSelected = true;

        arrange();
      });

      checkNavBarLink();
      checkNavBarLinkClick();
    });
  });

  describe("when there is a transaction", () => {
    beforeEach(() => (mockTransaction = true));

    describe("when selected is false", () => {
      beforeEach(() => {
        mockSelected = false;

        arrange();
      });

      checkNavBarLink();
      checkNavBarLinkClick();
    });

    describe("when selected is true", () => {
      beforeEach(() => {
        mockSelected = true;

        arrange();
      });

      checkNavBarLink();
      checkNavBarLinkClick();
    });
  });
});
