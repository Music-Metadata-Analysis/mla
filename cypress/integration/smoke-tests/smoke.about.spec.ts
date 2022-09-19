import about from "../../../public/locales/en/about.json";
import routes from "../../../src/config/routes";
import { baseUrl } from "../../fixtures/setup";

describe("Splash Page", () => {
  before(() => {
    baseUrl();
    cy.visit(routes.about);
  });

  it("should render the correct page title", () => {
    cy.contains(about.title).should("be.visible", { timeout: 5000 });
  });

  it("should render the correct company name", () => {
    cy.contains(about.company).should("be.visible");
  });

  it("should render the correct text", () => {
    cy.contains(about.aboutText1).should("be.visible");
    cy.contains(about.aboutText2).should("be.visible");
    cy.contains(about.aboutText3).should("be.visible");
  });
});
