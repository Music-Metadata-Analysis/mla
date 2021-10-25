import { render, screen, within } from "@testing-library/react";
import { RouterContext } from "next/dist/shared/lib/router-context";
import translations from "../../../../../public/locales/en/legal.json";
import externalLinks from "../../../../config/external";
import mockRouter from "../../../../tests/fixtures/mock.router";
import { testIDs } from "../../../dialogues/resizable/dialogue.resizable.component";
import Privacy from "../privacy.component";

describe("Privacy", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(
      <RouterContext.Provider value={mockRouter}>
        <Privacy />
      </RouterContext.Provider>
    );
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should render the correct text inside the HeaderComponent", async () => {
      const header = await screen.findByTestId(testIDs.DialogueHeaderComponent);
      expect(header?.firstChild?.firstChild?.textContent).toBe(
        translations.privacy.privacyText1
      );
    });

    it("should render the company name on the screen, inside the ToggleComponent", async () => {
      const toggle = await screen.findByTestId(testIDs.DialogueToggleComponent);
      expect(
        await within(toggle).findByText(translations.privacy.company)
      ).toBeTruthy();
    });

    it("should render button text inside the contact button, inside the FooterComponent", async () => {
      const footer = await screen.findByTestId(testIDs.DialogueFooterComponent);
      expect(
        await within(footer).findByText(translations.privacy.buttons.contact)
      ).toBeTruthy();
    });

    it("should render button text inside the policy button, inside the FooterComponent", async () => {
      const footer = await screen.findByTestId(testIDs.DialogueFooterComponent);
      expect(
        await within(footer).findByText(translations.privacy.buttons.policy)
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
          translations.privacy.buttons.contact
        );
      });

      it("should redirect to the contact page", async () => {
        expect(button.parentElement?.parentElement).toHaveProperty(
          "href",
          externalLinks.svsContact
        );
      });
    });

    describe("clicking on the policy button", () => {
      let button: HTMLButtonElement;

      beforeEach(async () => {
        expect(mockRouter.push).toBeCalledTimes(0);
        const footer = await screen.findByTestId(
          testIDs.DialogueFooterComponent
        );
        button = await within(footer).findByText(
          translations.privacy.buttons.policy
        );
      });

      it("should redirect to the policy page", async () => {
        expect(button.parentElement?.parentElement).toHaveProperty(
          "href",
          externalLinks.privacyPolicy
        );
      });
    });
  });
});
