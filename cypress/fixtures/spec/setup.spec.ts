import env from "@cypress/config/env";
import { getAuthorizationCookieName } from "@cypress/fixtures/cookies";

export const setup = () => {
  resetState();
  baseUrl();
  viewPort();
};
const baseUrl = () => {
  Cypress.config("baseUrl", Cypress.env(env.BASEURL));
};

const viewPort = () => {
  cy.viewport("macbook-16");
};

const resetState = () => {
  cy.clearCookies();
  cy.clearCookie(getAuthorizationCookieName());
  cy.clearLocalStorage();
};
