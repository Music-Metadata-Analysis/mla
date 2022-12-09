import { render, screen } from "@testing-library/react";
import Spinner from "../navbar.spinner.component";
import { testIDs } from "../navbar.spinner.identifiers";

describe("NavBarSpinner", () => {
  const arrange = (condition: boolean) => {
    render(
      <Spinner whileTrue={condition}>
        <div data-testid="TestComponent">Test Component</div>
      </Spinner>
    );
  };

  describe("whileTrue is true", () => {
    beforeEach(() => arrange(true));

    it("should not render the child component", async () => {
      expect(screen.queryByTestId("TestComponent")).toBeNull();
    });

    it("should render the spinner", async () => {
      expect(await screen.findByTestId(testIDs.NavBarSpinner)).toBeTruthy();
    });
  });

  describe("whileTrue is false", () => {
    beforeEach(() => arrange(false));

    it("should render the child component", async () => {
      expect(await screen.findByTestId("TestComponent")).toBeTruthy();
    });
  });
});
