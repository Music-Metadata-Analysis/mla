import LastFMProxy from "../proxy.class";
import { lastFMVendorBackend } from "@src/vendors/integrations/lastfm/vendor.backend";

jest.mock("@src/vendors/integrations/lastfm/vendor.backend");

describe("LastFMProxy", () => {
  let originalEnvironment: typeof process.env;
  const mockError = "Mock Error";
  const username = "testuser";
  const artist = "The Cure";
  const album = "Wish";
  const track = "Open";
  const mockProfileResponse = { image: [], playcount: 0 };
  const mockInfoResponse = { info: "mocked information" };
  const mockTopAlbumsResponse = { albums: "Top albums" };
  const mockTopArtistsResponse = { artists: "Top artists" };
  const mockTopTracksResponse = { artists: "Top tracks" };
  let underlyingClientMock1: jest.SpyInstance;
  let underlyingClientMock2: jest.SpyInstance;
  let instance: LastFMProxy;
  let artistMethods: "getArtistTopAlbums";
  let albumMethods: "getAlbumInfo";
  let trackMethods: "getTrackInfo";
  let userMethods:
    | "getUserTopAlbums"
    | "getUserTopArtists"
    | "getUserTopTracks";

  beforeAll(() => {
    originalEnvironment = process.env;
    process.env.LAST_FM_KEY = "random key";
  });

  beforeEach(() => {
    jest.clearAllMocks();
    instance = new LastFMProxy();
  });

  afterAll(() => {
    process.env = originalEnvironment;
  });

  const actArtistMethodCall = () => {
    return instance[artistMethods](artist);
  };

  const actAlbumMethodCall = () => {
    return instance[albumMethods](artist, album, username);
  };

  const actTrackMethodCall = () => {
    return instance[trackMethods](artist, track, username);
  };

  const actUserMethodCall = () => {
    return instance[userMethods](username);
  };

  const arrangeSuccess = (spy: jest.SpyInstance, response: unknown) =>
    spy.mockResolvedValueOnce(response);

  const arrangeFail = (spy: jest.SpyInstance) =>
    spy.mockRejectedValueOnce(new Error(mockError));

  describe("getAlbumInfo", () => {
    beforeEach(() => {
      albumMethods = "getAlbumInfo";
      underlyingClientMock1 = lastFMVendorBackend.AlbumClient.prototype.getInfo;
    });

    describe("when all requests are successful", () => {
      beforeEach(() => arrangeSuccess(underlyingClientMock1, mockInfoResponse));

      it("should return a valid response", async () => {
        const response = await actAlbumMethodCall();

        expect(underlyingClientMock1).toHaveBeenCalledTimes(1);
        expect(underlyingClientMock1).toHaveBeenCalledWith(
          artist,
          album,
          username
        );
        expect(response).toStrictEqual(mockInfoResponse);
      });
    });

    describe("when getInfo is unsuccessful", () => {
      beforeEach(() => arrangeFail(underlyingClientMock1));

      it("should throw an error", async () => {
        const test = async () => await actAlbumMethodCall();

        await expect(test).rejects.toThrow(mockError);
      });
    });
  });

  describe("getArtistTopAlbums", () => {
    beforeEach(() => {
      artistMethods = "getArtistTopAlbums";
      underlyingClientMock1 =
        lastFMVendorBackend.ArtistClient.prototype.getTopAlbums;
    });

    describe("when requests are successful", () => {
      beforeEach(() =>
        arrangeSuccess(underlyingClientMock1, mockTopAlbumsResponse)
      );

      it("should return a valid response", async () => {
        const response = await actArtistMethodCall();

        expect(underlyingClientMock1).toHaveBeenCalledTimes(1);
        expect(underlyingClientMock1).toHaveBeenCalledWith(artist);
        expect(response).toStrictEqual(mockTopAlbumsResponse);
      });
    });

    describe("when getTopAlbums is unsuccessful", () => {
      beforeEach(() => arrangeFail(underlyingClientMock1));

      it("should throw an error", async () => {
        const test = async () => await actArtistMethodCall();

        await expect(test).rejects.toThrow(mockError);
      });
    });
  });

  describe("getTrackInfo", () => {
    beforeEach(() => {
      trackMethods = "getTrackInfo";
      underlyingClientMock1 = lastFMVendorBackend.TrackClient.prototype.getInfo;
    });

    describe("when requests are successful", () => {
      beforeEach(() => arrangeSuccess(underlyingClientMock1, mockInfoResponse));

      it("should return a valid response", async () => {
        const response = await actTrackMethodCall();

        expect(underlyingClientMock1).toHaveBeenCalledTimes(1);
        expect(underlyingClientMock1).toHaveBeenCalledWith(
          artist,
          track,
          username
        );
        expect(response).toStrictEqual(mockInfoResponse);
      });
    });

    describe("when getInfo is unsuccessful", () => {
      beforeEach(() => arrangeFail(underlyingClientMock1));

      it("should throw an error", async () => {
        const test = async () => await actTrackMethodCall();

        await expect(test).rejects.toThrow(mockError);
      });
    });
  });

  describe("getUserTopAlbums", () => {
    beforeEach(() => {
      userMethods = "getUserTopAlbums";
      underlyingClientMock1 =
        lastFMVendorBackend.UserClient.prototype.getTopAlbums;
      underlyingClientMock2 =
        lastFMVendorBackend.UserClient.prototype.getUserProfile;
    });

    describe("when requests are successful", () => {
      beforeEach(() => {
        arrangeSuccess(underlyingClientMock1, mockTopAlbumsResponse);
        arrangeSuccess(underlyingClientMock2, mockProfileResponse);
      });

      it("should return a valid response", async () => {
        const response = await actUserMethodCall();
        expect(underlyingClientMock1).toHaveBeenCalledTimes(1);
        expect(underlyingClientMock1).toHaveBeenCalledWith(username);
        expect(underlyingClientMock2).toHaveBeenCalledTimes(1);
        expect(underlyingClientMock2).toHaveBeenCalledWith(username);
        expect(response).toStrictEqual({
          albums: mockTopAlbumsResponse,
          image: mockProfileResponse.image,
          playcount: mockProfileResponse.playcount,
        });
      });
    });

    describe("when getTopAlbums is unsuccessful", () => {
      beforeEach(() => {
        arrangeFail(underlyingClientMock1);
        arrangeSuccess(underlyingClientMock2, mockProfileResponse);
      });

      it("should throw an error", async () => {
        const test = async () => await actUserMethodCall();
        await expect(test).rejects.toThrow(mockError);
      });
    });

    describe("when getUserImage is unsuccessful", () => {
      beforeEach(() => {
        arrangeSuccess(underlyingClientMock1, mockTopAlbumsResponse);
        arrangeFail(underlyingClientMock2);
      });

      it("should throw an error", async () => {
        const test = async () => await actUserMethodCall();
        await expect(test).rejects.toThrow(mockError);
      });
    });
  });

  describe("getUserTopArtists", () => {
    beforeEach(() => {
      userMethods = "getUserTopArtists";
      underlyingClientMock1 =
        lastFMVendorBackend.UserClient.prototype.getTopArtists;
      underlyingClientMock2 =
        lastFMVendorBackend.UserClient.prototype.getUserProfile;
    });

    describe("when requests are successful", () => {
      beforeEach(() => {
        arrangeSuccess(underlyingClientMock1, mockTopArtistsResponse);
        arrangeSuccess(underlyingClientMock2, mockProfileResponse);
      });

      it("should return a valid response", async () => {
        const response = await actUserMethodCall();
        expect(underlyingClientMock1).toHaveBeenCalledTimes(1);
        expect(underlyingClientMock1).toHaveBeenCalledWith(username);
        expect(underlyingClientMock2).toHaveBeenCalledTimes(1);
        expect(underlyingClientMock2).toHaveBeenCalledWith(username);
        expect(response).toStrictEqual({
          artists: mockTopArtistsResponse,
          image: mockProfileResponse.image,
          playcount: mockProfileResponse.playcount,
        });
      });
    });

    describe("when getTopArtists is unsuccessful", () => {
      beforeEach(() => {
        arrangeFail(underlyingClientMock1);
        arrangeSuccess(underlyingClientMock2, mockProfileResponse);
      });

      it("should throw an error", async () => {
        const test = async () => await actUserMethodCall();
        await expect(test).rejects.toThrow(mockError);
      });
    });

    describe("when getUserImage is unsuccessful", () => {
      beforeEach(() => {
        arrangeSuccess(underlyingClientMock1, mockTopArtistsResponse);
        arrangeFail(underlyingClientMock2);
      });

      it("should throw an error", async () => {
        const test = async () => await actUserMethodCall();
        await expect(test).rejects.toThrow(mockError);
      });
    });
  });

  describe("getUserTopTracks", () => {
    beforeEach(() => {
      userMethods = "getUserTopTracks";
      underlyingClientMock1 =
        lastFMVendorBackend.UserClient.prototype.getTopTracks;
      underlyingClientMock2 =
        lastFMVendorBackend.UserClient.prototype.getUserProfile;
    });

    describe("when requests are successful", () => {
      beforeEach(() => {
        arrangeSuccess(underlyingClientMock1, mockTopTracksResponse);
        arrangeSuccess(underlyingClientMock2, mockProfileResponse);
      });

      it("should return a valid response", async () => {
        const response = await actUserMethodCall();
        expect(underlyingClientMock1).toHaveBeenCalledTimes(1);
        expect(underlyingClientMock1).toHaveBeenCalledWith(username);
        expect(underlyingClientMock2).toHaveBeenCalledTimes(1);
        expect(underlyingClientMock2).toHaveBeenCalledWith(username);
        expect(response).toStrictEqual({
          tracks: mockTopTracksResponse,
          image: mockProfileResponse.image,
          playcount: mockProfileResponse.playcount,
        });
      });
    });

    describe("when getTopTracks is unsuccessful", () => {
      beforeEach(() => {
        arrangeFail(underlyingClientMock1);
        arrangeSuccess(underlyingClientMock2, mockProfileResponse);
      });

      it("should throw an error", async () => {
        const test = async () => await actUserMethodCall();
        await expect(test).rejects.toThrow(mockError);
      });
    });

    describe("when getUserImage is unsuccessful", () => {
      beforeEach(() => {
        arrangeSuccess(underlyingClientMock1, mockTopTracksResponse);
        arrangeFail(underlyingClientMock2);
      });

      it("should throw an error", async () => {
        const test = async () => await actUserMethodCall();
        await expect(test).rejects.toThrow(mockError);
      });
    });
  });
});
