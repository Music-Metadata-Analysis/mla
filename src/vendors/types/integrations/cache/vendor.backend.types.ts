import type { PersistenceVendorClientInterface } from "@src/vendors/types/integrations/persistence/vendor.backend.types";

export interface CacheVendorCdnInterface<ObjectType> {
  logCacheHitRate(): void;
  query(keyName: string): Promise<ObjectType>;
}

export interface CacheVendorCdnOriginReportsCacheObjectConstructorInterface {
  authenticatedUserName: string;
  reportName: string;
  sourceName: string;
  userName: string;
}

export interface CacheVendorCdnOriginReportsCacheObjectInterface {
  getCacheId(): string;
  getStorageName(): string;
}

export interface CacheVendorCdnControllerInterface<ObjectType> {
  logCacheHitRate(): void;
  query(keyName?: string): Promise<ObjectType>;
}

export interface CacheVendorCdnControllerFactoryInterface<ObjectType> {
  create(): CacheVendorCdnControllerInterface<ObjectType>;
}

export interface CacheVendorBackendInterface {
  CdnBaseClient: abstract new <ObjectType>(
    originServerClient: PersistenceVendorClientInterface,
    cdnHostname: string
  ) => CacheVendorCdnInterface<ObjectType>;
  CdnOriginReportsCacheObject: new (
    args: CacheVendorCdnOriginReportsCacheObjectConstructorInterface
  ) => CacheVendorCdnOriginReportsCacheObjectInterface;
  CdnController: new <ObjectType>(
    defaultResponse: ObjectType,
    cdnClient: CacheVendorCdnInterface<ObjectType>
  ) => CacheVendorCdnControllerInterface<ObjectType>;
  CdnControllerAbstractFactory: abstract new <
    ObjectType
  >() => CacheVendorCdnControllerFactoryInterface<ObjectType>;
}
