import Query from "../top20.tracks.query.class";
import routes from "@src/config/routes";
import { _t } from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";
import FlipCardDrawerContainer from "@src/web/reports/lastfm/generics/components/report.drawer/flip.card/flip.card.report.drawer.container";
import LastFMReportFlipCardTopTracksStateEncapsulation from "@src/web/reports/lastfm/top20.tracks/state/encapsulations/lastfm.report.encapsulation.top.tracks.flipcard.class";
import type { LastFMUserTrackInterface } from "@src/contracts/api/types/services/lastfm/responses/reports/top/top.tracks.types";

describe(Query.name, () => {
  let query: Query;
  const mockTrackData = [
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
        tracks: mockTrackData,
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
    expect(query.getAnalyticsReportType()).toBe("TOP20 TRACKS");
    expect(query.getDrawerArtWorkAltTextTranslationKey()).toBe(
      "top20Tracks.drawer.artWorkAltText"
    );
    expect(query.getDrawerComponent()).toBe(FlipCardDrawerContainer);
    expect(
      query.getEncapsulatedReportState(mockReportProperties, _t)
    ).toBeInstanceOf(LastFMReportFlipCardTopTracksStateEncapsulation);
    expect(query.getRetryRoute()).toBe(routes.search.lastfm.top20tracks);
    expect(query.getReportTranslationKey()).toBe("top20Tracks");
    expect(query.getHookMethod()).toBe("top20tracks");
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
    let value: LastFMUserTrackInterface[];

    beforeEach(() => {
      value = query.getReportData(mockReportProperties);
    });

    it("should match the expected value", () => {
      expect(value).toBe(mockTrackData);
    });
  });
});
