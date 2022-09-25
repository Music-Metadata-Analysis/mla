import { render } from "@testing-library/react";
import NavBarProvider, { NavBarContext } from "../navbar.provider";
import type { NavBarContextInterface } from "@src/types/navbar.types";

describe("NavBarProvider", () => {
  const received: Partial<NavBarContextInterface> = {};

  const arrange = () => {
    render(
      <NavBarProvider>
        <NavBarContext.Consumer>
          {(state) => (
            <div>
              {"Place Holder Div"}
              {JSON.stringify(Object.assign(received, state))}
            </div>
          )}
        </NavBarContext.Consumer>
      </NavBarProvider>
    );
  };

  describe("when initialized", () => {
    beforeEach(() => {
      arrange();
    });

    it("should contain the expected getters", () => {
      const properties = received as NavBarContextInterface;
      expect(typeof properties.getters.isVisible).toBe("boolean");
      expect(typeof properties.getters.isHamburgerEnabled).toBe("boolean");
    });

    it("should contain the expected setters", () => {
      const properties = received as NavBarContextInterface;
      expect(typeof properties.setters.setIsVisible).toBe("function");
      expect(typeof properties.setters.setIsHamburgerEnabled).toBe("function");
    });
  });
});
