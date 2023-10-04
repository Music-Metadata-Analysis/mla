import ReportCacheProxy from "../proxy.class";
import ProxyError from "@src/backend/api/services/generics/proxy/error/proxy.error.class";
import { mockPersistenceClient } from "@src/vendors/integrations/persistence/__mocks__/vendor.backend.mock";
import { persistenceVendorBackend } from "@src/vendors/integrations/persistence/vendor.backend";
import type { ReportCacheResponseInterface } from "@src/contracts/api/types/services/report.cache/response.types";

jest.mock("@src/vendors/integrations/persistence/vendor.backend");

describe(ReportCacheProxy.name, () => {
  let originalEnvironment: typeof process.env;
  let instance: ReportCacheProxy;

  const mockBucketName = "mockBucketName";
  const mockError = "mockError";
  const mockCacheId = "mockObjectId";
  const mockObjectContent = { mock: "content" };
  const mockObjectHeaders = {
    CacheControl: "max-age=14400",
    ContentType: "application/json",
  };
  const mockObjectName = "mockObjectName";

  beforeEach(() => jest.clearAllMocks());

  const arrange = () => (instance = new ReportCacheProxy());

  describe("when initialized", () => {
    beforeAll(() => {
      originalEnvironment = process.env;
      process.env.LAST_FM_KEY = "random key";
    });

    afterAll(() => {
      process.env = originalEnvironment;
    });

    beforeEach(() => {
      process.env.LASTFM_CACHE_AWS_S3_BUCKET_NAME = mockBucketName;
      arrange();
    });

    it("should instantiate the underlying persistanceVendor", () => {
      expect(persistenceVendorBackend.PersistenceClient).toBeCalledTimes(1);
      expect(persistenceVendorBackend.PersistenceClient).toBeCalledWith(
        mockBucketName
      );
    });

    describe("createCache", () => {
      let result: ReportCacheResponseInterface | ProxyError;

      const act = async () =>
        (result = await instance.createCacheObject({
          cacheId: mockCacheId,
          objectName: mockObjectName,
          objectContent: mockObjectContent,
        }));

      describe("when successful", () => {
        beforeEach(() => {
          jest.mocked(mockPersistenceClient.write).mockImplementation();
          act();
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
          await expect(t).rejects.toThrow(ProxyError);
          await expect(t).rejects.toEqual(new ProxyError(mockError));
          await expect(t).rejects.not.toHaveProperty("clientStatusCode");
        });
      });
    });
  });
});
