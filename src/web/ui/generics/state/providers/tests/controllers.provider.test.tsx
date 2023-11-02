import { render, screen } from "@testing-library/react";
import ControllerRootProvider from "../controllers.provider";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import NavBarControllerProvider from "@src/web/navigation/navbar/state/providers/navbar.provider";
import ImagesControllerProvider from "@src/web/ui/images/state/providers/images.provider";
import ScrollBarsControllerProvider from "@src/web/ui/scrollbars/generics/state/providers/scrollbars.provider";

jest.mock("@src/web/ui/images/state/providers/images.provider", () =>
  require("@fixtures/react/parent").createComponent("ImagesControllerProvider")
);

jest.mock("@src/web/navigation/navbar/state/providers/navbar.provider", () =>
  require("@fixtures/react/parent").createComponent("NavBarControllerProvider")
);

jest.mock(
  "@src/web/ui/scrollbars/generics/state/providers/scrollbars.provider",
  () =>
    require("@fixtures/react/parent").createComponent(
      "ScrollBarsControllerProvider"
    )
);

describe("UserInterfaceRootProvider", () => {
  const mockChildComponent = "MockChildComponent";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(
      <ControllerRootProvider>
        <div>{mockChildComponent}</div>
      </ControllerRootProvider>
    );
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should call ImagesControllerProvider with the correct props", () => {
      expect(ImagesControllerProvider).toHaveBeenCalledTimes(1);
      checkMockCall(ImagesControllerProvider, {});
    });

    it("should call NavBarControllerProvider with the correct props", () => {
      expect(NavBarControllerProvider).toHaveBeenCalledTimes(1);
      checkMockCall(NavBarControllerProvider, {});
    });

    it("should call ScrollBarsControllerProvider with the correct props", () => {
      expect(ScrollBarsControllerProvider).toHaveBeenCalledTimes(1);
      checkMockCall(ScrollBarsControllerProvider, {});
    });

    it("should return the mock child component", async () => {
      expect(await screen.findByText(mockChildComponent)).toBeTruthy();
    });
  });
});
