import { config, getValueOf } from "@cypress/config";
import { getAuthorizationCookieName } from "@cypress/fixtures/cookies";
import { sunBurstReports } from "@cypress/fixtures/reports";
import { authenticate } from "@cypress/fixtures/spec/auth.cy";
import { setup } from "@cypress/fixtures/spec/setup.cy";
import LastFmTranslations from "@locales/lastfm.json";
import translations from "@locales/main.json";
import metrics from "@src/config/metrics";
import { testIDs as feedBackTestIDs } from "@src/web/notifications/popups/components/feedback/feedback.popup.identifiers";
import { testIDs as SunBurstTitleIDs } from "@src/web/reports/lastfm/generics/components/report.component/sunburst/panels/title/title.panel.identifiers";

describe("Feedback Dialogue", () => {
  const authorizationCookieName = getAuthorizationCookieName();
  const timeout = 40000;

  before(() => setup());

  describe("when we are logged in", () => {
    before(() => {
      authenticate(authorizationCookieName, config.SMOKE_TEST_ALL_ACCESS_TOKEN);
    });

    [
      { condition: { SearchMetric: 3 }, result: false },
      { condition: { SearchMetric: 4 }, result: true },
      { condition: { SearchMetric: 5 }, result: false },
    ].forEach((testCase) =>
      describe(`when local storage contains a search metric value (${JSON.stringify(
        testCase.condition
      )})`, () => {
        before(() => {
          window.localStorage.setItem(
            metrics.localStorageKey,
            JSON.stringify(testCase.condition)
          );
        });

        after(() => window.localStorage.clear());

        describe("when we visit a user's lastfm playcount by artist report page", () => {
          before(() => {
            cy.visit(
              sunBurstReports[0].reportRoute +
                `?username=${getValueOf(
                  config.LASTFM_TEST_ACCOUNT_WITH_LISTENS
                )}`
            );
          });

          describe("when the title dialogue is displayed", () => {
            const getDialogue = () =>
              cy.get(`[data-testid="${feedBackTestIDs.FeedBackDialogue}"]`, {
                timeout,
              });

            const noDialogue = () =>
              cy
                .get(`[data-testid="${feedBackTestIDs.FeedBackDialogue}"]`)
                .should("not.exist", {
                  timeout: 500,
                });

            it("should load a title for the report", () => {
              cy.get(
                `[data-testid="${SunBurstTitleIDs.SunBurstTitlePanelTitle}"]`,
                { timeout }
              )
                .contains(LastFmTranslations.playCountByArtist.title, {
                  timeout,
                })
                .should("be.visible", { timeout });
            });

            if (testCase.result) {
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
            } else {
              it("should NOT display the feedback dialogue icon", () => {
                noDialogue();
              });
            }
          });
        });
      })
    );
  });
});
