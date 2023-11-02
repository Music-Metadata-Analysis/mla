import CloudFrontCdnBaseClass from "./backend/cdn/cloudfront";
import CdnController from "./backend/cdn.controller/controller/cdn.controller.class";
import CdnControllerAbstractFactory from "./backend/cdn.controller/factory/cdn.controller.abstract.factory.class";
import S3CdnOriginReportsCacheObject from "./backend/cdn.origin.reports/s3";
import type { CacheVendorBackendInterface } from "@src/vendors/types/integrations/cache/vendor.backend.types";

export const cacheVendorBackend: CacheVendorBackendInterface = {
  CdnBaseClient: CloudFrontCdnBaseClass,
  CdnOriginReportsCacheObject: S3CdnOriginReportsCacheObject,
  CdnController: CdnController,
  CdnControllerAbstractFactory: CdnControllerAbstractFactory,
};
