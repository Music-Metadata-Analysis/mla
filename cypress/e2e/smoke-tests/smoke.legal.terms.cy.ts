import checkBillboardTitleToggle from "@cypress/fixtures/spec/responsiveness/billboard.cy";
import checkDialogueToggle from "@cypress/fixtures/spec/responsiveness/dialogue.cy";
import { setup } from "@cypress/fixtures/spec/setup.cy";
import legal from "@locales/legal.json";
import routes from "@src/config/routes";

describe("Terms of Use Page", () => {
  const timeout = 5000;

  before(() => {
    setup();
    cy.visit(routes.legal.terms);
  });

  it("should render the title correctly", () => {
    cy.contains(legal.termsOfService.title, { timeout }).should("be.visible", {
      timeout,
    });
  });

  it("should render the terms of service text correctly", () => {
    cy.contains(legal.termsOfService.text1, { timeout }).should("be.visible", {
      timeout,
    });
    cy.contains(legal.termsOfService.text2, { timeout }).should("be.visible", {
      timeout,
    });
  });

  checkBillboardTitleToggle({ timeout, titleText: legal.termsOfService.title });
  checkDialogueToggle({
    timeout,
    toggleText: legal.termsOfService.company,
  });
});
