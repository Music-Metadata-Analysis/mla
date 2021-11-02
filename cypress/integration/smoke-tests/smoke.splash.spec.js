import main from "../../../public/locales/en/main.json";
import navbar from "../../../public/locales/en/navbar.json";
import splash from "../../../public/locales/en/splash.json";
import routes from "../../../src/config/routes";

describe("Splash Page", () => {
  Cypress.config("baseUrl", Cypress.env("BASEURL"));

  before(() => cy.visit(routes.home));

  it("should render the title correctly", () => {
    cy.contains(splash.title).should("be.visible", { timeout: 5000 });
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
    let CookieConsent;

    beforeEach(() => {
      CookieConsent = cy.get(".CookieConsent", { timeout: 1000 });
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
      beforeEach(() => {
        CookieConsent.contains(main.analytics.acceptMessage).click();
      });

      it("should no longer display the cookie consent banner", () => {
        CookieConsent.contains(main.analytics.message1).not;
        CookieConsent.contains(main.analytics.message2).mot;
      });
    });
  });
});
