import { render, screen } from "@testing-library/react";
import checkMockCall from "../../../../tests/fixtures/mock.component.call";
import ErrorDisplay from "../../display/error.display.component";
import ErrorCondition from "../error.condition.component";

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("../../../../tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

jest.mock("../../display/error.display.component", () =>
  createMockedComponent("ErrorDisplay")
);

describe("ErrorHandler", () => {
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
