import { render, screen } from "@testing-library/react";
import checkMockCall from "../../../../tests/fixtures/mock.component.call";
import BillBoard from "../../billboard.component";
import BillBoardSpinner, { testIDs } from "../billboard.spinner.component";

jest.mock("../../billboard.component", () =>
  createMockedComponent("Billboard")
);

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("../../../../tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

describe("BillBoardSpinner", () => {
  const testTitle = "Test Title";

  const arrange = (visibility: boolean) => {
    render(<BillBoardSpinner visible={visibility} title={testTitle} />);
  };

  beforeEach(() => jest.clearAllMocks());

  describe("visible is true", () => {
    beforeEach(() => arrange(true));

    it("should render the billboard", () => {
      expect(BillBoard).toBeCalledTimes(1);
      checkMockCall(BillBoard, { title: testTitle });
    });

    it("should render the spinner", async () => {
      expect(await screen.findByTestId(testIDs.BillboardSpinner)).toBeTruthy();
    });

    it("should render the spinner as visible", async () => {
      const spinner = await screen.findByTestId(
        testIDs.BillboardSpinnerVisibilityControl
      );
      expect(spinner).toBeVisible();
    });
  });

  describe("visible is false", () => {
    beforeEach(() => arrange(false));

    it("should render the billboard", () => {
      expect(BillBoard).toBeCalledTimes(1);
      checkMockCall(BillBoard, { title: testTitle });
    });

    it("should render the spinner", () => {
      expect(screen.queryByTestId(testIDs.BillboardSpinner)).toBeTruthy();
    });

    it("should render the spinner as NOT visible", async () => {
      const spinner = await screen.findByTestId(
        testIDs.BillboardSpinnerVisibilityControl
      );
      expect(spinner).not.toBeVisible();
    });
  });
});
