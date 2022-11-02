import { render, screen } from "@testing-library/react";
import ControllerRootProvider from "../controllers.root.provider";
import ImagesControllerProvider from "../images/images.provider";
import NavBarControllerProvider from "../navbar/navbar.provider";
import PopUpsControllerProvider from "../popups/popups.provider";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("../images/images.provider", () =>
  require("@fixtures/react/parent").createComponent("ImagesControllerProvider")
);

jest.mock("../navbar/navbar.provider", () =>
  require("@fixtures/react/parent").createComponent("NavBarControllerProvider")
);

jest.mock("../popups/popups.provider", () =>
  require("@fixtures/react/parent").createComponent("PopUpsControllerProvider")
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
      expect(ImagesControllerProvider).toBeCalledTimes(1);
      checkMockCall(ImagesControllerProvider, {});
    });

    it("should call NavBarControllerProvider with the correct props", () => {
      expect(NavBarControllerProvider).toBeCalledTimes(1);
      checkMockCall(NavBarControllerProvider, {});
    });

    it("should call PopUpsControllerProvider with the correct props", () => {
      expect(PopUpsControllerProvider).toBeCalledTimes(1);
      checkMockCall(PopUpsControllerProvider, {});
    });

    it("should return the mock child component", async () => {
      expect(await screen.findByText(mockChildComponent)).toBeTruthy();
    });
  });
});
