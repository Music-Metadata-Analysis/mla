import type { PersistanceVendorInterface } from "@src/types/integrations/persistance/vendor.types";

export interface CacheVendorCdnInterface<ObjectType> {
  logCacheHitRate(): void;
  query(keyName: string): Promise<ObjectType>;
}

export interface CacheVendorInterface {
  CdnBaseClient: abstract new <ObjectType>(
    originServerClient: PersistanceVendorInterface,
    cdnHostname: string
  ) => CacheVendorCdnInterface<ObjectType>;
}
