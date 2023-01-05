import Report from "../top20.artists.report.class";
import FlipCardDrawerContainer from "@src/components/reports/lastfm/common/drawer/flip.card/flip.card.report.drawer.container";
import routes from "@src/config/routes";
import { _t } from "@src/hooks/__mocks__/locale.hook.mock";
import UserArtistDataState from "@src/providers/user/encapsulations/lastfm/flipcard/user.state.artist.flipcard.report.class";
import type { LastFMUserArtistInterface } from "@src/types/clients/api/lastfm/response.types";

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
    report = new Report();
  });

  it("should have the correct instance values", () => {
    expect(report.getAnalyticsReportType()).toBe("TOP20 ARTISTS");
    expect(report.getDrawerArtWorkAltTextTranslationKey()).toBe(
      "top20Artists.drawer.artWorkAltText"
    );
    expect(report.getDrawerComponent()).toBe(FlipCardDrawerContainer);
    expect(
      report.getEncapsulatedReportState(mockReportProperties, _t)
    ).toBeInstanceOf(UserArtistDataState);
    expect(report.getRetryRoute()).toBe(routes.search.lastfm.top20artists);
    expect(report.getReportTranslationKey()).toBe("top20Artists");
    expect(report.getHookMethod()).toBe("top20artists");
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
    let value: LastFMUserArtistInterface[];

    beforeEach(() => {
      value = report.getReportData(mockReportProperties);
    });

    it("should match the expected value", () => {
      expect(value).toBe(mockArtistData);
    });
  });
});
