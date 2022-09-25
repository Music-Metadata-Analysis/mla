import Report from "../top20.tracks.report.class";
import FlipCardDrawer from "@src/components/reports/lastfm/common/flip.card.report.drawer/flip.card.report.drawer.component";
import routes from "@src/config/routes";
import UserTrackDataState from "@src/providers/user/encapsulations/lastfm/flipcard/user.state.track.flipcard.report.class";
import type { LastFMTrackDataInterface } from "@src/types/integrations/lastfm/api.types";

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
  const mockUserProperties = {
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
    expect(report.analyticsReportType).toBe("TOP20 TRACKS");
    expect(report.drawerArtWorkAltText).toBe(
      "top20Tracks.drawer.artWorkAltText"
    );
    expect(report.drawerComponent).toBe(FlipCardDrawer);
    expect(report.encapsulationClass).toBe(UserTrackDataState);
    expect(report.retryRoute).toBe(routes.search.lastfm.top20tracks);
    expect(report.translationKey).toBe("top20Tracks");
    expect(report.hookMethod).toBe("top20tracks");
  });

  describe("getNumberOfImageLoads", () => {
    let value: number;

    beforeEach(() => {
      value = report.getNumberOfImageLoads(mockUserProperties);
    });

    it("should match the expected value", () => {
      expect(value).toBe(4);
    });
  });

  describe("getReportData", () => {
    let value: LastFMTrackDataInterface[];

    beforeEach(() => {
      value = report.getReportData(mockUserProperties);
    });

    it("should match the expected value", () => {
      expect(value).toBe(mockTrackData);
    });
  });
});
