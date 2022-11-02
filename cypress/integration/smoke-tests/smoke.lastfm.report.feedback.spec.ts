import env from "@cypress/config/env";
import { authenticate } from "@cypress/fixtures/auth";
import { getAuthorizationCookieName } from "@cypress/fixtures/cookies";
import { flipCardReports } from "@cypress/fixtures/reports";
import { baseUrl } from "@cypress/fixtures/setup";
import translations from "@locales/main.json";
import metrics from "@src/config/metrics";
import routes from "@src/config/routes";

describe("Feedback dialogue test", () => {
  const authorizationCookieName = getAuthorizationCookieName();
  const expectedFlipCards = 20;
  const report = flipCardReports[0];
  const thresholdSearchMetricValue = { SearchMetric: 4 };
  const timeout = 40000;

  describe("when local storage contains a threshold search metric value", () => {
    before(() => {
      window.localStorage.setItem(
        metrics.localStorageKey,
        JSON.stringify(thresholdSearchMetricValue)
      );
    });

    after(() => window.localStorage.clear());

    describe("when we are logged in", () => {
      before(() => {
        baseUrl();
        authenticate(authorizationCookieName, env.SMOKE_TEST_ALL_ACCESS_TOKEN);
      });

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

            describe("when the feedback dialogue is displayed", () => {
              let Dialogue: Cypress.Chainable<JQuery<HTMLElement>>;

              before(() => {
                Dialogue = cy.get(`[data-testid="FeedBackDialogue"]`, {
                  timeout,
                });
              });

              it("should display the feedback dialogue icon", () => {
                Dialogue.contains(`[data-testid="FeedBackDialogueIcon"]`, {
                  timeout,
                });
              });

              it("should display the feedback dialogue close button", () => {
                Dialogue.contains(
                  `[data-testid="FeedBackDialogueCloseButton"]`,
                  {
                    timeout,
                  }
                );
              });

              it("should display the feedback dialogue's text", () => {
                Dialogue.contains(translations.popups.FeedBack);
              });
            });
          });
        });
      });
    });
  });
});
