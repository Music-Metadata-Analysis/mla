import { Buffer } from "buffer";
import type { DataSourceType } from "@src/contracts/api/types/source.types";
import type {
  CacheVendorCdnOriginReportsCacheObjectConstructorInterface,
  CacheVendorCdnOriginReportsCacheObjectInterface,
} from "@src/vendors/types/integrations/cache/vendor.backend.types";

export default class S3CdnOriginReportsCacheObject
  implements CacheVendorCdnOriginReportsCacheObjectInterface
{
  protected authenticatedUserName: string;
  protected reportName: string;
  protected sourceName: Lowercase<DataSourceType>;
  protected userName: string;

  constructor({
    authenticatedUserName,
    reportName,
    sourceName,
    userName,
  }: CacheVendorCdnOriginReportsCacheObjectConstructorInterface) {
    this.authenticatedUserName = authenticatedUserName;
    this.reportName = reportName;
    this.sourceName = sourceName;
    this.userName = userName;
  }

  getCacheId(): string {
    return this.unicodeToBase64(`${this.reportName}-${this.userName}`);
  }

  getStorageName() {
    const objectBaseName = this.getCacheId() + ".json";
    return [
      this.sourceName,
      "reports",
      this.authenticatedUserName,
      objectBaseName,
    ].join("/");
  }

  protected unicodeToBase64(unicodeString: string): string {
    return Buffer.from(unicodeString, "utf8").toString("base64");
  }
}
