import env from "@cypress/config/env";
import { flipCardReports, sunBurstReports } from "@cypress/fixtures/reports";
import { setup } from "@cypress/fixtures/spec/setup.spec";
import authentication from "@locales/authentication.json";
import type { CypressReportType } from "@cypress/types/reports";

describe("LastFM Report Viewing (Unauthenticated)", () => {
  const timeout = 5000;

  const reports: CypressReportType[] = flipCardReports.concat(sunBurstReports);

  before(() => setup());

  reports.forEach((reportConfig) => {
    describe(reportConfig.reportName, () => {
      describe("when we are NOT logged in", () => {
        before(() => cy.reload(true));

        describe("when we visit the report screen", () => {
          before(() => {
            cy.visit(
              reportConfig.reportRoute +
                `?username=${Cypress.env(env.LASTFM_TEST_ACCOUNT_WITH_LISTENS)}`
            );
          });

          it("should prompt us to log in", () => {
            cy.contains(authentication.title, { timeout }).should(
              "be.visible",
              {
                timeout,
              }
            );
            cy.contains(authentication.buttons.facebook, {
              timeout,
            }).should("be.visible", { timeout });
            cy.contains(authentication.buttons.github, { timeout }).should(
              "be.visible",
              {
                timeout,
              }
            );
            cy.contains(authentication.buttons.google, { timeout }).should(
              "be.visible",
              {
                timeout,
              }
            );
            cy.contains(authentication.buttons.spotify, { timeout }).should(
              "be.visible",
              {
                timeout,
              }
            );
          });

          it("should offer to show us the terms of service", () => {
            cy.contains(authentication.terms, { timeout }).should(
              "be.visible",
              {
                timeout,
              }
            );
          });
        });
      });
    });
  });
});
