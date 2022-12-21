import type { PersistenceVendorClientInterface } from "@src/types/integrations/persistence/vendor.types";

export interface CacheVendorCdnInterface<ObjectType> {
  logCacheHitRate(): void;
  query(keyName: string): Promise<ObjectType>;
}

export interface CacheVendorInterface {
  CdnBaseClient: abstract new <ObjectType>(
    originServerClient: PersistenceVendorClientInterface,
    cdnHostname: string
  ) => CacheVendorCdnInterface<ObjectType>;
}
