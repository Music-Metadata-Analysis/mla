import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import translations from "../../../../../../public/locales/en/lastfm.json";
import config from "../../../../../config/lastfm";
import routes from "../../../../../config/routes";
import mockRouter from "../../../../../tests/fixtures/mock.router";
import Select from "../select.report.component";

jest.mock("next/router", () => ({
  __esModule: true,
  useRouter: () => mockRouter,
}));

describe("SearchSelection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    render(<Select />);
  };

  describe("when rendered", () => {
    beforeEach(() => {
      arrange();
    });

    it("should display the indicator for report 1", async () => {
      expect(
        await screen.findByText(translations.select.indicators.topAlbums + ":")
      ).toBeTruthy();
    });

    it("should display the indicator for report 2", async () => {
      expect(
        await screen.findByText(translations.select.indicators.topArtists + ":")
      ).toBeTruthy();
    });

    it("should display the button for report 1", async () => {
      expect(
        await screen.findByText(translations.select.reports.topArtists)
      ).toBeTruthy();
    });

    it("should display the button for report 2", async () => {
      expect(
        await screen.findByText(translations.select.reports.topArtists)
      ).toBeTruthy();
    });

    describe("when the screen is resized below the configured threshold", () => {
      const originalWindowInnerWidth = window.innerWidth;

      beforeAll(() => {
        Object.defineProperty(window, "innerWidth", {
          writable: true,
          configurable: true,
          value: config.select.indicatorWidth - 1,
        });
      });

      beforeEach(() => {
        fireEvent.resize(window.document);
      });

      afterAll(() => {
        Object.defineProperty(window, "innerWidth", {
          value: originalWindowInnerWidth,
        });
      });

      it("should NOT display the indicator for report 1", async () => {
        await waitFor(() =>
          expect(
            screen.queryByText(translations.select.indicators.topAlbums + ":")
          ).toBeNull()
        );
      });

      it("should NOT display the indicator for report 2", async () => {
        await waitFor(() =>
          expect(
            screen.queryByText(translations.select.indicators.topArtists + ":")
          ).toBeNull()
        );
      });
    });

    describe("when report topArtists is clicked", () => {
      beforeEach(async () => {
        const reportButton = await screen.findByText(
          translations.select.reports.topArtists
        );
        fireEvent.click(reportButton);
      });

      it("should route to the expected page", () => {
        expect(mockRouter.push).toBeCalledTimes(1);
        expect(mockRouter.push).toBeCalledWith(
          routes.search.lastfm.top20artists
        );
      });
    });

    describe("when report topAlbums is clicked", () => {
      beforeEach(async () => {
        const reportButton = await screen.findByText(
          translations.select.reports.topAlbums
        );
        fireEvent.click(reportButton);
      });

      it("should route to the expected page", () => {
        expect(mockRouter.push).toBeCalledTimes(1);
        expect(mockRouter.push).toBeCalledWith(
          routes.search.lastfm.top20albums
        );
      });
    });
  });
});
