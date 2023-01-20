import navBarSettings from "@src/config/navbar";
import { testIDs as navBarIDs } from "@src/web/navigation/navbar/components/root/navbar.root.identifiers";

export default function checkNavBarInputToggle({
  timeout,
}: {
  timeout: number;
}) {
  describe("when the screen is resized (Below Input Threshold)", () => {
    before(() => cy.viewport(653, navBarSettings.minimumHeightDuringInput - 1));

    const checkNavBarElement = () => {
      it("should render the NavBar", () => {
        cy.get(`[data-testid="${navBarIDs.NavBarRoot}"]`, {
          timeout,
        }).should("be.visible");
      });
    };

    const checkNoNavBarElement = () => {
      it("should NOT render the NavBar", () => {
        cy.get(`[data-testid="${navBarIDs.NavBarRoot}"]`, {
          timeout,
        }).should("not.exist");
      });
    };

    checkNoNavBarElement();

    describe('when the screen size is restored (Macbook 16")', () => {
      before(() => cy.viewport("macbook-16"));

      checkNavBarElement();
    });
  });
}
