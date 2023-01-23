import { fireEvent, render, screen } from "@testing-library/react";
import SelectContainer from "../select.report.container";
import translations from "@locales/lastfm.json";
import config from "@src/config/lastfm";
import mockUseFlags from "@src/hooks/__mocks__/flags.hook.mock";
import { _t } from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";
import mockRouterHook from "@src/web/navigation/routing/hooks/__mocks__/router.hook.mock";

jest.mock("@src/hooks/flags.hook");

jest.mock("@src/web/locale/translation/hooks/translation.hook");

jest.mock("@src/web/navigation/routing/hooks/router.hook");

jest.mock(
  "@src/components/scrollbars/vertical/vertical.scrollbar.container",
  () =>
    require("@fixtures/react/child").createComponent(
      "VerticalScrollBarContainer"
    )
);

type translationKeyType = keyof typeof translations["select"][
  | "indicators"
  | "reports"];

describe("SearchSelection", () => {
  const translationKeys = ["topAlbums", "topArtists", "topTracks"];

  beforeEach(() => {
    jest.clearAllMocks();
    enableAllFlags();
  });

  const enableAllFlags = () => mockUseFlags.isEnabled.mockReturnValue(true);

  const arrange = () => {
    render(<SelectContainer />);
  };

  describe("when rendered on a screen above the configured threshold", () => {
    beforeEach(() => {
      arrange();
    });

    (translationKeys as translationKeyType[]).map((key, index) => {
      describe(translations.select.reports[key], () => {
        it("should display the indicator text", async () => {
          expect(
            await screen.findAllByText(
              _t(translations.select.indicators[key]) + ":"
            )
          ).toBeTruthy();
        });

        it("should display the button text for report", async () => {
          expect(
            await screen.findByText(_t(translations.select.reports[key]))
          ).toBeTruthy();
        });

        describe("when the button is clicked", () => {
          beforeEach(async () => {
            const reportButton = await screen.findByText(
              _t(translations.select.reports[key])
            );
            fireEvent.click(reportButton);
          });

          it("should route to the expected page", () => {
            expect(mockRouterHook.push).toBeCalledTimes(1);
            expect(mockRouterHook.push).toBeCalledWith(
              config.select.options[index].route
            );
          });
        });
      });
    });
  });

  describe("when rendered on a screen below the configured threshold", () => {
    const originalWindowInnerWidth = window.innerWidth;

    beforeAll(() => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: config.select.indicatorWidth - 1,
      });
    });

    beforeEach(() => {
      arrange();
      fireEvent.resize(window.document);
    });

    afterAll(() => {
      Object.defineProperty(window, "innerWidth", {
        value: originalWindowInnerWidth,
      });
    });

    (translationKeys as translationKeyType[]).map((key, index) => {
      describe(translations.select.reports[key], () => {
        it("should NOT display the indicator text", async () => {
          expect(
            screen.queryByText(
              _t(translations.select.indicators[key as translationKeyType]) +
                ":"
            )
          ).toBeNull();
        });

        it("should display the button text for report", async () => {
          expect(
            await screen.findByText(_t(translations.select.reports[key]))
          ).toBeTruthy();
        });

        describe("when the button is clicked", () => {
          beforeEach(async () => {
            const reportButton = await screen.findByText(
              _t(translations.select.reports[key])
            );
            fireEvent.click(reportButton);
          });

          it("should route to the expected page", () => {
            expect(mockRouterHook.push).toBeCalledTimes(1);
            expect(mockRouterHook.push).toBeCalledWith(
              config.select.options[index].route
            );
          });
        });
      });
    });
  });
});
