import CacheController from "../cache.controller.class";
import type { CacheVendorCdnInterface } from "@src/vendors/types/integrations/cache/vendor.backend.types";

describe(CacheController.name, () => {
  let instance: CacheController<string>;

  const mockObjectName = "mockObjectName";
  const mockDefaultResponse = "mockDefaultResponse";
  const mockCdnResponse = "mockCdnResponse";

  const mockCdnLogCacheHitRate = jest.fn();
  const mockCdnQuery = jest.fn();
  const mockCdnClient = jest.fn(
    () =>
      ({
        logCacheHitRate: mockCdnLogCacheHitRate,
        query: mockCdnQuery,
      } as unknown as CacheVendorCdnInterface<string>)
  );

  beforeEach(() => jest.clearAllMocks());

  const arrange = () =>
    (instance = new CacheController(mockDefaultResponse, new mockCdnClient()));

  describe("when initialized", () => {
    beforeEach(() => arrange());

    describe("query", () => {
      let result: string;
      let cachedResult: string;

      describe("when called without an objectName", () => {
        beforeEach(async () => (result = await instance.query()));

        it("should return the default response", () => {
          expect(result).toBe(mockDefaultResponse);
        });

        it("should not query the CDN", () => {
          expect(mockCdnQuery).toBeCalledTimes(0);
        });
      });

      describe("when called with a valid objectName", () => {
        describe("one time", () => {
          beforeEach(async () => {
            mockCdnQuery.mockReturnValueOnce(mockCdnResponse);
            result = await instance.query(mockObjectName);
          });

          it("should query the CDN one time", () => {
            expect(mockCdnQuery).toBeCalledTimes(1);
            expect(mockCdnQuery).toBeCalledWith(mockObjectName);
          });

          it("should return the CDN's response", () => {
            expect(result).toBe(mockCdnResponse);
          });
        });

        describe("twice", () => {
          beforeEach(async () => {
            mockCdnQuery.mockReturnValueOnce(mockCdnResponse);
            result = await instance.query(mockObjectName);
            cachedResult = await instance.query(mockObjectName);
          });

          it("should query the CDN still only one time", () => {
            expect(mockCdnQuery).toBeCalledTimes(1);
            expect(mockCdnQuery).toBeCalledWith(mockObjectName);
          });

          it("should return the CDN's response", () => {
            expect(result).toBe(mockCdnResponse);
          });

          it("should return a cached result to subsequent requests", () => {
            expect(cachedResult).toBe(result);
          });
        });
      });
    });

    describe("logCacheHitRate", () => {
      beforeEach(() => instance.logCacheHitRate());

      it("should call the logCacheHitRate method on the CDN client", () => {
        expect(mockCdnLogCacheHitRate).toBeCalledTimes(1);
        expect(mockCdnLogCacheHitRate).toBeCalledWith();
      });
    });
  });
});
