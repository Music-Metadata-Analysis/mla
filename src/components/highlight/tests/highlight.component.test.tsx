import { Box } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import Highlight from "../highlight.component";
import mockColourHook from "@src/hooks/tests/colour.hook.mock";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("@src/tests/fixtures/mock.chakra.react.factory.class");
  return factoryInstance.create(["Box"]);
});

jest.mock("@src/hooks/colour", () => () => mockColourHook);

describe("Highlight", () => {
  const mockChildComponent = "MockChildComponent";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(
      <Highlight>
        <div>{mockChildComponent}</div>
      </Highlight>
    );
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should call Box with the correct props", () => {
      expect(Box).toBeCalledTimes(1);
      checkMockCall(Box, {
        bg: mockColourHook.highlightColour.background,
        color: mockColourHook.highlightColour.foreground,
        borderColor: mockColourHook.highlightColour.border,
      });
    });

    it("should return the mock child component", async () => {
      expect(await screen.findByText(mockChildComponent)).toBeTruthy();
    });
  });
});
