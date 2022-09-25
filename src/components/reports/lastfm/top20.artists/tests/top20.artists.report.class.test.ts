import Report from "../top20.artists.report.class";
import FlipCardDrawer from "@src/components/reports/lastfm/common/flip.card.report.drawer/flip.card.report.drawer.component";
import routes from "@src/config/routes";
import UserArtistDataState from "@src/providers/user/encapsulations/lastfm/flipcard/user.state.artist.flipcard.report.class";
import type { LastFMArtistDataInterface } from "@src/types/integrations/lastfm/api.types";

describe("Top20ArtistsReport", () => {
  let report: Report;
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
  const mockUserProperties = {
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
    report = new Report();
  });

  it("should have the correct instance values", () => {
    expect(report.analyticsReportType).toBe("TOP20 ARTISTS");
    expect(report.drawerArtWorkAltText).toBe(
      "top20Artists.drawer.artWorkAltText"
    );
    expect(report.drawerComponent).toBe(FlipCardDrawer);
    expect(report.encapsulationClass).toBe(UserArtistDataState);
    expect(report.retryRoute).toBe(routes.search.lastfm.top20artists);
    expect(report.translationKey).toBe("top20Artists");
    expect(report.hookMethod).toBe("top20artists");
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
    let value: LastFMArtistDataInterface[];

    beforeEach(() => {
      value = report.getReportData(mockUserProperties);
    });

    it("should match the expected value", () => {
      expect(value).toBe(mockArtistData);
    });
  });
});
