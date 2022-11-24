import { setup } from "@cypress/fixtures/spec/setup.spec";
import navbar from "@locales/navbar.json";
import routes from "@src/config/routes";

describe("NavBar", () => {
  const timeout = 5000;

  before(() => {
    setup();
    cy.visit(routes.home);
  });

  describe("when we view the navbar", () => {
    it("should contain the expected button text", () => {
      cy.contains(navbar.title, { timeout }).should("be.visible");
    });

    it("should contain the expected button text", () => {
      cy.contains(navbar.title);
    });

    it("should contain the expected button text", () => {
      cy.contains(navbar.menu.about).should("be.visible");
    });

    it("should contain the expected button text", () => {
      cy.contains(navbar.menu.search).should("be.visible");
    });
  });
});
