import type CacheControllerAbstractFactory from "../../../backend/integrations/cache/controller/controller.abstract.factory.class";
import type { PersistanceVendorInterface } from "../persistance/vendor.types";

export interface CacheFactoryInterface<ObjectType> {
  create(): CacheControllerInterface<ObjectType>;
  getPartitionName(): string;
  getCdnHostname(): string;
}

export interface CacheControllerInterface<ObjectType> {
  logCacheHitRate(): void;
  query(keyName?: string): Promise<ObjectType>;
}

export interface CdnVendorInterface<ObjectType> {
  logCacheHitRate(): void;
  query(keyName: string): Promise<ObjectType>;
}

export interface CacheVendor {
  VendorBaseCdnClient: abstract new <T>(
    originServerClient: PersistanceVendorInterface,
    cdnHostname: string
  ) => CdnVendorInterface<T>;
  ControllerBaseFactory: abstract new <
    T
  >() => CacheControllerAbstractFactory<T>;
}
