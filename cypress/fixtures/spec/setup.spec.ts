import env from "@cypress/config/env";

export const setup = () => {
  baseUrl();
  viewPort();
};
const baseUrl = () => {
  Cypress.config("baseUrl", Cypress.env(env.BASEURL));
};

const viewPort = () => {
  cy.viewport("macbook-16");
};
