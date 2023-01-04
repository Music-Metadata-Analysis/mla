import CacheVendorCdnBaseClient from "./bases/cdn.base.client.class";
import type { CacheVendorCdnInterface } from "@src/backend/api/types/integrations/cache/vendor.types";
import type { PersistenceVendorClientInterface } from "@src/backend/api/types/integrations/persistence/vendor.types";

export default abstract class CloudFrontCdnBaseClass<ObjectType>
  extends CacheVendorCdnBaseClient<ObjectType>
  implements CacheVendorCdnInterface<ObjectType>
{
  protected abstract cacheFolderName: string;
  protected cacheTypeName = "CloudFront";

  constructor(
    originServerClient: PersistenceVendorClientInterface,
    cdnHostname: string
  ) {
    super(originServerClient, cdnHostname);
  }

  protected isCachedResponse(response: Response): boolean {
    const cache_header = response.headers.get("x-cache");
    if (!cache_header) return false;
    return cache_header.includes("Hit");
  }

  protected getOriginServerStorageLocation(objectName: string): string {
    return `${this.cacheFolderName}/${objectName}`;
  }

  protected getOriginServerUrlFromObjectName(objectName: string): string {
    return (
      this.getCloudFrontPrefix() +
      `${this.cacheFolderName}/${encodeURIComponent(objectName)}`
    );
  }

  protected getCloudFrontPrefix(): string {
    return `https://${this.cdnHostname}/`;
  }
}
