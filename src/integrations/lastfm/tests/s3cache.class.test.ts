import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import S3Cache from "../s3cache.class";
import Scraper from "../scraper.class";

jest.mock("@aws-sdk/client-s3", () => {
  return {
    S3Client: jest.fn(() => MockS3Client),
    PutObjectCommand: jest.fn(() => MockBucketCommand),
  };
});

jest.mock("../scraper.class", () => jest.fn(() => MockScraper));

const MockS3Client = {
  send: jest.fn(async () => null),
};

const MockBucketCommand = { MockCommand: "MockCommand" };

const MockScraper = {
  getArtistImage: jest.fn(),
};

describe("S3Cache", () => {
  let instance: S3Cache;
  let originalEnvironment: typeof process.env;
  const cacheResponse = "http://cached/url";
  let response: Promise<string>;
  let mockArtistName: string | undefined;
  const mockImage = "http://link/to/image.jpg";

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
    process.env.LASTFM_CACHE_AWS_ACCESS_KEY_ID = "MockValue1";
    process.env.LASTFM_CACHE_AWS_SECRET_ACCESS_KEY = "MockValue2";
    process.env.LASTFM_CACHE_AWS_REGION = "MockValue3";
    process.env.LASTFM_CACHE_AWS_S3_BUCKET_NAME = "MockValue4";
    process.env.LASTFM_CACHE_AWS_CLOUDFRONT_DOMAIN_NAME = "MockValue5";
  };

  const setupFetch = ({
    success,
    status,
  }: {
    success: boolean;
    status: number;
  }) => {
    (window.fetch as jest.Mock).mockResolvedValue({
      status,
      ok: success,
      text: async () => cacheResponse,
    });
  };

  const arrange = () => {
    instance = new S3Cache();
  };

  describe("when initialized", () => {
    beforeEach(() => {
      arrange();
    });

    it("should have the correct instance variables", () => {
      expect(instance.awsRegion).toBe(process.env.LASTFM_CACHE_AWS_REGION);
      expect(instance.cacheBucketName).toBe(
        process.env.LASTFM_CACHE_AWS_S3_BUCKET_NAME
      );
      expect(instance.cloudFrontDomainName).toBe(
        process.env.LASTFM_CACHE_AWS_CLOUDFRONT_DOMAIN_NAME
      );
      expect(instance.s3client).toBe(MockS3Client);
      expect(instance.scraper).toBe(MockScraper);
    });

    it("should instantiate the S3 client correctly", () => {
      expect(S3Client).toBeCalledTimes(1);
      expect(S3Client).toBeCalledWith({ region: process.env.LASTFM_CACHE_AWS_REGION });
    });

    it("should instantiate the Scraper correctly", () => {
      expect(Scraper).toBeCalledTimes(1);
      expect(Scraper).toBeCalledWith();
    });

    describe("getCloudFrontPrefix", () => {
      it("should return the correct value", () => {
        expect(instance.getCloudFrontPrefix()).toBe(
          "https://" + process.env.LASTFM_CACHE_AWS_CLOUDFRONT_DOMAIN_NAME + "/"
        );
      });
    });
  });

  describe("when the cache is empty", () => {
    beforeEach(() => {
      arrange();
      setupFetch({
        success: false,
        status: 404,
      });
      MockScraper.getArtistImage.mockImplementation(() =>
        Promise.resolve(mockImage)
      );
    });

    describe("lookup", () => {
      describe("when given a valid artist name", () => {
        beforeEach(() => {
          mockArtistName = "mockArtistName";
          response = instance.lookup(mockArtistName);
        });

        it("should attempt to fetch the data from the cache", () => {
          expect(fetch).toBeCalledTimes(1);
          expect(fetch).toBeCalledWith(
            instance.getCloudFrontPrefix() + mockArtistName,
            {
              method: "GET",
            }
          );
        });

        it("should call the scraper to generate the data", () => {
          expect(instance.scraper.getArtistImage).toBeCalledTimes(1);
          expect(instance.scraper.getArtistImage).toBeCalledWith(
            mockArtistName,
            instance.scraperRetries
          );
        });

        it("should update the cache with the scraper response", () => {
          const expectedCommand = {
            Body: mockImage,
            Bucket: process.env.LASTFM_CACHE_AWS_S3_BUCKET_NAME,
            Key: mockArtistName,
          };
          expect(PutObjectCommand).toBeCalledTimes(1);
          expect(PutObjectCommand).toBeCalledWith(expectedCommand);
          expect(instance.s3client.send).toBeCalledTimes(1);
          expect(instance.s3client.send).toBeCalledWith(MockBucketCommand);
        });

        it("should return a promise that resolves to scraped value", async () => {
          expect(await response).toBe(mockImage);
        });
      });

      describe("when given an invalid artist name", () => {
        beforeEach(() => {
          mockArtistName = undefined;
          response = instance.lookup(mockArtistName);
        });

        it("should NOT attempt to fetch the data from the cache", () => {
          expect(fetch).toBeCalledTimes(0);
        });

        it("should NOT call the scraper to generate the data", () => {
          expect(instance.scraper.getArtistImage).toBeCalledTimes(0);
        });

        it("should NOT update the cache", () => {
          expect(instance.s3client.send).toBeCalledTimes(0);
        });

        it("should return a promise that resolves to the default value", async () => {
          expect(await response).toBe(instance.defaultResponse);
        });
      });
    });
  });

  describe("when the cache is populated", () => {
    beforeEach(() => {
      arrange();
      setupFetch({
        success: true,
        status: 200,
      });
    });

    describe("lookup", () => {
      describe("when given a valid artist name", () => {
        beforeEach(() => {
          mockArtistName = "mockArtistName";
          response = instance.lookup(mockArtistName);
        });

        it("should attempt to fetch the data from the cache", () => {
          expect(fetch).toBeCalledTimes(1);
          expect(fetch).toBeCalledWith(
            instance.getCloudFrontPrefix() + mockArtistName,
            {
              method: "GET",
            }
          );
        });

        it("should NOT call the scraper to generate the data", () => {
          expect(instance.scraper.getArtistImage).toBeCalledTimes(0);
        });

        it("should NOT update the cache ", () => {
          expect(instance.s3client.send).toBeCalledTimes(0);
        });

        it("should return a promise that resolves to cache value", async () => {
          expect(await response).toBe(cacheResponse);
        });
      });

      describe("when given an invalid artist name", () => {
        beforeEach(() => {
          mockArtistName = undefined;
          response = instance.lookup(mockArtistName);
        });

        it("should NOT attempt to fetch the data from the cache", () => {
          expect(fetch).toBeCalledTimes(0);
        });

        it("should NOT call the scraper to generate the data", () => {
          expect(instance.scraper.getArtistImage).toBeCalledTimes(0);
        });

        it("should NOT update the cache", () => {
          expect(instance.s3client.send).toBeCalledTimes(0);
        });

        it("should return a promise that resolves to the default value", async () => {
          expect(await response).toBe(instance.defaultResponse);
        });
      });
    });
  });
});
