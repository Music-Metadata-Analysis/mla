import LastFMProxy from "../proxy.class";

jest.mock("../client.class", () => {
  return jest.fn().mockImplementation(() => {
    return {
      getTopAlbums: mockGetTopAlbums,
      getTopArtists: mockGetTopArtists,
      getTopTracks: mockGetTopTracks,
      getUserProfile: mockGetUserProfile,
    };
  });
});

const mockGetTopAlbums = jest.fn();
const mockGetTopArtists = jest.fn();
const mockGetTopTracks = jest.fn();
const mockGetUserProfile = jest.fn();

describe("LastFMProxy", () => {
  let originalEnvironment: typeof process.env;
  const mockError = "Mock Error";
  const username = "testuser";
  const instance = new LastFMProxy();
  const mockProfileResponse = { image: [], playcount: 0 };
  let method: keyof LastFMProxy;

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

  const methodCall = () => {
    return instance[method](username);
  };

  describe("getTopAlbums", () => {
    beforeEach(() => {
      method = "getTopAlbums";
    });

    describe("when requests are successful", () => {
      beforeEach(() => {
        mockGetTopAlbums.mockReturnValueOnce(Promise.resolve([]));
        mockGetUserProfile.mockReturnValueOnce(
          Promise.resolve(mockProfileResponse)
        );
      });

      it("should return a valid response", async () => {
        const response = await methodCall();
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
        mockGetUserProfile.mockReturnValueOnce(Promise.resolve([]));
      });

      it("should throw an error", async () => {
        const test = async () => await methodCall();
        await expect(test).rejects.toThrow(mockError);
      });
    });

    describe("when getUserImage is unsuccessful", () => {
      beforeEach(() => {
        mockGetTopAlbums.mockReturnValueOnce(Promise.resolve([]));
        mockGetUserProfile.mockImplementationOnce(() =>
          Promise.reject(() => {
            throw new Error(mockError);
          })
        );
      });

      it("should throw an error", async () => {
        const test = async () => await methodCall();
        await expect(test).rejects.toThrow(mockError);
      });
    });
  });

  describe("getTopArtists", () => {
    beforeEach(() => {
      method = "getTopArtists";
    });

    describe("when requests are successful", () => {
      beforeEach(() => {
        mockGetTopArtists.mockReturnValueOnce(Promise.resolve([]));
        mockGetUserProfile.mockReturnValueOnce(
          Promise.resolve(mockProfileResponse)
        );
      });

      it("should return a valid response", async () => {
        const response = await methodCall();
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
        const test = async () => await methodCall();
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
        const test = async () => await methodCall();
        await expect(test).rejects.toThrow(mockError);
      });
    });
  });

  describe("getTopTracks", () => {
    beforeEach(() => {
      method = "getTopTracks";
    });

    describe("when requests are successful", () => {
      beforeEach(() => {
        mockGetTopTracks.mockReturnValueOnce(Promise.resolve([]));
        mockGetUserProfile.mockReturnValueOnce(
          Promise.resolve(mockProfileResponse)
        );
      });

      it("should return a valid response", async () => {
        const response = await methodCall();
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
        const test = async () => await methodCall();
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
        const test = async () => await methodCall();
        await expect(test).rejects.toThrow(mockError);
      });
    });
  });
});
