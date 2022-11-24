import checkBillboardTitleToggle from "@cypress/fixtures/spec/responsiveness/billboard.spec";
import checkDialogueToggle from "@cypress/fixtures/spec/responsiveness/dialogue.spec";
import { setup } from "@cypress/fixtures/spec/setup.spec";
import splash from "@locales/splash.json";
import routes from "@src/config/routes";

describe("Splash Page", () => {
  const timeout = 5000;

  before(() => {
    setup();
    cy.visit(routes.home);
  });

  it("should render the title correctly", () => {
    cy.contains(splash.title, { timeout }).should("be.visible", { timeout });
  });

  it("should render the credit text correctly", () => {
    cy.contains(splash.creditText, { timeout }).should("be.visible", {
      timeout,
    });
  });

  it("should render the splash text correctly", () => {
    cy.contains(splash.splashText1, { timeout }).should("be.visible", {
      timeout,
    });
    cy.contains(splash.splashText2, { timeout }).should("be.visible", {
      timeout,
    });
    cy.contains(splash.splashText3, { timeout }).should("be.visible", {
      timeout,
    });
  });

  checkBillboardTitleToggle({
    timeout,
    titleText: splash.title,
  });
  checkDialogueToggle({
    timeout,
    toggleText: splash.splashText1,
  });
});
