import env from "@cypress/config/env";
import { getAuthorizationCookieName } from "@cypress/fixtures/cookies";
import { sunBurstReports } from "@cypress/fixtures/reports";
import { authenticate } from "@cypress/fixtures/spec/auth.spec";
import { setup } from "@cypress/fixtures/spec/setup.spec";
import LastFmTranslations from "@locales/lastfm.json";
import SunBurstTranslations from "@locales/sunburst.json";
import { fields } from "@src/components/search/lastfm/forms/username/username.form.identifiers";
import routes from "@src/config/routes";
import { classes as SunBurstSVGclasses } from "@src/web/reports/generics/components/charts/sunburst/svg/svg.identifiers";
import { testIDs as SunBurstDrawerButtonIDs } from "@src/web/reports/lastfm/generics/components/drawer/sunburst/nodes/node.button/node.button.identifiers";
import { testIDs as SunBurstDrawerListIDs } from "@src/web/reports/lastfm/generics/components/drawer/sunburst/nodes/node.list/node.list.identifiers";
import { testIDs as SunBurstControlIDs } from "@src/web/reports/lastfm/generics/components/report.component/sunburst/panels/control/control.panel.identifiers";
import { testIDs as SunBurstTitleIDs } from "@src/web/reports/lastfm/generics/components/report.component/sunburst/panels/title/title.panel.identifiers";

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
                "test-account-2{enter}"
              );
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

            it("should load an svg with the correct title element", () => {
              cy.get(`.${SunBurstSVGclasses.SunburstPercentageDisplay}`, {
                timeout,
              })
                .contains("100%", { timeout })
                .should("be.visible", { timeout });
            });

            describe("when the 'select' button is clicked", () => {
              before(() => {
                cy.get(
                  `[data-testid="${SunBurstControlIDs.SunBurstControlPanelSelect}"]`,
                  { timeout }
                ).click();
              });

              it("should display the artist list", () => {
                cy.get(
                  `[data-testid="${SunBurstDrawerListIDs.SunBurstEntityNodeListTitle}"]`,
                  { timeout }
                )
                  .contains(SunBurstTranslations.entities.artists, { timeout })
                  .should("be.visible", { timeout });
              });

              describe("when an artist is clicked", () => {
                before(() => {
                  cy.get(
                    `[data-testid="${SunBurstDrawerButtonIDs.NodeNameText}"]`,
                    { timeout }
                  ).click();
                });

                it("should display the album list", () => {
                  cy.get(
                    `[data-testid="${SunBurstDrawerListIDs.SunBurstEntityNodeListTitle}"]`,
                    { timeout }
                  )
                    .contains(SunBurstTranslations.entities.albums, { timeout })
                    .should("be.visible", {
                      timeout,
                    });
                });
              });

              describe("when an album is clicked", () => {
                before(() => {
                  cy.get(
                    `[data-testid="${SunBurstDrawerButtonIDs.NodeNameText}"]`,
                    { timeout }
                  ).click();
                });

                it("should display the track list- no information available", () => {
                  cy.get(
                    `[data-testid="${SunBurstDrawerListIDs.SunBurstEntityNodeListTitle}"]`,
                    { timeout }
                  )
                    .contains(
                      LastFmTranslations.playCountByArtist.drawer.noInformation,
                      { timeout }
                    )
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
});
