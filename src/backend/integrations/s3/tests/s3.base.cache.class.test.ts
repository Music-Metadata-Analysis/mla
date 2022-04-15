import { PutObjectCommand } from "@aws-sdk/client-s3";
import S3BaseCache from "../s3.base.cache.class";

jest.mock("@aws-sdk/client-s3", () => {
  return {
    S3Client: jest.fn(() => MockS3Client),
    PutObjectCommand: jest.fn(() => MockBucketCommand),
  };
});

const MockS3Client = {
  send: jest.fn(async () => null),
};

const MockBucketCommand = { MockCommand: "MockCommand" };

class ConcreteS3BaseCache extends S3BaseCache<Record<string, string>> {
  cacheFolderName = "path/to/cache";
  cacheContentType = "text/json";
  defaultResponse = {};

  createEntry(objectName: string): Promise<Record<string, string>> {
    return Promise.resolve({ entry: objectName });
  }

  getResponseValue(response: Response): Promise<Record<string, string>> {
    return response.json();
  }

  stringifyObject(newEntry: Record<string, string>): string {
    return JSON.stringify(newEntry);
  }
}

describe("S3BaseCache", () => {
  let instance: ConcreteS3BaseCache;
  let originalEnvironment: typeof process.env;
  const cacheResponse = "http://cached/url";
  let response: Promise<Record<string, string>>;
  let mockKeyName: string | undefined;

  beforeAll(() => {
    originalEnvironment = process.env;
    jest.spyOn(window, "fetch");
  });

  beforeEach(() => {
    jest.clearAllMocks();
    setupEnv();
  });

  afterAll(() => {
    jest.restoreAllMocks();
    process.env = originalEnvironment;
  });

  const setupEnv = () => {
    process.env.MLA_AWS_ACCESS_KEY_ID = "MockValue1";
    process.env.MLA_AWS_SECRET_ACCESS_KEY = "MockValue2";
    process.env.MLA_AWS_REGION = "MockValue3";
    process.env.LASTFM_CACHE_AWS_S3_BUCKET_NAME = "MockValue4";
    process.env.LASTFM_CACHE_AWS_CLOUDFRONT_DOMAIN_NAME = "MockValue5";
  };

  const setupFetch = ({
    headerHash,
    success,
    status,
  }: {
    headerHash: Record<string, string>;
    success: boolean;
    status: number;
  }) => {
    (window.fetch as jest.Mock).mockResolvedValue({
      headers: {
        get: (key: string) => headerHash[key],
      },
      status,
      ok: success,
      json: async () => cacheResponse,
    });
  };

  const arrange = () => {
    instance = new ConcreteS3BaseCache(
      process.env.LASTFM_CACHE_AWS_S3_BUCKET_NAME
    );
  };

  describe("when initialized", () => {
    beforeEach(() => {
      arrange();
    });

    it("should have the correct instance variables", () => {
      expect(instance.cloudFrontDomainName).toBe(
        process.env.LASTFM_CACHE_AWS_CLOUDFRONT_DOMAIN_NAME
      );
      expect(instance.requestCount).toBe(0);
      expect(instance.cacheHitCount).toBe(0);
    });
  });

  describe("logCacheHitRate", () => {
    beforeEach(() => {
      jest.spyOn(console, "log").mockImplementationOnce(() => jest.fn());
    });

    afterEach(() => {
      (console.log as unknown as jest.SpyInstance).mockRestore();
    });

    describe("with multiple requests", () => {
      beforeEach(() => (instance.requestCount = 10));

      describe("with multiple cache hits", () => {
        beforeEach(() => {
          instance.cacheHitCount = 5;
          instance.logCacheHitRate();
        });

        it("should log the correct message", () => {
          const hitRate =
            (instance.cacheHitCount / instance.requestCount) * 100;
          expect(console.log).toBeCalledTimes(1);
          expect(console.log).toBeCalledWith(
            `[S3 CACHE] hit rate: ${hitRate.toFixed(2)}%`
          );
        });
      });
    });

    describe("with no requests", () => {
      beforeEach(() => {
        instance.requestCount = 0;
        instance.logCacheHitRate();
      });

      it("should not log a message", () => {
        expect(console.log).toBeCalledTimes(0);
      });
    });
  });

  describe("lookup", () => {
    describe("when the cache is empty", () => {
      beforeEach(() => {
        arrange();
        setupFetch({
          headerHash: {},
          success: false,
          status: 404,
        });
      });

      describe("when given a valid object key name", () => {
        beforeEach(() => {
          mockKeyName = "valid key";
          response = instance.lookup(mockKeyName);
        });

        it("should return a promise that resolves to the scraped value", async () => {
          expect(await response).toStrictEqual(
            await instance.createEntry(String(mockKeyName))
          );
        });

        it("should attempt to fetch the data from the cache", () => {
          expect(fetch).toBeCalledTimes(1);
          expect(fetch).toBeCalledWith(
            `https://${instance.cloudFrontDomainName}/` +
              instance.cacheFolderName +
              "/" +
              encodeURIComponent(String(mockKeyName)),
            {
              method: "GET",
            }
          );
        });

        it("should update the cache with the created entry", async () => {
          const expectedCommand = {
            Body: JSON.stringify(
              await instance.createEntry(String(mockKeyName))
            ),
            Bucket: process.env.LASTFM_CACHE_AWS_S3_BUCKET_NAME,
            Key: instance.cacheFolderName + "/" + mockKeyName,
            ContentType: instance.cacheContentType,
          };
          expect(PutObjectCommand).toBeCalledTimes(1);
          expect(PutObjectCommand).toBeCalledWith(expectedCommand);
          expect(instance.s3client.send).toBeCalledTimes(1);
          expect(instance.s3client.send).toBeCalledWith(MockBucketCommand);
        });

        it("should NOT increment the cache hit count", () => {
          expect(instance.cacheHitCount).toBe(0);
        });

        it("should increment the request count", () => {
          expect(instance.requestCount).toBe(1);
        });

        describe("when given the same valid object key name twice", () => {
          beforeEach(() => {
            jest.clearAllMocks();
            response = instance.lookup(mockKeyName);
          });

          it("should return a promise that resolves to the scraped value", async () => {
            expect(await response).toStrictEqual(
              await instance.createEntry(String(mockKeyName))
            );
          });

          it("should NOT attempt to fetch the data from the cache a second time", () => {
            expect(fetch).toBeCalledTimes(0);
          });

          it("should NOT increment the cache hit count", () => {
            expect(instance.cacheHitCount).toBe(0);
          });

          it("should NOT increment the request count", () => {
            expect(instance.requestCount).toBe(1);
          });
        });
      });

      describe("when given an invalid object key name", () => {
        beforeEach(() => {
          mockKeyName = undefined;
          response = instance.lookup(mockKeyName);
        });

        it("should return a promise that resolves to the default value", async () => {
          expect(await response).toBe(instance.defaultResponse);
        });

        it("should NOT attempt to fetch the data from the cache", () => {
          expect(fetch).toBeCalledTimes(0);
        });

        it("should NOT update the cache", () => {
          expect(instance.s3client.send).toBeCalledTimes(0);
        });

        it("should NOT increment the cache hit count", () => {
          expect(instance.cacheHitCount).toBe(0);
        });

        it("should increment the request count", () => {
          expect(instance.requestCount).toBe(0);
        });
      });
    });
  });

  describe("when the cache is populated", () => {
    const testValidLookup = () => {
      it("should attempt to fetch the data from the cache", () => {
        expect(fetch).toBeCalledTimes(1);
        expect(fetch).toBeCalledWith(
          `https://${instance.cloudFrontDomainName}/` +
            instance.cacheFolderName +
            "/" +
            encodeURIComponent(String(mockKeyName)),
          {
            method: "GET",
          }
        );
      });

      it("should return a promise that resolves to the cache value", async () => {
        expect(await response).toBe(cacheResponse);
      });

      it("should NOT update the cache ", () => {
        expect(instance.s3client.send).toBeCalledTimes(0);
      });
    };

    const testInvalidLookup = () => {
      it("should NOT attempt to fetch the data from the cache", () => {
        expect(fetch).toBeCalledTimes(0);
      });

      it("should NOT update the cache", () => {
        expect(instance.s3client.send).toBeCalledTimes(0);
      });

      it("should return a promise that resolves to the default value", async () => {
        expect(await response).toBe(instance.defaultResponse);
      });
    };

    describe("when the cache is warmed", () => {
      beforeEach(() => {
        arrange();
        setupFetch({
          headerHash: {
            "x-cache": "Hit from cloudfront",
          },
          success: true,
          status: 200,
        });
      });

      describe("when given a valid object key name", () => {
        beforeEach(() => {
          mockKeyName = "valid key";
          response = instance.lookup(mockKeyName);
        });

        testValidLookup();

        it("should increment the cache hit count", () => {
          expect(instance.cacheHitCount).toBe(1);
        });

        it("should increment the request count", () => {
          expect(instance.requestCount).toBe(1);
        });
      });

      describe("when given an invalid object key name", () => {
        beforeEach(() => {
          mockKeyName = undefined;
          response = instance.lookup(mockKeyName);
        });

        testInvalidLookup();

        it("should NOT increment the cache hit count", () => {
          expect(instance.cacheHitCount).toBe(0);
        });

        it("should increment the request count", () => {
          expect(instance.requestCount).toBe(0);
        });
      });
    });

    describe("when the cache is NOT warmed", () => {
      beforeEach(() => {
        arrange();
        setupFetch({
          headerHash: {
            "x-cache": "Miss from cloudfront",
          },
          success: true,
          status: 200,
        });
      });

      describe("when given a valid object key name", () => {
        beforeEach(() => {
          mockKeyName = "valid key";
          response = instance.lookup(mockKeyName);
        });

        testValidLookup();

        it("should NOT increment the cache hit count", () => {
          expect(instance.cacheHitCount).toBe(0);
        });

        it("should increment the request count", () => {
          expect(instance.requestCount).toBe(1);
        });
      });

      describe("when given an invalid object key name", () => {
        beforeEach(() => {
          mockKeyName = undefined;
          response = instance.lookup(mockKeyName);
        });

        testInvalidLookup();

        it("should NOT increment the cache hit count", () => {
          expect(instance.cacheHitCount).toBe(0);
        });

        it("should increment the request count", () => {
          expect(instance.requestCount).toBe(0);
        });
      });
    });
  });
});
