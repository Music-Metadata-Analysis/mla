import LastFMArtistClientAdapter from "../artist.class";
import type { ProxyError } from "../../../../../errors/proxy.error.class";
import type { LastFMArtistTopAlbumsInterface } from "../../../../../types/integrations/lastfm/api.types";
import type { LastFMExternalClientError } from "../../../../../types/integrations/lastfm/client.types";

jest.mock("@toplast/lastfm", () => {
  return jest.fn().mockImplementation(() => {
    return {
      artist: mockApiCalls,
    };
  });
});

const mockApiCalls = {
  getTopAlbums: jest.fn(),
};

describe("LastFMArtistClientAdapter", () => {
  const secretKey = "123VerySecret";
  const artist = "The Cure";
  const mockTopAlbumsResponse = { topalbums: { album: ["Disintegration"] } };
  let instance: LastFMArtistClientAdapter;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = (secretKey: string) => {
    return new LastFMArtistClientAdapter(secretKey);
  };

  describe("getTopAlbums", () => {
    let res: LastFMArtistTopAlbumsInterface[];

    describe("when the request is successful", () => {
      beforeEach(() => {
        mockApiCalls["getTopAlbums"].mockReturnValueOnce(
          Promise.resolve(JSON.parse(JSON.stringify(mockTopAlbumsResponse)))
        );
        instance = arrange(secretKey);
      });

      it("should call the external library correctly", async () => {
        res = await instance.getTopAlbums(artist);
        expect(mockApiCalls["getTopAlbums"]).toBeCalledTimes(1);
        expect(mockApiCalls["getTopAlbums"]).toBeCalledWith({
          artist,
          limit: instance.reportCount,
          page: 1,
        });
        expect(res).toStrictEqual(mockTopAlbumsResponse.topalbums.album);
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
            await instance.getTopAlbums(artist);
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
            await instance.getTopAlbums(artist);
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
