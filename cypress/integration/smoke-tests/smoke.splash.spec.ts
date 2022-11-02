import { baseUrl } from "@cypress/fixtures/setup";
import main from "@locales/main.json";
import navbar from "@locales/navbar.json";
import splash from "@locales/splash.json";
import routes from "@src/config/routes";

describe("Splash Page", () => {
  const timeout = 5000;

  before(() => {
    baseUrl();
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

  describe("when we view the navbar", () => {
    it("should contain the expected button text", () => {
      cy.contains(navbar.title).should("be.visible");
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

  describe("when we view the cookie consent banner", () => {
    let CookieConsent: Cypress.Chainable<JQuery<Node>>;

    before(() => {
      CookieConsent = cy.get(".CookieConsent", { timeout });
    });

    it("should display the cookie consent banner", () => {
      CookieConsent.contains(main.analytics.message1).should("be.visible");
      CookieConsent.contains(main.analytics.message2).should("be.visible");
    });

    it("should display the accept button", () => {
      CookieConsent.contains(main.analytics.acceptMessage).should("be.visible");
      CookieConsent.contains(main.analytics.declineMessage).should(
        "be.visible"
      );
    });

    it("should display the decline button", () => {
      CookieConsent.contains(main.analytics.acceptMessage).should("be.visible");
    });

    describe("when we click the accept button", () => {
      before(() => {
        CookieConsent.contains(main.analytics.acceptMessage).click();
      });

      it("should no longer display the cookie consent banner", () => {
        CookieConsent.contains(main.analytics.message1).not;
        CookieConsent.contains(main.analytics.message2).not;
      });
    });
  });
});
