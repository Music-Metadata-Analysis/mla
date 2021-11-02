import authentication from "../../../public/locales/en/authentication.json";
import lastfm from "../../../public/locales/en/lastfm.json";
import routes from "../../../src/config/routes";
import reports from "../../fixtures/reports";

describe("Search Selection Page", () => {
  Cypress.config("baseUrl", Cypress.env("BASEURL"));

  reports.forEach((report) => {
    describe(report, () => {
      describe("when we are NOT logged in", () => {
        before(() => cy.visit(routes.search.lastfm.selection));

        it("should render the correct page title", () => {
          cy.contains(lastfm.select.title).should("be.visible", {
            timeout: 5000,
          });
        });

        it("should render the correct button text", () => {
          cy.contains(lastfm.select.reports.topAlbums).should("be.visible");
          cy.contains(lastfm.select.reports.topArtists).should("be.visible");
          cy.contains(lastfm.select.reports.topTracks).should("be.visible");
        });

        describe(`when we select the ${report} report`, () => {
          let Report;

          before(() => {
            Report = cy.contains(report);
            Report.click();
          });

          it("should prompt us to log in", () => {
            Report.contains(authentication.title).should("be.visible");
            Report.contains(authentication.buttons.facebook).should(
              "be.visible"
            );
            Report.contains(authentication.buttons.github).should("be.visible");
            Report.contains(authentication.buttons.spotify).should(
              "be.visible"
            );
          });

          it("should offer to show us the terms of service", () => {
            Report.contains(authentication.terms).should("be.visible");
          });
        });
      });
    });
  });
});
