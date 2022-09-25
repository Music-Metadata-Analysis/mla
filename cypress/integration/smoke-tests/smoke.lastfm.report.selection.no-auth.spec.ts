import { flipCardReports, sunBurstReports } from "@cypress/fixtures/reports";
import { baseUrl } from "@cypress/fixtures/setup";
import authentication from "@locales/authentication.json";
import lastfm from "@locales/lastfm.json";
import routes from "@src/config/routes";

describe("LastFM Report Selection Protected", () => {
  const reports = flipCardReports.concat(Object.values(sunBurstReports));
  const openAuthReports = [reports[0]];

  before(() => {
    baseUrl();
    cy.visit("/");
  });

  openAuthReports.forEach((report) => {
    describe(report, () => {
      describe("when we are NOT logged in", () => {
        before(() => {
          cy.visit(routes.search.lastfm.selection);
        });

        it("should render the correct page title", () => {
          cy.contains(lastfm.select.title).should("be.visible", {
            timeout: 5000,
          });
        });

        it("should render the correct button text", () => {
          cy.contains(report).should("be.visible");
        });

        describe(`when we select the ${report} report`, () => {
          let Report: Cypress.Chainable<undefined>;

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
            Report.contains(authentication.buttons.google).should("be.visible");
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
