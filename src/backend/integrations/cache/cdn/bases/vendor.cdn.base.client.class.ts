import type { CdnVendorInterface } from "../../../../../types/integrations/cache/vendor.types";
import type { PersistanceVendorInterface } from "../../../../../types/integrations/persistance/vendor.types";

export default abstract class VendorCdnBaseClient<ObjectType>
  implements CdnVendorInterface<ObjectType>
{
  protected cdnHostname: string;
  protected originServerClient: PersistanceVendorInterface;
  protected cacheHitCount = 0;
  protected requestCount = 0;
  protected abstract cacheTypeName: string;

  constructor(
    originServerClient: PersistanceVendorInterface,
    cdnHostname: string
  ) {
    this.originServerClient = originServerClient;
    this.cdnHostname = cdnHostname;
  }

  protected abstract createNewObject(objectName: string): Promise<ObjectType>;
  protected abstract deserializeObjectForJavascript(
    serializedObject: string
  ): ObjectType;
  protected abstract isCachedResponse(response: Response): boolean;
  protected abstract getKeyName(objectName: string): string;
  protected abstract getOriginServerUrlFromObjectName(
    objectName: string
  ): string;
  protected abstract serializeObjectForStorage(
    deserializedObject: ObjectType
  ): string;

  async query(objectName: string): Promise<ObjectType> {
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

  protected async populateCache(objectName: string) {
    const newEntry = await this.createNewObject(objectName);
    await this.originServerClient.write(
      this.getKeyName(objectName),
      this.serializeObjectForStorage(newEntry),
      { ContentType: "text/plain" }
    );
    return newEntry;
  }

  async getCachedResponse(response: Response): Promise<ObjectType> {
    if (this.isCachedResponse(response)) this.cacheHitCount++;
    return this.deserializeObjectForJavascript(await response.text());
  }

  logCacheHitRate() {
    if (this.requestCount > 0) {
      const hitRate = (this.cacheHitCount / this.requestCount) * 100;
      console.log(`[${this.cacheTypeName}] hit rate: ${hitRate.toFixed(2)}%`);
    }
  }
}
