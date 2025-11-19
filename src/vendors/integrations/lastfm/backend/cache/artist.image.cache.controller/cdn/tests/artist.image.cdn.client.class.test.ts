import LastFMArtistImageScraperInterface from "../../artist.image.scraper/artist.image.scraper";
import ArtistImageCdnClient from "../artist.image.cdn.client.class";

jest.mock("../../artist.image.scraper/artist.image.scraper");

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
      clone: () => Object.assign({}, mockResponse),
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
      expect(LastFMArtistImageScraperInterface).toHaveBeenCalledTimes(1);
      expect(LastFMArtistImageScraperInterface).toHaveBeenCalledWith();
    });

    describe("logCacheHitRate", () => {
      beforeEach(() => {
        instance.logCacheHitRate();
      });

      it("should NOT log when called before any queries", () => {
        expect(consoleLogSpy).toHaveBeenCalledTimes(0);
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
            expect(fetchSpy).toHaveBeenCalledTimes(1);
            expect(fetchSpy).toHaveBeenCalledWith(
              `https://${mockCdnHostname}/${expectedCdnFolderPath}/${encodeURI(
                mockObjectName
              )}`
            );
          });

          it("should return the deserialized cached response", () => {
            expect(result).toBe(`${response}`);
          });

          it("should NOT create a new object", () => {
            expect(
              jest.mocked(LastFMArtistImageScraperInterface).mock.instances[0]
                .scrape
            ).toHaveBeenCalledTimes(0);
          });

          it("should NOT use the originServerClient", () => {
            expect(mockPersistenceClient.write).toHaveBeenCalledTimes(0);
          });

          describe("logCacheHitRate", () => {
            beforeEach(() => {
              instance.logCacheHitRate();
            });

            it("should log the correct cache hit rate", () => {
              expect(consoleLogSpy).toHaveBeenCalledTimes(1);
              expect(consoleLogSpy).toHaveBeenCalledWith(
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
            expect(fetchSpy).toHaveBeenCalledTimes(1);
            expect(fetchSpy).toHaveBeenCalledWith(
              `https://${mockCdnHostname}/${expectedCdnFolderPath}/${encodeURI(
                mockObjectName
              )}`
            );
          });

          it("should return the deserialized cached response", () => {
            expect(result).toBe(`${response}`);
          });

          it("should NOT create a new object", () => {
            expect(
              jest.mocked(LastFMArtistImageScraperInterface).mock.instances[0]
                .scrape
            ).toHaveBeenCalledTimes(0);
          });

          it("should NOT use the originServerClient", () => {
            expect(mockPersistenceClient.write).toHaveBeenCalledTimes(0);
          });

          describe("logCacheHitRate", () => {
            beforeEach(() => {
              instance.logCacheHitRate();
            });

            it("should log the correct cache hit rate", () => {
              expect(consoleLogSpy).toHaveBeenCalledTimes(1);
              expect(consoleLogSpy).toHaveBeenCalledWith(
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
            .mocked(
              jest.mocked(LastFMArtistImageScraperInterface).mock.instances[0]
                .scrape
            )
            .mockResolvedValueOnce(`${mockObjectName}>Created`);

          result = await instance.query(mockObjectName);
        });

        it("should return the the scraper's response", () => {
          expect(result).toBe(`${mockObjectName}>Created`);
        });

        it("should create a new object with the scraper", () => {
          expect(
            jest.mocked(LastFMArtistImageScraperInterface).mock.instances[0]
              .scrape
          ).toHaveBeenCalledTimes(1);
          expect(
            jest.mocked(LastFMArtistImageScraperInterface).mock.instances[0]
              .scrape
          ).toHaveBeenCalledWith(mockObjectName, expectedScraperRetries);
        });

        it("should use the originServerClient", () => {
          expect(mockPersistenceClient.write).toHaveBeenCalledTimes(1);
          expect(mockPersistenceClient.write).toHaveBeenCalledWith(
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
            expect(consoleLogSpy).toHaveBeenCalledTimes(1);
            expect(consoleLogSpy).toHaveBeenCalledWith(
              "[CloudFront] hit rate: 0.00%"
            );
          });
        });
      });
    });
  });
});
