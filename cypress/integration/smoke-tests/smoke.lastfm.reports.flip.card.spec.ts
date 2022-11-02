import env from "@cypress/config/env";
import { authenticate } from "@cypress/fixtures/auth";
import { getAuthorizationCookieName } from "@cypress/fixtures/cookies";
import { flipCardReports } from "@cypress/fixtures/reports";
import { baseUrl } from "@cypress/fixtures/setup";
import routes from "@src/config/routes";

describe("Flip Card Reports", () => {
  const authorizationCookieName = getAuthorizationCookieName();
  const expectedFlipCards = 20;
  const timeout = 40000;

  before(() => baseUrl());

  flipCardReports.forEach((report) => {
    describe(report, () => {
      describe("when we are logged in", () => {
        before(() =>
          authenticate(authorizationCookieName, env.SMOKE_TEST_ALL_ACCESS_TOKEN)
        );

        describe("when we visit the search selection screen", () => {
          before(() => cy.visit(routes.search.lastfm.selection));

          describe(`when we select the '${report}' report`, () => {
            let Report: Cypress.Chainable<undefined>;

            before(() => {
              Report = cy.contains(report);
              Report.click();
            });

            it("should display an input field for a lastfm username", () => {
              cy.get('input[name="username"]', { timeout });
            });

            describe("when we enter a username", () => {
              let Input: Cypress.Chainable<JQuery<HTMLElement>>;

              before(() => {
                Input = cy.get('input[name="username"]');
                Input.type("niall-byrne{enter}");
              });

              it("should load 20 flip cards for the expected report", () => {
                for (let i = 1; i <= expectedFlipCards; i++) {
                  cy.get(`[alt="Image: ${i}"]`, { timeout });
                }
              });
            });
          });
        });
      });
    });
  });
});
