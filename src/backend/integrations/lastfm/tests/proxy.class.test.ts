import LastFMProxy from "../proxy.class";

jest.mock("../client/album.class", () => {
  return jest.fn().mockImplementation(() => {
    return {
      getInfo: mockGetInfo,
    };
  });
});

jest.mock("../client/artist.class", () => {
  return jest.fn().mockImplementation(() => {
    return {
      getTopAlbums: mockGetTopAlbums,
    };
  });
});

jest.mock("../client/track.class", () => {
  return jest.fn().mockImplementation(() => {
    return {
      getInfo: mockGetInfo,
    };
  });
});

jest.mock("../client/user.class", () => {
  return jest.fn().mockImplementation(() => {
    return {
      getTopAlbums: mockGetTopAlbums,
      getTopArtists: mockGetTopArtists,
      getTopTracks: mockGetTopTracks,
      getUserProfile: mockGetUserProfile,
    };
  });
});

const mockGetInfo = jest.fn();
const mockGetTopAlbums = jest.fn();
const mockGetTopArtists = jest.fn();
const mockGetTopTracks = jest.fn();
const mockGetUserProfile = jest.fn();

describe("LastFMProxy", () => {
  let originalEnvironment: typeof process.env;
  const mockError = "Mock Error";
  const username = "testuser";
  const artist = "The Cure";
  const album = "Wish";
  const track = "Open";
  const instance = new LastFMProxy();
  const mockProfileResponse = { image: [], playcount: 0 };
  const mockInfoResponse = { info: "mocked information" };
  const mockTopAlbumsResponse = { albums: "Top albums" };
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
  });

  afterAll(() => {
    process.env = originalEnvironment;
  });

  const artistMethodCall = () => {
    return instance[artistMethods](artist);
  };

  const albumMethodCall = () => {
    return instance[albumMethods](artist, album, username);
  };

  const trackMethodCall = () => {
    return instance[trackMethods](artist, track, username);
  };

  const userMethodCall = () => {
    return instance[userMethods](username);
  };

  describe("getAlbumInfo", () => {
    beforeEach(() => {
      albumMethods = "getAlbumInfo";
    });

    describe("when requests are successful", () => {
      beforeEach(() => {
        mockGetInfo.mockReturnValueOnce(Promise.resolve(mockInfoResponse));
      });

      it("should return a valid response", async () => {
        const response = await albumMethodCall();
        expect(mockGetInfo).toBeCalledTimes(1);
        expect(mockGetInfo).toBeCalledWith(artist, album, username);
        expect(response).toStrictEqual(mockInfoResponse);
      });
    });

    describe("when getInfo is unsuccessful", () => {
      beforeEach(() => {
        mockGetInfo.mockImplementationOnce(() =>
          Promise.reject(() => {
            throw new Error(mockError);
          })
        );
      });

      it("should throw an error", async () => {
        const test = async () => await albumMethodCall();
        await expect(test).rejects.toThrow(mockError);
      });
    });
  });

  describe("getArtistTopAlbums", () => {
    beforeEach(() => {
      artistMethods = "getArtistTopAlbums";
    });

    describe("when requests are successful", () => {
      beforeEach(() => {
        mockGetTopAlbums.mockReturnValueOnce(
          Promise.resolve(mockTopAlbumsResponse)
        );
      });

      it("should return a valid response", async () => {
        const response = await artistMethodCall();
        expect(mockGetTopAlbums).toBeCalledTimes(1);
        expect(mockGetTopAlbums).toBeCalledWith(artist);
        expect(response).toStrictEqual(mockTopAlbumsResponse);
      });
    });

    describe("when getTopAlbums is unsuccessful", () => {
      beforeEach(() => {
        mockGetTopAlbums.mockImplementationOnce(() =>
          Promise.reject(() => {
            throw new Error(mockError);
          })
        );
      });

      it("should throw an error", async () => {
        const test = async () => await artistMethodCall();
        await expect(test).rejects.toThrow(mockError);
      });
    });
  });

  describe("getTrackInfo", () => {
    beforeEach(() => {
      trackMethods = "getTrackInfo";
    });

    describe("when requests are successful", () => {
      beforeEach(() => {
        mockGetInfo.mockReturnValueOnce(Promise.resolve(mockInfoResponse));
      });

      it("should return a valid response", async () => {
        const response = await trackMethodCall();
        expect(mockGetInfo).toBeCalledTimes(1);
        expect(mockGetInfo).toBeCalledWith(artist, track, username);
        expect(response).toStrictEqual(mockInfoResponse);
      });
    });

    describe("when getInfo is unsuccessful", () => {
      beforeEach(() => {
        mockGetInfo.mockImplementationOnce(() =>
          Promise.reject(() => {
            throw new Error(mockError);
          })
        );
      });

      it("should throw an error", async () => {
        const test = async () => await trackMethodCall();
        await expect(test).rejects.toThrow(mockError);
      });
    });
  });

  describe("getUserTopAlbums", () => {
    beforeEach(() => {
      userMethods = "getUserTopAlbums";
    });

    describe("when requests are successful", () => {
      beforeEach(() => {
        mockGetTopAlbums.mockReturnValueOnce(Promise.resolve([]));
        mockGetUserProfile.mockReturnValueOnce(
          Promise.resolve(mockProfileResponse)
        );
      });

      it("should return a valid response", async () => {
        const response = await userMethodCall();
        expect(mockGetTopAlbums).toBeCalledTimes(1);
        expect(mockGetTopAlbums).toBeCalledWith(username);
        expect(mockGetUserProfile).toBeCalledTimes(1);
        expect(mockGetUserProfile).toBeCalledWith(username);
        expect(response).toStrictEqual({
          albums: [],
          image: mockProfileResponse.image,
          playcount: mockProfileResponse.playcount,
        });
      });
    });

    describe("when getTopAlbums is unsuccessful", () => {
      beforeEach(() => {
        mockGetTopAlbums.mockImplementationOnce(() =>
          Promise.reject(() => {
            throw new Error(mockError);
          })
        );
        mockGetUserProfile.mockReturnValueOnce(
          Promise.resolve(mockTopAlbumsResponse)
        );
      });

      it("should throw an error", async () => {
        const test = async () => await userMethodCall();
        await expect(test).rejects.toThrow(mockError);
      });
    });

    describe("when getUserImage is unsuccessful", () => {
      beforeEach(() => {
        mockGetTopAlbums.mockReturnValueOnce(
          Promise.resolve(mockTopAlbumsResponse)
        );
        mockGetUserProfile.mockImplementationOnce(() =>
          Promise.reject(() => {
            throw new Error(mockError);
          })
        );
      });

      it("should throw an error", async () => {
        const test = async () => await userMethodCall();
        await expect(test).rejects.toThrow(mockError);
      });
    });
  });

  describe("getUserTopArtists", () => {
    beforeEach(() => {
      userMethods = "getUserTopArtists";
    });

    describe("when requests are successful", () => {
      beforeEach(() => {
        mockGetTopArtists.mockReturnValueOnce(Promise.resolve([]));
        mockGetUserProfile.mockReturnValueOnce(
          Promise.resolve(mockProfileResponse)
        );
      });

      it("should return a valid response", async () => {
        const response = await userMethodCall();
        expect(mockGetTopArtists).toBeCalledTimes(1);
        expect(mockGetTopArtists).toBeCalledWith(username);
        expect(mockGetUserProfile).toBeCalledTimes(1);
        expect(mockGetUserProfile).toBeCalledWith(username);
        expect(response).toStrictEqual({
          artists: [],
          image: mockProfileResponse.image,
          playcount: mockProfileResponse.playcount,
        });
      });
    });

    describe("when getTopArtists is unsuccessful", () => {
      beforeEach(() => {
        mockGetTopArtists.mockImplementationOnce(() =>
          Promise.reject(() => {
            throw new Error(mockError);
          })
        );
        mockGetUserProfile.mockReturnValueOnce(Promise.resolve([]));
      });

      it("should throw an error", async () => {
        const test = async () => await userMethodCall();
        await expect(test).rejects.toThrow(mockError);
      });
    });

    describe("when getUserImage is unsuccessful", () => {
      beforeEach(() => {
        mockGetTopArtists.mockReturnValueOnce(Promise.resolve([]));
        mockGetUserProfile.mockImplementationOnce(() =>
          Promise.reject(() => {
            throw new Error(mockError);
          })
        );
      });

      it("should throw an error", async () => {
        const test = async () => await userMethodCall();
        await expect(test).rejects.toThrow(mockError);
      });
    });
  });

  describe("getUserTopTracks", () => {
    beforeEach(() => {
      userMethods = "getUserTopTracks";
    });

    describe("when requests are successful", () => {
      beforeEach(() => {
        mockGetTopTracks.mockReturnValueOnce(Promise.resolve([]));
        mockGetUserProfile.mockReturnValueOnce(
          Promise.resolve(mockProfileResponse)
        );
      });

      it("should return a valid response", async () => {
        const response = await userMethodCall();
        expect(mockGetTopTracks).toBeCalledTimes(1);
        expect(mockGetTopTracks).toBeCalledWith(username);
        expect(mockGetUserProfile).toBeCalledTimes(1);
        expect(mockGetUserProfile).toBeCalledWith(username);
        expect(response).toStrictEqual({
          tracks: [],
          image: mockProfileResponse.image,
          playcount: mockProfileResponse.playcount,
        });
      });
    });

    describe("when getTopTracks is unsuccessful", () => {
      beforeEach(() => {
        mockGetTopTracks.mockImplementationOnce(() =>
          Promise.reject(() => {
            throw new Error(mockError);
          })
        );
        mockGetUserProfile.mockReturnValueOnce(Promise.resolve([]));
      });

      it("should throw an error", async () => {
        const test = async () => await userMethodCall();
        await expect(test).rejects.toThrow(mockError);
      });
    });

    describe("when getUserImage is unsuccessful", () => {
      beforeEach(() => {
        mockGetTopTracks.mockReturnValueOnce(Promise.resolve([]));
        mockGetUserProfile.mockImplementationOnce(() =>
          Promise.reject(() => {
            throw new Error(mockError);
          })
        );
      });

      it("should throw an error", async () => {
        const test = async () => await userMethodCall();
        await expect(test).rejects.toThrow(mockError);
      });
    });
  });
});
