import { Container, Text, Center, Box } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import mockColourHook from "../../../hooks/tests/colour.hook.mock";
import checkMockCall from "../../../tests/fixtures/mock.component.call";
import Billboard from "../billboard.component";

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("../../../tests/fixtures/mock.chakra.react.factory.class");
  return factoryInstance.create(["Container", "Text", "Center", "Box"]);
});

jest.mock("../../../hooks/colour", () => {
  return () => mockColourHook;
});

describe("Billboard", () => {
  const mockTitle = "Title";
  const MockChild = jest.fn().mockImplementation(() => <>{"MockChild"}</>);

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const arrange = () => {
    render(
      <Billboard title={mockTitle}>
        <MockChild />
      </Billboard>
    );
  };

  it("should call the Center component correctly", () => {
    expect(Center).toBeCalledTimes(1);
    checkMockCall(Center, { height: "calc(100vh - 32px)" });
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
    });
  });

  it("should call the Box component correctly", () => {
    expect(Box).toBeCalledTimes(1);
    checkMockCall(Box, {
      bg: mockColourHook.componentColour.background,
      color: mockColourHook.componentColour.foreground,
      p: 3,
      w: ["90%", "80%", "70%"],
    });
  });

  it("should call the Text component correctly", () => {
    expect(Text).toBeCalledTimes(1);
    checkMockCall(Text, { fontSize: ["xl", "2xl", "3xl"] });
  });

  it("should call the MockChild component correctly", () => {
    expect(MockChild).toBeCalledTimes(1);
  });
});
