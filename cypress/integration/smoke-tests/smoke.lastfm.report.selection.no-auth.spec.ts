import { config, getValueOf } from "@cypress/config";
import checkBillboardTitleToggle from "@cypress/fixtures/spec/responsiveness/billboard.spec";
import { setup } from "@cypress/fixtures/spec/setup.spec";
import authentication from "@locales/authentication.json";
import lastfm from "@locales/lastfm.json";
import main from "@locales/main.json";
import routes from "@src/config/routes";
import type { CypressFlagEnabledReportType } from "@cypress/types/reports";

describe("LastFM Report Selection (Unauthenticated)", () => {
  const timeout = 5000;

  const reports: CypressFlagEnabledReportType[] = JSON.parse(
    getValueOf(config.FLAG_ENABLED_REPORTS)
  );

  before(() => setup());

  reports
    .filter((reportConfig) => reportConfig.enabled)
    .forEach((reportConfig) => {
      describe(reportConfig.reportName, () => {
        describe("when we are NOT logged in", () => {
          before(() => cy.reload(true));

          describe("when we visit the search selection screen", () => {
            before(() => {
              cy.visit(routes.search.lastfm.selection);
            });

            it("should contain the lastfm logo", () => {
              cy.get(`[alt="${main.altText.lastfm}"]`, { timeout }).should(
                "be.visible",
                {
                  timeout,
                }
              );
            });

            checkBillboardTitleToggle({
              timeout,
              titleText: lastfm.select.title,
            });

            it("should render the correct button text", () => {
              cy.contains(reportConfig.reportName, { timeout }).should(
                "be.visible",
                {
                  timeout,
                }
              );
            });

            describe(`when we select the ${reportConfig.reportName} report`, () => {
              before(() => {
                cy.contains(reportConfig.reportName, { timeout }).click();
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
});
