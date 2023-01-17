import { render } from "@testing-library/react";
import Billboard from "../billboard.component";
import BillboardContainer from "../billboard.container";
import { createSimpleComponent } from "@fixtures/react/simple";
import { settings } from "@src/config/billboard";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import mockNavBarControllerHook from "@src/hooks/controllers/__mocks__/navbar.controller.hook.mock";
import mockUseWindowThresholdHook from "@src/hooks/ui/__mocks__/window.threshold.hook.mock";
import useWindowThreshold from "@src/hooks/ui/window.threshold.hook";

jest.mock("@src/hooks/controllers/navbar.controller.hook");

jest.mock("@src/hooks/ui/window.threshold.hook");

jest.mock("../billboard.component", () =>
  require("@fixtures/react/parent").createComponent("Billboard")
);

describe("BillboardContainer", () => {
  const mockTitleText = "mockTitleText";

  const MockChild = createSimpleComponent("MockChild");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    render(
      <BillboardContainer titleText={mockTitleText}>
        <MockChild />
      </BillboardContainer>
    );
  };

  const checkWindowThreshold = () => {
    it("should initialize the window threshold with the correct settings", () => {
      expect(useWindowThreshold).toBeCalledTimes(1);
      expect(useWindowThreshold).toBeCalledWith({
        axis: "innerHeight",
        lowState: false,
        threshold: settings.minimumTitleHeight,
      });
    });
  };

  const checkBillBoardComponentRender = () => {
    it("should render the Billboard Component as expected", () => {
      expect(Billboard).toBeCalledTimes(1);
      checkMockCall(
        Billboard,
        {
          isNavBarVisible: mockNavBarControllerHook.navigation.state,
          showTitle: mockUseWindowThresholdHook.state,
          titleText: mockTitleText,
        },
        0
      );
    });
  };

  const checkMockChildComponentRender = () => {
    it("should render the MockChild Component as expected", () => {
      expect(MockChild).toBeCalledTimes(1);
      checkMockCall(MockChild, {}, 0);
    });
  };

  describe("when the window threshold is below", () => {
    beforeEach(() => (mockUseWindowThresholdHook.state = false));

    describe("when the navbar is visible", () => {
      beforeEach(() => {
        mockNavBarControllerHook.navigation.state = true;

        arrange();
      });

      checkWindowThreshold();
      checkBillBoardComponentRender();
      checkMockChildComponentRender();
    });

    describe("when the navbar is NOT visible", () => {
      beforeEach(() => {
        mockNavBarControllerHook.navigation.state = false;

        arrange();
      });

      checkWindowThreshold();
      checkBillBoardComponentRender();
      checkMockChildComponentRender();
    });
  });

  describe("when the window threshold is equal or above", () => {
    beforeEach(() => (mockUseWindowThresholdHook.state = true));

    describe("when the navbar is visible", () => {
      beforeEach(() => {
        mockNavBarControllerHook.navigation.state = true;

        arrange();
      });

      checkWindowThreshold();
      checkBillBoardComponentRender();
      checkMockChildComponentRender();
    });

    describe("when the navbar is NOT visible", () => {
      beforeEach(() => {
        mockNavBarControllerHook.navigation.state = false;

        arrange();
      });

      checkWindowThreshold();
      checkBillBoardComponentRender();
      checkMockChildComponentRender();
    });
  });
});
