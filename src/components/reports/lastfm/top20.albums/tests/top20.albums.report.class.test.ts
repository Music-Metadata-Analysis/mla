import routes from "../../../../../config/routes";
import UserAlbumDataState from "../../../../../providers/user/encapsulations/lastfm/user.state.album.class";
import FlipCardDrawer from "../../common/flip.card.report.drawer/flip.card.report.drawer.component";
import Report from "../top20.albums.report.class";
import type { LastFMAlbumDataInterface } from "../../../../../types/integrations/lastfm/api.types";

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
  const mockUserProperties = {
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
    expect(report.analyticsReportType).toBe("TOP20 ALBUMS");
    expect(report.drawerArtWorkAltText).toBe(
      "top20Albums.drawer.artWorkAltText"
    );
    expect(report.drawerComponent).toBe(FlipCardDrawer);
    expect(report.encapsulationClass).toBe(UserAlbumDataState);
    expect(report.retryRoute).toBe(routes.search.lastfm.top20albums);
    expect(report.translationKey).toBe("top20Albums");
    expect(report.hookMethod).toBe("top20albums");
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
    let value: LastFMAlbumDataInterface[];

    beforeEach(() => {
      value = report.getReportData(mockUserProperties);
    });

    it("should match the expected value", () => {
      expect(value).toBe(mockAlbumData);
    });
  });
});
