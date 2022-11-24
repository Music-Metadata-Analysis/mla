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

    const getTitle = () =>
      cy.get(`[data-testid="${billboardIDs.BillBoardTitle}"]`);

    const checkTitleElement = () => {
      it("should render the title text", () => {
        getTitle().contains(titleText).should("be.visible", { timeout });
      });
    };

    const checkNoTitleElement = () => {
      it("should NOT render the title text", () => {
        getTitle().should("not.exist", { timeout });
      });
    };

    checkNoTitleElement();

    describe('when the screen size is restored (Macbook 16")', () => {
      before(() => cy.viewport("macbook-16"));

      checkTitleElement();
    });
  });
}
