import { render } from "@testing-library/react";
import NavBarControllerProvider, {
  NavBarControllerContext,
} from "../navbar.provider";
import type { NavBarControllerContextInterface } from "@src/web/navigation/navbar/types/state/provider.types";

describe("NavBarControllerProvider", () => {
  const received: Partial<NavBarControllerContextInterface> = {};

  const arrange = () => {
    render(
      <NavBarControllerProvider>
        <NavBarControllerContext.Consumer>
          {(state) => (
            <div>
              {"Place Holder Div"}
              {JSON.stringify(Object.assign(received, state))}
            </div>
          )}
        </NavBarControllerContext.Consumer>
      </NavBarControllerProvider>
    );
  };

  describe("when initialized", () => {
    beforeEach(() => {
      arrange();
    });

    const checkIsToggle = (name: keyof NavBarControllerContextInterface) => {
      it(`should contain the expected ${name} properties`, () => {
        const properties = received as NavBarControllerContextInterface;
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
