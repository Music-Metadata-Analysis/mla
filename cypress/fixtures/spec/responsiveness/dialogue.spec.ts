import { testIDs as dialogueIDs } from "@src/web/ui/generics/components/dialogues/resizable/dialogue.resizable.identifiers";

export default function checkDialogueToggle({
  timeout,
  toggleText,
}: {
  timeout: number;
  toggleText: string;
}) {
  describe("when the screen is resized (Galaxy Fold Size)", () => {
    before(() => cy.viewport(653, 280));

    const getDialogue = () =>
      cy.get(`[data-testid="${dialogueIDs.DialogueToggleComponent}"]`);

    const checkToggleElement = () => {
      it("should render the dialogue's toggle element", () => {
        getDialogue().contains(toggleText).should("be.visible", { timeout });
      });
    };

    const checkNoToggleElement = () => {
      it("should NOT render the dialogue's toggle element", () => {
        getDialogue().should("not.exist", { timeout });
      });
    };

    checkNoToggleElement();

    describe('when the screen size is restored (Macbook 16")', () => {
      before(() => cy.viewport("macbook-16"));

      checkToggleElement();
    });
  });
}
