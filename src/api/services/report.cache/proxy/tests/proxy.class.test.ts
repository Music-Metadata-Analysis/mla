import ReportCacheProxy from "../proxy.class";
import { cacheVendorBackend } from "@src/vendors/integrations/cache/vendor.backend";
import { errorVendorBackend } from "@src/vendors/integrations/errors/vendor.backend";
import { mockPersistenceClient } from "@src/vendors/integrations/persistence/__mocks__/vendor.backend.mock";
import { persistenceVendorBackend } from "@src/vendors/integrations/persistence/vendor.backend";
import type { RemoteServiceError } from "@src/contracts/api/types/services/generics/proxy/proxy.error.types";
import type {
  ReportCacheCreateResponseInterface,
  ReportCacheRetrieveResponseInterface,
} from "@src/contracts/api/types/services/report.cache/response.types";
import type { PersistenceVendorDataType } from "@src/vendors/types/integrations/persistence/vendor.backend.types";

jest.mock("@src/vendors/integrations/cache/vendor.backend");

jest.mock("@src/vendors/integrations/persistence/vendor.backend");

describe(ReportCacheProxy.name, () => {
  let originalEnvironment: typeof process.env;
  let instance: ReportCacheProxy;

  const mockBucketName = "mockBucketName";
  const mockCdnDomain = "www.mock.com";

  const mockError = "mockError";
  const mockCacheId = "mockObjectId";

  const mockObjectContent = { mock: "content" };
  const mockObjectHeaders = {
    CacheControl: "max-age=14400",
    ContentType: "application/json",
  };

  const mockAuthenticatedUser = "mockAuthenticatedUser";
  const mockReportName = "mockReportName";
  const mockSourceName = "mockSourceName";
  const mockUserName = "mockUserName";

  const mockObjectName = "some/path/on/cdn/server/basename.json";

  beforeEach(() => jest.clearAllMocks());

  const arrange = () => (instance = new ReportCacheProxy());

  describe("when initialized", () => {
    beforeAll(() => {
      originalEnvironment = process.env;
    });

    afterAll(() => {
      process.env = originalEnvironment;
    });

    beforeEach(() => {
      process.env.LASTFM_CACHE_AWS_S3_BUCKET_NAME = mockBucketName;
      process.env.LASTFM_CACHE_AWS_CLOUDFRONT_DOMAIN_NAME = mockCdnDomain;
      arrange();
    });

    it("should instantiate the underlying persistanceVendor", () => {
      expect(persistenceVendorBackend.PersistenceClient).toBeCalledTimes(1);
      expect(persistenceVendorBackend.PersistenceClient).toBeCalledWith(
        mockBucketName
      );
    });

    describe("createCacheObject", () => {
      let result: ReportCacheCreateResponseInterface | RemoteServiceError;

      beforeEach(() => {
        jest
          .mocked(
            cacheVendorBackend.CdnOriginReportsCacheObject.prototype
              .getStorageName
          )
          .mockReturnValue(mockObjectName);
        jest
          .mocked(
            cacheVendorBackend.CdnOriginReportsCacheObject.prototype.getCacheId
          )
          .mockReturnValue(mockCacheId);
      });

      const act = async () =>
        (result = await instance.createCacheObject({
          authenticatedUserName: mockAuthenticatedUser,
          reportName: mockReportName,
          sourceName: mockSourceName,
          userName: mockUserName,
          content: mockObjectContent,
        }));

      describe("when successful", () => {
        beforeEach(() => {
          jest.mocked(mockPersistenceClient.write).mockImplementation();
          act();
        });

        it("should instantiate the CdnOriginReportsCacheObject class correctly", () => {
          expect(
            cacheVendorBackend.CdnOriginReportsCacheObject
          ).toBeCalledTimes(1);
          expect(cacheVendorBackend.CdnOriginReportsCacheObject).toBeCalledWith(
            {
              authenticatedUserName: mockAuthenticatedUser,
              reportName: mockReportName,
              sourceName: mockSourceName,
              userName: mockUserName,
              content: mockObjectContent,
            }
          );
        });

        it("should call the getStorageName method of the CdnOriginReportsCacheObject class correctly", () => {
          expect(
            cacheVendorBackend.CdnOriginReportsCacheObject.prototype
              .getStorageName
          ).toBeCalledTimes(1);
          expect(
            cacheVendorBackend.CdnOriginReportsCacheObject.prototype
              .getStorageName
          ).toBeCalledWith();
        });

        it("should call the write method of the mockPersistenceClient", () => {
          expect(mockPersistenceClient.write).toBeCalledTimes(1);
          expect(mockPersistenceClient.write).toBeCalledWith(
            mockObjectName,
            mockObjectContent,
            mockObjectHeaders
          );
        });

        it("should return the correct result", () => {
          expect(result).toStrictEqual({ id: mockCacheId });
        });
      });

      describe("when an error occurs", () => {
        beforeEach(() => {
          jest.mocked(mockPersistenceClient.write).mockImplementation(() => {
            throw new Error(mockError);
          });
        });

        it("should throw the expected error", async () => {
          const t = async () => await act();
          await expect(t).rejects.toThrow(errorVendorBackend.ProxyError);
          await expect(t).rejects.toEqual(
            new errorVendorBackend.ProxyError(mockError)
          );
          await expect(t).rejects.toHaveProperty("clientStatusCode", undefined);
        });
      });
    });

    describe("retrieveCacheObject", () => {
      let fetchSpy: jest.SpyInstance;
      let result: ReportCacheRetrieveResponseInterface<PersistenceVendorDataType> | void;

      beforeEach(() => {
        fetchSpy = jest.spyOn(window, "fetch");
      });

      const act = async () =>
        (result = await instance.retrieveCacheObject({
          authenticatedUserName: mockAuthenticatedUser,
          reportName: mockReportName,
          sourceName: mockSourceName,
          userName: mockUserName,
        }));

      const checkCdnVendorReportsCacheObjectClass = () => {
        it("should instantiate the CdnOriginReportsCacheObject class correctly", () => {
          expect(
            cacheVendorBackend.CdnOriginReportsCacheObject
          ).toBeCalledTimes(1);
          expect(cacheVendorBackend.CdnOriginReportsCacheObject).toBeCalledWith(
            {
              authenticatedUserName: mockAuthenticatedUser,
              reportName: mockReportName,
              sourceName: mockSourceName,
              userName: mockUserName,
            }
          );
        });

        it("should call the getStorageName method of the CdnOriginReportsCacheObject class correctly", () => {
          expect(
            cacheVendorBackend.CdnOriginReportsCacheObject.prototype
              .getStorageName
          ).toBeCalledTimes(1);
          expect(
            cacheVendorBackend.CdnOriginReportsCacheObject.prototype
              .getStorageName
          ).toBeCalledWith();
        });
      };

      const checkFetch = () => {
        it("should call fetch with the expected props", () => {
          expect(fetchSpy).toBeCalledTimes(1);
          expect(fetchSpy).toBeCalledWith(
            [
              "https:/",
              process.env.LASTFM_CACHE_AWS_CLOUDFRONT_DOMAIN_NAME,
              mockObjectName,
            ].join("/")
          );
        });
      };

      describe("when successful", () => {
        describe("with no headers set", () => {
          const mockHeaders = {
            get: jest.fn(() => null),
          } as unknown as Headers;

          beforeEach(() => {
            fetchSpy.mockResolvedValue({
              headers: mockHeaders,
              ok: true,
              status: 200,
              json: () => Promise.resolve(mockObjectContent),
            } as Response);
            act();
          });

          checkCdnVendorReportsCacheObjectClass();
          checkFetch();

          it("should retrieve the Cache-Control header", () => {
            expect(mockHeaders.get).toBeCalledTimes(1);
            expect(mockHeaders.get).toBeCalledWith("Cache-Control");
          });

          it("should return the correct result", () => {
            expect(result?.response).toStrictEqual(mockObjectContent);
            expect(result?.cacheControl).toStrictEqual(
              mockObjectHeaders.CacheControl
            );
          });
        });

        describe("with headers set", () => {
          const mockHeaders = {
            get: jest.fn(() => "max-age=2000"),
          } as unknown as Headers;

          beforeEach(() => {
            fetchSpy.mockResolvedValue({
              headers: mockHeaders,
              ok: true,
              status: 200,
              json: () => Promise.resolve(mockObjectContent),
            } as Response);
            act();
          });

          checkCdnVendorReportsCacheObjectClass();
          checkFetch();

          it("should retrieve the Cache-Control header", () => {
            expect(mockHeaders.get).toBeCalledTimes(1);
            expect(mockHeaders.get).toBeCalledWith("Cache-Control");
          });

          it("should return the correct result", () => {
            expect(result?.response).toStrictEqual(mockObjectContent);
            expect(result?.cacheControl).toStrictEqual("max-age=2000");
          });
        });
      });

      describe("when an status code error occurs", () => {
        let error: RemoteServiceError;
        const proxyServiceError = "Unable to retrieve object.";
        const mockHeaders = {
          get: jest.fn(() => "max-age=2000"),
        } as unknown as Headers;

        beforeEach(async () => {
          fetchSpy.mockResolvedValue({
            headers: mockHeaders,
            ok: false,
            status: 404,
            text: () => Promise.resolve(proxyServiceError),
          } as Response);
          try {
            await act();
          } catch (err) {
            error = err as RemoteServiceError;
          }
        });

        checkCdnVendorReportsCacheObjectClass();
        checkFetch();

        it("should NOT retrieve the Cache-Control header", () => {
          expect(mockHeaders.get).toBeCalledTimes(0);
        });

        it("should throw the expected error", () => {
          expect(error.message).toEqual(proxyServiceError);
          expect(error.clientStatusCode).toBe(404);
        });
      });

      describe("when a network error occurs", () => {
        let error: RemoteServiceError;
        const mockHeaders = {
          get: jest.fn(() => "max-age=2000"),
        } as unknown as Headers;

        beforeEach(async () => {
          fetchSpy.mockRejectedValue({
            headers: mockHeaders,
          } as Response);
          try {
            await act();
          } catch (err) {
            error = err as RemoteServiceError;
          }
        });

        checkCdnVendorReportsCacheObjectClass();
        checkFetch();

        it("should NOT retrieve the Cache-Control header", () => {
          expect(mockHeaders.get).toBeCalledTimes(0);
        });

        it("should throw the expected error", () => {
          expect(error.message).toEqual("Unknown error occurred.");
          expect(error).toHaveProperty("clientStatusCode", undefined);
        });
      });
    });
  });
});
