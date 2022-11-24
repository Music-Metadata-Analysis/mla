import { flipCardReports, sunBurstReports } from "@cypress/fixtures/reports";
import { setup } from "@cypress/fixtures/spec/setup.spec";
import authentication from "@locales/authentication.json";
import lastfm from "@locales/lastfm.json";
import routes from "@src/config/routes";

describe("LastFM Report Selection (Unauthenticated)", () => {
  const reports = flipCardReports.concat(sunBurstReports);
  const timeout = 5000;

  const openAuthReports = [reports[0]];

  before(() => setup());

  openAuthReports.forEach((reportConfig) => {
    describe(reportConfig.reportName, () => {
      describe("when we are NOT logged in", () => {
        before(() => {
          cy.visit(routes.search.lastfm.selection);
        });

        it("should render the correct page title", () => {
          cy.contains(lastfm.select.title).should("be.visible", {
            timeout,
          });
        });

        it("should render the correct button text", () => {
          cy.contains(reportConfig.reportName).should("be.visible");
        });

        describe(`when we select the ${reportConfig.reportName} report`, () => {
          let Report: Cypress.Chainable<undefined>;

          before(() => {
            Report = cy.contains(reportConfig.reportName);
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
