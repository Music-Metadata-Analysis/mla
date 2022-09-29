import { render } from "@testing-library/react";
import ErrorDisplay from "../../display/error.display.component";
import ErrorHandler from "../error.handler.component";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("../../display/error.display.component", () =>
  require("@fixtures/react/parent").createComponent("ErrorDisplay")
);

describe("ErrorHandler", () => {
  const mockErrorMessage = "Test Error";
  const mockError = new Error(mockErrorMessage);
  const mockReset = jest.fn();
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, "error");
    consoleErrorSpy.mockImplementation(() => null);
    arrange();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  const arrange = () => {
    render(<ErrorHandler error={mockError} resetErrorBoundary={mockReset} />);
  };

  it("should log the error", () => {
    expect(consoleErrorSpy).toBeCalledTimes(1);
    expect(consoleErrorSpy).toBeCalledWith(mockError);
  });

  it("should render the ErrorDisplay correctly", () => {
    expect(ErrorDisplay).toBeCalledTimes(1);
    checkMockCall(ErrorDisplay, {
      error: mockError,
      errorKey: "generic",
      resetError: mockReset,
    });
  });
});
