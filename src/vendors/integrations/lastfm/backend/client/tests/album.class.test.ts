import LastFMAlbumClientAdapter from "../album.class";
import { mockVendorMethods } from "@src/__mocks__/@toplast/lastfm";
import type { RemoteServiceError } from "@src/contracts/api/types/services/generics/proxy/proxy.error.types";
import type { LastFMAlbumInfoInterface } from "@src/contracts/api/types/services/lastfm/responses/datapoints/album.info.types";
import type { LastFMVendorClientError } from "@src/vendors/types/integrations/lastfm/vendor.backend.types";

describe("LastFMAlbumClientAdapter", () => {
  const artist = "The Cure";
  const album = "Kiss Me, Kiss Me, Kiss Me";
  const secretKey = "123VerySecret";
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
        mockVendorMethods.album.getInfo.mockResolvedValueOnce(
          JSON.parse(JSON.stringify(mockAlbumInfo))
        );
        instance = arrange(secretKey);
      });

      it("should call the external library correctly", async () => {
        res = await instance.getInfo(artist, album, username);
        expect(mockVendorMethods.album.getInfo).toHaveBeenCalledTimes(1);
        expect(mockVendorMethods.album.getInfo).toHaveBeenCalledWith({
          artist,
          album,
          username,
        });
        expect(res).toStrictEqual(mockAlbumInfo.album);
      });
    });

    describe("when the request errors", () => {
      let err: LastFMVendorClientError;

      beforeEach(() => {
        err = new Error("Test Error") as LastFMVendorClientError;
        mockVendorMethods.album.getInfo.mockRejectedValueOnce(err);
      });

      describe("with a status code", () => {
        beforeEach(() => {
          err.statusCode = 999;
          instance = arrange(secretKey);
        });

        it("should embed the status code as expected", async () => {
          try {
            await instance.getInfo(artist, album, username);
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
            await instance.getInfo(artist, album, username);
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
