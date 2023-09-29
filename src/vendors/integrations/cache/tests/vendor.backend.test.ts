import S3CdnOriginReportsCacheObject from "../backend/cdn.origin.reports/s3";
import CloudFrontCdnBaseClass from "../backend/cdn/cloudfront";
import { cacheVendorBackend } from "../vendor.backend";

describe("cacheVendorBackend", () => {
  it("should be configured with the correct properties", () => {
    expect(cacheVendorBackend.CdnBaseClient).toBe(CloudFrontCdnBaseClass);
    expect(cacheVendorBackend.CdnOriginReportsCacheObject).toBe(
      S3CdnOriginReportsCacheObject
    );
  });
});
