import { Flex, Spinner } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import BillBoard from "../../billboard.component";
import BillBoardSpinner, { testIDs } from "../billboard.spinner.component";
import { settings } from "@src/config/billboard";
import mockColourHook from "@src/hooks/tests/colour.hook.mock";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("../../billboard.component", () =>
  require("@fixtures/react").createComponent("Billboard")
);

jest.mock("@src/hooks/colour", () => () => mockColourHook);

jest.mock("@chakra-ui/react", () => {
  const { createChakraMock } = require("@fixtures/chakra");
  return createChakraMock(["Flex", "Spinner"]);
});

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
  const originalWindowHeight = window.innerHeight;
  let visible: boolean;

  afterAll(() => (window.innerHeight = originalWindowHeight));

  const actRender = (visibility: boolean) => {
    render(<BillBoardSpinner visible={visibility} title={testTitle} />);
  };

  beforeEach(() => jest.clearAllMocks());

  const checkBillBoardComponent = () => {
    it("should call the BillBoard component with the correct props", () => {
      expect(BillBoard).toBeCalledTimes(1);
      checkMockCall(BillBoard, { title: testTitle });
    });
  };

  const checkFlexComponent = ({
    expectedPaddingBottom,
  }: {
    expectedPaddingBottom: number;
  }) => {
    it("should call the Flex component with the correct props", () => {
      expect(Flex).toBeCalledTimes(1);
      checkMockCall(Flex, {
        justify: "center",
        pb: expectedPaddingBottom,
        pt: 10,
      });
    });
  };

  const checkSpinnerComponent = () => {
    it("should render the Spinner component with the correct props", () => {
      expect(Spinner).toBeCalledTimes(1);
      checkMockCall(Spinner, spinnerProps);
    });
  };

  describe("visible is true", () => {
    beforeEach(() => (visible = true));

    describe("when the screen height is < the threshold", () => {
      beforeEach(() => {
        window.innerHeight = settings.minimumTitleHeight - 1;
        actRender(visible);
      });

      checkBillBoardComponent();
      checkFlexComponent({ expectedPaddingBottom: 10 });
      checkSpinnerComponent();

      it("should render the Spinner as visible", async () => {
        const spinner = await screen.findByTestId(
          testIDs.BillboardSpinnerVisibilityControl
        );
        expect(spinner).toBeVisible();
      });
    });

    describe("when the screen height is >= the threshold", () => {
      beforeEach(() => {
        window.innerHeight = settings.minimumTitleHeight;
        actRender(visible);
      });

      checkBillBoardComponent();
      checkFlexComponent({ expectedPaddingBottom: 20 });
      checkSpinnerComponent();

      it("should render the Spinner as visible", async () => {
        const spinner = await screen.findByTestId(
          testIDs.BillboardSpinnerVisibilityControl
        );
        expect(spinner).toBeVisible();
      });
    });
  });

  describe("visible is false", () => {
    beforeEach(() => (visible = false));

    describe("when the screen height is < the threshold", () => {
      beforeEach(() => {
        window.innerHeight = settings.minimumTitleHeight - 1;
        actRender(visible);
      });

      checkBillBoardComponent();
      checkFlexComponent({ expectedPaddingBottom: 10 });
      checkSpinnerComponent();

      it("should render the Spinner as NOT visible", async () => {
        const spinner = await screen.findByTestId(
          testIDs.BillboardSpinnerVisibilityControl
        );
        expect(spinner).not.toBeVisible();
      });
    });

    describe("when the screen height is >= the threshold", () => {
      beforeEach(() => {
        window.innerHeight = settings.minimumTitleHeight;
        actRender(visible);
      });

      checkBillBoardComponent();
      checkFlexComponent({ expectedPaddingBottom: 20 });
      checkSpinnerComponent();

      it("should render the Spinner as NOT visible", async () => {
        const spinner = await screen.findByTestId(
          testIDs.BillboardSpinnerVisibilityControl
        );
        expect(spinner).not.toBeVisible();
      });
    });
  });
});
