import env from "@cypress/config/env";
import { getAuthorizationCookieName } from "@cypress/fixtures/cookies";
import { flipCardReports } from "@cypress/fixtures/reports";
import { authenticate } from "@cypress/fixtures/spec/auth.spec";
import { setup } from "@cypress/fixtures/spec/setup.spec";
import translations from "@locales/main.json";
import { testIDs as feedBackTestIDs } from "@src/components/popups/popups.components/feedback.popup.identifiers";
import { fields } from "@src/components/search/lastfm/forms/username/username.form.identifiers";
import metrics from "@src/config/metrics";
import routes from "@src/config/routes";

describe("Feedback Dialogue", () => {
  const authorizationCookieName = getAuthorizationCookieName();
  const thresholdSearchMetricValue = { SearchMetric: 4 };
  const timeout = 40000;
  const report = flipCardReports[0].reportName;

  before(() => setup());

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
        authenticate(authorizationCookieName, env.SMOKE_TEST_ALL_ACCESS_TOKEN);
      });

      describe("when we visit the search selection screen", () => {
        before(() => cy.visit(routes.search.lastfm.selection));

        describe(`when we select the '${report}' report`, () => {
          before(() => {
            cy.contains(report, { timeout }).click();
          });

          it("should display an input field for a lastfm username", () => {
            cy.get(`input[name="${fields.username}"]`, { timeout });
          });

          describe("when we enter a username", () => {
            before(() => {
              cy.get(`input[name="${fields.username}"]`, { timeout }).type(
                "niall-byrne{enter}"
              );
            });

            describe("when the feedback dialogue is displayed", () => {
              const getDialogue = () =>
                cy.get(`[data-testid="${feedBackTestIDs.FeedBackDialogue}"]`, {
                  timeout,
                });

              it("should display the feedback dialogue icon", () => {
                getDialogue()
                  .get(
                    `[data-testid="${feedBackTestIDs.FeedBackDialogueIcon}"]`,
                    { timeout }
                  )
                  .should("be.visible", {
                    timeout,
                  });
              });

              it("should display the feedback dialogue close button", () => {
                getDialogue()
                  .get(
                    `[data-testid="${feedBackTestIDs.FeedBackDialogueCloseButton}"]`,
                    { timeout }
                  )
                  .should("be.visible", {
                    timeout,
                  });
              });

              it("should display the feedback dialogue's text", () => {
                getDialogue()
                  .contains(translations.popups.FeedBack, { timeout })
                  .should("be.visible", {
                    timeout,
                  });
              });
            });
          });
        });
      });
    });
  });
});
