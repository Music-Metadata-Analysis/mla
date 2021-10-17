import {
  fireEvent,
  render,
  screen,
  within,
  waitFor,
} from "@testing-library/react";
import { RouterContext } from "next/dist/shared/lib/router-context";
import translations from "../../../../public/locales/en/splash.json";
import routes from "../../../config/routes";
import splashSettings from "../../../config/splash";
import mockRouter from "../../../tests/fixtures/mock.router";
import Splash, { testIDs } from "../splash.component";

describe("Splash", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(
      <RouterContext.Provider value={mockRouter}>
        <Splash />
      </RouterContext.Provider>
    );
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should render the correct text inside the visible UnorderedList", async () => {
      const splashList = await screen.findByTestId(testIDs.SplashList);
      expect(splashList).toBeVisible();
      expect(
        await within(splashList).findByText(translations.splashText1)
      ).toBeTruthy();
      expect(
        await within(splashList).findByText(translations.splashText2)
      ).toBeTruthy();
      expect(
        await within(splashList).findByText(translations.splashText3)
      ).toBeTruthy();
    });

    it("should render the credit text on the screen", async () => {
      expect(await screen.findByText(translations.creditText)).toBeTruthy();
    });

    it("should render LAST.FM on the screen", async () => {
      expect(await screen.findByText("LAST.FM")).toBeTruthy();
    });

    it("should render button text inside the button", async () => {
      const button = await screen.findByTestId(testIDs.SplashStartButton);
      expect(await within(button).findByText(translations.button)).toBeTruthy();
    });

    describe("clicking on the button", () => {
      beforeEach(async () => {
        expect(mockRouter.push).toBeCalledTimes(0);
        const button = await screen.findByTestId(testIDs.SplashStartButton);
        fireEvent.click(button);
      });

      it("should redirect to the search page", async () => {
        await waitFor(() => expect(mockRouter.push).toBeCalledTimes(1));
        expect(mockRouter.push).toBeCalledWith(routes.search.lastfm.selection);
      });
    });

    describe("when the screen is resized vertically", () => {
      const originalWindowInnerHeight = window.innerHeight;

      beforeAll(() => {
        Object.defineProperty(window, "innerHeight", {
          writable: true,
          configurable: true,
          value: splashSettings.listMinimumHeight - 1,
        });
      });

      beforeEach(async () => {
        fireEvent.resize(window.document);
      });

      afterAll(() => {
        Object.defineProperty(window, "innerHeight", {
          value: originalWindowInnerHeight,
        });
      });

      it("should hide the UnorderedList", async () => {
        const splashList = await screen.findByTestId(testIDs.SplashList);
        expect(splashList).not.toBeVisible();
      });
    });
  });
});
