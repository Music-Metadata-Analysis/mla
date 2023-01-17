import { Box, Center, Container, Text } from "@chakra-ui/react";
import { render, screen, within } from "@testing-library/react";
import Billboard, { BillboardProps } from "../billboard.component";
import { testIDs } from "../billboard.identifiers";
import { createSimpleComponent } from "@fixtures/react/simple";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import mockColourHook from "@src/hooks/ui/__mocks__/colour.hook.mock";

jest.mock("@src/hooks/ui/colour.hook");

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock([
    "Box",
    "Center",
    "Container",
    "Text",
  ])
);

describe("BillboardContainer", () => {
  let currentProps: Omit<BillboardProps, "children">;

  const mockTitleText = "mockTitleText";

  const MockChild = createSimpleComponent("MockChild");

  const baseProps: Omit<BillboardProps, "children"> = {
    isNavBarVisible: false,
    showTitle: false,
    titleText: mockTitleText,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    resetProps();
  });

  const arrange = () => {
    render(
      <Billboard {...currentProps}>
        <MockChild />
      </Billboard>
    );
  };

  const resetProps = () => {
    currentProps = { ...baseProps };
  };

  const checkChakraCenterComponentRender = () => {
    it("should render the chakra Center component as expected", () => {
      expect(Center).toBeCalledTimes(1);
      checkMockCall(Center, { height: "calc(100vh)" }, 0);
    });
  };

  const checkChakraBoxComponentRender = ({
    expectedMarginTop,
    expectedPaddingBottom,
  }: {
    expectedMarginTop: number;
    expectedPaddingBottom: number;
  }) => {
    it("should render the chakra Box component as expected", () => {
      expect(Box).toBeCalledTimes(1);
      checkMockCall(
        Box,
        {
          bg: mockColourHook.componentColour.background,
          color: mockColourHook.componentColour.foreground,
          mt: expectedMarginTop,
          p: 3,
          pb: expectedPaddingBottom,
          w: ["90%", "80%", "70%"],
        },
        0
      );
    });
  };

  const checkChakraContainerComponentRender = () => {
    it("should render the chakra Container component as expected", () => {
      expect(Container).toBeCalledTimes(1);
      checkMockCall(
        Container,
        {
          centerContent: true,
          textAlign: "center",
          maxW: "medium",
          sx: {
            caretColor: mockColourHook.transparent,
          },
          mb: 3,
        },
        0
      );
    });
  };

  const checkChakraContainerComponentNoRender = () => {
    it("should NOT render the chakra Container component", () => {
      expect(Container).toBeCalledTimes(0);
    });
  };

  const checkChakraTextComponentRender = () => {
    it("should render the chakra Text component as expected", () => {
      expect(Text).toBeCalledTimes(1);
      checkMockCall(Text, {
        "data-testid": testIDs.BillBoardTitle,
        fontSize: ["xl", "2xl", "3xl"],
      });
    });
  };

  const checkChakraTextComponentNoRender = () => {
    it("should NOT render the chakra Text component", () => {
      expect(Text).toBeCalledTimes(0);
    });
  };

  const checkTitleRenders = () => {
    it("should render the titleText as expected", async () => {
      const element = await screen.findByTestId(testIDs.BillBoardTitle);
      expect(
        await within(element).findByText(currentProps.titleText)
      ).toBeTruthy();
    });
  };

  const checkTitleDoesNotRender = () => {
    it("should NOT render the titleText", () => {
      expect(screen.queryByText(currentProps.titleText)).toBeNull();
    });
  };

  describe("when the showTitle is true", () => {
    beforeEach(() => (currentProps.showTitle = true));

    describe("when the navbar is visible", () => {
      beforeEach(() => {
        currentProps.isNavBarVisible = true;

        arrange();
      });

      checkChakraCenterComponentRender();
      checkChakraBoxComponentRender({
        expectedMarginTop: 16,
        expectedPaddingBottom: 5,
      });
      checkChakraContainerComponentRender();
      checkChakraTextComponentRender();
      checkTitleRenders();
    });

    describe("when the navbar is NOT visible", () => {
      beforeEach(() => {
        currentProps.isNavBarVisible = false;

        arrange();
      });

      checkChakraCenterComponentRender();
      checkChakraBoxComponentRender({
        expectedMarginTop: 0,
        expectedPaddingBottom: 5,
      });
      checkChakraContainerComponentRender();
      checkChakraTextComponentRender();
      checkTitleRenders();
    });
  });

  describe("when the showTitle is false", () => {
    beforeEach(() => (currentProps.showTitle = false));

    describe("when the navbar is visible", () => {
      beforeEach(() => {
        currentProps.isNavBarVisible = true;

        arrange();
      });

      checkChakraCenterComponentRender();
      checkChakraBoxComponentRender({
        expectedMarginTop: 16,
        expectedPaddingBottom: 3,
      });
      checkChakraContainerComponentNoRender();
      checkChakraTextComponentNoRender();
      checkTitleDoesNotRender();
    });

    describe("when the navbar is NOT visible", () => {
      beforeEach(() => {
        currentProps.isNavBarVisible = false;

        arrange();
      });

      checkChakraCenterComponentRender();
      checkChakraBoxComponentRender({
        expectedMarginTop: 0,
        expectedPaddingBottom: 3,
      });
      checkChakraContainerComponentNoRender();
      checkChakraTextComponentNoRender();
      checkTitleDoesNotRender();
    });
  });
});
