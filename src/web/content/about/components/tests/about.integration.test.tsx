import {
  fireEvent,
  render,
  screen,
  within,
  waitFor,
} from "@testing-library/react";
import AboutContainer from "../about.container";
import translations from "@locales/about.json";
import routes from "@src/config/routes";
import { _t } from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";
import mockRouterHook from "@src/web/navigation/routing/hooks/__mocks__/router.hook.mock";
import { testIDs } from "@src/web/ui/generics/components/dialogues/resizable/dialogue.resizable.identifiers";

jest.mock("@src/web/locale/translation/hooks/translation.hook");

jest.mock("@src/web/navigation/routing/hooks/router.hook");

describe("About", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(<AboutContainer />);
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should render the correct text inside the visible UnorderedList", async () => {
      const aboutList = await screen.findByTestId(
        testIDs.DialogueToggleComponent
      );
      expect(aboutList).toBeVisible();
      expect(
        await within(aboutList).findByText(_t(translations.aboutText1))
      ).toBeTruthy();
      expect(
        await within(aboutList).findByText(_t(translations.aboutText2))
      ).toBeTruthy();
      expect(
        await within(aboutList).findByText(_t(translations.aboutText3))
      ).toBeTruthy();
    });

    it("should render the credit text on the screen", async () => {
      expect(await screen.findByText(_t(translations.creditText))).toBeTruthy();
    });

    it("should render the company name on the screen", async () => {
      expect(await screen.findByText(_t(translations.company))).toBeTruthy();
    });

    it("should render button text inside the start button", async () => {
      const footer = await screen.findByTestId(testIDs.DialogueFooterComponent);
      expect(
        await within(footer).findByText(_t(translations.buttons.start))
      ).toBeTruthy();
    });

    it("should render button text inside the privacy button", async () => {
      const footer = await screen.findByTestId(testIDs.DialogueFooterComponent);
      expect(
        await within(footer).findByText(_t(translations.buttons.privacy))
      ).toBeTruthy();
    });

    describe("clicking on the start button", () => {
      beforeEach(async () => {
        expect(mockRouterHook.push).toHaveBeenCalledTimes(0);
        const footer = await screen.findByTestId(
          testIDs.DialogueFooterComponent
        );
        const button = await within(footer).findByText(
          _t(translations.buttons.start)
        );
        fireEvent.click(button);
      });

      it("should redirect to the search page", async () => {
        await waitFor(() =>
          expect(mockRouterHook.push).toHaveBeenCalledTimes(1)
        );
        expect(mockRouterHook.push).toHaveBeenCalledWith(
          routes.search.lastfm.selection
        );
      });
    });

    describe("clicking on the privacy button", () => {
      beforeEach(async () => {
        expect(mockRouterHook.push).toHaveBeenCalledTimes(0);
        const footer = await screen.findByTestId(
          testIDs.DialogueFooterComponent
        );
        const button = await within(footer).findByText(
          _t(translations.buttons.privacy)
        );
        fireEvent.click(button);
      });

      it("should redirect to the privacy page", async () => {
        await waitFor(() =>
          expect(mockRouterHook.push).toHaveBeenCalledTimes(1)
        );
        expect(mockRouterHook.push).toHaveBeenCalledWith(routes.legal.privacy);
      });
    });
  });
});
