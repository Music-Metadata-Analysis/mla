import authentication from "@locales/authentication.json";

export const checkAuthenticationModal = ({ timeout }: { timeout: number }) => {
  describe("when the authentication modal opens", () => {
    it("should prompt us to log in", () => {
      cy.contains(authentication.title, { timeout }).should("be.visible", {
        timeout,
      });
    });

    (
      Object.keys(
        authentication.buttons
      ) as (keyof typeof authentication.buttons)[]
    ).forEach((button) => {
      it(`should show the login button for '${button}'`, () => {
        cy.contains(authentication.buttons[button], {
          timeout,
        }).should("be.visible", {
          timeout,
        });
      });
    });

    it("should offer to show us the terms of service", () => {
      cy.contains(authentication.terms, {
        timeout,
      }).should("be.visible", {
        timeout,
      });
    });
  });
};
