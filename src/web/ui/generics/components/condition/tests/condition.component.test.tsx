import { render, screen } from "@testing-library/react";
import Condition from "../condition.component";

describe("Condition", () => {
  const arrange = (condition: boolean) => {
    render(
      <Condition isTrue={condition}>
        <div data-testid="TestComponent">Test Component</div>
      </Condition>
    );
  };

  describe("When condition is true", () => {
    beforeEach(() => arrange(true));

    it("should render the child component", async () => {
      expect(await screen.findByTestId("TestComponent")).toBeTruthy();
    });
  });

  describe("When condition is false", () => {
    beforeEach(() => arrange(false));

    it("should not render the child component", async () => {
      expect(screen.queryByTestId("TestComponent")).toBeNull();
    });
  });
});
