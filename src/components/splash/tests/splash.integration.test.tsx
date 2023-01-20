import {
  fireEvent,
  render,
  screen,
  within,
  waitFor,
} from "@testing-library/react";
import SplashContainer from "../splash.container";
import translations from "@locales/splash.json";
import { testIDs } from "@src/components/dialogues/resizable/dialogue.resizable.identifiers";
import routes from "@src/config/routes";
import { _t } from "@src/hooks/__mocks__/locale.hook.mock";
import mockRouterHook from "@src/web/navigation/routing/hooks/__mocks__/router.hook.mock";

jest.mock("@src/hooks/locale.hook");

jest.mock("@src/web/navigation/routing/hooks/router.hook");

describe("Splash", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(<SplashContainer />);
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should render the correct text inside the DialogueToggleComponent", async () => {
      const toggle = await screen.findByTestId(testIDs.DialogueToggleComponent);
      expect(toggle).toBeVisible();
      expect(
        await within(toggle).findByText(_t(translations.splashText1))
      ).toBeTruthy();
      expect(
        await within(toggle).findByText(_t(translations.splashText2))
      ).toBeTruthy();
      expect(
        await within(toggle).findByText(_t(translations.splashText3))
      ).toBeTruthy();
    });

    it("should render the credit text on the screen, inside the DialogueBodyComponent", async () => {
      const body = await screen.findByTestId(testIDs.DialogueBodyComponent);
      expect(
        await within(body).findByText(_t(translations.creditText))
      ).toBeTruthy();
    });

    it("should render LAST.FM on the screen, inside the DialogueBodyComponent", async () => {
      const body = await screen.findByTestId(testIDs.DialogueBodyComponent);
      expect(await within(body).findByText("LAST.FM")).toBeTruthy();
    });

    it("should render button text inside the button,inside the DialogueFooterComponent ", async () => {
      const footer = await screen.findByTestId(testIDs.DialogueFooterComponent);
      expect(
        await within(footer).findByText(_t(translations.buttons.start))
      ).toBeTruthy();
    });

    describe("clicking on the start button", () => {
      beforeEach(async () => {
        expect(mockRouterHook.push).toBeCalledTimes(0);
        const footer = await screen.findByTestId(
          testIDs.DialogueFooterComponent
        );
        const button = await within(footer).findByText(
          _t(translations.buttons.start)
        );
        fireEvent.click(button);
      });

      it("should redirect to the search page", async () => {
        await waitFor(() => expect(mockRouterHook.push).toBeCalledTimes(1));
        expect(mockRouterHook.push).toBeCalledWith(
          routes.search.lastfm.selection
        );
      });
    });
  });
});
