import { render } from "@testing-library/react";
import { InitialContext } from "../popups.initial";
import PopUpsControllerProvider, {
  PopUpsControllerContext,
} from "../popups.provider";
import { mockIsSSR } from "@src/vendors/integrations/web.framework/__mocks__/vendor.mock";
import type { PopUpsControllerContextInterface } from "@src/vendors/types/integrations/ui.framework/popups/popups.context.types";

jest.mock("@src/vendors/integrations/web.framework/vendor");

describe("PopUpsControllerProvider", () => {
  const received: Partial<PopUpsControllerContextInterface> = {};

  const mockPopUp = "MockPopUp";

  const arrange = () => {
    render(
      <PopUpsControllerProvider popUps={[mockPopUp]}>
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

  describe("when being rendered server side", () => {
    beforeEach(() => mockIsSSR.mockReturnValueOnce(true));

    describe("when initialized", () => {
      beforeEach(() => {
        arrange();
      });

      it("should contain the expected properties", () => {
        const properties = received as PopUpsControllerContextInterface;
        expect(properties.state).toStrictEqual(InitialContext.state);
        expect(typeof properties.dispatch).toBe("function");
      });
    });
  });

  describe("when being rendered client side", () => {
    beforeEach(() => mockIsSSR.mockReturnValueOnce(false));

    describe("when initialized", () => {
      beforeEach(() => {
        arrange();
      });

      it("should contain the expected properties", () => {
        const properties = received as PopUpsControllerContextInterface;
        expect(properties.state).toStrictEqual({
          [mockPopUp]: { status: false },
        });
        expect(typeof properties.dispatch).toBe("function");
      });
    });
  });
});
