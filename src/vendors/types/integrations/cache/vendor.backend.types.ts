import type { PersistenceVendorClientInterface } from "@src/vendors/types/integrations/persistence/vendor.backend.types";

export interface CacheVendorCdnInterface<ObjectType> {
  logCacheHitRate(): void;
  query(keyName: string): Promise<ObjectType>;
}

export interface CacheVendorBackendInterface {
  CdnBaseClient: abstract new <ObjectType>(
    originServerClient: PersistenceVendorClientInterface,
    cdnHostname: string
  ) => CacheVendorCdnInterface<ObjectType>;
}
