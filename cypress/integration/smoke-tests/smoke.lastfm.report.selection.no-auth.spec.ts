import { flipCardReports, sunBurstReports } from "@cypress/fixtures/reports";
import checkBillboardTitle from "@cypress/fixtures/spec/responsiveness/billboard.spec";
import { setup } from "@cypress/fixtures/spec/setup.spec";
import authentication from "@locales/authentication.json";
import lastfm from "@locales/lastfm.json";
import main from "@locales/main.json";
import routes from "@src/config/routes";

describe("LastFM Report Selection (Unauthenticated)", () => {
  const reports = flipCardReports.concat(sunBurstReports);
  const timeout = 5000;

  const openAuthReports = [reports[0]];

  before(() => setup());

  openAuthReports.forEach((reportConfig) => {
    describe(reportConfig.reportName, () => {
      describe("when we are NOT logged in", () => {
        before(() => cy.reload(true));

        describe("when we visit the search selection screen", () => {
          before(() => {
            cy.visit(routes.search.lastfm.selection);
          });

          it("should contain the lastfm logo", () => {
            cy.get(`[alt="${main.altText.lastfm}"]`, { timeout }).should(
              "be.visible"
            );
          });

          checkBillboardTitle({ timeout, titleText: lastfm.select.title });

          it("should render the correct button text", () => {
            cy.contains(reportConfig.reportName).should("be.visible");
          });

          describe(`when we select the ${reportConfig.reportName} report`, () => {
            before(() => {
              cy.contains(reportConfig.reportName).click();
            });

            it("should prompt us to log in", () => {
              cy.contains(authentication.title).should("be.visible");
              cy.contains(authentication.buttons.facebook).should("be.visible");
              cy.contains(authentication.buttons.github).should("be.visible");
              cy.contains(authentication.buttons.google).should("be.visible");
              cy.contains(authentication.buttons.spotify).should("be.visible");
            });

            it("should offer to show us the terms of service", () => {
              cy.contains(authentication.terms).should("be.visible");
            });
          });
        });
      });
    });
  });
});
