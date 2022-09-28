import { render, screen } from "@testing-library/react";
import ErrorDisplay from "../../display/error.display.component";
import ErrorCondition from "../error.condition.component";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("../../display/error.display.component", () =>
  require("@fixtures/react").createComponent("ErrorDisplay")
);

describe("ErrorCondition", () => {
  const mockChildren = "mockChildren";
  const mockReset = jest.fn();
  const mockErrorKey = "generic";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = (isTrue: boolean, errorKey: string) => {
    render(
      <ErrorCondition
        isTrue={isTrue}
        errorKey={errorKey}
        resetError={mockReset}
      >
        <div>{mockChildren}</div>
      </ErrorCondition>
    );
  };

  describe("when the condition is true", () => {
    beforeEach(() => arrange(true, mockErrorKey));

    it("should render the ErrorDisplay correctly", () => {
      expect(ErrorDisplay).toBeCalledTimes(1);
      checkMockCall(ErrorDisplay, {
        errorKey: mockErrorKey,
        resetError: mockReset,
      });
    });
  });

  describe("when the condition is NOT true", () => {
    beforeEach(() => arrange(false, "generic"));

    it("should render the child component", async () => {
      expect(await screen.findByText(mockChildren)).toBeTruthy();
    });
  });
});
