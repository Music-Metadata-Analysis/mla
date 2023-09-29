import S3CdnOriginReportsCacheObject from "../backend/cdn.origin.reports/s3";
import CdnAbstractBaseClient from "../backend/cdn/bases/cdn.base.client.class";
import type { CacheVendorBackendInterface } from "@src/vendors/types/integrations/cache/vendor.backend.types";

jest.mock("../backend/cdn/bases/cdn.base.client.class");
jest.mock("../backend/cdn.origin.reports/s3");

export const cacheVendorBackend: CacheVendorBackendInterface = {
  CdnBaseClient: CdnAbstractBaseClient,
  CdnOriginReportsCacheObject: S3CdnOriginReportsCacheObject,
};
