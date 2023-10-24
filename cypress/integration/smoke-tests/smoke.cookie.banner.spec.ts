import { setup } from "@cypress/fixtures/spec/setup.spec";
import main from "@locales/main.json";
import routes from "@src/config/routes";

describe("Cookie Consent Banner", () => {
  const timeout = 5000;

  before(() => {
    setup();
    cy.visit(routes.home);
  });

  describe("when we view the cookie consent banner", () => {
    const getConsentBanner = () => cy.get(".CookieConsent", { timeout });

    it("should display the cookie consent banner", () => {
      getConsentBanner()
        .contains(main.analytics.message1, { timeout })
        .should("be.visible");
      getConsentBanner()
        .contains(main.analytics.message2, { timeout })
        .should("be.visible");
    });

    it("should display the accept button", () => {
      getConsentBanner()
        .contains(main.analytics.acceptMessage, { timeout })
        .should("be.visible", { timeout });
      getConsentBanner()
        .contains(main.analytics.declineMessage, { timeout })
        .should("be.visible", { timeout });
    });

    it("should display the decline button", () => {
      getConsentBanner()
        .contains(main.analytics.acceptMessage, { timeout })
        .should("be.visible", { timeout });
    });

    describe("when we click the accept button", () => {
      before(() => {
        getConsentBanner()
          .contains(main.analytics.acceptMessage, { timeout })
          .click();
      });

      it("should no longer display the cookie consent banner", () => {
        getConsentBanner().should("not.exist", { timeout: 1000 });
      });
    });
  });
});
