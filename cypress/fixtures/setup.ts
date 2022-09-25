import env from "@cypress/config/env";

export const baseUrl = () => {
  Cypress.config("baseUrl", Cypress.env(env.BASEURL));
};
