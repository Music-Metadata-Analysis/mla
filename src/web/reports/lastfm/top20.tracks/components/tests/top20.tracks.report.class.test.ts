import Report from "../top20.tracks.report.class";
import routes from "@src/config/routes";
import UserTrackDataState from "@src/providers/user/encapsulations/lastfm/flipcard/user.state.track.flipcard.report.class";
import { _t } from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";
import FlipCardDrawerContainer from "@src/web/reports/lastfm/generics/components/drawer/flip.card/flip.card.report.drawer.container";
import type { LastFMUserTrackInterface } from "@src/web/api/lastfm/types/response.types";

describe("Top20TracksReport", () => {
  let report: Report;
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
    report = new Report();
  });

  it("should have the correct instance values", () => {
    expect(report.getAnalyticsReportType()).toBe("TOP20 TRACKS");
    expect(report.getDrawerArtWorkAltTextTranslationKey()).toBe(
      "top20Tracks.drawer.artWorkAltText"
    );
    expect(report.getDrawerComponent()).toBe(FlipCardDrawerContainer);
    expect(
      report.getEncapsulatedReportState(mockReportProperties, _t)
    ).toBeInstanceOf(UserTrackDataState);
    expect(report.getRetryRoute()).toBe(routes.search.lastfm.top20tracks);
    expect(report.getReportTranslationKey()).toBe("top20Tracks");
    expect(report.getHookMethod()).toBe("top20tracks");
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
    let value: LastFMUserTrackInterface[];

    beforeEach(() => {
      value = report.getReportData(mockReportProperties);
    });

    it("should match the expected value", () => {
      expect(value).toBe(mockTrackData);
    });
  });
});
