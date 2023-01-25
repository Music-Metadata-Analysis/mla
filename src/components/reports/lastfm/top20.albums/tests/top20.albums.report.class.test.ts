import Report from "../top20.albums.report.class";
import FlipCardDrawerContainer from "@src/components/reports/lastfm/common/drawer/flip.card/flip.card.report.drawer.container";
import routes from "@src/config/routes";
import UserAlbumDataState from "@src/providers/user/encapsulations/lastfm/flipcard/user.state.album.flipcard.report.class";
import { _t } from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";
import type { LastFMUserAlbumInterface } from "@src/web/api/lastfm/types/lastfm/response.types";

describe("Top20AlbumsReport", () => {
  let report: Report;
  const mockAlbumData = [
    {
      mbid: "some_mbid1",
      name: "mock_artist1",
    },
    {
      mbid: "some_mbid2",
      name: "mock_artist2",
    },
  ];
  const mockReportProperties = {
    error: null,
    inProgress: false,
    profileUrl: null,
    ready: true,
    userName: "mockUserName",
    retries: 3,
    data: {
      report: {
        albums: mockAlbumData,
        image: [],
        playcount: 0,
      },
      integration: "LASTFM" as const,
    },
  };

  beforeEach(() => {
    report = new Report();
  });

  it("should have the correct instance values", () => {
    expect(report.getAnalyticsReportType()).toBe("TOP20 ALBUMS");
    expect(report.getDrawerArtWorkAltTextTranslationKey()).toBe(
      "top20Albums.drawer.artWorkAltText"
    );
    expect(report.getDrawerComponent()).toBe(FlipCardDrawerContainer);
    expect(
      report.getEncapsulatedReportState(mockReportProperties, _t)
    ).toBeInstanceOf(UserAlbumDataState);
    expect(report.getRetryRoute()).toBe(routes.search.lastfm.top20albums);
    expect(report.getReportTranslationKey()).toBe("top20Albums");
    expect(report.getHookMethod()).toBe("top20albums");
  });

  describe("getNumberOfImageLoads", () => {
    let value: number;

    beforeEach(() => {
      value = report.getNumberOfImageLoads(mockReportProperties);
    });

    it("should match the expected value", () => {
      expect(value).toBe(4);
    });
  });

  describe("getReportData", () => {
    let value: LastFMUserAlbumInterface[];

    beforeEach(() => {
      value = report.getReportData(mockReportProperties);
    });

    it("should match the expected value", () => {
      expect(value).toBe(mockAlbumData);
    });
  });
});
