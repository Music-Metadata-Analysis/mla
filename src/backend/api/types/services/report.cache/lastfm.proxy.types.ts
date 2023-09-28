import type { ReportCacheResponseInterface } from "@src/contracts/api/types/services/report.cache/reponses/response.types";
import type { PersistenceVendorDataType } from "@src/vendors/types/integrations/persistence/vendor.backend.types";

export interface LastFMReportCacheInterface {
  createCache: (
    objectName: string,
    objectContent: PersistenceVendorDataType
  ) => Promise<ReportCacheResponseInterface>;
}
