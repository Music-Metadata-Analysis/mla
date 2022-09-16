import VendorCdnBaseClient from "./bases/vendor.cdn.base.client.class";
import type { CdnVendorInterface } from "../../../../types/integrations/cache/vendor.types";
import type { PersistanceVendorInterface } from "../../../../types/integrations/persistance/vendor.types";

export default abstract class CloudFrontCdnBaseClass<ObjectType>
  extends VendorCdnBaseClient<ObjectType>
  implements CdnVendorInterface<ObjectType>
{
  protected abstract cacheFolderName: string;
  protected requestCount = 0;
  protected cacheHitCount = 0;
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

  protected getOriginServerUrlFromObjectName(objectName: string): string {
    return (
      this.getCloudFrontPrefix() +
      `${this.cacheFolderName}/${encodeURIComponent(objectName)}`
    );
  }

  protected getCloudFrontPrefix() {
    return `https://${this.cdnHostname}/`;
  }

  protected getKeyName(objectName: string) {
    return `${this.cacheFolderName}/${objectName}`;
  }
}
