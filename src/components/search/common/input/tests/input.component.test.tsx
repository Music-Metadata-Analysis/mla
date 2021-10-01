import { Input } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import mockColourHook from "../../../../../hooks/tests/colour.hook.mock";
import checkMockCall from "../../../../../tests/fixtures/mock.component.call";
import StyledInput from "../input.component";

jest.mock("../../../../../hooks/colour", () => {
  return () => mockColourHook;
});

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("../../../../../tests/fixtures/mock.chakra.react.factory.class");
  return factoryInstance.create(["Input"]);
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
        "data-testid": mockTestID,
      });
    });
  });
});
