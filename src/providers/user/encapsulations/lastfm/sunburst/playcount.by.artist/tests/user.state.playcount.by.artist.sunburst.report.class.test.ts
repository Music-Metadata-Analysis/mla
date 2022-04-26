import MockStage2Report from "./fixtures/user.state.playcount.by.artist.sunburst.stage.2.json";
import MockStage3Report from "./fixtures/user.state.playcount.by.artist.sunburst.stage.3.json";
import MockStage4Report from "./fixtures/user.state.playcount.by.artist.sunburst.stage.4.json";
import apiRoutes from "../../../../../../../config/apiRoutes";
import MockAlbumGetInfo from "../../../../../../../tests/fixtures/lastfm/api/album.getInfo.json";
import MockArtistGetTopAlbums from "../../../../../../../tests/fixtures/lastfm/api/artist.getTopAlbums.json";
import MockTrackGetInfo from "../../../../../../../tests/fixtures/lastfm/api/track.getInfo.json";
import MockUserGetTopArtists from "../../../../../../../tests/fixtures/lastfm/api/user.getTopArtists.json";
import { InitialState } from "../../../../../user.initial";
import UserPlaycountByArtistState from "../user.state.playcount.by.artist.sunburst.report.class";
import type { LastFMImageDataInterface } from "../../../../../../../types/integrations/lastfm/api.types";
import type { LastFMUserStatePlayCountByArtistReport } from "../../../../../../../types/user/state.types";

describe("UserPlaycountByArtistState", () => {
  let instance: UserPlaycountByArtistState;
  let mockUserProperties: LastFMUserStatePlayCountByArtistReport;
  const mockTopArtists = MockUserGetTopArtists.artists.map((artist) => ({
    name: artist.name,
    playcount: parseInt(artist.playcount),
    albums: [],
  }));
  const mockTopAlbums = MockArtistGetTopAlbums.topalbums.album.map((album) => ({
    name: album.name,
    playcount: null,
    tracks: [],
  }));
  const mockAlbumInfo = {
    name: MockAlbumGetInfo.album.name,
    playcount: MockAlbumGetInfo.album.userplaycount,
    tracks: MockAlbumGetInfo.album.tracks.track.map((track) => ({
      name: track.name,
      playcount: null,
    })),
  };
  const mockTrackInfo = {
    name: MockTrackGetInfo.track.name,
    playcount: parseInt(MockTrackGetInfo.track.userplaycount),
  };

  describe("when initialized", () => {
    beforeEach(() => {
      mockUserProperties = JSON.parse(JSON.stringify(InitialState));
      instance = new UserPlaycountByArtistState(mockUserProperties);
    });

    describe("getReport", () => {
      it("should return the expected value", () => {
        expect(instance.getReport()).toBe(
          instance.userProperties.data.report.playCountByArtist
        );
      });
    });

    describe("with an unknown url response", () => {
      it("should throw an error", () => {
        const test = () =>
          instance.updateWithResponse(
            MockUserGetTopArtists,
            { userName: "niall-byrne" },
            "unknown-url"
          );
        expect(test).toThrow(instance.errorMessage);
      });
    });
  });

  describe("when the report is non-existent", () => {
    beforeEach(() => {
      mockUserProperties = JSON.parse(JSON.stringify(InitialState));
      instance = new UserPlaycountByArtistState(mockUserProperties);
    });

    describe("getReport", () => {
      it("should return the expected value", () => {
        expect(instance.getReport()).toBe(
          instance.userProperties.data.report.playCountByArtist
        );
      });
    });

    describe("updateWithResponse", () => {
      describe("with an empty response and an DEFAULT url", () => {
        beforeEach(() =>
          instance.updateWithResponse(
            MockUserGetTopArtists,
            { userName: "niall-byrne" },
            "DEFAULT"
          )
        );

        it("should modify the results as expected", () => {
          const expected: LastFMUserStatePlayCountByArtistReport = JSON.parse(
            JSON.stringify(InitialState)
          );
          expected.data.integration = "LASTFM";
          expected.data.report.playCountByArtist.status = {
            complete: false,
            steps_total: 2,
            steps_complete: 0,
            operation: {
              type: "User Profile" as const,
              resource: "niall-byrne",
              url: apiRoutes.v2.reports.lastfm.top20artists,
              params: { userName: "niall-byrne" },
            },
          };
          expect(instance.userProperties).toStrictEqual(expected);
        });
      });

      describe("with a user's top artists response", () => {
        beforeEach(() =>
          instance.updateWithResponse(
            MockUserGetTopArtists,
            { userName: "niall-byrne" },
            apiRoutes.v2.reports.lastfm.top20artists
          )
        );

        it("should attach the results as expected", () => {
          const expected: LastFMUserStatePlayCountByArtistReport = JSON.parse(
            JSON.stringify(InitialState)
          );
          expected.data.integration = "LASTFM";
          expected.data.report.playcount = MockUserGetTopArtists.playcount;
          expected.data.report.image =
            MockUserGetTopArtists.image as LastFMImageDataInterface[];
          expected.data.report.playCountByArtist.content = mockTopArtists;
          expected.data.report.playCountByArtist.status = {
            complete: false,
            steps_total: 2 + mockTopArtists.length,
            steps_complete: 1,
            operation: {
              type: "Top Albums" as const,
              resource: mockTopArtists[0].name,
              url: apiRoutes.v2.data.artists.albumsList,
              params: { userName: "niall-byrne", artist: "Lights & Motion" },
            },
          };
          expect(instance.userProperties).toStrictEqual(expected);
        });
      });
    });
  });

  describe("when the report has top artist information", () => {
    beforeEach(() => {
      mockUserProperties = JSON.parse(JSON.stringify(MockStage2Report));
      instance = new UserPlaycountByArtistState(mockUserProperties);
    });

    describe("getReport", () => {
      it("should return the expected value", () => {
        expect(instance.getReport()).toBe(
          instance.userProperties.data.report.playCountByArtist
        );
      });
    });

    describe("updateWithResponse", () => {
      describe("with an artists's top album information", () => {
        beforeEach(() =>
          instance.updateWithResponse(
            MockArtistGetTopAlbums.topalbums.album,
            { artist: "The Cure", userName: "niall-byrne" },
            apiRoutes.v2.data.artists.albumsList
          )
        );

        it("should attach the results as expected", () => {
          const expected: LastFMUserStatePlayCountByArtistReport = JSON.parse(
            JSON.stringify(MockStage2Report)
          );
          expected.data.report.playCountByArtist.content[12].albums =
            mockTopAlbums;
          expected.data.report.playCountByArtist.status = {
            complete: false,
            steps_total:
              expected.data.report.playCountByArtist.status.steps_total +
              mockTopAlbums.length,
            steps_complete: 2,
            operation: {
              type: "Album Details" as const,
              resource: mockTopAlbums[0].name,
              url: apiRoutes.v2.data.artists.albumsGet,
              params: {
                userName: "niall-byrne",
                artist: "The Cure",
                album: "Greatest Hits",
              },
            },
          };
          expect(instance.userProperties).toStrictEqual(expected);
        });
      });
    });
  });

  describe("when the report has all top albums for an artist", () => {
    beforeEach(() => {
      mockUserProperties = JSON.parse(JSON.stringify(MockStage3Report));
      instance = new UserPlaycountByArtistState(mockUserProperties);
    });

    describe("getReport", () => {
      it("should return the expected value", () => {
        expect(instance.getReport()).toBe(
          instance.userProperties.data.report.playCountByArtist
        );
      });
    });

    describe("updateWithResponse", () => {
      describe("with an album info response", () => {
        beforeEach(() =>
          instance.updateWithResponse(
            MockAlbumGetInfo.album,
            {
              artist: "The Cure",
              album: "Disintegration",
              userName: "niall-byrne",
            },
            apiRoutes.v2.data.artists.albumsGet
          )
        );

        it("should attach the results as expected", () => {
          const expected: LastFMUserStatePlayCountByArtistReport = JSON.parse(
            JSON.stringify(MockStage3Report)
          );
          expected.data.report.playCountByArtist.content[12].albums[2] =
            mockAlbumInfo;
          expected.data.report.playCountByArtist.status = {
            complete: false,
            steps_total:
              expected.data.report.playCountByArtist.status.steps_total +
              mockAlbumInfo.tracks.length,
            steps_complete: 3,
            operation: {
              type: "Track Details" as const,
              resource: mockAlbumInfo.tracks[0].name,
              url: apiRoutes.v2.data.artists.tracksGet,
              params: {
                userName: "niall-byrne",
                artist: "The Cure",
                album: "Disintegration",
                track: "Plainsong",
              },
            },
          };
          expect(instance.userProperties).toStrictEqual(expected);
        });
      });
    });
  });

  describe("when the report has ALMOST all album info", () => {
    beforeEach(() => {
      mockUserProperties = JSON.parse(JSON.stringify(MockStage4Report));
      mockUserProperties.data.report.playCountByArtist.content[12].albums[2].tracks[3].playcount =
        null;
      instance = new UserPlaycountByArtistState(mockUserProperties);
    });

    describe("getReport", () => {
      it("should return the expected value", () => {
        expect(instance.getReport()).toBe(
          instance.userProperties.data.report.playCountByArtist
        );
      });
    });

    describe("updateWithResponse", () => {
      beforeEach(() =>
        instance.updateWithResponse(
          MockTrackGetInfo.track,
          {
            artist: "The Cure",
            album: "Disintegration",
            track: "Plainsong",
            userName: "niall-byrne",
          },
          apiRoutes.v2.data.artists.tracksGet
        )
      );

      describe("with an a track info response", () => {
        it("should attach the results as expected", () => {
          const expected: LastFMUserStatePlayCountByArtistReport = JSON.parse(
            JSON.stringify(MockStage4Report)
          );
          expected.data.report.playCountByArtist.content[12].albums[2].tracks[0] =
            mockTrackInfo;
          expected.data.report.playCountByArtist.content[12].albums[2].tracks[3].playcount =
            null;
          expected.data.report.playCountByArtist.status = {
            complete: false,
            steps_total:
              expected.data.report.playCountByArtist.status.steps_total,
            steps_complete: 4,
            operation: {
              url: apiRoutes.v2.data.artists.tracksGet,
              resource:
                expected.data.report.playCountByArtist.content[12].albums[2]
                  .tracks[3].name,
              params: {
                artist: "The Cure",
                album: "Disintegration",
                track: "Lovesong",
                userName: "niall-byrne",
              },
              type: "Track Details",
            },
          };
          expect(instance.userProperties).toStrictEqual(expected);
        });
      });
    });
  });

  describe("when the report has all album info", () => {
    beforeEach(() => {
      mockUserProperties = JSON.parse(JSON.stringify(MockStage4Report));
      instance = new UserPlaycountByArtistState(mockUserProperties);
    });

    describe("getReport", () => {
      it("should return the expected value", () => {
        expect(instance.getReport()).toBe(
          instance.userProperties.data.report.playCountByArtist
        );
      });
    });

    describe("updateWithResponse", () => {
      beforeEach(() =>
        instance.updateWithResponse(
          MockTrackGetInfo.track,
          {
            artist: "The Cure",
            album: "Disintegration",
            track: "Plainsong",
            userName: "niall-byrne",
          },
          apiRoutes.v2.data.artists.tracksGet
        )
      );

      describe("with an a track info response", () => {
        it("should attach the results as expected", () => {
          const expected: LastFMUserStatePlayCountByArtistReport = JSON.parse(
            JSON.stringify(MockStage4Report)
          );
          expected.data.report.playCountByArtist.content[12].albums[2].tracks[0] =
            mockTrackInfo;
          expected.data.report.playCountByArtist.status = {
            complete: true,
            steps_total:
              expected.data.report.playCountByArtist.status.steps_total,
            steps_complete: 4,
          };
          expect(instance.userProperties).toStrictEqual(expected);
        });
      });
    });
  });
});
