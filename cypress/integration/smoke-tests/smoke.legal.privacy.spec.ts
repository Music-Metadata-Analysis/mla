import checkBillboardTitleToggle from "@cypress/fixtures/spec/responsiveness/billboard.spec";
import checkDialogueToggle from "@cypress/fixtures/spec/responsiveness/dialogue.spec";
import { setup } from "@cypress/fixtures/spec/setup.spec";
import legal from "@locales/legal.json";
import routes from "@src/config/routes";

describe("Privacy Policy Page", () => {
  const timeout = 5000;

  before(() => {
    setup();
    cy.visit(routes.legal.privacy);
  });

  it("should render the title correctly", () => {
    cy.contains(legal.privacy.title, { timeout }).should("be.visible", {
      timeout,
    });
  });

  it("should render the terms of service text correctly", () => {
    cy.contains(legal.privacy.text1, { timeout }).should("be.visible", {
      timeout,
    });
  });

  checkBillboardTitleToggle({ timeout, titleText: legal.privacy.title });
  checkDialogueToggle({
    timeout,
    toggleText: legal.privacy.company,
  });
});
