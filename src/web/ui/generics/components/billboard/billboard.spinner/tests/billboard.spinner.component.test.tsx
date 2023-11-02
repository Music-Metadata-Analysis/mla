import { Flex, Spinner } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import BillBoardSpinner from "../billboard.spinner.component";
import { testIDs } from "../billboard.spinner.identifiers";
import { settings } from "@src/config/billboard";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import mockColourHook from "@src/web/ui/colours/state/hooks/__mocks__/colour.hook.mock";
import BillBoardContainer from "@src/web/ui/generics/components/billboard/billboard.base/billboard.container";

jest.mock("@src/web/ui/colours/state/hooks/colour.hook");

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock(["Flex", "Spinner"])
);

jest.mock(
  "@src/web/ui/generics/components/billboard/billboard.base/billboard.container",
  () => require("@fixtures/react/parent").createComponent("BillboardContainer")
);

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
    render(<BillBoardSpinner visible={visibility} titleText={testTitle} />);
  };

  beforeEach(() => jest.clearAllMocks());

  const checkBillBoardComponent = () => {
    it("should call the BillBoard component with the correct props", () => {
      expect(BillBoardContainer).toHaveBeenCalledTimes(1);
      checkMockCall(BillBoardContainer, { titleText: testTitle });
    });
  };

  const checkFlexComponent = ({
    expectedPaddingBottom,
  }: {
    expectedPaddingBottom: number;
  }) => {
    it("should call the Flex component with the correct props", () => {
      expect(Flex).toHaveBeenCalledTimes(1);
      checkMockCall(Flex, {
        justify: "center",
        pb: expectedPaddingBottom,
        pt: 10,
      });
    });
  };

  const checkSpinnerComponent = () => {
    it("should render the Spinner component with the correct props", () => {
      expect(Spinner).toHaveBeenCalledTimes(1);
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
