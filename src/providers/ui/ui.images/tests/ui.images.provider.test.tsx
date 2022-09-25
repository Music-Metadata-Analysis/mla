import { render } from "@testing-library/react";
import UserInterfaceProviderInterface, {
  UserInterfaceImagesContext,
} from "../ui.images.provider";
import type { UserInterfaceImagesContextInterface } from "@src/types/ui/images/ui.images.context.types";

describe("UserInterfaceChakraProvider", () => {
  const received: Partial<UserInterfaceImagesContextInterface> = {};

  const arrange = () => {
    render(
      <UserInterfaceProviderInterface>
        <UserInterfaceImagesContext.Consumer>
          {(state) => (
            <div>
              {"Place Holder Div"}
              {JSON.stringify(Object.assign(received, state))}
            </div>
          )}
        </UserInterfaceImagesContext.Consumer>
      </UserInterfaceProviderInterface>
    );
  };

  describe("when initialized", () => {
    beforeEach(() => {
      arrange();
    });

    it("should contain the expected properties", () => {
      const properties = received as UserInterfaceImagesContextInterface;
      expect(typeof properties.loadedCount).toBe("number");
      expect(typeof properties.setLoadedCount).toBe("function");
    });
  });
});
