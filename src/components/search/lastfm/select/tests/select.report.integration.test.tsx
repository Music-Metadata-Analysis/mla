import { fireEvent, render, screen } from "@testing-library/react";
import translations from "../../../../../../public/locales/en/lastfm.json";
import config from "../../../../../config/lastfm";
import mockRouter from "../../../../../tests/fixtures/mock.router";
import Select from "../select.report.component";

jest.mock("next/router", () => ({
  __esModule: true,
  useRouter: () => mockRouter,
}));

type translationKeyType = keyof typeof translations["select"][
  | "indicators"
  | "reports"];

describe("SearchSelection", () => {
  const translationKeys = ["topAlbums", "topArtists", "topTracks"];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    render(<Select />);
  };

  describe("when rendered on a screen above the configured threshold", () => {
    beforeEach(() => {
      arrange();
    });

    (translationKeys as translationKeyType[]).map((key, index) => {
      describe(translations.select.reports[key], () => {
        it("should display the indicator text", async () => {
          expect(
            await screen.findByText(translations.select.indicators[key] + ":")
          ).toBeTruthy();
        });

        it("should display the button text for report", async () => {
          expect(
            await screen.findByText(translations.select.reports[key])
          ).toBeTruthy();
        });

        describe("when the button is clicked", () => {
          beforeEach(async () => {
            const reportButton = await screen.findByText(
              translations.select.reports[key]
            );
            fireEvent.click(reportButton);
          });

          it("should route to the expected page", () => {
            expect(mockRouter.push).toBeCalledTimes(1);
            expect(mockRouter.push).toBeCalledWith(
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
              translations.select.indicators[key as translationKeyType] + ":"
            )
          ).toBeNull();
        });

        it("should display the button text for report", async () => {
          expect(
            await screen.findByText(translations.select.reports[key])
          ).toBeTruthy();
        });

        describe("when the button is clicked", () => {
          beforeEach(async () => {
            const reportButton = await screen.findByText(
              translations.select.reports[key]
            );
            fireEvent.click(reportButton);
          });

          it("should route to the expected page", () => {
            expect(mockRouter.push).toBeCalledTimes(1);
            expect(mockRouter.push).toBeCalledWith(
              config.select.options[index].route
            );
          });
        });
      });
    });
  });
});
