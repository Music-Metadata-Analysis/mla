import LastFMUserClientAdapter from "../user.class";
import { mockVendorMethods } from "@src/__mocks__/@toplast/lastfm";
import { cacheVendorBackend } from "@src/vendors/integrations/cache/vendor.backend";
import ArtistImageCacheFactory from "@src/vendors/integrations/lastfm/backend/cache/artist.image.cache.controller/artist.image.cache.controller.factory.class";
import type { RemoteServiceError } from "@src/contracts/api/types/services/generics/proxy/proxy.error.types";
import type { LastFMUserProfileInterface } from "@src/contracts/api/types/services/lastfm/responses/elements/user.profile.types";
import type { LastFMUserAlbumInterface } from "@src/contracts/api/types/services/lastfm/responses/reports/top/top.albums.types";
import type { LastFMUserArtistInterface } from "@src/contracts/api/types/services/lastfm/responses/reports/top/top.artists.types";
import type { LastFMUserTrackInterface } from "@src/contracts/api/types/services/lastfm/responses/reports/top/top.tracks.types";
import type { CacheVendorCdnControllerInterface } from "@src/vendors/types/integrations/cache/vendor.backend.types";
import type { LastFMVendorClientError } from "@src/vendors/types/integrations/lastfm/vendor.backend.types";

jest.mock("@src/vendors/integrations/cache/vendor.backend");

describe("LastFMUserClientAdapter", () => {
  let instance: LastFMUserClientAdapter;
  let mockCacheController: Record<
    keyof CacheVendorCdnControllerInterface<string>,
    jest.Mock
  >;
  const secretKey = "123VerySecret";
  const username = "testuser";

  beforeEach(() => {
    jest.clearAllMocks();
    mockCacheController = cacheVendorBackend.CdnController
      .prototype as unknown as Record<
      keyof CacheVendorCdnControllerInterface<string>,
      jest.Mock
    >;
  });

  const arrange = (secretKey: string) => {
    jest
      .spyOn(ArtistImageCacheFactory.prototype, "create")
      .mockReturnValue(
        mockCacheController as unknown as CacheVendorCdnControllerInterface<string>
      );
    return new LastFMUserClientAdapter(secretKey);
  };

  describe("getTopAlbums", () => {
    let res: LastFMUserAlbumInterface[];
    const mockTopAlbumsResponse = { topalbums: { album: "response" } };

    describe("when the request is successful", () => {
      beforeEach(() => {
        mockVendorMethods.user.getTopAlbums.mockResolvedValueOnce(
          JSON.parse(JSON.stringify(mockTopAlbumsResponse))
        );
        instance = arrange(secretKey);
      });

      it("should call the external library correctly", async () => {
        res = await instance.getTopAlbums(username);
        expect(mockVendorMethods.user.getTopAlbums).toHaveBeenCalledTimes(1);
        expect(mockVendorMethods.user.getTopAlbums).toHaveBeenCalledWith({
          user: username,
          period: instance.reportPeriod,
          limit: instance.reportCount,
          page: 1,
        });
        expect(res).toBe(mockTopAlbumsResponse.topalbums.album);
      });
    });

    describe("when the request errors", () => {
      let err: LastFMVendorClientError;

      beforeEach(() => {
        err = new Error("Test Error") as LastFMVendorClientError;
        mockVendorMethods.user.getTopAlbums.mockRejectedValueOnce(err);
      });

      describe("with a status code", () => {
        beforeEach(() => {
          err.statusCode = 999;
          instance = arrange(secretKey);
        });

        it("should embed the status code as expected", async () => {
          try {
            await instance.getTopAlbums(username);
          } catch (receivedError) {
            expect((receivedError as RemoteServiceError).message).toBe(
              `${err.message}`
            );
            expect((receivedError as RemoteServiceError).clientStatusCode).toBe(
              err.statusCode
            );
          }
        });
      });

      describe("without a status code", () => {
        beforeEach(() => {
          instance = arrange(secretKey);
        });

        it("should embed the status code as expected", async () => {
          try {
            await instance.getTopAlbums(username);
          } catch (receivedError) {
            expect((receivedError as RemoteServiceError).message).toBe(
              `${err.message}`
            );
            expect(
              (receivedError as RemoteServiceError).clientStatusCode
            ).toBeUndefined();
          }
        });
      });
    });
  });

  describe("getTopArtists", () => {
    let res: LastFMUserArtistInterface[];
    let mockImageUrl: string;
    const mockTopArtistsResponseComplete = {
      topartists: {
        artist: [{ name: "mockArtist", image: [{ "#text": "none" }] }],
      },
    };
    const mockTopArtistsResponseIncomplete = {
      topartists: {
        artist: [{ name: "mockArtist" }],
      },
    };

    describe("when the request is successful", () => {
      describe("with complete artist information", () => {
        beforeEach(async () => {
          mockImageUrl = "http://not/a/real/image";
          mockVendorMethods.user.getTopArtists.mockResolvedValueOnce(
            JSON.parse(JSON.stringify(mockTopArtistsResponseComplete))
          );
          mockCacheController.query.mockReturnValueOnce(mockImageUrl);
          instance = arrange(secretKey);
          res = await instance.getTopArtists(username);
        });

        it("should perform a cache lookup with the correct params", () => {
          expect(mockCacheController.query).toHaveBeenCalledTimes(1);
          expect(mockCacheController.query).toHaveBeenCalledWith(
            mockTopArtistsResponseComplete.topartists.artist[0].name
          );
        });

        it("should call the external library correctly", () => {
          expect(mockVendorMethods.user.getTopArtists).toHaveBeenCalledTimes(1);
          expect(mockVendorMethods.user.getTopArtists).toHaveBeenCalledWith({
            user: username,
            period: instance.reportPeriod,
            limit: instance.reportCount,
            page: 1,
          });
          const expected_response = JSON.parse(
            JSON.stringify(mockTopArtistsResponseComplete)
          ).topartists.artist;
          expected_response[0].image[0]["#text"] = mockImageUrl;
          expect(res).toStrictEqual(expected_response);
        });

        it("should log the cache hit rate", () => {
          expect(mockCacheController.logCacheHitRate).toHaveBeenCalledTimes(1);
          expect(mockCacheController.logCacheHitRate).toHaveBeenCalledWith();
        });
      });

      describe("with incomplete artist information", () => {
        beforeEach(async () => {
          mockImageUrl = "http://not/a/real/image";
          mockVendorMethods.user.getTopArtists.mockResolvedValueOnce(
            JSON.parse(JSON.stringify(mockTopArtistsResponseIncomplete))
          );
          mockCacheController.query.mockReturnValueOnce(mockImageUrl);
          instance = arrange(secretKey);
          res = await instance.getTopArtists(username);
        });

        it("should perform a cache lookup with the correct params", () => {
          expect(mockCacheController.query).toHaveBeenCalledTimes(1);
          expect(mockCacheController.query).toHaveBeenCalledWith(
            mockTopArtistsResponseComplete.topartists.artist[0].name
          );
        });

        it("should call the external library correctly", () => {
          expect(mockVendorMethods.user.getTopArtists).toHaveBeenCalledTimes(1);
          expect(mockVendorMethods.user.getTopArtists).toHaveBeenCalledWith({
            user: username,
            period: instance.reportPeriod,
            limit: instance.reportCount,
            page: 1,
          });
          const expected_response = JSON.parse(
            JSON.stringify(mockTopArtistsResponseIncomplete)
          ).topartists.artist;
          expect(res).toStrictEqual(expected_response);
        });

        it("should log the cache hit rate", () => {
          expect(mockCacheController.logCacheHitRate).toHaveBeenCalledTimes(1);
          expect(mockCacheController.logCacheHitRate).toHaveBeenCalledWith();
        });
      });
    });

    describe("when the request errors", () => {
      let err: LastFMVendorClientError;

      beforeEach(() => {
        err = new Error("Test Error") as LastFMVendorClientError;
        mockVendorMethods.user.getTopArtists.mockRejectedValueOnce(err);
      });

      describe("with a status code", () => {
        beforeEach(() => {
          err.statusCode = 999;
          instance = arrange(secretKey);
        });

        it("should embed the status code as expected", async () => {
          try {
            await instance.getTopArtists(username);
          } catch (receivedError) {
            expect((receivedError as RemoteServiceError).message).toBe(
              `${err.message}`
            );
            expect((receivedError as RemoteServiceError).clientStatusCode).toBe(
              err.statusCode
            );
          }
        });
      });

      describe("without a status code", () => {
        beforeEach(async () => {
          instance = arrange(secretKey);
        });

        it("should embed the status code as expected", async () => {
          try {
            await instance.getTopArtists(username);
          } catch (receivedError) {
            expect((receivedError as RemoteServiceError).message).toBe(
              `${err.message}`
            );
            expect(
              (receivedError as RemoteServiceError).clientStatusCode
            ).toBeUndefined();
          }
        });
      });
    });
  });

  describe("getUserProfile", () => {
    let res: LastFMUserProfileInterface;
    const mockProfileResponse = {
      user: { image: "response", playcount: "0000" },
    };

    describe("when the request is successful", () => {
      beforeEach(async () => {
        mockVendorMethods.user.getInfo.mockResolvedValueOnce(
          JSON.parse(JSON.stringify(mockProfileResponse))
        );
        instance = arrange(secretKey);
        res = await instance.getUserProfile(username);
      });

      it("should call the external library correctly", () => {
        expect(mockVendorMethods.user.getInfo).toHaveBeenCalledTimes(1);
        expect(mockVendorMethods.user.getInfo).toHaveBeenCalledWith({
          user: username,
        });
        expect(res).toStrictEqual({
          image: mockProfileResponse.user.image,
          playcount: parseInt(mockProfileResponse.user.playcount),
        });
      });
    });

    describe("when the request errors", () => {
      let err: LastFMVendorClientError;

      beforeEach(() => {
        err = new Error("Test Error") as LastFMVendorClientError;
        mockVendorMethods.user.getInfo.mockRejectedValueOnce(err);
      });

      describe("with a status code", () => {
        beforeEach(() => {
          err.statusCode = 999;
          instance = arrange(secretKey);
        });

        it("should embed the status code as expected", async () => {
          try {
            await instance.getUserProfile(username);
          } catch (receivedError) {
            expect((receivedError as RemoteServiceError).message).toBe(
              `${err.message}`
            );
            expect((receivedError as RemoteServiceError).clientStatusCode).toBe(
              err.statusCode
            );
          }
        });
      });

      describe("without a status code", () => {
        beforeEach(() => {
          instance = arrange(secretKey);
        });

        it("should embed the status code as expected", async () => {
          try {
            await instance.getUserProfile(username);
          } catch (receivedError) {
            expect((receivedError as RemoteServiceError).message).toBe(
              `${err.message}`
            );
            expect(
              (receivedError as RemoteServiceError).clientStatusCode
            ).toBeUndefined();
          }
        });
      });
    });
  });

  describe("getTopTracks", () => {
    let res: LastFMUserTrackInterface[];
    let mockImageUrl: string;
    const mockTopTracksResponseComplete = {
      toptracks: {
        track: [
          {
            name: "mockTrack",
            image: [{ "#text": "none" }],
            artist: { name: "mockArtist" },
          },
        ],
      },
    };
    const mockTopTracksResponseIncomplete = {
      toptracks: {
        track: [{ name: "mockTrack" }],
      },
    };

    describe("when the request is successful", () => {
      describe("with complete track information", () => {
        beforeEach(async () => {
          mockImageUrl = "http://not/a/real/image";
          mockVendorMethods.user.getTopTracks.mockResolvedValueOnce(
            JSON.parse(JSON.stringify(mockTopTracksResponseComplete))
          );
          mockCacheController.query.mockReturnValueOnce(mockImageUrl);
          instance = arrange(secretKey);
          res = await instance.getTopTracks(username);
        });

        it("should perform a cache lookup with the correct params", () => {
          expect(mockCacheController.query).toHaveBeenCalledTimes(1);
          expect(mockCacheController.query).toHaveBeenCalledWith(
            mockTopTracksResponseComplete.toptracks.track[0].artist.name
          );
        });

        it("should call the external library correctly", () => {
          expect(mockVendorMethods.user.getTopTracks).toHaveBeenCalledTimes(1);
          expect(mockVendorMethods.user.getTopTracks).toHaveBeenCalledWith({
            user: username,
            period: instance.reportPeriod,
            limit: instance.reportCount,
            page: 1,
          });
          const expected_response = JSON.parse(
            JSON.stringify(mockTopTracksResponseComplete)
          ).toptracks.track;
          expected_response[0].image[0]["#text"] = mockImageUrl;
          expect(res).toStrictEqual(expected_response);
        });

        it("should log the cache hit rate", () => {
          expect(mockCacheController.logCacheHitRate).toHaveBeenCalledTimes(1);
          expect(mockCacheController.logCacheHitRate).toHaveBeenCalledWith();
        });
      });

      describe("with incomplete track information", () => {
        beforeEach(async () => {
          mockImageUrl = "http://not/a/real/image";
          mockVendorMethods.user.getTopTracks.mockResolvedValueOnce(
            JSON.parse(JSON.stringify(mockTopTracksResponseIncomplete))
          );
          mockCacheController.query.mockReturnValueOnce(mockImageUrl);
          instance = arrange(secretKey);
          res = await instance.getTopTracks(username);
        });

        it("should perform a cache lookup with the correct params", () => {
          expect(mockCacheController.query).toHaveBeenCalledTimes(1);
          expect(mockCacheController.query).toHaveBeenCalledWith(undefined);
        });

        it("should call the external library correctly", () => {
          expect(mockVendorMethods.user.getTopTracks).toHaveBeenCalledTimes(1);
          expect(mockVendorMethods.user.getTopTracks).toHaveBeenCalledWith({
            user: username,
            period: instance.reportPeriod,
            limit: instance.reportCount,
            page: 1,
          });
          const expected_response = JSON.parse(
            JSON.stringify(mockTopTracksResponseIncomplete)
          ).toptracks.track;
          expect(res).toStrictEqual(expected_response);
        });

        it("should log the cache hit rate", () => {
          expect(mockCacheController.logCacheHitRate).toHaveBeenCalledTimes(1);
          expect(mockCacheController.logCacheHitRate).toHaveBeenCalledWith();
        });
      });
    });

    describe("when the request errors", () => {
      let err: LastFMVendorClientError;

      beforeEach(() => {
        err = new Error("Test Error") as LastFMVendorClientError;
        mockVendorMethods.user.getTopTracks.mockRejectedValueOnce(err);
      });

      describe("with a status code", () => {
        beforeEach(() => {
          err.statusCode = 999;
          instance = arrange(secretKey);
        });

        it("should embed the status code as expected", async () => {
          try {
            await instance.getTopTracks(username);
          } catch (receivedError) {
            expect((receivedError as RemoteServiceError).message).toBe(
              `${err.message}`
            );
            expect((receivedError as RemoteServiceError).clientStatusCode).toBe(
              err.statusCode
            );
          }
        });
      });

      describe("without a status code", () => {
        beforeEach(() => {
          instance = arrange(secretKey);
        });

        it("should embed the status code as expected", async () => {
          try {
            await instance.getTopTracks(username);
          } catch (receivedError) {
            expect((receivedError as RemoteServiceError).message).toBe(
              `${err.message}`
            );
            expect(
              (receivedError as RemoteServiceError).clientStatusCode
            ).toBeUndefined();
          }
        });
      });
    });
  });
});
