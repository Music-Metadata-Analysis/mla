import Query from "../top20.artists.query.class";
import routes from "@src/config/routes";
import { _t } from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";
import FlipCardDrawerContainer from "@src/web/reports/lastfm/generics/components/report.drawer/flip.card/flip.card.report.drawer.container";
import LastFMReportFlipCardTopArtistsStateEncapsulation from "@src/web/reports/lastfm/top20.artists/state/encapsulations/lastfm.report.encapsulation.top.artists.flipcard.class";
import type { LastFMUserArtistInterface } from "@src/web/api/lastfm/types/lastfm.api.response.types";

describe(Query.name, () => {
  let query: Query;
  const mockArtistData = [
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
        artists: mockArtistData,
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
    expect(query.getAnalyticsReportType()).toBe("TOP20 ARTISTS");
    expect(query.getDrawerArtWorkAltTextTranslationKey()).toBe(
      "top20Artists.drawer.artWorkAltText"
    );
    expect(query.getDrawerComponent()).toBe(FlipCardDrawerContainer);
    expect(
      query.getEncapsulatedReportState(mockReportProperties, _t)
    ).toBeInstanceOf(LastFMReportFlipCardTopArtistsStateEncapsulation);
    expect(query.getRetryRoute()).toBe(routes.search.lastfm.top20artists);
    expect(query.getReportTranslationKey()).toBe("top20Artists");
    expect(query.getHookMethod()).toBe("top20artists");
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
    let value: LastFMUserArtistInterface[];

    beforeEach(() => {
      value = query.getReportData(mockReportProperties);
    });

    it("should match the expected value", () => {
      expect(value).toBe(mockArtistData);
    });
  });
});
