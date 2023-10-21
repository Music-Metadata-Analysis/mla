import type {
  ReportCacheCreateResponseInterface,
  ReportCacheRetrieveResponseInterface,
} from "@src/contracts/api/types/services/report.cache/response.types";
import type { PersistenceVendorDataType } from "@src/vendors/types/integrations/persistence/vendor.backend.types";

export interface ReportCacheProxyCreateCacheObjectInterface {
  authenticatedUserName: string;
  reportName: string;
  sourceName: string;
  userName: string;
  content: PersistenceVendorDataType;
}

export interface ReportCacheProxyRetrieveCacheObjectInterface {
  authenticatedUserName: string;
  reportName: string;
  sourceName: string;
  userName: string;
}

export interface ReportCacheProxyInterface {
  createCacheObject: ({
    authenticatedUserName,
    reportName,
    sourceName,
    userName,
    content,
  }: ReportCacheProxyCreateCacheObjectInterface) => Promise<ReportCacheCreateResponseInterface>;

  retrieveCacheObject: ({
    authenticatedUserName,
    reportName,
    sourceName,
    userName,
  }: ReportCacheProxyRetrieveCacheObjectInterface) => Promise<ReportCacheRetrieveResponseInterface<PersistenceVendorDataType> | void>;
}
