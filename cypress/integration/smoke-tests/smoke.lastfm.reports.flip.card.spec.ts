import env from "@cypress/config/env";
import { getAuthorizationCookieName } from "@cypress/fixtures/cookies";
import { flipCardReports } from "@cypress/fixtures/reports";
import { authenticate } from "@cypress/fixtures/spec/auth.spec";
import { setup } from "@cypress/fixtures/spec/setup.spec";
import { fields } from "@src/components/search/lastfm/forms/username/username.form.identifiers";
import routes from "@src/config/routes";

describe("Flip Card Reports", () => {
  const authorizationCookieName = getAuthorizationCookieName();
  const expectedFlipCards = 20;
  const timeout = 40000;

  before(() => setup());

  flipCardReports.forEach((reportConfig) => {
    describe(reportConfig.reportName, () => {
      describe("when we are logged in", () => {
        before(() =>
          authenticate(authorizationCookieName, env.SMOKE_TEST_ALL_ACCESS_TOKEN)
        );

        describe("when we visit the search selection screen", () => {
          before(() => cy.visit(routes.search.lastfm.selection));

          describe(`when we select the '${reportConfig.reportName}' report`, () => {
            before(() => {
              cy.contains(reportConfig.reportName, { timeout }).click();
            });

            it("should display an input field for a lastfm username", () => {
              cy.get(`input[name="${fields.username}"]`, { timeout }).should(
                "be.visible",
                {
                  timeout,
                }
              );
            });

            describe("when we enter a username", () => {
              before(() => {
                cy.get(`input[name="${fields.username}"]`, { timeout }).type(
                  "niall-byrne{enter}"
                );
              });

              it("should load 20 flip cards for the expected report", () => {
                for (let i = 1; i <= expectedFlipCards; i++) {
                  cy.get(`[alt="Image: ${i}"]`, { timeout }).should("exist", {
                    timeout,
                  });
                }
              });
            });
          });
        });
      });
    });
  });
});
