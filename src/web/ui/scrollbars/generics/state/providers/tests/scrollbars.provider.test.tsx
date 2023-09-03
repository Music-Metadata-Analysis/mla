import { render } from "@testing-library/react";
import { InitialState } from "../scrollbars.initial";
import ScrollBarsControllerProvider, {
  ScrollBarsControllerContext,
} from "../scrollbars.provider";
import type { ScrollBarsControllerContextInterface } from "@src/web/ui/scrollbars/generics/types/state/provider.types";

describe("ScrollBarsControllerProvider", () => {
  const received: Partial<ScrollBarsControllerContextInterface> = {};

  const arrange = () => {
    render(
      <ScrollBarsControllerProvider>
        <ScrollBarsControllerContext.Consumer>
          {(state) => (
            <div>
              {"Place Holder Div"}
              {JSON.stringify(Object.assign(received, state))}
            </div>
          )}
        </ScrollBarsControllerContext.Consumer>
      </ScrollBarsControllerProvider>
    );
  };

  describe("when initialized", () => {
    beforeEach(() => {
      arrange();
    });

    it("should contain the expected properties", () => {
      const properties = received as ScrollBarsControllerContextInterface;
      expect(properties.stack).toStrictEqual(InitialState.stack);
    });

    it("should contain the expected functions", () => {
      const properties = received as ScrollBarsControllerContextInterface;
      expect(typeof properties.setStack).toBe("function");
    });
  });
});
