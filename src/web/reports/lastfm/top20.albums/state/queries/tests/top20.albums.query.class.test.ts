import Query from "../top20.albums.query.class";
import routes from "@src/config/routes";
import { _t } from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";
import FlipCardDrawerContainer from "@src/web/reports/lastfm/generics/components/drawer/flip.card/flip.card.report.drawer.container";
import LastFMReportFlipCardTopAlbumsStateEncapsulation from "@src/web/reports/lastfm/top20.albums/state/encapsulations/lastfm.report.encapsulation.top.albums.flipcard.class";
import type { LastFMUserAlbumInterface } from "@src/web/api/lastfm/types/lastfm.api.response.types";

describe(Query.name, () => {
  let query: Query;
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
    query = new Query();
  });

  it("should have the correct instance values", () => {
    expect(query.getAnalyticsReportType()).toBe("TOP20 ALBUMS");
    expect(query.getDrawerArtWorkAltTextTranslationKey()).toBe(
      "top20Albums.drawer.artWorkAltText"
    );
    expect(query.getDrawerComponent()).toBe(FlipCardDrawerContainer);
    expect(
      query.getEncapsulatedReportState(mockReportProperties, _t)
    ).toBeInstanceOf(LastFMReportFlipCardTopAlbumsStateEncapsulation);
    expect(query.getRetryRoute()).toBe(routes.search.lastfm.top20albums);
    expect(query.getReportTranslationKey()).toBe("top20Albums");
    expect(query.getHookMethod()).toBe("top20albums");
  });

  describe("getNumberOfImageLoads", () => {
    let value: number;

    beforeEach(() => {
      value = query.getNumberOfImageLoads(mockReportProperties);
    });

    it("should match the expected value", () => {
      expect(value).toBe(4);
    });
  });

  describe("getReportData", () => {
    let value: LastFMUserAlbumInterface[];

    beforeEach(() => {
      value = query.getReportData(mockReportProperties);
    });

    it("should match the expected value", () => {
      expect(value).toBe(mockAlbumData);
    });
  });
});
