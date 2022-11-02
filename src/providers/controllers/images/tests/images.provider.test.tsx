import { render } from "@testing-library/react";
import ImagesControllerProvider, {
  ImagesControllerContext,
} from "../images.provider";
import type { ImagesControllerContextInterface } from "@src/types/controllers/images/images.context.types";

describe("ImagesControllerProvider", () => {
  const received: Partial<ImagesControllerContextInterface> = {};

  const arrange = () => {
    render(
      <ImagesControllerProvider>
        <ImagesControllerContext.Consumer>
          {(state) => (
            <div>
              {"Place Holder Div"}
              {JSON.stringify(Object.assign(received, state))}
            </div>
          )}
        </ImagesControllerContext.Consumer>
      </ImagesControllerProvider>
    );
  };

  describe("when initialized", () => {
    beforeEach(() => {
      arrange();
    });

    it("should contain the expected properties", () => {
      const properties = received as ImagesControllerContextInterface;
      expect(typeof properties.loadedCount).toBe("number");
      expect(typeof properties.setLoadedCount).toBe("function");
    });
  });
});
