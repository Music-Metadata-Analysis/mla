import env from "@cypress/config/env";
import { getAuthorizationCookieName } from "@cypress/fixtures/cookies";
import { sunBurstReports } from "@cypress/fixtures/reports";
import { authenticate } from "@cypress/fixtures/spec/auth.spec";
import { setup } from "@cypress/fixtures/spec/setup.spec";
import LastFmTranslations from "@locales/lastfm.json";
import SunBurstTranslations from "@locales/sunburst.json";
import routes from "@src/config/routes";

describe("Count By Artist SunBurst Report", async () => {
  const authorizationCookieName = getAuthorizationCookieName();
  const timeout = 40000;

  const reportConfig = sunBurstReports[0];

  before(() => setup());

  describe(reportConfig.reportName, () => {
    describe("when we are logged in", () => {
      before(() => {
        authenticate(authorizationCookieName, env.SMOKE_TEST_ALL_ACCESS_TOKEN);
      });

      describe("when we visit the search selection screen", () => {
        before(() => cy.visit(routes.search.lastfm.selection));

        describe(`when we select the '${reportConfig.reportName}' report`, () => {
          let Report: Cypress.Chainable<undefined>;

          before(() => {
            Report = cy.contains(reportConfig.reportName);
            Report.click();
          });

          it("should display an input field for a lastfm username", () => {
            cy.get('input[name="username"]', { timeout });
          });

          describe("when we enter a username", () => {
            let Input: Cypress.Chainable<JQuery<HTMLElement>>;

            before(() => {
              Input = cy.get('input[name="username"]');
              Input.type("test-account-2{enter}");
            });

            it("should load a title for the report", () => {
              const titleElement = cy.get(
                `[data-testid="SunBurstTitlePanelTitle"]`,
                { timeout }
              );

              titleElement
                .contains(LastFmTranslations.playCountByArtist.title)
                .should("be.visible");
            });

            it("should load an svg with the correct title element", () => {
              const svgTitleElement = cy.get(
                `[id="SunburstPercentageDisplay"]`,
                { timeout }
              );

              svgTitleElement.contains("100%").should("be.visible");
            });

            describe("when the 'select' button is clicked", () => {
              before(() => {
                const button = cy.get(
                  '[data-testid="SunBurstControlPanelSelect"]'
                );
                button.click();
              });

              it("should display the artist list", () => {
                const artistList = cy.get(
                  `[data-testid="SunBurstEntityNodeListTitle"]`,
                  { timeout }
                );

                artistList
                  .contains(SunBurstTranslations.entities.artists)
                  .should("be.visible");
              });

              describe("when an artist is clicked", () => {
                before(() => {
                  const artistList = cy.get(`[data-testid="NodeNameText"]`, {
                    timeout,
                  });
                  artistList.click();
                });

                it("should display the album list", () => {
                  const albumList = cy.get(
                    `[data-testid="SunBurstEntityNodeListTitle"]`,
                    { timeout }
                  );

                  albumList
                    .contains(SunBurstTranslations.entities.albums)
                    .should("be.visible");
                });
              });

              describe("when an album is clicked", () => {
                before(() => {
                  const albumList = cy.get(`[data-testid="NodeNameText"]`, {
                    timeout,
                  });
                  albumList.click();
                });

                it("should display the track list- no information available", () => {
                  const artistList = cy.get(
                    `[data-testid="SunBurstEntityNodeListTitle"]`,
                    { timeout }
                  );

                  artistList
                    .contains(
                      LastFmTranslations.playCountByArtist.drawer.noInformation
                    )
                    .should("be.visible");
                });
              });
            });
          });
        });
      });
    });
  });
});
