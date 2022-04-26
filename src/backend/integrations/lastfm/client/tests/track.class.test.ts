import LastFMTrackClientAdapter from "../track.class";
import type { ProxyError } from "../../../../../errors/proxy.error.class";
import type { LastFMTrackInfoInterface } from "../../../../../types/integrations/lastfm/api.types";
import type { LastFMExternalClientError } from "../../../../../types/integrations/lastfm/client.types";

jest.mock("@toplast/lastfm", () => {
  return jest.fn().mockImplementation(() => {
    return {
      track: mockApiCalls,
    };
  });
});

const mockApiCalls = {
  getInfo: jest.fn(),
};

describe("LastFMArtistClientAdapter", () => {
  const secretKey = "123VerySecret";
  const artist = "The Cure";
  const track = "Just Like Heaven";
  const username = "niall-byrne";
  const mockTrackInfo = { track: { album: "Kiss Me, Kiss Me, Kiss Me" } };
  let instance: LastFMTrackClientAdapter;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = (secretKey: string) => {
    return new LastFMTrackClientAdapter(secretKey);
  };

  describe("getInfo", () => {
    let res: LastFMTrackInfoInterface;

    describe("when the request is successful", () => {
      beforeEach(() => {
        mockApiCalls["getInfo"].mockReturnValueOnce(
          Promise.resolve(JSON.parse(JSON.stringify(mockTrackInfo)))
        );
        instance = arrange(secretKey);
      });

      it("should call the external library correctly", async () => {
        res = await instance.getInfo(artist, track, username);
        expect(mockApiCalls["getInfo"]).toBeCalledTimes(1);
        expect(mockApiCalls["getInfo"]).toBeCalledWith({
          artist,
          track,
          username,
        });
        expect(res).toStrictEqual(mockTrackInfo.track);
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
            await instance.getInfo(artist, track, username);
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
            await instance.getInfo(artist, track, username);
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
