import { render } from "@testing-library/react";
import PopUpsControllerProvider, {
  PopUpsControllerContext,
} from "../popups.provider";
import type { PopUpsControllerContextInterface } from "@src/types/controllers/popups/popups.context.types";

describe("PopUpsControllerProvider", () => {
  const received: Partial<PopUpsControllerContextInterface> = {};

  const arrange = () => {
    render(
      <PopUpsControllerProvider>
        <PopUpsControllerContext.Consumer>
          {(state) => (
            <div>
              {"Place Holder Div"}
              {JSON.stringify(Object.assign(received, state))}
            </div>
          )}
        </PopUpsControllerContext.Consumer>
      </PopUpsControllerProvider>
    );
  };

  describe("when initialized", () => {
    beforeEach(() => {
      arrange();
    });

    it("should contain the expected properties", () => {
      const properties = received as PopUpsControllerContextInterface;
      expect(properties.state).toStrictEqual({
        FeedBack: { status: false },
      });
      expect(typeof properties.dispatch).toBe("function");
    });
  });
});
