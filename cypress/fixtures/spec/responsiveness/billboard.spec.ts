import { testIDs as billboardIDs } from "@src/components/billboard/billboard.base/billboard.identifiers";

export default function checkBillboardTitle({
  timeout,
  titleText,
}: {
  timeout: number;
  titleText: string;
}) {
  describe("when the screen is resized (Galaxy Fold Size)", () => {
    before(() => cy.viewport(653, 280));

    const checkTitleElement = () => {
      it("should render the title text", () => {
        cy.get(`[data-testid="${billboardIDs.BillBoardTitle}"]`, {
          timeout,
        })
          .contains(titleText, { timeout })
          .should("be.visible");
      });
    };

    const checkNoTitleElement = () => {
      it("should NOT render the title text", () => {
        cy.get(`[data-testid="${billboardIDs.BillBoardTitle}"]`, {
          timeout,
        }).should("not.exist");
      });
    };

    checkNoTitleElement();

    describe('when the screen size is restored (Macbook 16")', () => {
      before(() => cy.viewport("macbook-16"));

      checkTitleElement();
    });
  });
}
