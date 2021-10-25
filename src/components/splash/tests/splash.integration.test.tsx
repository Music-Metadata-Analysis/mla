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
import mockRouter from "../../../tests/fixtures/mock.router";
import { testIDs } from "../../dialogues/resizable/dialogue.resizable.component";
import Splash from "../splash.component";

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

    it("should render the correct text inside the DialogueToggleComponent", async () => {
      const toggle = await screen.findByTestId(testIDs.DialogueToggleComponent);
      expect(toggle).toBeVisible();
      expect(
        await within(toggle).findByText(translations.splashText1)
      ).toBeTruthy();
      expect(
        await within(toggle).findByText(translations.splashText2)
      ).toBeTruthy();
      expect(
        await within(toggle).findByText(translations.splashText3)
      ).toBeTruthy();
    });

    it("should render the credit text on the screen, inside the DialogueBodyComponent", async () => {
      const body = await screen.findByTestId(testIDs.DialogueBodyComponent);
      expect(
        await within(body).findByText(translations.creditText)
      ).toBeTruthy();
    });

    it("should render LAST.FM on the screen, inside the DialogueBodyComponent", async () => {
      const body = await screen.findByTestId(testIDs.DialogueBodyComponent);
      expect(await within(body).findByText("LAST.FM")).toBeTruthy();
    });

    it("should render button text inside the button,inside the DialogueFooterComponent ", async () => {
      const footer = await screen.findByTestId(testIDs.DialogueFooterComponent);
      expect(
        await within(footer).findByText(translations.buttons.start)
      ).toBeTruthy();
    });

    describe("clicking on the start button", () => {
      beforeEach(async () => {
        expect(mockRouter.push).toBeCalledTimes(0);
        const footer = await screen.findByTestId(
          testIDs.DialogueFooterComponent
        );
        const button = await within(footer).findByText(
          translations.buttons.start
        );
        fireEvent.click(button);
      });

      it("should redirect to the search page", async () => {
        await waitFor(() => expect(mockRouter.push).toBeCalledTimes(1));
        expect(mockRouter.push).toBeCalledWith(routes.search.lastfm.selection);
      });
    });
  });
});
