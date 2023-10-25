import { config, getValueOf } from "@cypress/config";
import { getAuthorizationCookieName } from "@cypress/fixtures/cookies";

export const setup = () => {
  resetState();
  baseUrl();
  viewPort();
};
const baseUrl = () => {
  Cypress.config("baseUrl", getValueOf(config.BASEURL));
};

const viewPort = () => {
  cy.viewport("macbook-16");
};

const resetState = () => {
  cy.clearCookies();
  cy.clearCookie(getAuthorizationCookieName());
  cy.clearLocalStorage();
};
