import S3CdnOriginReportsCacheObject from "./backend/cdn.origin.reports/s3";
import CloudFrontCdnBaseClass from "./backend/cdn/cloudfront";
import type { CacheVendorBackendInterface } from "@src/vendors/types/integrations/cache/vendor.backend.types";

export const cacheVendorBackend: CacheVendorBackendInterface = {
  CdnBaseClient: CloudFrontCdnBaseClass,
  CdnOriginReportsCacheObject: S3CdnOriginReportsCacheObject,
};
