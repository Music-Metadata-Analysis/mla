import LastFMClientAdapter from "../client.class";
import type { ProxyError } from "../../../errors/proxy.error.class";
import type {
  LastFMAlbumDataInterface,
  LastFMArtistDataInterface,
  LastFMImageDataInterface,
} from "../../../types/integrations/lastfm/api.types";
import type { LastFMExternalClientError } from "../../../types/integrations/lastfm/client.types";

jest.mock("@toplast/lastfm", () => {
  return jest.fn().mockImplementation(() => {
    return {
      user: mockApiCalls,
    };
  });
});

const mockApiCalls = {
  getTopAlbums: jest.fn(),
  getTopArtists: jest.fn(),
  getInfo: jest.fn(),
};

describe("LastFMClient", () => {
  let secretKey: "123VerySecret";
  let username: "testuser";
  const mockTopAlbumsResponse = { topalbums: { album: "response" } };
  const mockTopArtistsResponse = { topartists: { artist: "response" } };
  const mockProfileResponse = { user: { image: "response" } };
  let instance: LastFMClientAdapter;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = (secretKey: string) => {
    return new LastFMClientAdapter(secretKey);
  };

  describe("getTopAlbums", () => {
    let res: LastFMAlbumDataInterface[];

    describe("when the request is successful", () => {
      beforeEach(async () => {
        mockApiCalls["getTopAlbums"].mockReturnValueOnce(
          Promise.resolve(mockTopAlbumsResponse)
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
        beforeEach(async () => {
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
        beforeEach(async () => {
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

    describe("when the request is successful", () => {
      beforeEach(async () => {
        mockApiCalls["getTopArtists"].mockReturnValueOnce(
          Promise.resolve(mockTopArtistsResponse)
        );
        instance = arrange(secretKey);
      });

      it("should call the external library correctly", async () => {
        res = await instance.getTopArtists(username);
        expect(mockApiCalls["getTopArtists"]).toBeCalledTimes(1);
        expect(mockApiCalls["getTopArtists"]).toBeCalledWith({
          user: username,
          period: instance.reportPeriod,
          limit: instance.reportCount,
          page: 1,
        });
        expect(res).toBe(mockTopArtistsResponse.topartists.artist);
      });
    });

    describe("when the request errors", () => {
      let err: LastFMExternalClientError;

      beforeEach(() => {
        err = new Error("Test Error") as LastFMExternalClientError;
      });

      describe("with a status code", () => {
        beforeEach(async () => {
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

  describe("getUserImage", () => {
    let res: LastFMImageDataInterface[];

    describe("when the request is successful", () => {
      beforeEach(async () => {
        mockApiCalls["getInfo"].mockReturnValueOnce(
          Promise.resolve(mockProfileResponse)
        );
        instance = arrange(secretKey);
      });

      it("should call the external library correctly", async () => {
        res = await instance.getUserImage(username);
        expect(mockApiCalls["getInfo"]).toBeCalledTimes(1);
        expect(mockApiCalls["getInfo"]).toBeCalledWith({
          user: username,
        });
        expect(res).toBe(mockProfileResponse.user.image);
      });
    });

    describe("when the request errors", () => {
      let err: LastFMExternalClientError;

      beforeEach(() => {
        err = new Error("Test Error") as LastFMExternalClientError;
      });

      describe("with a status code", () => {
        beforeEach(async () => {
          err.statusCode = 999;
          mockApiCalls["getInfo"].mockImplementationOnce(() =>
            Promise.reject(err)
          );
          instance = arrange(secretKey);
        });

        it("should embed the status code as expected", async () => {
          try {
            await instance.getUserImage(username);
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
          mockApiCalls["getInfo"].mockImplementationOnce(() =>
            Promise.reject(err)
          );
          instance = arrange(secretKey);
        });

        it("should embed the status code as expected", async () => {
          try {
            await instance.getUserImage(username);
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
