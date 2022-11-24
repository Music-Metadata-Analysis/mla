import { checkDialogueToggle } from "@cypress/fixtures/spec/responsiveness.spec";
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
    cy.contains(splash.title).should("be.visible", { timeout });
  });

  it("should render the credit text correctly", () => {
    cy.contains(splash.creditText).should("be.visible");
  });

  it("should render the splash text correctly", () => {
    cy.contains(splash.splashText1).should("be.visible");
    cy.contains(splash.splashText2).should("be.visible");
    cy.contains(splash.splashText3).should("be.visible");
  });

  checkDialogueToggle({
    titleText: splash.title,
    toggleText: splash.splashText1,
  });
});
