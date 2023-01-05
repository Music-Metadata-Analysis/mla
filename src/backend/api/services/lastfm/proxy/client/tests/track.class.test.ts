import LastFMTrackClientAdapter from "../track.class";
import { mockVendorMethods } from "@src/__mocks__/@toplast/lastfm";
import type { ProxyError } from "@src/backend/api/services/lastfm/proxy/error/proxy.error.class";
import type { LastFMTrackInfoInterface } from "@src/contracts/api/exports/lastfm/datapoint.types";
import type { LastFMExternalClientError } from "@src/types/integrations/lastfm/client.types";

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
        mockVendorMethods.track.getInfo.mockResolvedValueOnce(
          JSON.parse(JSON.stringify(mockTrackInfo))
        );
        instance = arrange(secretKey);
      });

      it("should call the external library correctly", async () => {
        res = await instance.getInfo(artist, track, username);
        expect(mockVendorMethods.track.getInfo).toBeCalledTimes(1);
        expect(mockVendorMethods.track.getInfo).toBeCalledWith({
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
        mockVendorMethods.track.getInfo.mockRejectedValueOnce(err);
      });

      describe("with a status code", () => {
        beforeEach(() => {
          err.statusCode = 999;
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
