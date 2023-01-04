import type { CacheControllerInterface } from "@src/backend/api/types/cache/controller.types";
import type { CacheVendorCdnInterface } from "@src/backend/api/types/integrations/cache/vendor.types";

export default class CacheController<ObjectType>
  implements CacheControllerInterface<ObjectType>
{
  protected defaultResponse: ObjectType;
  protected cdnClient: CacheVendorCdnInterface<ObjectType>;
  protected internalCache: Record<string, ObjectType> = {};

  constructor(
    defaultResponse: ObjectType,
    cdnClient: CacheVendorCdnInterface<ObjectType>
  ) {
    this.defaultResponse = defaultResponse;
    this.cdnClient = cdnClient;
  }

  public async query(objectName?: string | undefined): Promise<ObjectType> {
    if (objectName) {
      const internalCache = this.internalCache[objectName];
      if (internalCache) {
        return Promise.resolve(internalCache);
      }
      return this.populateCache(objectName);
    }
    return Promise.resolve(this.defaultResponse);
  }

  protected async populateCache(objectName: string): Promise<ObjectType> {
    const externalCacheValue = await this.cdnClient.query(objectName);
    this.internalCache[objectName] = externalCacheValue;
    return externalCacheValue;
  }

  public logCacheHitRate(): void {
    this.cdnClient.logCacheHitRate();
  }
}
