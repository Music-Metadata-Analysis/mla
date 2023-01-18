import LastFMAlbumClientAdapter from "../album.class";
import { mockVendorMethods } from "@src/__mocks__/@toplast/lastfm";
import type { ProxyError } from "@src/backend/api/services/lastfm/proxy/error/proxy.error.class";
import type { LastFMAlbumInfoInterface } from "@src/contracts/api/exports/lastfm/datapoint.types";
import type { LastFMVendorClientError } from "@src/vendors/types/integrations/lastfm/vendor.backend.types";

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
        mockVendorMethods.album.getInfo.mockResolvedValueOnce(
          JSON.parse(JSON.stringify(mockAlbumInfo))
        );
        instance = arrange(secretKey);
      });

      it("should call the external library correctly", async () => {
        res = await instance.getInfo(artist, album, username);
        expect(mockVendorMethods.album.getInfo).toBeCalledTimes(1);
        expect(mockVendorMethods.album.getInfo).toBeCalledWith({
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
