import { testIDs as dialogueIDs } from "@src/components/dialogues/resizable/dialogue.resizable.identifiers";

export default function checkDialogueToggle({
  timeout,
  toggleText,
}: {
  timeout: number;
  toggleText: string;
}) {
  describe("when the screen is resized (Galaxy Fold Size)", () => {
    before(() => cy.viewport(653, 280));

    const checkToggleElement = () => {
      it("should render the dialogue's toggle element", () => {
        cy.get(`[data-testid="${dialogueIDs.DialogueToggleComponent}"]`, {
          timeout,
        })
          .contains(toggleText, { timeout })
          .should("be.visible");
      });
    };

    const checkNoToggleElement = () => {
      it("should NOT render the dialogue's toggle element", () => {
        cy.get(`[data-testid="${dialogueIDs.DialogueToggleComponent}"]`, {
          timeout,
        }).should("not.exist");
      });
    };

    checkNoToggleElement();

    describe('when the screen size is restored (Macbook 16")', () => {
      before(() => cy.viewport("macbook-16"));

      checkToggleElement();
    });
  });
}
