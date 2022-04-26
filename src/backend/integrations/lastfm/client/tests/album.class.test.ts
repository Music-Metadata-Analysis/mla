import LastFMAlbumClientAdapter from "../album.class";
import type { ProxyError } from "../../../../../errors/proxy.error.class";
import type { LastFMAlbumInfoInterface } from "../../../../../types/integrations/lastfm/api.types";
import type { LastFMExternalClientError } from "../../../../../types/integrations/lastfm/client.types";

jest.mock("@toplast/lastfm", () => {
  return jest.fn().mockImplementation(() => {
    return {
      album: mockApiCalls,
    };
  });
});

const mockApiCalls = {
  getInfo: jest.fn(),
};

describe("LastFMAlbumClientAdapter", () => {
  let secretKey: "123VerySecret";
  const artist = "The Cure";
  const album = "Kiss Me, Kiss Me, Kiss Me";
  const username = "niall-byrne";
  const mockAlbumInfo = { album: { track: ["Just Like Heaven"] } };
  let instance: LastFMAlbumClientAdapter;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = (secretKey: string) => {
    return new LastFMAlbumClientAdapter(secretKey);
  };

  describe("getInfo", () => {
    let res: LastFMAlbumInfoInterface;

    describe("when the request is successful", () => {
      beforeEach(() => {
        mockApiCalls["getInfo"].mockReturnValueOnce(
          Promise.resolve(JSON.parse(JSON.stringify(mockAlbumInfo)))
        );
        instance = arrange(secretKey);
      });

      it("should call the external library correctly", async () => {
        res = await instance.getInfo(artist, album, username);
        expect(mockApiCalls["getInfo"]).toBeCalledTimes(1);
        expect(mockApiCalls["getInfo"]).toBeCalledWith({
          artist,
          album,
          username,
        });
        expect(res).toStrictEqual(mockAlbumInfo.album);
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
            await instance.getInfo(artist, album, username);
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
            await instance.getInfo(artist, album, username);
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
