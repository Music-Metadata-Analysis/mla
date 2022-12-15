import CacheVendorCdnBaseClient from "./bases/cdn.base.client.class";
import type { CacheVendorCdnInterface } from "@src/types/integrations/cache/vendor.types";
import type { PersistanceVendorInterface } from "@src/types/integrations/persistance/vendor.types";

export default abstract class CloudFrontCdnBaseClass<ObjectType>
  extends CacheVendorCdnBaseClient<ObjectType>
  implements CacheVendorCdnInterface<ObjectType>
{
  protected abstract cacheFolderName: string;
  protected cacheTypeName = "CloudFront";

  constructor(
    originServerClient: PersistanceVendorInterface,
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
