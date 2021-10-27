import { render, screen, within } from "@testing-library/react";
import { RouterContext } from "next/dist/shared/lib/router-context";
import translations from "../../../../../public/locales/en/legal.json";
import externalLinks from "../../../../config/external";
import mockRouter from "../../../../tests/fixtures/mock.router";
import { testIDs } from "../../../dialogues/resizable/dialogue.resizable.component";
import TermsOfService from "../terms.component";

describe("TermsOfService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(
      <RouterContext.Provider value={mockRouter}>
        <TermsOfService />
      </RouterContext.Provider>
    );
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should render the correct text inside the HeaderComponent", async () => {
      const header = await screen.findByTestId(testIDs.DialogueHeaderComponent);
      expect(header?.firstChild?.firstChild?.textContent).toBe(
        translations.termsOfService.text1
      );
    });

    it("should render the company name on the screen, inside the ToggleComponent", async () => {
      const toggle = await screen.findByTestId(testIDs.DialogueToggleComponent);
      expect(
        await within(toggle).findByText(translations.termsOfService.company)
      ).toBeTruthy();
    });

    it("should render button text inside the contact button, inside the FooterComponent", async () => {
      const footer = await screen.findByTestId(testIDs.DialogueFooterComponent);
      expect(
        await within(footer).findByText(
          translations.termsOfService.buttons.contact
        )
      ).toBeTruthy();
    });

    it("should render button text inside the policy button, inside the FooterComponent", async () => {
      const footer = await screen.findByTestId(testIDs.DialogueFooterComponent);
      expect(
        await within(footer).findByText(
          translations.termsOfService.buttons.terms
        )
      ).toBeTruthy();
    });

    describe("clicking on the contact button", () => {
      let button: HTMLButtonElement;

      beforeEach(async () => {
        expect(mockRouter.push).toBeCalledTimes(0);
        const footer = await screen.findByTestId(
          testIDs.DialogueFooterComponent
        );
        button = await within(footer).findByText(
          translations.termsOfService.buttons.contact
        );
      });

      it("should redirect to the contact page", async () => {
        expect(button.parentElement?.parentElement).toHaveProperty(
          "href",
          externalLinks.svsContact
        );
      });
    });

    describe("clicking on the terms of service button", () => {
      let button: HTMLButtonElement;

      beforeEach(async () => {
        expect(mockRouter.push).toBeCalledTimes(0);
        const footer = await screen.findByTestId(
          testIDs.DialogueFooterComponent
        );
        button = await within(footer).findByText(
          translations.termsOfService.buttons.terms
        );
      });

      it("should redirect to the terms of service page", async () => {
        expect(button.parentElement?.parentElement).toHaveProperty(
          "href",
          externalLinks.termsOfService
        );
      });
    });
  });
});
