import LastFMClient from "../client.class";

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

describe("LastFMClient", () => {
  let secretKey: "123VerySecret";
  let username: "testuser";
  let mockTopAlbumsResponse = { topalbums: { album: "response" } };
  let mockInfoResponse = { user: { image: "response" } };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = (secretKey: string) => {
    return new LastFMClient(secretKey);
  };

  describe("when a user's top20 data is requested", () => {
    beforeEach(() => {
      mockApiCall.mockReturnValueOnce(Promise.resolve(mockTopAlbumsResponse));
    });

    it("should call the external library correctly", async () => {
      const instance = arrange(secretKey);
      const res = await instance.getTopAlbums(username);
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

  describe("when a user's profile data is requested", () => {
    beforeEach(() => {
      mockApiCall.mockReturnValueOnce(Promise.resolve(mockInfoResponse));
    });

    it("should call the external library correctly", async () => {
      const instance = arrange(secretKey);
      const res = await instance.getUserImage(username);
      expect(mockApiCall).toBeCalledTimes(1);
      expect(mockApiCall).toBeCalledWith({
        user: username,
      });
      expect(res).toBe(mockInfoResponse.user.image);
    });
  });
});
