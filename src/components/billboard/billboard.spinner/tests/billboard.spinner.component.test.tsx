import { render, screen } from "@testing-library/react";
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
  const arrange = (condition: boolean) => {
    render(
      <BillBoardSpinner whileTrue={condition}>
        <div data-testid="TestComponent">Test Component</div>
      </BillBoardSpinner>
    );
  };

  beforeEach(() => jest.clearAllMocks());

  describe("whileTrue is true", () => {
    beforeEach(() => arrange(true));

    it("should not render the child component", async () => {
      expect(screen.queryByTestId("TestComponent")).toBeNull();
    });

    it("should render the billboard", () => {
      expect(BillBoard).toBeCalledTimes(1);
    });

    it("should render the spinner", async () => {
      expect(await screen.findByTestId(testIDs.BillboardSpinner)).toBeTruthy();
    });
  });

  describe("whileTrue is false", () => {
    beforeEach(() => arrange(false));

    it("should not render the billboard", () => {
      expect(BillBoard).toBeCalledTimes(0);
    });

    it("should not render the spinner", () => {
      expect(screen.queryByTestId(testIDs.BillboardSpinner)).toBeNull();
    });

    it("should render the child component", async () => {
      expect(await screen.findByTestId("TestComponent")).toBeTruthy();
    });
  });
});
