import LastFMClient from "../client.class";
import type {
  LastFMAlbumDataInterface,
  LastFMImageDataInterface,
} from "../../../types/lastfm.types";

const mockApiCall = jest.fn();
jest.mock("@toplast/lastfm", () => {
  return jest.fn().mockImplementation(() => {
    return {
      user: {
        getTopAlbums: mockApiCall,
        getInfo: mockApiCall,
      },
    };
  });
});

type ClientResponse = { status: number };

interface ClientError extends Error {
  response: ClientResponse;
}

describe("LastFMClient", () => {
  let secretKey: "123VerySecret";
  let username: "testuser";
  let mockTopAlbumsResponse = { topalbums: { album: "response" } };
  let mockInfoResponse = { user: { image: "response" } };
  let instance: LastFMClient;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = (secretKey: string) => {
    return new LastFMClient(secretKey);
  };

  describe("when a user's top20 data is requested", () => {
    let res: LastFMAlbumDataInterface[];

    describe("when the request is successful", () => {
      beforeEach(async () => {
        mockApiCall.mockReturnValueOnce(Promise.resolve(mockTopAlbumsResponse));
        instance = arrange(secretKey);
      });

      it("should call the external library correctly", async () => {
        res = await instance.getTopAlbums(username);
        expect(mockApiCall).toBeCalledTimes(1);
        expect(mockApiCall).toBeCalledWith({
          user: username,
          period: instance.reportAlbumPeriod,
          limit: instance.reportAlbumCount,
          page: 1,
        });
        expect(res).toBe(mockTopAlbumsResponse.topalbums.album);
      });
    });

    describe("when the request errors", () => {
      let err: ClientError;

      beforeEach(() => {
        err = new Error("Test Error") as ClientError;
      });

      describe("with a status code", () => {
        beforeEach(async () => {
          err.response = { status: 999 };
          mockApiCall.mockImplementationOnce(() => Promise.reject(err));
          instance = arrange(secretKey);
        });

        it("should embed the status code as expected", async () => {
          try {
            await instance.getTopAlbums(username);
          } catch (receivedError) {
            expect(receivedError.message).toBe(`${err.message}`);
            expect(receivedError.clientStatusCode).toBe(err.response.status);
          }
        });
      });

      describe("without a status code", () => {
        beforeEach(async () => {
          mockApiCall.mockImplementationOnce(() => Promise.reject(err));
          instance = arrange(secretKey);
        });

        it("should embed the status code as expected", async () => {
          try {
            await instance.getTopAlbums(username);
          } catch (receivedError) {
            expect(receivedError.message).toBe(`${err.message}`);
          }
        });
      });
    });
  });

  describe("when a user's profile data is requested", () => {
    let res: LastFMImageDataInterface[];

    describe("when the request is successful", () => {
      beforeEach(async () => {
        mockApiCall.mockReturnValueOnce(Promise.resolve(mockInfoResponse));
        instance = arrange(secretKey);
      });

      it("should call the external library correctly", async () => {
        res = await instance.getUserImage(username);
        expect(mockApiCall).toBeCalledTimes(1);
        expect(mockApiCall).toBeCalledWith({
          user: username,
        });
        expect(res).toBe(mockInfoResponse.user.image);
      });
    });

    describe("when the request errors", () => {
      let err: ClientError;

      beforeEach(() => {
        err = new Error("Test Error") as ClientError;
      });

      describe("with a status code", () => {
        beforeEach(async () => {
          err.response = { status: 999 };
          mockApiCall.mockImplementationOnce(() => Promise.reject(err));
          instance = arrange(secretKey);
        });

        it("should embed the status code as expected", async () => {
          try {
            await instance.getUserImage(username);
          } catch (receivedError) {
            expect(receivedError.message).toBe(`${err.message}`);
            expect(receivedError.clientStatusCode).toBe(err.response.status);
          }
        });
      });

      describe("without a status code", () => {
        beforeEach(async () => {
          mockApiCall.mockImplementationOnce(() => Promise.reject(err));
          instance = arrange(secretKey);
        });

        it("should embed the status code as expected", async () => {
          try {
            await instance.getUserImage(username);
          } catch (receivedError) {
            expect(receivedError.message).toBe(`${err.message}`);
          }
        });
      });
    });
  });
});
