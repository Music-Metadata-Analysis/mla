import { render } from "@testing-library/react";
import Billboard from "../billboard.component";
import BillboardContainer from "../billboard.container";
import { createSimpleComponent } from "@fixtures/react/simple";
import mockUseNavBar from "@src/hooks/__mocks__/navbar.mock";
import mockUseWindowThreshold from "@src/hooks/utility/__mocks__/windowThreshold.mock";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("@src/hooks/navbar");

jest.mock("@src/hooks/utility/windowThreshold");

jest.mock("../billboard.component", () =>
  require("@fixtures/react/parent").createComponent("Billboard")
);

describe("BillboardContainer", () => {
  const MockChild = createSimpleComponent("MockChild");
  const mockTitleText = "mockTitleText";

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

  const checkBillBoardComponentRender = () => {
    it("should render the Billboard Component as expected", () => {
      expect(Billboard).toBeCalledTimes(1);
      checkMockCall(
        Billboard,
        {
          isNavBarVisible: mockUseNavBar.navigation.state,
          showTitle: mockUseWindowThreshold.state,
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
    beforeEach(() => (mockUseWindowThreshold.state = false));

    describe("when the navbar is visible", () => {
      beforeEach(() => {
        mockUseNavBar.navigation.state = true;

        arrange();
      });

      checkBillBoardComponentRender();
      checkMockChildComponentRender();
    });

    describe("when the navbar is NOT visible", () => {
      beforeEach(() => {
        mockUseNavBar.navigation.state = false;

        arrange();
      });

      checkBillBoardComponentRender();
      checkMockChildComponentRender();
    });
  });

  describe("when the window threshold is equal or above", () => {
    beforeEach(() => (mockUseWindowThreshold.state = true));

    describe("when the navbar is visible", () => {
      beforeEach(() => {
        mockUseNavBar.navigation.state = true;

        arrange();
      });

      checkBillBoardComponentRender();
      checkMockChildComponentRender();
    });

    describe("when the navbar is NOT visible", () => {
      beforeEach(() => {
        mockUseNavBar.navigation.state = false;

        arrange();
      });

      checkBillBoardComponentRender();
      checkMockChildComponentRender();
    });
  });
});
