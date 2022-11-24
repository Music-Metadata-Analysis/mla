import { setup } from "@cypress/fixtures/spec/setup.spec";
import main from "@locales/main.json";
import routes from "@src/config/routes";

describe("Splash Page", () => {
  const timeout = 5000;

  before(() => {
    setup();
    cy.visit(routes.home);
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
