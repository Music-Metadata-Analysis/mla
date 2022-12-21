import ArtistImageCdnClient from "../artist.image.cdn.client.class";
import { mockArtistImageScraper } from "@src/backend/integrations/lastfm/__mocks__/vendor.mock";
import lastFMvendor from "@src/backend/integrations/lastfm/vendor";

jest.mock("@src/backend/integrations/lastfm/vendor");

describe(ArtistImageCdnClient.name, () => {
  let consoleLogSpy: jest.SpyInstance;
  let fetchSpy: jest.SpyInstance;
  let instance: ArtistImageCdnClient;
  let mockResponse: Response & { ok: boolean; status: number };

  const expectedCdnFolderPath = "lastfm/artists";
  const expectedScraperRetries = 2;

  const mockObjectName = "<mockObjectName>";
  const mockCdnHostname = "mockCdnHostname";
  const mockPersistenceClient = { write: jest.fn() };
  const mockHeaders = { get: jest.fn() };

  beforeAll(() => {
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => null);
    fetchSpy = jest.spyOn(window, "fetch");
  });

  afterAll(() => fetchSpy.mockRestore());

  beforeEach(() => {
    jest.clearAllMocks();
    mockResponse = {
      status: 0,
      headers: mockHeaders,
      ok: false,
      text: () => Promise.resolve("defaultValue"),
    } as unknown as Response;
    fetchSpy.mockResolvedValue(mockResponse);
  });

  const arrange = () =>
    (instance = new ArtistImageCdnClient(
      mockPersistenceClient,
      mockCdnHostname
    ));

  describe("when initialized", () => {
    beforeEach(() => arrange());

    it("should initialize the ArtistImageScraper", () => {
      expect(lastFMvendor.ArtistImageScraper).toBeCalledTimes(1);
      expect(lastFMvendor.ArtistImageScraper).toBeCalledWith();
    });

    describe("logCacheHitRate", () => {
      beforeEach(() => {
        instance.logCacheHitRate();
      });

      it("should NOT log when called before any queries", () => {
        expect(consoleLogSpy).toBeCalledTimes(0);
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
            expect(fetchSpy).toBeCalledTimes(1);
            expect(fetchSpy).toBeCalledWith(
              `https://${mockCdnHostname}/${expectedCdnFolderPath}/${encodeURI(
                mockObjectName
              )}`
            );
          });

          it("should return the deserialized cached response", () => {
            expect(result).toBe(`${response}`);
          });

          it("should NOT create a new object", () => {
            expect(mockArtistImageScraper.scrape).toBeCalledTimes(0);
          });

          it("should NOT use the originServerClient", () => {
            expect(mockPersistenceClient.write).toBeCalledTimes(0);
          });

          describe("logCacheHitRate", () => {
            beforeEach(() => {
              instance.logCacheHitRate();
            });

            it("should log the correct cache hit rate", () => {
              expect(consoleLogSpy).toBeCalledTimes(1);
              expect(consoleLogSpy).toBeCalledWith(
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
            expect(fetchSpy).toBeCalledTimes(1);
            expect(fetchSpy).toBeCalledWith(
              `https://${mockCdnHostname}/${expectedCdnFolderPath}/${encodeURI(
                mockObjectName
              )}`
            );
          });

          it("should return the deserialized cached response", () => {
            expect(result).toBe(`${response}`);
          });

          it("should NOT create a new object", () => {
            expect(mockArtistImageScraper.scrape).toBeCalledTimes(0);
          });

          it("should NOT use the originServerClient", () => {
            expect(mockPersistenceClient.write).toBeCalledTimes(0);
          });

          describe("logCacheHitRate", () => {
            beforeEach(() => {
              instance.logCacheHitRate();
            });

            it("should log the correct cache hit rate", () => {
              expect(consoleLogSpy).toBeCalledTimes(1);
              expect(consoleLogSpy).toBeCalledWith(
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
          jest
            .mocked(mockArtistImageScraper.scrape)
            .mockResolvedValueOnce(`${mockObjectName}>Created`);

          result = await instance.query(mockObjectName);
        });

        it("should return the the scraper's response", () => {
          expect(result).toBe(`${mockObjectName}>Created`);
        });

        it("should create a new object with the scraper", () => {
          expect(mockArtistImageScraper.scrape).toBeCalledTimes(1);
          expect(mockArtistImageScraper.scrape).toBeCalledWith(
            mockObjectName,
            expectedScraperRetries
          );
        });

        it("should use the originServerClient", () => {
          expect(mockPersistenceClient.write).toBeCalledTimes(1);
          expect(mockPersistenceClient.write).toBeCalledWith(
            `${instance["cacheFolderName"]}/${mockObjectName}`,
            `${mockObjectName}>Created`,
            { ContentType: "text/plain" }
          );
        });

        describe("logCacheHitRate", () => {
          beforeEach(() => {
            instance.logCacheHitRate();
          });

          it("should log the correct cache hit rate", () => {
            expect(consoleLogSpy).toBeCalledTimes(1);
            expect(consoleLogSpy).toBeCalledWith(
              "[CloudFront] hit rate: 0.00%"
            );
          });
        });
      });
    });
  });
});
