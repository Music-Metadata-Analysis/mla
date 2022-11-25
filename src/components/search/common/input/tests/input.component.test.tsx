import { Input } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import StyledInput from "../input.component";
import mockColourHook from "@src/hooks/__mocks__/colour.mock";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("@src/hooks/colour");

jest.mock("@chakra-ui/react", () => {
  const { createChakraMock } = require("@fixtures/chakra");
  return createChakraMock(["Input"]);
});

describe("StyledInput", () => {
  const mockTestID = "mockTestID";

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementationOnce(() => null);
  });

  const arrange = () => {
    render(<StyledInput data-testid={mockTestID} />);
  };

  describe("when rendered", () => {
    beforeEach(() => {
      arrange();
    });

    it("should call the underlying Input component with the correct props", () => {
      expect(Input).toBeCalledTimes(1);
      checkMockCall(Input, {
        bg: mockColourHook.inputColour.background,
        borderColor: mockColourHook.inputColour.border,
        borderWidth: 1,
        color: mockColourHook.inputColour.foreground,
        _placeholder: { color: mockColourHook.inputColour.placeHolder },
        "data-testid": mockTestID,
      });
    });
  });
});
