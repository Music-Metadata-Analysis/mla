import { checkDialogueToggle } from "@cypress/fixtures/spec/responsiveness.spec";
import { setup } from "@cypress/fixtures/spec/setup.spec";
import legal from "@locales/legal.json";
import routes from "@src/config/routes";

describe("Splash Page", () => {
  const timeout = 5000;

  before(() => {
    setup();
    cy.visit(routes.legal.privacy);
  });

  it("should render the title correctly", () => {
    cy.contains(legal.privacy.title).should("be.visible", { timeout });
  });

  it("should render the terms of service text correctly", () => {
    cy.contains(legal.privacy.text1.replace("  ", " ")).should("be.visible");
  });

  checkDialogueToggle({
    titleText: legal.privacy.title,
    toggleText: legal.privacy.company,
  });
});
