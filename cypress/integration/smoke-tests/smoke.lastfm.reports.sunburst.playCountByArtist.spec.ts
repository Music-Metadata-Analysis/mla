import env from "@cypress/config/env";
import { authenticate } from "@cypress/fixtures/auth";
import { getAuthorizationCookieName } from "@cypress/fixtures/cookies";
import { sunBurstReports } from "@cypress/fixtures/reports";
import { baseUrl } from "@cypress/fixtures/setup";
import routes from "@src/config/routes";

describe("Count By Artist SunBurst Report", async () => {
  const authorizationCookieName = getAuthorizationCookieName();

  before(() => baseUrl());

  describe(sunBurstReports.playCountByArtist, () => {
    describe("when we are logged in", () => {
      before(() => {
        authenticate(authorizationCookieName, env.SMOKE_TEST_ALL_ACCESS_TOKEN);
        cy.visit("/");
      });

      describe("when we visit the search selection screen", () => {
        before(() => cy.visit(routes.search.lastfm.selection));

        describe(`when we select the '${sunBurstReports.playCountByArtist}' report`, () => {
          let Report;

          before(() => {
            Report = cy.contains(sunBurstReports.playCountByArtist);
            Report.click();
          });

          it("should display an input field for a lastfm username", () => {
            cy.get('input[name="username"]', { timeout: 20000 });
          });

          describe("when we enter a username", () => {
            let Input;

            before(() => {
              Input = cy.get('input[name="username"]');
              Input.type("test-account-2{enter}");
            });

            it("should load a title for the report", () => {
              const titleElement = cy.get(
                `[data-testid="SunBurstTitlePanelTitle"]`,
                {
                  timeout: 40000,
                }
              );

              titleElement
                .contains("My Top Artist Playcounts")
                .should("be.visible");
            });

            it("should load an svg with the correct title element", () => {
              const svgTitleElement = cy.get(
                `[id="SunburstPercentageDisplay"]`,
                { timeout: 40000 }
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
                  {
                    timeout: 40000,
                  }
                );

                artistList.contains("Artists").should("be.visible");
              });

              describe("when an artist is clicked", () => {
                before(() => {
                  const artistList = cy.get(`[data-testid="NodeNameText"]`, {
                    timeout: 40000,
                  });
                  artistList.click();
                });

                it("should display the album list", () => {
                  const albumList = cy.get(
                    `[data-testid="SunBurstEntityNodeListTitle"]`,
                    {
                      timeout: 40000,
                    }
                  );

                  albumList.contains("Albums").should("be.visible");
                });
              });

              describe("when an album is clicked", () => {
                before(() => {
                  const albumList = cy.get(`[data-testid="NodeNameText"]`, {
                    timeout: 40000,
                  });
                  albumList.click();
                });

                it("should display the track list- no information available", () => {
                  const artistList = cy.get(
                    `[data-testid="SunBurstEntityNodeListTitle"]`,
                    {
                      timeout: 40000,
                    }
                  );

                  artistList
                    .contains("No information available")
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
