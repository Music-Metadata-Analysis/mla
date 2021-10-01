import { render } from "@testing-library/react";
import NavBarProvider, { NavBarContext } from "../navbar.provider";
import type { NavBarContextInterface } from "../../../types/navbar.types";

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

    it("should contain the expected properties", () => {
      const properties = received as NavBarContextInterface;
      expect(typeof properties.isVisible).toBe("boolean");
      expect(typeof properties.setIsVisible).toBe("function");
    });
  });
});
