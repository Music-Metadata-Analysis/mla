import CdnController from "../backend/cdn.controller/controller/cdn.controller.class";
import CdnControllerAbstractFactory from "../backend/cdn.controller/factory/cdn.controller.abstract.factory.class";
import S3CdnOriginReportsCacheObject from "../backend/cdn.origin.reports/s3";
import CloudFrontCdnBaseClass from "../backend/cdn/cloudfront";
import { cacheVendorBackend } from "../vendor.backend";

describe("cacheVendorBackend", () => {
  it("should be configured with the correct properties", () => {
    expect(cacheVendorBackend.CdnController).toBe(CdnController);
    expect(cacheVendorBackend.CdnControllerAbstractFactory).toBe(
      CdnControllerAbstractFactory
    );
    expect(cacheVendorBackend.CdnBaseClient).toBe(CloudFrontCdnBaseClass);
    expect(cacheVendorBackend.CdnOriginReportsCacheObject).toBe(
      S3CdnOriginReportsCacheObject
    );
    expect(Object.keys(cacheVendorBackend).length).toBe(4);
  });
});
