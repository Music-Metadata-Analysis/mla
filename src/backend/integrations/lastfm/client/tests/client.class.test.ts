import LastFMUserClientAdapter from "../user.class";
import type { ProxyError } from "../../../../../errors/proxy.error.class";
import type {
  LastFMAlbumDataInterface,
  LastFMArtistDataInterface,
  LastFMUserProfileInterface,
  LastFMTrackDataInterface,
} from "../../../../../types/integrations/lastfm/api.types";
import type { LastFMExternalClientError } from "../../../../../types/integrations/lastfm/client.types";

jest.mock("@toplast/lastfm", () => {
  return jest.fn().mockImplementation(() => {
    return {
      user: mockApiCalls,
    };
  });
});

jest.mock("../../s3.artist.cache.class", () => jest.fn(() => MockCache));

const MockCache = {
  lookup: jest.fn(),
  logCacheHitRate: jest.fn(),
};

const mockApiCalls = {
  getTopAlbums: jest.fn(),
  getTopArtists: jest.fn(),
  getInfo: jest.fn(),
  getTopTracks: jest.fn(),
};

describe("LastFMUserClientAdapter", () => {
  const secretKey = "123VerySecret";
  const username = "testuser";
  const mockTopAlbumsResponse = { topalbums: { album: "response" } };
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
  const mockProfileResponse = {
    user: { image: "response", playcount: "0000" },
  };
  let instance: LastFMUserClientAdapter;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = (secretKey: string) => {
    return new LastFMUserClientAdapter(secretKey);
  };

  describe("getTopAlbums", () => {
    let res: LastFMAlbumDataInterface[];

    describe("when the request is successful", () => {
      beforeEach(() => {
        mockApiCalls["getTopAlbums"].mockReturnValueOnce(
          Promise.resolve(JSON.parse(JSON.stringify(mockTopAlbumsResponse)))
        );
        instance = arrange(secretKey);
      });

      it("should call the external library correctly", async () => {
        res = await instance.getTopAlbums(username);
        expect(mockApiCalls["getTopAlbums"]).toBeCalledTimes(1);
        expect(mockApiCalls["getTopAlbums"]).toBeCalledWith({
          user: username,
          period: instance.reportPeriod,
          limit: instance.reportCount,
          page: 1,
        });
        expect(res).toBe(mockTopAlbumsResponse.topalbums.album);
      });
    });

    describe("when the request errors", () => {
      let err: LastFMExternalClientError;

      beforeEach(() => {
        err = new Error("Test Error") as LastFMExternalClientError;
      });

      describe("with a status code", () => {
        beforeEach(() => {
          err.statusCode = 999;
          mockApiCalls["getTopAlbums"].mockImplementationOnce(() =>
            Promise.reject(err)
          );
          instance = arrange(secretKey);
        });

        it("should embed the status code as expected", async () => {
          try {
            await instance.getTopAlbums(username);
          } catch (receivedError) {
            expect((receivedError as ProxyError).message).toBe(
              `${err.message}`
            );
            expect((receivedError as ProxyError).clientStatusCode).toBe(
              err.statusCode
            );
          }
        });
      });

      describe("without a status code", () => {
        beforeEach(() => {
          mockApiCalls["getTopAlbums"].mockImplementationOnce(() =>
            Promise.reject(err)
          );
          instance = arrange(secretKey);
        });

        it("should embed the status code as expected", async () => {
          try {
            await instance.getTopAlbums(username);
          } catch (receivedError) {
            expect((receivedError as ProxyError).message).toBe(
              `${err.message}`
            );
            expect(
              (receivedError as ProxyError).clientStatusCode
            ).toBeUndefined();
          }
        });
      });
    });
  });

  describe("getTopArtists", () => {
    let res: LastFMArtistDataInterface[];
    let mockImageUrl: string;

    describe("when the request is successful", () => {
      describe("with complete artist information", () => {
        beforeEach(async () => {
          mockImageUrl = "http://not/a/real/image";
          mockApiCalls["getTopArtists"].mockReturnValueOnce(
            Promise.resolve(
              JSON.parse(JSON.stringify(mockTopArtistsResponseComplete))
            )
          );
          MockCache.lookup.mockReturnValueOnce(mockImageUrl);
          instance = arrange(secretKey);
          res = await instance.getTopArtists(username);
        });

        it("should perform a cache lookup with the correct params", () => {
          expect(MockCache.lookup).toBeCalledTimes(1);
          expect(MockCache.lookup).toBeCalledWith(
            mockTopArtistsResponseComplete.topartists.artist[0].name
          );
        });

        it("should call the external library correctly", () => {
          expect(mockApiCalls["getTopArtists"]).toBeCalledTimes(1);
          expect(mockApiCalls["getTopArtists"]).toBeCalledWith({
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
          expect(MockCache.logCacheHitRate).toBeCalledTimes(1);
          expect(MockCache.logCacheHitRate).toBeCalledWith();
        });
      });

      describe("with incomplete artist information", () => {
        beforeEach(async () => {
          mockImageUrl = "http://not/a/real/image";
          mockApiCalls["getTopArtists"].mockReturnValueOnce(
            Promise.resolve(
              JSON.parse(JSON.stringify(mockTopArtistsResponseIncomplete))
            )
          );
          MockCache.lookup.mockReturnValueOnce(mockImageUrl);
          instance = arrange(secretKey);
          res = await instance.getTopArtists(username);
        });

        it("should perform a cache lookup with the correct params", () => {
          expect(MockCache.lookup).toBeCalledTimes(1);
          expect(MockCache.lookup).toBeCalledWith(
            mockTopArtistsResponseComplete.topartists.artist[0].name
          );
        });

        it("should call the external library correctly", () => {
          expect(mockApiCalls["getTopArtists"]).toBeCalledTimes(1);
          expect(mockApiCalls["getTopArtists"]).toBeCalledWith({
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
          expect(MockCache.logCacheHitRate).toBeCalledTimes(1);
          expect(MockCache.logCacheHitRate).toBeCalledWith();
        });
      });
    });

    describe("when the request errors", () => {
      let err: LastFMExternalClientError;

      beforeEach(() => {
        err = new Error("Test Error") as LastFMExternalClientError;
      });

      describe("with a status code", () => {
        beforeEach(() => {
          err.statusCode = 999;
          mockApiCalls["getTopArtists"].mockImplementationOnce(() =>
            Promise.reject(err)
          );
          instance = arrange(secretKey);
        });

        it("should embed the status code as expected", async () => {
          try {
            await instance.getTopArtists(username);
          } catch (receivedError) {
            expect((receivedError as ProxyError).message).toBe(
              `${err.message}`
            );
            expect((receivedError as ProxyError).clientStatusCode).toBe(
              err.statusCode
            );
          }
        });
      });

      describe("without a status code", () => {
        beforeEach(async () => {
          mockApiCalls["getTopArtists"].mockImplementationOnce(() =>
            Promise.reject(err)
          );
          instance = arrange(secretKey);
        });

        it("should embed the status code as expected", async () => {
          try {
            await instance.getTopArtists(username);
          } catch (receivedError) {
            expect((receivedError as ProxyError).message).toBe(
              `${err.message}`
            );
            expect(
              (receivedError as ProxyError).clientStatusCode
            ).toBeUndefined();
          }
        });
      });
    });
  });

  describe("getUserProfile", () => {
    let res: LastFMUserProfileInterface;

    describe("when the request is successful", () => {
      beforeEach(async () => {
        mockApiCalls["getInfo"].mockReturnValueOnce(
          Promise.resolve(JSON.parse(JSON.stringify(mockProfileResponse)))
        );
        instance = arrange(secretKey);
        res = await instance.getUserProfile(username);
      });

      it("should call the external library correctly", () => {
        expect(mockApiCalls["getInfo"]).toBeCalledTimes(1);
        expect(mockApiCalls["getInfo"]).toBeCalledWith({
          user: username,
        });
        expect(res).toStrictEqual({
          image: mockProfileResponse.user.image,
          playcount: parseInt(mockProfileResponse.user.playcount),
        });
      });
    });

    describe("when the request errors", () => {
      let err: LastFMExternalClientError;

      beforeEach(() => {
        err = new Error("Test Error") as LastFMExternalClientError;
      });

      describe("with a status code", () => {
        beforeEach(() => {
          err.statusCode = 999;
          mockApiCalls["getInfo"].mockImplementationOnce(() =>
            Promise.reject(err)
          );
          instance = arrange(secretKey);
        });

        it("should embed the status code as expected", async () => {
          try {
            await instance.getUserProfile(username);
          } catch (receivedError) {
            expect((receivedError as ProxyError).message).toBe(
              `${err.message}`
            );
            expect((receivedError as ProxyError).clientStatusCode).toBe(
              err.statusCode
            );
          }
        });
      });

      describe("without a status code", () => {
        beforeEach(() => {
          mockApiCalls["getInfo"].mockImplementationOnce(() =>
            Promise.reject(err)
          );
          instance = arrange(secretKey);
        });

        it("should embed the status code as expected", async () => {
          try {
            await instance.getUserProfile(username);
          } catch (receivedError) {
            expect((receivedError as ProxyError).message).toBe(
              `${err.message}`
            );
            expect(
              (receivedError as ProxyError).clientStatusCode
            ).toBeUndefined();
          }
        });
      });
    });
  });

  describe("getTopTracks", () => {
    let res: LastFMTrackDataInterface[];
    let mockImageUrl: string;

    describe("when the request is successful", () => {
      describe("with complete track information", () => {
        beforeEach(async () => {
          mockImageUrl = "http://not/a/real/image";
          mockApiCalls["getTopTracks"].mockReturnValueOnce(
            Promise.resolve(
              JSON.parse(JSON.stringify(mockTopTracksResponseComplete))
            )
          );
          MockCache.lookup.mockReturnValueOnce(mockImageUrl);
          instance = arrange(secretKey);
          res = await instance.getTopTracks(username);
        });

        it("should perform a cache lookup with the correct params", () => {
          expect(MockCache.lookup).toBeCalledTimes(1);
          expect(MockCache.lookup).toBeCalledWith(
            mockTopTracksResponseComplete.toptracks.track[0].artist.name
          );
        });

        it("should call the external library correctly", () => {
          expect(mockApiCalls["getTopTracks"]).toBeCalledTimes(1);
          expect(mockApiCalls["getTopTracks"]).toBeCalledWith({
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
          expect(MockCache.logCacheHitRate).toBeCalledTimes(1);
          expect(MockCache.logCacheHitRate).toBeCalledWith();
        });
      });

      describe("with incomplete track information", () => {
        beforeEach(async () => {
          mockImageUrl = "http://not/a/real/image";
          mockApiCalls["getTopTracks"].mockReturnValueOnce(
            Promise.resolve(
              JSON.parse(JSON.stringify(mockTopTracksResponseIncomplete))
            )
          );
          MockCache.lookup.mockReturnValueOnce(mockImageUrl);
          instance = arrange(secretKey);
          res = await instance.getTopTracks(username);
        });

        it("should perform a cache lookup with the correct params", () => {
          expect(MockCache.lookup).toBeCalledTimes(1);
          expect(MockCache.lookup).toBeCalledWith(undefined);
        });

        it("should call the external library correctly", () => {
          expect(mockApiCalls["getTopTracks"]).toBeCalledTimes(1);
          expect(mockApiCalls["getTopTracks"]).toBeCalledWith({
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
          expect(MockCache.logCacheHitRate).toBeCalledTimes(1);
          expect(MockCache.logCacheHitRate).toBeCalledWith();
        });
      });
    });

    describe("when the request errors", () => {
      let err: LastFMExternalClientError;

      beforeEach(() => {
        err = new Error("Test Error") as LastFMExternalClientError;
      });

      describe("with a status code", () => {
        beforeEach(() => {
          err.statusCode = 999;
          mockApiCalls["getTopTracks"].mockImplementationOnce(() =>
            Promise.reject(err)
          );
          instance = arrange(secretKey);
        });

        it("should embed the status code as expected", async () => {
          try {
            await instance.getTopTracks(username);
          } catch (receivedError) {
            expect((receivedError as ProxyError).message).toBe(
              `${err.message}`
            );
            expect((receivedError as ProxyError).clientStatusCode).toBe(
              err.statusCode
            );
          }
        });
      });

      describe("without a status code", () => {
        beforeEach(() => {
          mockApiCalls["getTopArtists"].mockImplementationOnce(() =>
            Promise.reject(err)
          );
          instance = arrange(secretKey);
        });

        it("should embed the status code as expected", async () => {
          try {
            await instance.getTopArtists(username);
          } catch (receivedError) {
            expect((receivedError as ProxyError).message).toBe(
              `${err.message}`
            );
            expect(
              (receivedError as ProxyError).clientStatusCode
            ).toBeUndefined();
          }
        });
      });
    });
  });
});
