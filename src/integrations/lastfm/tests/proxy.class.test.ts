import LastFMProxy from "../proxy.class";

jest.mock("../client.class", () => {
  return jest.fn().mockImplementation(() => {
    return {
      getTopAlbums: mockGetTopAlbums,
      getUserImage: mockGetUserImage,
    };
  });
});

const mockGetTopAlbums = jest.fn();
const mockGetUserImage = jest.fn();

describe("LastFMProxy", () => {
  let originalEnvironment: typeof process.env;
  const mockError = "Mock Error";
  const username = "testuser";
  const instance = new LastFMProxy();

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

  describe("getTop20Response", () => {
    describe("when requests are successful", () => {
      beforeEach(() => {
        mockGetTopAlbums.mockReturnValueOnce(Promise.resolve([]));
        mockGetUserImage.mockReturnValueOnce(Promise.resolve([]));
      });

      it("should return a valid response", async () => {
        const response = await instance.getTopAlbums(username);
        expect(mockGetTopAlbums).toBeCalledTimes(1);
        expect(mockGetTopAlbums).toBeCalledWith(username);
        expect(mockGetUserImage).toBeCalledTimes(1);
        expect(mockGetUserImage).toBeCalledWith(username);
        expect(response).toStrictEqual({ albums: [], image: [] });
      });
    });

    describe("when getTop20 is unsuccessful", () => {
      beforeEach(() => {
        mockGetTopAlbums.mockImplementationOnce(() => {
          throw new Error(mockError);
        });
        mockGetUserImage.mockReturnValueOnce(Promise.resolve([]));
      });

      it("should throw an error", async () => {
        const test = async () => instance.getTopAlbums(username);
        expect(test).rejects.toThrow(mockError);
      });
    });

    describe("when getUserImage is unsuccessful", () => {
      beforeEach(() => {
        mockGetUserImage.mockImplementationOnce(() => {
          throw new Error(mockError);
        });
        mockGetTopAlbums.mockReturnValueOnce(Promise.resolve([]));
      });

      it("should throw an error", async () => {
        const test = async () => instance.getTopAlbums(username);
        instance.getTopAlbums(username);
        expect(test).rejects.toThrow(mockError);
      });
    });
  });
});
