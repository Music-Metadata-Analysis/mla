import type { CacheVendorCdnInterface } from "@src/vendors/types/integrations/cache/vendor.backend.types";
import type { PersistenceVendorClientInterface } from "@src/vendors/types/integrations/persistence/vendor.backend.types";

export default abstract class CacheVendorCdnBaseClient<ObjectType>
  implements CacheVendorCdnInterface<ObjectType>
{
  protected cdnHostname: string;
  protected originServerClient: PersistenceVendorClientInterface;
  protected cacheHitCount = 0;
  protected requestCount = 0;
  protected abstract cacheTypeName: string;

  constructor(
    originServerClient: PersistenceVendorClientInterface,
    cdnHostname: string
  ) {
    this.originServerClient = originServerClient;
    this.cdnHostname = cdnHostname;
  }

  protected abstract createNewObject(objectName: string): Promise<ObjectType>;
  protected abstract isCachedResponse(response: Response): boolean;
  protected abstract getOriginServerStorageLocation(objectName: string): string;
  protected abstract getOriginServerUrlFromObjectName(
    objectName: string
  ): string;
  protected abstract deserializeObjectForJavascript(
    serializedObject: string
  ): ObjectType;
  protected abstract serializeObjectForStorage(
    deserializedObject: ObjectType
  ): string;

  public async query(objectName: string): Promise<ObjectType> {
    this.requestCount++;
    return fetch(this.getOriginServerUrlFromObjectName(objectName)).then(
      async (response) => {
        if (!response.ok) {
          return await this.populateCache(objectName);
        }
        return await this.getCachedResponse(response);
      }
    );
  }

  protected async populateCache(objectName: string): Promise<ObjectType> {
    const newEntry = await this.createNewObject(objectName);
    await this.originServerClient.write(
      this.getOriginServerStorageLocation(objectName),
      this.serializeObjectForStorage(newEntry),
      { ContentType: "text/plain" }
    );
    return newEntry;
  }

  protected async getCachedResponse(response: Response): Promise<ObjectType> {
    if (this.isCachedResponse(response)) this.cacheHitCount++;
    return this.deserializeObjectForJavascript(await response.text());
  }

  public logCacheHitRate(): void {
    if (this.requestCount > 0) {
      const hitRate = (this.cacheHitCount / this.requestCount) * 100;
      console.log(`[${this.cacheTypeName}] hit rate: ${hitRate.toFixed(2)}%`);
    }
  }
}
