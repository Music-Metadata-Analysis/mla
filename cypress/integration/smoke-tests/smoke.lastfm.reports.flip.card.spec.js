import routes from "../../../src/config/routes";
import { getAuthorizationCookieName } from "../../fixtures/cookies";
import { flipCardReports } from "../../fixtures/reports";

describe("Flip Card Reports", () => {
  Cypress.config("baseUrl", Cypress.env("BASEURL"));
  const expectedFlipCards = 20;
  const authorizationCookieName = getAuthorizationCookieName();

  flipCardReports.forEach((report) => {
    describe(report, () => {
      describe("when we are logged in", () => {
        beforeEach(() => {
          cy.visit("/");
          cy.setCookie(
            authorizationCookieName,
            Cypress.env("SMOKE_TEST_TOKEN"),
            {
              httpOnly: true,
              domain: Cypress.env("BASEURL").split("//")[1],
              expiry: new Date().getTime() + 20000,
              sameSite: "lax",
              secure: true,
            }
          );
        });

        describe("when we visit the search selection screen", () => {
          beforeEach(() => cy.visit(routes.search.lastfm.selection));

          describe(`when we select the '${report}' report`, () => {
            let Report;

            beforeEach(() => {
              Report = cy.contains(report);
              Report.click();
            });

            it("should display an input field for a lastfm username", () => {
              cy.get('input[name="username"]', { timeout: 20000 });
            });

            describe("when we enter a username", () => {
              let Input;

              beforeEach(() => {
                Input = cy.get('input[name="username"]');
                Input.type("niall-byrne{enter}").enter;
              });

              it("should load 20 flip cards for the expected report", () => {
                for (let i = 1; i <= expectedFlipCards; i++) {
                  cy.get(`[alt="Image: ${i}"]`, { timeout: 40000 });
                }
              });
            });
          });
        });
      });
    });
  });
});
