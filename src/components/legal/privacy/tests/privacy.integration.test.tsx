import { render, screen, within } from "@testing-library/react";
import Privacy from "../privacy.component";
import translations from "@locales/legal.json";
import { testIDs } from "@src/components/dialogues/resizable/dialogue.resizable.component";
import externalLinks from "@src/config/external";
import { _t } from "@src/hooks/__mocks__/locale.mock";
import mockRouterHook from "@src/hooks/__mocks__/router.mock";

jest.mock("@src/hooks/locale");

jest.mock("@src/hooks/router");

describe("Privacy", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(<Privacy />);
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should render the correct text inside the HeaderComponent", async () => {
      const header = await screen.findByTestId(testIDs.DialogueHeaderComponent);
      expect(header?.firstChild?.firstChild?.textContent).toBe(
        _t(translations.privacy.text1)
      );
    });

    it("should render the company name on the screen, inside the ToggleComponent", async () => {
      const toggle = await screen.findByTestId(testIDs.DialogueToggleComponent);
      expect(
        await within(toggle).findByText(_t(translations.privacy.company))
      ).toBeTruthy();
    });

    it("should render button text inside the contact button, inside the FooterComponent", async () => {
      const footer = await screen.findByTestId(testIDs.DialogueFooterComponent);
      expect(
        await within(footer).findByText(
          _t(translations.privacy.buttons.contact)
        )
      ).toBeTruthy();
    });

    it("should render button text inside the policy button, inside the FooterComponent", async () => {
      const footer = await screen.findByTestId(testIDs.DialogueFooterComponent);
      expect(
        await within(footer).findByText(_t(translations.privacy.buttons.policy))
      ).toBeTruthy();
    });

    describe("clicking on the contact button", () => {
      let button: HTMLButtonElement;

      beforeEach(async () => {
        expect(mockRouterHook.push).toBeCalledTimes(0);
        const footer = await screen.findByTestId(
          testIDs.DialogueFooterComponent
        );
        button = await within(footer).findByText(
          _t(translations.privacy.buttons.contact)
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
        expect(mockRouterHook.push).toBeCalledTimes(0);
        const footer = await screen.findByTestId(
          testIDs.DialogueFooterComponent
        );
        button = await within(footer).findByText(
          _t(translations.privacy.buttons.policy)
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
