import { Spinner } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import mockColourHook from "../../../../hooks/tests/colour.hook.mock";
import checkMockCall from "../../../../tests/fixtures/mock.component.call";
import BillBoard from "../../billboard.component";
import BillBoardSpinner, { testIDs } from "../billboard.spinner.component";

jest.mock("../../billboard.component", () =>
  createMockedComponent("Billboard")
);

jest.mock("../../../../hooks/colour", () => {
  return () => mockColourHook;
});

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("../../../../tests/fixtures/mock.chakra.react.factory.class");
  return factoryInstance.create(["Spinner"]);
});

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("../../../../tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

describe("BillBoardSpinner", () => {
  const testTitle = "Test Title";
  const spinnerProps = {
    bgColor: mockColourHook.componentColour.background,
    color: mockColourHook.componentColour.foreground,
    "data-testid": testIDs.BillboardSpinner,
    emptyColor: mockColourHook.componentColour.background,
    size: "xl",
    style: {
      transform: "scale(1.5)",
    },
    thickness: "8px",
  };

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
      expect(Spinner).toBeCalledTimes(1);
      checkMockCall(Spinner, spinnerProps);
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

    it("should render the spinner", async () => {
      expect(Spinner).toBeCalledTimes(1);
      checkMockCall(Spinner, spinnerProps);
    });

    it("should render the spinner as NOT visible", async () => {
      const spinner = await screen.findByTestId(
        testIDs.BillboardSpinnerVisibilityControl
      );
      expect(spinner).not.toBeVisible();
    });
  });
});
