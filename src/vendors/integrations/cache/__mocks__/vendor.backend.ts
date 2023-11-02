import CdnAbstractBaseClient from "../backend/cdn/bases/cdn.base.client.class";
import CdnController from "../backend/cdn.controller/controller/cdn.controller.class";
import CdnControllerAbstractFactory from "../backend/cdn.controller/factory/cdn.controller.abstract.factory.class";
import S3CdnOriginReportsCacheObject from "../backend/cdn.origin.reports/s3";
import type { CacheVendorBackendInterface } from "@src/vendors/types/integrations/cache/vendor.backend.types";

jest.mock("../backend/cdn/bases/cdn.base.client.class");
jest.mock("../backend/cdn.origin.reports/s3");
jest.mock("../backend/cdn.controller/controller/cdn.controller.class");

export const cacheVendorBackend: CacheVendorBackendInterface = {
  CdnBaseClient: CdnAbstractBaseClient,
  CdnController: CdnController,
  CdnControllerAbstractFactory: CdnControllerAbstractFactory,
  CdnOriginReportsCacheObject: S3CdnOriginReportsCacheObject,
};
