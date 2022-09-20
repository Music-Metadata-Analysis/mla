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

    const checkIsToggle = (name: keyof NavBarContextInterface) => {
      it(`should contain the expected ${name} properties`, () => {
        const properties = received as NavBarContextInterface;
        expect(typeof properties[name].state).toBe("boolean");
        expect(typeof properties[name].setFalse).toBe("function");
        expect(typeof properties[name].setTrue).toBe("function");
        expect(typeof properties[name].toggle).toBe("function");
      });
    };

    checkIsToggle("hamburger");
    checkIsToggle("mobileMenu");
    checkIsToggle("navigation");
  });
});
