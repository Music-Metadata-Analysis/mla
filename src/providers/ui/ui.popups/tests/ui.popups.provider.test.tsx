import { render } from "@testing-library/react";
import UserInterfacePopUpsProvider, {
  UserInterfacePopUpsContext,
} from "../ui.popups.provider";
import type { UserInterfacePopUpsContextInterface } from "../../../../types/ui/popups/ui.popups.context.types";

describe("UserInterfacePopUpsProvider", () => {
  const received: Partial<UserInterfacePopUpsContextInterface> = {};

  const arrange = () => {
    render(
      <UserInterfacePopUpsProvider>
        <UserInterfacePopUpsContext.Consumer>
          {(state) => (
            <div>
              {"Place Holder Div"}
              {JSON.stringify(Object.assign(received, state))}
            </div>
          )}
        </UserInterfacePopUpsContext.Consumer>
      </UserInterfacePopUpsProvider>
    );
  };

  describe("when initialized", () => {
    beforeEach(() => {
      arrange();
    });

    it("should contain the expected properties", () => {
      const properties = received as UserInterfacePopUpsContextInterface;
      expect(properties.status).toStrictEqual({
        FeedBack: { status: false },
      });
      expect(typeof properties.dispatch).toBe("function");
    });
  });
});
