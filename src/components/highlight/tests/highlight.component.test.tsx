import { Box } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import Highlight from "../highlight.component";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import mockColourHook from "@src/hooks/ui/__mocks__/colour.hook.mock";

jest.mock("@chakra-ui/react", () => {
  const { createChakraMock } = require("@fixtures/chakra");
  return createChakraMock(["Box"]);
});

jest.mock("@src/hooks/ui/colour.hook");

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
