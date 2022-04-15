import S3BaseCache from "../../s3/s3.base.cache.class";
import S3ArtistCache from "../s3.artist.cache.class";
import Scraper from "../scraper.class";

jest.mock("../scraper.class", () => jest.fn(() => MockScraper));

const MockScraper = {
  getArtistImage: jest.fn(),
};

describe("S3ArtistCache", () => {
  let instance: S3ArtistCache;
  let originalEnvironment: typeof process.env;
  const testString = "test string";
  const mockScraperResponse = "created artist";
  const mockFetchResponse = {
    status: 200,
    ok: true,
    text: async () => Promise.resolve(testString),
  };
  let actualScraperResponse: Promise<string>;

  beforeAll(() => {
    originalEnvironment = process.env;
    jest.spyOn(window, "fetch");
  });

  afterAll(() => jest.restoreAllMocks());

  beforeEach(() => {
    jest.clearAllMocks();
    setupEnv();
  });

  afterAll(() => {
    process.env = originalEnvironment;
  });

  const setupEnv = () => {
    process.env.LASTFM_CACHE_AWS_CLOUDFRONT_DOMAIN_NAME = "MockValue1";
  };

  const arrange = () => {
    instance = new S3ArtistCache(process.env.LASTFM_CACHE_AWS_S3_BUCKET_NAME);
  };

  it("should inherit from the S3BaseCache class", () => {
    S3ArtistCache.prototype instanceof S3BaseCache;
  });

  describe("when initialized", () => {
    beforeEach(() => {
      arrange();
    });

    it("should have the correct instance variables", () => {
      expect(instance.cloudFrontDomainName).toBe(
        process.env.LASTFM_CACHE_AWS_CLOUDFRONT_DOMAIN_NAME
      );
      expect(instance.cacheFolderName).toBe("lastfm/artists");
      expect(instance.cacheContentType).toBe("text/plain");
      expect(instance.scraper).toBe(MockScraper);
      expect(instance.scraperRetries).toBe(2);
      expect(instance.defaultResponse).toBe("");
    });

    it("should instantiate the Scraper correctly", () => {
      expect(Scraper).toBeCalledTimes(1);
      expect(Scraper).toBeCalledWith();
    });
  });

  describe("when stringifyObject is called on a string", () => {
    it("should return the string", () => {
      expect(instance.stringifyObject(testString)).toBe(testString);
    });
  });

  describe("when getResponseValue is called on a fetch response", () => {
    it("should return the output of the text method", async () => {
      expect(
        await instance.getResponseValue(mockFetchResponse as Response)
      ).toBe(testString);
    });
  });

  describe("when createEntry is called on an object", () => {
    beforeEach(() => {
      MockScraper.getArtistImage.mockImplementationOnce(() =>
        Promise.resolve(mockScraperResponse)
      );
      actualScraperResponse = instance.createEntry(testString);
    });

    it("should call the Scraper getArtistImage method", () => {
      expect(instance.scraper.getArtistImage).toBeCalledTimes(1);
      expect(instance.scraper.getArtistImage).toBeCalledWith(
        testString,
        instance.scraperRetries
      );
    });

    it("should return the Scraper getArtistImage's return value", async () => {
      expect(await actualScraperResponse).toBe(mockScraperResponse);
    });
  });
});
