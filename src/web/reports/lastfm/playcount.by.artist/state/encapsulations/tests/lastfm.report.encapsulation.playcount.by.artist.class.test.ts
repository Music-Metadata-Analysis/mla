import LastFMReportPlayCountByArtistStateEncapsulation from "../lastfm.report.encapsulation.playcount.by.artist.class";
import apiRoutes from "@src/config/apiRoutes";
import MockStage2Report from "@src/contracts/api/services/lastfm/fixtures/aggregates/playcount.by.artist/lastfm.report.state.playcount.by.artist.sunburst.stage.2.json";
import MockStage3Report from "@src/contracts/api/services/lastfm/fixtures/aggregates/playcount.by.artist/lastfm.report.state.playcount.by.artist.sunburst.stage.3.json";
import { response as MockUserGetTopArtists } from "@src/contracts/api/services/lastfm/fixtures/reports/tops/top.artists";
import { response as MockAlbumGetInfo } from "@src/contracts/api/services/lastfm/fixtures/responses/album.get.info";
import { response as MockArtistGetTopAlbums } from "@src/contracts/api/services/lastfm/fixtures/responses/artist.get.topalbums";
import { InitialState } from "@src/web/reports/generics/state/providers/report.initial";
import type { LastFMImageDataInterface } from "@src/contracts/api/types/services/lastfm/responses/elements/image.data.types";
import type { LastFMReportStatePlayCountByArtistReport } from "@src/web/reports/lastfm/generics/types/state/providers/lastfm.report.state.types";

describe("LastFMReportPlayCountByArtistStateEncapsulation", () => {
  let instance: LastFMReportPlayCountByArtistStateEncapsulation;
  let mockReportProperties: LastFMReportStatePlayCountByArtistReport;
  const mockTopArtists = MockUserGetTopArtists.artists.map((artist) => ({
    name: artist.name,
    playcount: parseInt(artist.playcount),
    albums: [],
    fetched: false,
  }));
  const mockTopAlbums = MockArtistGetTopAlbums.topalbums.album.map((album) => ({
    name: album.name,
    playcount: null,
    tracks: [],
    fetched: false,
  }));
  const mockAlbumInfo = {
    fetched: true,
    name: MockAlbumGetInfo.album.name,
    playcount: MockAlbumGetInfo.album.userplaycount,
    tracks: MockAlbumGetInfo.album.tracks.track.map((track) => ({
      name: track.name,
      rank: track["@attr"].rank,
      fetched: true,
    })),
  };

  const systemTime = new Date("2020-01-01");

  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(systemTime);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe("when initialized", () => {
    beforeEach(() => {
      mockReportProperties = JSON.parse(JSON.stringify(InitialState));
      instance = new LastFMReportPlayCountByArtistStateEncapsulation(
        mockReportProperties
      );
    });

    describe("getReport", () => {
      it("should return the expected value", () => {
        expect(instance.getReport()).toBe(
          instance.reportProperties.data.report.playCountByArtist
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

  describe("when the report is non-existent (Stage1)", () => {
    beforeEach(() => {
      mockReportProperties = JSON.parse(JSON.stringify(InitialState));
      instance = new LastFMReportPlayCountByArtistStateEncapsulation(
        mockReportProperties
      );
    });

    describe("getReport", () => {
      it("should return the expected value", () => {
        expect(instance.getReport()).toBe(
          instance.reportProperties.data.report.playCountByArtist
        );
      });
    });

    describe("updateWithResponse", () => {
      let expected: LastFMReportStatePlayCountByArtistReport;

      beforeEach(() => (expected = JSON.parse(JSON.stringify(InitialState))));

      describe("with an empty response and an DEFAULT url", () => {
        beforeEach(() =>
          instance.updateWithResponse(
            MockUserGetTopArtists,
            { userName: "niall-byrne" },
            "DEFAULT"
          )
        );

        it("should modify the results as expected", () => {
          expected.data.integration = "LASTFM";
          expected.data.report.playCountByArtist.status = {
            complete: false,
            steps_total: 1,
            steps_complete: 1,
            operation: {
              type: "User Profile" as const,
              resource: "niall-byrne",
              url: apiRoutes.v2.reports.lastfm.top20artists,
              params: { userName: "niall-byrne" },
            },
          };
          expect(instance.reportProperties).toStrictEqual(expected);
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
          expected.data.report.playcount = MockUserGetTopArtists.playcount;
          expected.data.report.image =
            MockUserGetTopArtists.image as LastFMImageDataInterface[];
          expected.data.report.playCountByArtist.content = mockTopArtists;
          expected.data.report.playCountByArtist.status = {
            complete: false,
            steps_total: 1 + mockTopArtists.length,
            steps_complete: 1,
            operation: {
              type: "Top Albums" as const,
              resource: mockTopArtists[0].name,
              url: apiRoutes.v2.data.artists.albumsList,
              params: { userName: "niall-byrne", artist: "Lights & Motion" },
            },
          };
          expect(instance.reportProperties).toStrictEqual(expected);
        });
      });

      describe("with a user's top artists response with missing playcount information", () => {
        let expected: LastFMReportStatePlayCountByArtistReport;

        beforeEach(() => {
          const mockMissingPlaycounts = JSON.parse(
            JSON.stringify(MockUserGetTopArtists)
          );
          expected = JSON.parse(JSON.stringify(InitialState));
          mockMissingPlaycounts.artists[0].playcount = null;
          instance.updateWithResponse(
            mockMissingPlaycounts,
            { userName: "niall-byrne" },
            apiRoutes.v2.reports.lastfm.top20artists
          );
        });

        it("should attach the results as expected", () => {
          expected.data.report.playcount = MockUserGetTopArtists.playcount;
          expected.data.report.image =
            MockUserGetTopArtists.image as LastFMImageDataInterface[];
          expected.data.report.playCountByArtist.content = mockTopArtists;
          expected.data.report.playCountByArtist.content[0].playcount = 0;
          expected.data.report.playCountByArtist.status = {
            complete: false,
            steps_total: 1 + mockTopArtists.length,
            steps_complete: 1,
            operation: {
              type: "Top Albums" as const,
              resource: mockTopArtists[0].name,
              url: apiRoutes.v2.data.artists.albumsList,
              params: { userName: "niall-byrne", artist: "Lights & Motion" },
            },
          };
          expect(instance.reportProperties).toStrictEqual(expected);
        });
      });

      describe("with a user's top artists response without any listens", () => {
        beforeEach(() =>
          instance.updateWithResponse(
            { artist: [], playcount: 0, image: MockUserGetTopArtists.image },
            { userName: "niall-byrne" },
            apiRoutes.v2.reports.lastfm.top20artists
          )
        );

        it("should return a completed a report", () => {
          expected.data.report.image =
            MockUserGetTopArtists.image as LastFMImageDataInterface[];
          expected.data.report.playCountByArtist.status = {
            complete: true,
            steps_total: 1,
            steps_complete: 1,
          };
          expect(instance.reportProperties).toStrictEqual(expected);
        });
      });
    });
  });

  describe("when the report has top artist information, except for The Cure (Stage2)", () => {
    beforeEach(() => {
      mockReportProperties = JSON.parse(JSON.stringify(MockStage2Report));
      instance = new LastFMReportPlayCountByArtistStateEncapsulation(
        mockReportProperties
      );
    });

    describe("getReport", () => {
      it("should return the expected value", () => {
        expect(instance.getReport()).toBe(
          instance.reportProperties.data.report.playCountByArtist
        );
      });
    });

    describe("updateWithResponse", () => {
      let expected: LastFMReportStatePlayCountByArtistReport;

      beforeEach(
        () => (expected = JSON.parse(JSON.stringify(MockStage2Report)))
      );

      describe("with an artists's top album information", () => {
        beforeEach(() =>
          instance.updateWithResponse(
            MockArtistGetTopAlbums.topalbums.album,
            { artist: "The Cure", userName: "niall-byrne" },
            apiRoutes.v2.data.artists.albumsList
          )
        );

        it("should attach the results as expected", () => {
          expected.data.report.playCountByArtist.content[12].albums =
            mockTopAlbums;
          expected.data.report.playCountByArtist.content[12].fetched = true;
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
          expect(instance.reportProperties).toStrictEqual(expected);
        });
      });
    });
  });

  describe("when the report has top artist information, and almost all album details except for The Cure (Stage3)", () => {
    beforeEach(() => {
      mockReportProperties = JSON.parse(JSON.stringify(MockStage3Report));
      mockReportProperties.data.report.playCountByArtist.content[12].albums = [
        { name: "Disintegration", playcount: null, tracks: [], fetched: false },
        { name: "Wish", playcount: null, tracks: [], fetched: false },
      ];
      instance = new LastFMReportPlayCountByArtistStateEncapsulation(
        mockReportProperties
      );
    });

    describe("getReport", () => {
      it("should return the expected value", () => {
        expect(instance.getReport()).toBe(
          instance.reportProperties.data.report.playCountByArtist
        );
      });
    });

    describe("updateWithResponse", () => {
      let expected: LastFMReportStatePlayCountByArtistReport;

      beforeEach(
        () => (expected = JSON.parse(JSON.stringify(MockStage3Report)))
      );

      describe("with a regular album response", () => {
        beforeEach(() => {
          instance.updateWithResponse(
            {
              name: "Disintegration",
              userplaycount: 100,
              tracks: { track: [{ name: "Plainsong", "@attr": { rank: 1 } }] },
            },
            {
              album: "Disintegration",
              artist: "The Cure",
              userName: "niall-byrne",
            },
            apiRoutes.v2.data.artists.albumsGet
          );
        });

        it("should attach the results as expected", () => {
          expected.data.report.playCountByArtist.content[12].albums = [
            {
              name: "Disintegration",
              playcount: 100,
              tracks: [{ name: "Plainsong", rank: 1, fetched: true }],
              fetched: true,
            },
            {
              name: "Wish",
              playcount: null,
              tracks: [],
              fetched: false,
            },
          ];
          expected.data.report.playCountByArtist.status = {
            complete: false,
            steps_total:
              expected.data.report.playCountByArtist.status.steps_total,
            steps_complete: 3,
            operation: {
              type: "Album Details" as const,
              resource: "Wish",
              url: apiRoutes.v2.data.artists.albumsGet,
              params: {
                userName: "niall-byrne",
                artist: "The Cure",
                album: "Wish",
              },
            },
          };
          expect(instance.reportProperties).toStrictEqual(expected);
        });
      });

      describe("with an album response missing playcount information", () => {
        beforeEach(() => {
          instance.updateWithResponse(
            {
              name: "Disintegration",
              userplaycount: null,
              tracks: { track: [{ name: "Plainsong", "@attr": { rank: 1 } }] },
            },
            {
              album: "Disintegration",
              artist: "The Cure",
              userName: "niall-byrne",
            },
            apiRoutes.v2.data.artists.albumsGet
          );
        });

        it("should attach the results as expected", () => {
          expected.data.report.playCountByArtist.content[12].albums = [
            {
              name: "Disintegration",
              playcount: 0,
              tracks: [{ name: "Plainsong", rank: 1, fetched: true }],
              fetched: true,
            },
            {
              name: "Wish",
              playcount: null,
              tracks: [],
              fetched: false,
            },
          ];
          expected.data.report.playCountByArtist.status = {
            complete: false,
            steps_total:
              expected.data.report.playCountByArtist.status.steps_total,
            steps_complete: 3,
            operation: {
              type: "Album Details" as const,
              resource: "Wish",
              url: apiRoutes.v2.data.artists.albumsGet,
              params: {
                userName: "niall-byrne",
                artist: "The Cure",
                album: "Wish",
              },
            },
          };
          expect(instance.reportProperties).toStrictEqual(expected);
        });
      });
    });
  });

  describe("when the report has top artist information, and has quickly found all user plays for The Cure (Stage3)", () => {
    const target_artists = [12, 13];

    beforeEach(() => {
      mockReportProperties = JSON.parse(JSON.stringify(MockStage3Report));
      target_artists.forEach((target_artist) => {
        mockReportProperties.data.report.playCountByArtist.content[
          target_artist
        ].fetched = true;
        mockReportProperties.data.report.playCountByArtist.content[
          target_artist
        ].albums.forEach((albumResult) => {
          albumResult.fetched = false;
          albumResult.playcount = null;
          albumResult.tracks.forEach((trackResult) => {
            trackResult.fetched = false;
          });
        });
      });
      instance = new LastFMReportPlayCountByArtistStateEncapsulation(
        mockReportProperties
      );
    });

    describe("getReport", () => {
      it("should return the expected value", () => {
        expect(instance.getReport()).toBe(
          instance.reportProperties.data.report.playCountByArtist
        );
      });
    });

    describe("updateWithResponse", () => {
      let expected: LastFMReportStatePlayCountByArtistReport;

      beforeEach(() => {
        expected = JSON.parse(JSON.stringify(mockReportProperties));
        expected.data.report.playCountByArtist.content.forEach(
          (artist, index) => {
            if (!(index === target_artists[1])) {
              artist.fetched = true;
              artist.albums.forEach((albumResult) => {
                albumResult.fetched = true;
              });
            }
          }
        );
      });

      describe("with a result that satisfies all listens ", () => {
        beforeEach(() => {
          instance.updateWithResponse(
            {
              name: "Greatest Hits",
              userplaycount: 1946,
              tracks: { track: [{ name: "Mock Track", "@attr": { rank: 1 } }] },
            },
            {
              album: "Greatest Hits",
              artist: "The Cure",
              userName: "niall-byrne",
            },
            apiRoutes.v2.data.artists.albumsGet
          );
        });

        it("should attach the results as expected", () => {
          expected.data.report.playCountByArtist.content[12].albums.forEach(
            (albumResult) => {
              albumResult.playcount = 0;
            }
          );
          expected.data.report.playCountByArtist.content[12].albums[0] = {
            name: "Greatest Hits",
            playcount: 1946,
            fetched: true,
            tracks: [{ name: "Mock Track", rank: 1, fetched: true }],
          };

          expected.data.report.playCountByArtist.status = {
            complete: false,
            steps_total:
              expected.data.report.playCountByArtist.status.steps_total,
            steps_complete:
              mockReportProperties.data.report.playCountByArtist.status
                .steps_complete +
              mockReportProperties.data.report.playCountByArtist.content[12]
                .albums.length,
            operation: {
              type: "Album Details" as const,
              resource:
                expected.data.report.playCountByArtist.content[13].albums[0]
                  .name,
              url: apiRoutes.v2.data.artists.albumsGet,
              params: {
                userName: "niall-byrne",
                artist: expected.data.report.playCountByArtist.content[13].name,
                album:
                  expected.data.report.playCountByArtist.content[13].albums[0]
                    .name,
              },
            },
          };
          expect(instance.reportProperties).toStrictEqual(expected);
        });
      });
    });
  });

  describe("when the report has top artist information, and album details, and is about to be completed (Stage3)", () => {
    beforeEach(() => {
      mockReportProperties = JSON.parse(JSON.stringify(MockStage3Report));
      instance = new LastFMReportPlayCountByArtistStateEncapsulation(
        mockReportProperties
      );
    });

    describe("getReport", () => {
      it("should return the expected value", () => {
        expect(instance.getReport()).toBe(
          instance.reportProperties.data.report.playCountByArtist
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
          const expected: LastFMReportStatePlayCountByArtistReport = JSON.parse(
            JSON.stringify(MockStage3Report)
          );
          expected.data.report.playCountByArtist.created =
            new Date().toISOString();
          expected.data.report.playCountByArtist.content[12].albums[2] =
            mockAlbumInfo;
          expected.data.report.playCountByArtist.status = {
            complete: true,
            steps_total:
              expected.data.report.playCountByArtist.status.steps_total,
            steps_complete: 3,
          };
          expect(instance.reportProperties).toStrictEqual(expected);
        });
      });

      describe("with a get album response missing track information", () => {
        beforeEach(() => {
          instance.updateWithResponse(
            {
              name: "Disintegration",
              userplaycount: 100,
            },
            {
              album: "Disintegration",
              artist: "The Cure",
              userName: "niall-byrne",
            },
            apiRoutes.v2.data.artists.albumsGet
          );
        });

        it("should attach the results as expected", () => {
          const expected: LastFMReportStatePlayCountByArtistReport = JSON.parse(
            JSON.stringify(MockStage3Report)
          );
          expected.data.report.playCountByArtist.content[12].albums[2] = {
            name: "Disintegration",
            playcount: 100,
            tracks: [],
            fetched: true,
          };
          expected.data.report.playCountByArtist.status = {
            complete: true,
            steps_total:
              expected.data.report.playCountByArtist.status.steps_total,
            steps_complete: 3,
          };
          expected.data.report.playCountByArtist.created =
            new Date().toISOString();
          expect(instance.reportProperties).toStrictEqual(expected);
        });
      });

      describe("with a get album response having track info as an object", () => {
        beforeEach(() => {
          instance.updateWithResponse(
            {
              name: "Disintegration",
              userplaycount: 100,
              tracks: { track: { name: "Plainsong", "@attr": { rank: 1 } } },
            },
            {
              album: "Disintegration",
              artist: "The Cure",
              userName: "niall-byrne",
            },
            apiRoutes.v2.data.artists.albumsGet
          );
        });

        it("should attach the results as expected", () => {
          const expected: LastFMReportStatePlayCountByArtistReport = JSON.parse(
            JSON.stringify(MockStage3Report)
          );
          expected.data.report.playCountByArtist.content[12].albums[2] = {
            name: "Disintegration",
            playcount: 100,
            tracks: [{ name: "Plainsong", rank: 1, fetched: true }],
            fetched: true,
          };
          expected.data.report.playCountByArtist.status = {
            complete: true,
            steps_total:
              expected.data.report.playCountByArtist.status.steps_total,
            steps_complete: 3,
          };
          expected.data.report.playCountByArtist.created =
            new Date().toISOString();
          expect(instance.reportProperties).toStrictEqual(expected);
        });
      });
    });

    describe("removeEntity", () => {
      let expected: LastFMReportStatePlayCountByArtistReport;

      beforeEach(
        () => (expected = JSON.parse(JSON.stringify(MockStage3Report)))
      );

      describe("with track params", () => {
        beforeEach(() =>
          instance.removeEntity({
            userName: "niall-byrne",
            album: "Mock Album",
            artist: "New Order",
            track: "Mock Track",
          })
        );

        it("should remove the specified track", () => {
          expected.data.report.playCountByArtist.content[19].albums[0].tracks =
            [];
          expected.data.report.playCountByArtist.status.operation = undefined;
          expected.data.report.playCountByArtist.status.complete = true;
          expected.data.report.playCountByArtist.status.steps_total -= 1;
          expect(instance.reportProperties).toStrictEqual(expected);
        });
      });

      describe("with album params", () => {
        beforeEach(() =>
          instance.removeEntity({
            userName: "niall-byrne",
            album: "Mock Album",
            artist: "New Order",
          })
        );

        it("should remove the specified album", () => {
          expected.data.report.playCountByArtist.content[19].albums = [];
          expected.data.report.playCountByArtist.status.operation = undefined;
          expected.data.report.playCountByArtist.status.complete = true;
          expected.data.report.playCountByArtist.status.steps_total -= 1;
          expect(instance.reportProperties).toStrictEqual(expected);
        });
      });

      describe("with artist params", () => {
        beforeEach(() =>
          instance.removeEntity({
            userName: "niall-byrne",
            artist: "New Order",
          })
        );

        it("should remove the specified artist", () => {
          expected.data.report.playCountByArtist.content.splice(19, 1);
          expected.data.report.playCountByArtist.status.operation = undefined;
          expected.data.report.playCountByArtist.status.complete = true;
          expected.data.report.playCountByArtist.status.steps_total -= 1;
          expect(instance.reportProperties).toStrictEqual(expected);
        });
      });

      describe("with only username params", () => {
        beforeEach(() =>
          instance.removeEntity({
            userName: "niall-byrne",
          })
        );

        it("should NOT remove anything", () => {
          expect(instance.reportProperties).toStrictEqual(expected);
        });
      });
    });
  });
});
