import type { ReportCacheResponseInterface } from "@src/contracts/api/types/services/report.cache/response.types";
import type { PersistenceVendorDataType } from "@src/vendors/types/integrations/persistence/vendor.backend.types";

export interface ReportCacheProxyCreateCacheObjectInterface {
  cacheId: string;
  objectName: string;
  objectContent: PersistenceVendorDataType;
}

export interface ReportCacheProxyInterface {
  createCacheObject: ({
    cacheId,
    objectName,
    objectContent,
  }: ReportCacheProxyCreateCacheObjectInterface) => Promise<ReportCacheResponseInterface>;
}
