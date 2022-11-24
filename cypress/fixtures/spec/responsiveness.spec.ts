import { testIDs as billboardIDs } from "@src/components/billboard/billboard.base/billboard.component";
import { testIDs as dialogueIDs } from "@src/components/dialogues/resizable/dialogue.resizable.component";

const checkTitleElement = ({
  timeout,
  titleText,
}: {
  timeout: number;
  titleText: string;
}) => {
  it("should NOT render the title", () => {
    cy.get(`[data-testid="${billboardIDs.BillBoardTitle}"]`, {
      timeout,
    })
      .contains(titleText)
      .should("be.visible", { timeout });
  });
};

const checkNoTitleElement = ({ timeout }: { timeout: number }) => {
  it("should render the title text", () => {
    cy.contains(`[data-testid="${billboardIDs.BillBoardTitle}"]`, {
      timeout,
    }).should("not.exist");
  });
};

export const checkBillboardTitle = ({ titleText }: { titleText: string }) => {
  describe("when the screen is resized (Galaxy Fold Size)", () => {
    const timeout = 10000;

    before(() => cy.viewport(653, 280));

    checkNoTitleElement({ timeout });

    describe('when the screen size is restored (Macbook 16")', () => {
      before(() => cy.viewport("macbook-16"));

      checkTitleElement({ timeout, titleText });
    });
  });
};

export const checkDialogueToggle = ({
  titleText,
  toggleText,
}: {
  titleText: string;
  toggleText: string;
}) => {
  describe("when the screen is resized (Galaxy Fold Size)", () => {
    const timeout = 10000;

    before(() => cy.viewport(653, 280));

    const checkToggleElement = () => {
      it("should NOT render the dialogue's toggle element", () => {
        cy.get(`[data-testid="${dialogueIDs.DialogueToggleComponent}"]`, {
          timeout,
        })
          .contains(toggleText)
          .should("be.visible", { timeout });
      });
    };

    const checkNoToggleElement = () => {
      it("should NOT render the dialogue's toggle element", () => {
        cy.contains(`[data-testid="${dialogueIDs.DialogueToggleComponent}"]`, {
          timeout,
        }).should("not.exist");
      });
    };

    checkNoTitleElement({ timeout });
    checkNoToggleElement();

    describe('when the screen size is restored (Macbook 16")', () => {
      before(() => cy.viewport("macbook-16"));

      checkTitleElement({ timeout, titleText });
      checkToggleElement();
    });
  });
};
