import LastFMArtistClientAdapter from "../artist.class";
import { mockVendorMethods } from "@src/__mocks__/@toplast/lastfm";
import type { ProxyError } from "@src/backend/api/services/lastfm/proxy/error/proxy.error.class";
import type { LastFMArtistTopAlbumsInterface } from "@src/types/integrations/lastfm/api.types";
import type { LastFMExternalClientError } from "@src/types/integrations/lastfm/client.types";

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
        mockVendorMethods.artist.getTopAlbums.mockResolvedValueOnce(
          JSON.parse(JSON.stringify(mockTopAlbumsResponse))
        );
        instance = arrange(secretKey);
      });

      it("should call the external library correctly", async () => {
        res = await instance.getTopAlbums(artist);
        expect(mockVendorMethods.artist.getTopAlbums).toBeCalledTimes(1);
        expect(mockVendorMethods.artist.getTopAlbums).toBeCalledWith({
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
        mockVendorMethods.artist.getTopAlbums.mockRejectedValueOnce(err);
      });

      describe("with a status code", () => {
        beforeEach(async () => {
          err.statusCode = 999;
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
