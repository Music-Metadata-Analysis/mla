import LastFMTrackClientAdapter from "../track.class";
import { mockVendorMethods } from "@src/__mocks__/@toplast/lastfm";
import type { RemoteServiceError } from "@src/contracts/api/types/services/generics/proxy/proxy.error.types";
import type { LastFMTrackInfoInterface } from "@src/contracts/api/types/services/lastfm/responses/datapoints/track.info.types";
import type { LastFMVendorClientError } from "@src/vendors/types/integrations/lastfm/vendor.backend.types";

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
        expect(mockVendorMethods.track.getInfo).toHaveBeenCalledTimes(1);
        expect(mockVendorMethods.track.getInfo).toHaveBeenCalledWith({
          artist,
          track,
          username,
        });
        expect(res).toStrictEqual(mockTrackInfo.track);
      });
    });

    describe("when the request errors", () => {
      let err: LastFMVendorClientError;

      beforeEach(() => {
        err = new Error("Test Error") as LastFMVendorClientError;
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
            await instance.getInfo(artist, track, username);
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
