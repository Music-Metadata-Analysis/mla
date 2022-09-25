import { Container, Text, Center, Box } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import Billboard from "../billboard.component";
import { settings } from "@src/config/billboard";
import mockColourHook from "@src/hooks/tests/colour.hook.mock";
import mockNavBarHook from "@src/hooks/tests/navbar.mock.hook";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("@src/tests/fixtures/mock.chakra.react.factory.class");
  return factoryInstance.create(["Container", "Text", "Center", "Box"]);
});

jest.mock("@src/hooks/colour", () => () => mockColourHook);

jest.mock("@src/hooks/navbar", () => () => mockNavBarHook);

describe("Billboard", () => {
  const mockTitle = "Title";
  const originalWindowHeight = window.innerHeight;
  const MockChild = jest.fn().mockImplementation(() => <>{"MockChild"}</>);

  afterAll(() => (window.innerHeight = originalWindowHeight));

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    render(
      <Billboard title={mockTitle}>
        <MockChild />
      </Billboard>
    );
  };

  const checkChakraComponents = ({
    expectedCalls,
    expectedTopMargin,
    expectedBottomMargin,
  }: {
    expectedCalls: number;
    expectedTopMargin: number;
    expectedBottomMargin: number;
  }) => {
    it("should call the Center component correctly", () => {
      expect(Center).toBeCalledTimes(expectedCalls);
      for (let i = 0; i < expectedCalls; i++) {
        checkMockCall(Center, { height: "calc(100vh)" }, i);
      }
    });

    it("should call the Container component correctly", () => {
      expect(Container).toBeCalledTimes(1);
      checkMockCall(Container, {
        centerContent: true,
        textAlign: "center",
        maxW: "medium",
        sx: {
          caretColor: mockColourHook.transparent,
        },
        mb: 3,
      });
    });

    it("should call the Box component correctly", () => {
      expect(Box).toBeCalledTimes(expectedCalls);
      for (let i = 0; i < expectedCalls; i++) {
        checkMockCall(
          Box,
          {
            bg: mockColourHook.componentColour.background,
            color: mockColourHook.componentColour.foreground,
            p: 3,
            pb: i == 0 ? 5 : expectedBottomMargin,
            mt: expectedTopMargin,
            w: ["90%", "80%", "70%"],
          },
          i
        );
      }
    });

    it("should call the Text component correctly", () => {
      expect(Text).toBeCalledTimes(1);
      checkMockCall(Text, { fontSize: ["xl", "2xl", "3xl"] });
    });
  };

  const checkChildComponents = ({
    expectedCalls,
  }: {
    expectedCalls: number;
  }) => {
    it("should call the MockChild component correctly", () => {
      expect(MockChild).toBeCalledTimes(expectedCalls);
    });
  };

  describe("when the navbar is visible", () => {
    beforeEach(() => (mockNavBarHook.getters.isVisible = true));

    describe("when the screen height is >= the threshold", () => {
      beforeEach(() => {
        window.innerHeight = settings.minimumTitleHeight;
        arrange();
      });

      checkChakraComponents({
        expectedCalls: 1,
        expectedTopMargin: 16,
        expectedBottomMargin: 5,
      });
      checkChildComponents({ expectedCalls: 1 });
    });

    describe("when the screen height is < the threshold", () => {
      beforeEach(() => {
        window.innerHeight = settings.minimumTitleHeight - 1;
        arrange();
      });

      checkChakraComponents({
        expectedCalls: 2,
        expectedTopMargin: 16,
        expectedBottomMargin: 3,
      });
      checkChildComponents({ expectedCalls: 2 });
    });
  });

  describe("when the navbar is NOT visible", () => {
    beforeEach(() => (mockNavBarHook.getters.isVisible = false));

    describe("when the screen height is >= the threshold", () => {
      beforeEach(() => {
        window.innerHeight = settings.minimumTitleHeight;
        arrange();
      });

      checkChakraComponents({
        expectedCalls: 1,
        expectedTopMargin: 0,
        expectedBottomMargin: 5,
      });
      checkChildComponents({ expectedCalls: 1 });
    });

    describe("when the screen height is < the threshold", () => {
      beforeEach(() => {
        window.innerHeight = settings.minimumTitleHeight - 1;
        arrange();
      });

      checkChakraComponents({
        expectedCalls: 2,
        expectedTopMargin: 0,
        expectedBottomMargin: 3,
      });
      checkChildComponents({ expectedCalls: 2 });
    });
  });
});
