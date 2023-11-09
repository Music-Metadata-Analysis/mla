import { cacheVendorBackend } from "@src/vendors/integrations/cache/vendor.backend";
import { errorVendorBackend } from "@src/vendors/integrations/errors/vendor.backend";
import { persistenceVendorBackend } from "@src/vendors/integrations/persistence/vendor.backend";
import type {
  ReportCacheProxyCreateCacheObjectInterface,
  ReportCacheProxyInterface,
  ReportCacheProxyRetrieveCacheObjectInterface,
} from "@src/api/types/services/report.cache/proxy/proxy.types";
import type { RemoteServiceError } from "@src/contracts/api/types/services/generics/proxy/proxy.error.types";
import type {
  ReportCacheCreateResponseInterface,
  ReportCacheRetrieveResponseInterface,
} from "@src/contracts/api/types/services/report.cache/response.types";
import type { DataSourceType } from "@src/contracts/api/types/source.types";
import type { CacheVendorCdnOriginReportsCacheObjectInterface } from "@src/vendors/types/integrations/cache/vendor.backend.types";
import type { PersistenceVendorClientInterface } from "@src/vendors/types/integrations/persistence/vendor.backend.types";
import type { PersistenceVendorDataType } from "@src/vendors/types/integrations/persistence/vendor.backend.types";

class ReportCacheProxy implements ReportCacheProxyInterface {
  protected persistanceClient: PersistenceVendorClientInterface;
  protected objectHeaders = {
    CacheControl: "max-age=14400",
    ContentType: "application/json",
  };

  constructor() {
    this.persistanceClient = new persistenceVendorBackend.PersistenceClient(
      process.env.LASTFM_CACHE_AWS_S3_BUCKET_NAME
    );
  }

  async createCacheObject(
    args: ReportCacheProxyCreateCacheObjectInterface
  ): Promise<ReportCacheCreateResponseInterface> {
    const cacheReportObject = this.createCacheReportObject(args);
    try {
      await this.persistanceClient.write(
        cacheReportObject.getStorageName(),
        args.content,
        this.objectHeaders
      );
    } catch (e) {
      this.createProxyCompatibleError(e as Error);
    }
    return {
      id: cacheReportObject.getCacheId(),
    };
  }

  async retrieveCacheObject(
    args: ReportCacheProxyRetrieveCacheObjectInterface
  ): Promise<ReportCacheRetrieveResponseInterface<PersistenceVendorDataType> | void> {
    try {
      const cacheReportObject = this.createCacheReportObject(args);
      const url = this.getCdnUrl(cacheReportObject.getStorageName());
      const response = await fetch(url);
      if (response.ok) {
        const responseCacheControlHeaderValue =
          response.headers.get("Cache-Control");
        const returnedControlHeaderValue = responseCacheControlHeaderValue
          ? responseCacheControlHeaderValue
          : this.objectHeaders["CacheControl"];
        return {
          response: await response.json(),
          cacheControl: String(returnedControlHeaderValue),
        };
      }
      throw new errorVendorBackend.ProxyError(
        await response.text(),
        response.status
      );
    } catch (e) {
      if (e instanceof Error) {
        this.createProxyCompatibleError(e as Error);
      }
      throw new errorVendorBackend.ProxyError("Unknown error occurred.");
    }
  }

  protected createCacheReportObject(args: {
    authenticatedUserName: string;
    reportName: string;
    sourceName: Lowercase<DataSourceType>;
    userName: string;
  }): CacheVendorCdnOriginReportsCacheObjectInterface {
    return new cacheVendorBackend.CdnOriginReportsCacheObject(args);
  }

  protected getCdnUrl(objectName: string): string {
    return [
      "https://" + process.env.LASTFM_CACHE_AWS_CLOUDFRONT_DOMAIN_NAME,
      objectName,
    ].join("/");
  }

  createProxyCompatibleError(
    err: Error | RemoteServiceError
  ): RemoteServiceError {
    if (err instanceof errorVendorBackend.ProxyError) {
      throw err;
    }
    throw new errorVendorBackend.ProxyError(err.message);
  }
}

export default ReportCacheProxy;
