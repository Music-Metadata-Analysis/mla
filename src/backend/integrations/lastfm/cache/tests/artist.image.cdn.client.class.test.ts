import ArtistImageCdnClient from "../artist.image.cdn.client.class";
import ArtistImageScraper from "../artist.image.scraper.class";

jest.mock("../artist.image.scraper.class.ts", () =>
  jest.fn(() => ({
    getArtistImage: mockGetArtistImage,
  }))
);

const mockGetArtistImage = jest.fn();

describe(ArtistImageCdnClient.name, () => {
  const expectedCdnFolderPath = "lastfm/artists";
  const expectedScraperRetries = 2;
  const mockObjectName = "<mockObjectName>";
  const mockCdnHostname = "mockCdnHostname";
  const mockPersistanceClient = { write: jest.fn() };
  const mockHeaders = { get: jest.fn() };
  const originalConsoleLog = console.log;
  const mockConsoleLog = jest.fn();
  let instance: ArtistImageCdnClient;
  let mockFetch: jest.SpyInstance;
  let mockResponse: {
    status: number;
    headers: { get: () => string | undefined };
    ok: boolean;
    text: () => Promise<string>;
  };

  beforeAll(() => (mockFetch = jest.spyOn(window, "fetch")));

  afterAll(() => mockFetch.mockRestore());

  beforeEach(() => {
    jest.clearAllMocks();
    mockResponse = {
      status: 0,
      headers: mockHeaders,
      ok: false,
      text: () => Promise.resolve("defaultValue"),
    };
    (window.fetch as jest.Mock).mockResolvedValue(mockResponse);
  });

  const arrange = () =>
    (instance = new ArtistImageCdnClient(
      mockPersistanceClient,
      mockCdnHostname
    ));

  describe("when initialized", () => {
    beforeEach(() => arrange());

    it("should initialize the ArtistImageScraper", () => {
      expect(ArtistImageScraper).toBeCalledTimes(1);
      expect(ArtistImageScraper).toBeCalledWith();
    });

    describe("logCacheHitRate", () => {
      beforeEach(() => {
        console.log = mockConsoleLog;

        instance.logCacheHitRate();
      });

      afterEach(() => (console.log = originalConsoleLog));

      it("should NOT log when called without requests", () => {
        expect(mockConsoleLog).toBeCalledTimes(0);
      });
    });

    describe("query", () => {
      let result: string;

      describe("when the fetch response is 200", () => {
        beforeEach(() => {
          mockResponse.status = 200;
          mockResponse.ok = true;
        });

        describe("when the result is cached", () => {
          const response = "CachedResponse";

          beforeEach(async () => {
            mockHeaders.get.mockReturnValueOnce("Hit");
            mockResponse.text = () => Promise.resolve(response);

            result = await instance.query(mockObjectName);
          });

          it("should call fetch with the expected arguments", () => {
            expect(mockFetch).toBeCalledTimes(1);
            expect(mockFetch).toBeCalledWith(
              `https://${mockCdnHostname}/${expectedCdnFolderPath}/${encodeURI(
                mockObjectName
              )}`
            );
          });

          it("should return the deserialized cached response", () => {
            expect(result).toBe(`${response}`);
          });

          it("should NOT create a new object", () => {
            expect(mockGetArtistImage).toBeCalledTimes(0);
          });

          it("should NOT use the originServerClient", () => {
            expect(mockPersistanceClient.write).toBeCalledTimes(0);
          });

          describe("logCacheHitRate", () => {
            beforeEach(() => {
              console.log = mockConsoleLog;

              instance.logCacheHitRate();
            });

            afterEach(() => (console.log = originalConsoleLog));

            it("should log the correct cache hit rate", () => {
              expect(mockConsoleLog).toBeCalledTimes(1);
              expect(mockConsoleLog).toBeCalledWith(
                "[CloudFront] hit rate: 100.00%"
              );
            });
          });
        });

        describe("when the result is NOT cached", () => {
          const response = "CachedResponse";

          beforeEach(async () => {
            mockHeaders.get.mockReturnValueOnce(undefined);
            mockResponse.text = () => Promise.resolve(response);

            result = await instance.query(mockObjectName);
          });

          it("should call fetch with the expected arguments", () => {
            expect(mockFetch).toBeCalledTimes(1);
            expect(mockFetch).toBeCalledWith(
              `https://${mockCdnHostname}/${expectedCdnFolderPath}/${encodeURI(
                mockObjectName
              )}`
            );
          });

          it("should return the deserialized cached response", () => {
            expect(result).toBe(`${response}`);
          });

          it("should NOT create a new object", () => {
            expect(mockGetArtistImage).toBeCalledTimes(0);
          });

          it("should NOT use the originServerClient", () => {
            expect(mockPersistanceClient.write).toBeCalledTimes(0);
          });

          describe("logCacheHitRate", () => {
            beforeEach(() => {
              console.log = mockConsoleLog;

              instance.logCacheHitRate();
            });

            afterEach(() => (console.log = originalConsoleLog));

            it("should log the correct cache hit rate", () => {
              expect(mockConsoleLog).toBeCalledTimes(1);
              expect(mockConsoleLog).toBeCalledWith(
                "[CloudFront] hit rate: 0.00%"
              );
            });
          });
        });
      });

      describe("when the fetch response is 404", () => {
        beforeEach(async () => {
          mockResponse.status = 404;
          mockResponse.ok = false;
          mockResponse.text = () => Promise.resolve("Not Found.");
          mockGetArtistImage.mockResolvedValueOnce(`${mockObjectName}>Created`);

          result = await instance.query(mockObjectName);
        });

        it("should return the the scraper's response", () => {
          expect(result).toBe(`${mockObjectName}>Created`);
        });

        it("should create a new object with the scraper", () => {
          expect(mockGetArtistImage).toBeCalledTimes(1);
          expect(mockGetArtistImage).toBeCalledWith(
            mockObjectName,
            expectedScraperRetries
          );
        });

        it("should use the originServerClient", () => {
          expect(mockPersistanceClient.write).toBeCalledTimes(1);
          expect(mockPersistanceClient.write).toBeCalledWith(
            `${instance["cacheFolderName"]}/${mockObjectName}`,
            `${mockObjectName}>Created`,
            { ContentType: "text/plain" }
          );
        });

        describe("logCacheHitRate", () => {
          beforeEach(() => {
            console.log = mockConsoleLog;

            instance.logCacheHitRate();
          });

          afterEach(() => (console.log = originalConsoleLog));

          it("should log the correct cache hit rate", () => {
            expect(mockConsoleLog).toBeCalledTimes(1);
            expect(mockConsoleLog).toBeCalledWith(
              "[CloudFront] hit rate: 0.00%"
            );
          });
        });
      });
    });
  });
});
