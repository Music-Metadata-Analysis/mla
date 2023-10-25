import checkBillboardTitleToggle from "@cypress/fixtures/spec/responsiveness/billboard.cy";
import checkDialogueToggle from "@cypress/fixtures/spec/responsiveness/dialogue.cy";
import { setup } from "@cypress/fixtures/spec/setup.cy";
import about from "@locales/about.json";
import routes from "@src/config/routes";

describe("About Page", () => {
  const timeout = 5000;

  before(() => {
    setup();
    cy.visit(routes.about);
  });

  it("should render the correct page title", () => {
    cy.contains(about.title, { timeout }).should("be.visible", { timeout });
  });

  it("should render the correct company name", () => {
    cy.contains(about.company, { timeout }).should("be.visible", { timeout });
  });

  it("should render the correct text", () => {
    cy.contains(about.aboutText1, { timeout }).should("be.visible", {
      timeout,
    });
    cy.contains(about.aboutText2, { timeout }).should("be.visible", {
      timeout,
    });
    cy.contains(about.aboutText3, { timeout }).should("be.visible", {
      timeout,
    });
  });

  checkBillboardTitleToggle({ timeout, titleText: about.title });
  checkDialogueToggle({ timeout, toggleText: about.aboutText1 });
});
