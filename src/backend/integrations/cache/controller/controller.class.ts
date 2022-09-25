import type {
  CacheControllerInterface,
  CdnVendorInterface,
} from "@src/types/integrations/cache/vendor.types";

export default class CacheController<ObjectType>
  implements CacheControllerInterface<ObjectType>
{
  protected defaultResponse: ObjectType;
  protected cdnClient: CdnVendorInterface<ObjectType>;
  protected internalCache: Record<string, ObjectType> = {};

  constructor(
    defaultResponse: ObjectType,
    cdnClient: CdnVendorInterface<ObjectType>
  ) {
    this.defaultResponse = defaultResponse;
    this.cdnClient = cdnClient;
  }

  async query(objectName?: string | undefined): Promise<ObjectType> {
    if (objectName) {
      const internalCache = this.internalCache[objectName];
      if (internalCache) {
        return Promise.resolve(internalCache);
      }
      return this.populateCache(objectName);
    }
    return Promise.resolve(this.defaultResponse);
  }

  protected async populateCache(objectName: string) {
    const externalCacheValue = await this.cdnClient.query(objectName);
    this.internalCache[objectName] = externalCacheValue;
    return externalCacheValue;
  }

  logCacheHitRate() {
    this.cdnClient.logCacheHitRate();
  }
}
