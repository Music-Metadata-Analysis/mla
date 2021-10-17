import {
  fireEvent,
  render,
  screen,
  within,
  waitFor,
} from "@testing-library/react";
import { RouterContext } from "next/dist/shared/lib/router-context";
import translations from "../../../../public/locales/en/about.json";
import aboutSettings from "../../../config/about";
import routes from "../../../config/routes";
import mockRouter from "../../../tests/fixtures/mock.router";
import About, { testIDs } from "../about.component";

describe("About", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(
      <RouterContext.Provider value={mockRouter}>
        <About />
      </RouterContext.Provider>
    );
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should render the correct text inside the visible UnorderedList", async () => {
      const aboutList = await screen.findByTestId(testIDs.AboutList);
      expect(aboutList).toBeVisible();
      expect(
        await within(aboutList).findByText(translations.aboutText1)
      ).toBeTruthy();
      expect(
        await within(aboutList).findByText(translations.aboutText2)
      ).toBeTruthy();
      expect(
        await within(aboutList).findByText(translations.aboutText3)
      ).toBeTruthy();
    });

    it("should render the credit text on the screen", async () => {
      expect(await screen.findByText(translations.creditText)).toBeTruthy();
    });

    it("should render the company name on the screen", async () => {
      expect(await screen.findByText(translations.company)).toBeTruthy();
    });

    it("should render button text inside the button", async () => {
      const button = await screen.findByTestId(testIDs.AboutStartButton);
      expect(await within(button).findByText(translations.button)).toBeTruthy();
    });

    describe("clicking on the button", () => {
      beforeEach(async () => {
        expect(mockRouter.push).toBeCalledTimes(0);
        const button = await screen.findByTestId(testIDs.AboutStartButton);
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
          value: aboutSettings.listMinimumHeight - 1,
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
        const splashList = await screen.findByTestId(testIDs.AboutList);
        expect(splashList).not.toBeVisible();
      });
    });
  });
});
