import ProxyError from "@src/backend/api/services/generics/proxy/error/proxy.error.class";
import { persistenceVendorBackend } from "@src/vendors/integrations/persistence/vendor.backend";
import type {
  ReportCacheProxyCreateCacheObjectInterface,
  ReportCacheProxyInterface,
} from "@src/backend/api/types/services/report.cache/proxy.types";
import type { ReportCacheResponseInterface } from "@src/contracts/api/types/services/report.cache/response.types";
import type { PersistenceVendorClientInterface } from "@src/vendors/types/integrations/persistence/vendor.backend.types";

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

  async createCacheObject({
    cacheId,
    objectName,
    objectContent,
  }: ReportCacheProxyCreateCacheObjectInterface): Promise<ReportCacheResponseInterface> {
    try {
      await this.persistanceClient.write(
        objectName,
        objectContent,
        this.objectHeaders
      );
    } catch (e) {
      this.createProxyCompatibleError(e as Error);
    }
    return {
      id: cacheId,
    };
  }

  createProxyCompatibleError(err: Error): ProxyError {
    throw new ProxyError(err.message);
  }
}

export default ReportCacheProxy;
