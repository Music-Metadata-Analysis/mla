import { setup } from "@cypress/fixtures/spec/setup.spec";
import navbar from "@locales/navbar.json";
import routes from "@src/config/routes";
import { testIDs as navBarMobileMenuIDs } from "@src/web/navigation/navbar/components/mobile.menu/navbar.mobile.menu.identifiers";
import { testIDs as navBarTestIds } from "@src/web/navigation/navbar/components/root/navbar.root.identifiers";

const breakPointThreshold = 480;

describe("NavBar", () => {
  const timeout = 5000;

  before(() => {
    setup();
    cy.visit(routes.home);
  });

  const getNavBarMobileMenuButton = () =>
    cy.get(`[data-testid="${navBarTestIds.NavBarMobileMenuButton}"]`, {
      timeout,
    });

  describe("when the screen is resized (Below Breakpoint Threshold)", () => {
    beforeEach(() => cy.viewport(breakPointThreshold - 1, 768));

    it("should render the NavBar Mobile Menu Button", () => {
      getNavBarMobileMenuButton().should("be.visible", {
        timeout,
      });
    });

    it("should contain the expected title button text", () => {
      cy.contains(navbar.title, { timeout }).should("be.visible", {
        timeout,
      });
    });

    it("should NOT contain the about button text", () => {
      cy.contains(navbar.menu.about, {
        timeout,
      }).should("not.be.visible", { timeout });
    });

    it("should NOT contain the search button text", () => {
      cy.contains(navbar.menu.search, {
        timeout,
      }).should("not.be.visible", { timeout });
    });

    describe("when the NavBar Mobile Menu Button is clicked", () => {
      beforeEach(() => click());

      afterEach(() => click());

      const getNavBarMobileMenu = () =>
        cy.get(`[data-testid="${navBarMobileMenuIDs.NavBarMobileMenu}"]`, {
          timeout,
        });

      const click = () => getNavBarMobileMenuButton().click();

      it("should display the Nav Bar Mobile Menu", () => {
        getNavBarMobileMenu().should("be.visible", {
          timeout,
        });
      });

      it("should contain the expected about button text", () => {
        getNavBarMobileMenu()
          .contains("About", {
            timeout,
          })
          .should("be.visible", { timeout });
      });

      it("should contain the expected search button text", () => {
        getNavBarMobileMenu()
          .contains(navbar.menu.search, {
            timeout,
          })
          .should("be.visible", { timeout });
      });
    });
  });

  describe('when the screen size is restored (Macbook 16")', () => {
    beforeEach(() => cy.viewport("macbook-16"));

    it("should NOT render the NavBar Mobile Menu", () => {
      getNavBarMobileMenuButton().should("not.be.visible", {
        timeout,
      });
    });

    it("should contain the expected title button text", () => {
      cy.contains(navbar.title, { timeout }).should("be.visible", {
        timeout,
      });
    });

    it("should contain the expected about button text", () => {
      cy.contains(navbar.menu.about, {
        timeout,
      }).should("be.visible", { timeout });
    });

    it("should contain the expected search button text", () => {
      cy.contains(navbar.menu.search, {
        timeout,
      }).should("be.visible", { timeout });
    });
  });
});
