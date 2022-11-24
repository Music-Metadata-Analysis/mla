import { checkDialogueToggle } from "@cypress/fixtures/spec/responsiveness.spec";
import { setup } from "@cypress/fixtures/spec/setup.spec";
import about from "@locales/about.json";
import routes from "@src/config/routes";

describe("About Page", () => {
  const timeout = 5000;

  before(() => {
    setup();
    cy.visit(routes.about);
  });

  it("should render the correct page title", () => {
    cy.contains(about.title).should("be.visible", { timeout });
  });

  it("should render the correct company name", () => {
    cy.contains(about.company).should("be.visible");
  });

  it("should render the correct text", () => {
    cy.contains(about.aboutText1).should("be.visible");
    cy.contains(about.aboutText2).should("be.visible");
    cy.contains(about.aboutText3).should("be.visible");
  });

  checkDialogueToggle({ titleText: about.title, toggleText: about.aboutText1 });
});
